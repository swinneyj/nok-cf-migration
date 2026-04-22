from __future__ import annotations

import csv
import json
import re
from dataclasses import dataclass, asdict
from datetime import datetime
from pathlib import Path
from typing import Iterable

import requests
from bs4 import BeautifulSoup


ROOT = Path("/Users/mini/Documents/GitHub/nokturnal-lifestyle")
DOWNLOADS_DIR = Path("/Volumes/SS990Evo1TB/Downloads")
YELP_EXPORT_PATH = DOWNLOADS_DIR / "export_20260422-152154.csv"
GOOGLE_EXPORT_CANDIDATES = [
    DOWNLOADS_DIR / "export_20260422-160928.csv",
    DOWNLOADS_DIR / "Google Maps Reviews Scraper (1)_20260422_1532.csv",
]
OUTPUT_DIR = ROOT / "data" / "reviews"

YELP_HIDDEN_BASE_URL = "https://www.yelp.com/not_recommended_reviews/nokturnal-lifestyle-las-vegas-2"
REQUEST_HEADERS = {"User-Agent": "Mozilla/5.0"}

VENUE_PATTERNS = {
    "xs-nightclub": [r"\bXS\b"],
    "hakkasan-nightclub": [r"\bHakkasan\b"],
    "omnia-nightclub": [r"\bOmnia\b"],
    "marquee-nightclub": [r"\bMarquee\b(?!\s+Day)"],
    "marquee-dayclub": [r"\bMarquee Day(?:club| Party)?\b", r"\bday party at Marquee\b"],
    "tao-nightclub": [r"\bTAO\b"],
    "zouk-nightclub": [r"\bZouk\b"],
    "liv-nightclub": [r"\bLIV\b(?!\s+Beach)"],
    "liv-beach-club": [r"\bLIV Beach\b"],
    "drais-nightclub": [r"\bDrai'?s\b(?!\s+Beach)"],
    "drais-beach-club": [r"\bDrai'?s Beach\b"],
    "encore-beach-club": [r"\bEncore Beach Club\b", r"\bEBC\b"],
    "ebc-at-night": [r"\bEBC at Night\b"],
    "jewel-nightclub": [r"\bJewel\b"],
    "surrender-nightclub": [r"\bSurrender\b"],
    "wet-republic": [r"\bWet Republic\b"],
    "tao-beach": [r"\bTAO Beach\b"],
    "light-nightclub": [r"\bLIGHT\b"],
}

CATEGORY_TAGS_BY_VENUE = {
    "xs-nightclub": ["nightclub"],
    "hakkasan-nightclub": ["nightclub"],
    "omnia-nightclub": ["nightclub"],
    "omnia": ["nightclub"],
    "marquee-nightclub": ["nightclub"],
    "tao-nightclub": ["nightclub"],
    "zouk-nightclub": ["nightclub"],
    "liv-nightclub": ["nightclub"],
    "drais-nightclub": ["nightclub"],
    "jewel-nightclub": ["nightclub"],
    "surrender-nightclub": ["nightclub"],
    "ebc-at-night": ["nightclub"],
    "encore-beach-club": ["dayclub"],
    "marquee-dayclub": ["dayclub"],
    "liv-beach-club": ["dayclub"],
    "drais-beach-club": ["dayclub"],
    "tao-beach": ["dayclub"],
    "wet-republic": ["dayclub"],
    "sapphire": ["stripclub"],
    "crazy-horse-3": ["stripclub"],
}


@dataclass
class ReviewRecord:
    id: str
    source: str
    author: str
    date: str
    rating: int
    location: str
    text: str
    review_url: str
    venue_mentions: list[str]
    matched_terms: list[str]
    category_tags: list[str]
    priority: int


def normalize_space(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def format_date(raw: str) -> str:
    raw = raw.strip()
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M:%S.%f%z", "%Y-%m-%d %H:%M:%S%z", "%m/%d/%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(raw, fmt).strftime("%B %Y")
        except ValueError:
            continue
    return raw


def detect_venues(text: str) -> tuple[list[str], list[str]]:
    venue_mentions: list[str] = []
    matched_terms: list[str] = []
    for slug, patterns in VENUE_PATTERNS.items():
        for pattern in patterns:
            match = re.search(pattern, text, flags=re.IGNORECASE)
            if match:
                venue_mentions.append(slug)
                matched_terms.append(match.group(0))
                break
    return venue_mentions, matched_terms


def resolve_google_export_path() -> Path:
    for path in GOOGLE_EXPORT_CANDIDATES:
        if path.exists():
            return path
    raise FileNotFoundError("No Google review export found in expected locations")


def derive_category_tags(venue_mentions: list[str]) -> list[str]:
    tags = {tag for slug in venue_mentions for tag in CATEGORY_TAGS_BY_VENUE.get(slug, [])}
    if not tags:
        tags.add("general")
    return sorted(tags)


def calculate_priority(source: str, venue_mentions: list[str], matched_terms: list[str], text: str) -> int:
    priority = 0
    if venue_mentions:
        priority += 100
    if source == "Google":
        priority += 15
    elif source == "Yelp public":
        priority += 10
    exact_terms = " ".join(matched_terms).lower()
    if "xs" in exact_terms or "marquee" in exact_terms or "omnia" in exact_terms or "hakkasan" in exact_terms:
        priority += 20
    if "bachelor" in text.lower():
        priority += 5
    return priority


def create_review_record(
    *,
    id: str,
    source: str,
    author: str,
    date: str,
    rating: int,
    location: str,
    text: str,
    review_url: str,
) -> ReviewRecord:
    venue_mentions, matched_terms = detect_venues(text)
    category_tags = derive_category_tags(venue_mentions)
    priority = calculate_priority(source, venue_mentions, matched_terms, text)
    return ReviewRecord(
        id=id,
        source=source,
        author=author,
        date=date,
        rating=rating,
        location=location,
        text=text,
        review_url=review_url,
        venue_mentions=venue_mentions,
        matched_terms=matched_terms,
        category_tags=category_tags,
        priority=priority,
    )


def load_yelp_export() -> list[ReviewRecord]:
    reviews: list[ReviewRecord] = []
    with YELP_EXPORT_PATH.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle)
        next(reader, None)
        for index, row in enumerate(reader, start=1):
            if len(row) < 17:
                continue

            author = row[2].strip()
            date = format_date(row[3])
            rating = int(row[7] or "0")
            text = normalize_space(row[9])
            location = row[13].strip()
            review_url = row[16].strip()

            if not text:
                continue

            reviews.append(
                create_review_record(
                    id=f"yelp-public-{index}",
                    source="Yelp public",
                    author=author,
                    date=date,
                    rating=rating,
                    location=location,
                    text=text,
                    review_url=review_url,
                )
            )
    return reviews


def load_google_export() -> list[ReviewRecord]:
    reviews: list[ReviewRecord] = []
    google_export_path = resolve_google_export_path()
    with google_export_path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        for index, row in enumerate(reader, start=1):
            text = normalize_space(
                row.get("TEXT")
                or row.get("ORIGINAL TEXT")
                or row.get("Review")
                or row.get("Message Original")
                or ""
            )
            if not text:
                continue
            reviews.append(
                create_review_record(
                    id=f"google-{index}",
                    source="Google",
                    author=(row.get("USER NAME") or row.get("Author") or "").strip(),
                    date=format_date(row.get("PUBLISHED AT DATETIME") or row.get("Date") or ""),
                    rating=int(float(row.get("SCORE") or row.get("Rating") or "0")),
                    location="",
                    text=text,
                    review_url=(row.get("REVIEW LINK") or row.get("Review Url") or "").strip(),
                )
            )
    return reviews


def fetch_yelp_hidden_page(start: int) -> str:
    params = {"not_recommended_start": start} if start else None
    response = requests.get(YELP_HIDDEN_BASE_URL, params=params, headers=REQUEST_HEADERS, timeout=30)
    response.raise_for_status()
    return response.text


def parse_hidden_page(html: str, page_index: int) -> list[ReviewRecord]:
    soup = BeautifulSoup(html, "html.parser")
    review_nodes = soup.select("div.review.review--with-sidebar")
    reviews: list[ReviewRecord] = []
    for idx, node in enumerate(review_nodes, start=1):
        review_id = node.get("data-review-id", f"page{page_index}-review{idx}")
        author = normalize_space(node.select_one(".user-display-name").get_text(" ", strip=True))
        location_node = node.select_one(".user-location b")
        location = normalize_space(location_node.get_text(" ", strip=True)) if location_node else ""
        date = normalize_space(node.select_one(".rating-qualifier").get_text(" ", strip=True))
        stars_title = node.select_one(".i-stars")
        rating_match = re.search(r"(\d+(?:\.\d+)?)", stars_title.get("title", "")) if stars_title else None
        rating = int(float(rating_match.group(1))) if rating_match else 0
        paragraphs = [normalize_space(p.get_text(" ", strip=True)) for p in node.select(".review-content p[lang]")]
        text = "\n\n".join([p for p in paragraphs if p])
        reviews.append(
            create_review_record(
                id=f"yelp-hidden-{review_id}",
                source="Yelp not recommended",
                author=author,
                date=format_date(date),
                rating=rating,
                location=location,
                text=text,
                review_url=f"{YELP_HIDDEN_BASE_URL}?not_recommended_start={page_index * 10}#{review_id}",
            )
        )
    return reviews


def load_yelp_hidden_reviews() -> list[ReviewRecord]:
    all_reviews: list[ReviewRecord] = []
    for page_index, start in enumerate(range(0, 80, 10)):
        html = fetch_yelp_hidden_page(start)
        page_reviews = parse_hidden_page(html, page_index)
        if not page_reviews:
            break
        all_reviews.extend(page_reviews)
    return all_reviews


def dedupe_reviews(reviews: Iterable[ReviewRecord]) -> list[ReviewRecord]:
    deduped: list[ReviewRecord] = []
    seen: set[tuple[str, str, str]] = set()
    for review in reviews:
        key = (review.source, review.author, review.text)
        if key in seen:
            continue
        seen.add(key)
        deduped.append(review)
    return deduped


def write_csv(path: Path, reviews: list[ReviewRecord]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(
            handle,
            fieldnames=[
                "id",
                "source",
                "author",
                "date",
                "rating",
                "location",
                "text",
                "review_url",
                "venue_mentions",
                "matched_terms",
                "category_tags",
                "priority",
            ],
        )
        writer.writeheader()
        for review in reviews:
            row = asdict(review)
            row["venue_mentions"] = "|".join(review.venue_mentions)
            row["matched_terms"] = "|".join(review.matched_terms)
            row["category_tags"] = "|".join(review.category_tags)
            writer.writerow(row)


def write_json(path: Path, reviews: list[ReviewRecord]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = [asdict(review) for review in reviews]
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


def write_summary(path: Path, reviews: list[ReviewRecord]) -> None:
    lines = []
    lines.append(f"Total normalized reviews: {len(reviews)}")
    by_source: dict[str, int] = {}
    venue_counts: dict[str, int] = {}
    for review in reviews:
        by_source[review.source] = by_source.get(review.source, 0) + 1
        for slug in review.venue_mentions:
            venue_counts[slug] = venue_counts.get(slug, 0) + 1

    lines.append("")
    lines.append("By source:")
    for source, count in sorted(by_source.items()):
        lines.append(f"- {source}: {count}")

    lines.append("")
    lines.append("Venue mention counts:")
    for slug, count in sorted(venue_counts.items(), key=lambda item: (-item[1], item[0])):
        lines.append(f"- {slug}: {count}")

    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_venue_matched_csv(path: Path, reviews: list[ReviewRecord]) -> None:
    matched = [review for review in reviews if review.venue_mentions]
    write_csv(path, matched)


def clip_review_text(text: str, limit: int = 280) -> str:
    text = normalize_space(text)
    if len(text) <= limit:
        return text

    sentences = re.split(r"(?<=[.!?])\s+", text)
    excerpt = ""
    for sentence in sentences:
        candidate = f"{excerpt} {sentence}".strip()
        if len(candidate) > limit:
            break
        excerpt = candidate

    if excerpt:
        return excerpt

    truncated = text[: limit - 1].rsplit(" ", 1)[0]
    return f"{truncated}…"


def build_venue_review_library(reviews: list[ReviewRecord]) -> list[dict]:
    library = []
    for review in reviews:
        source = "Google review" if review.source == "Google" else "Yelp review"
        library.append(
            {
                "id": review.id,
                "name": review.author,
                "date": review.date,
                "location": review.location,
                "rating": review.rating,
                "text": clip_review_text(review.text),
                "source": source,
                "venueSlugs": review.venue_mentions,
                "matchedTerms": review.matched_terms,
                "categoryTags": review.category_tags,
                "priority": review.priority,
            }
        )
    library.sort(key=lambda item: (-item["priority"], item["name"].lower(), item["date"]))
    return library


def write_review_library_json(path: Path, reviews: list[ReviewRecord]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = build_venue_review_library(reviews)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")


def main() -> None:
    yelp_public = load_yelp_export()
    google = load_google_export()
    yelp_hidden = load_yelp_hidden_reviews()
    normalized = dedupe_reviews([*yelp_public, *google, *yelp_hidden])
    normalized.sort(key=lambda review: (review.source, review.author.lower(), review.date))

    write_csv(OUTPUT_DIR / "normalized_reviews.csv", normalized)
    write_venue_matched_csv(OUTPUT_DIR / "venue_matched_reviews.csv", normalized)
    write_json(OUTPUT_DIR / "normalized_reviews.json", normalized)
    write_review_library_json(OUTPUT_DIR / "venueReviewLibrary.json", normalized)
    write_summary(OUTPUT_DIR / "summary.txt", normalized)

    print(f"Wrote {len(normalized)} normalized reviews")
    print(f"CSV: {OUTPUT_DIR / 'normalized_reviews.csv'}")
    print(f"JSON: {OUTPUT_DIR / 'normalized_reviews.json'}")
    print(f"Summary: {OUTPUT_DIR / 'summary.txt'}")
    print(f"Venue matched CSV: {OUTPUT_DIR / 'venue_matched_reviews.csv'}")
    print(f"Venue review library: {OUTPUT_DIR / 'venueReviewLibrary.json'}")


if __name__ == "__main__":
    main()
