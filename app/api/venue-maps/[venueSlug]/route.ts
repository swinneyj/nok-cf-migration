export const dynamic = "force-dynamic";

import { readdir } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import {
  getFallbackVenueMapConfig,
  getVenueMapConfig,
  resolveVenueMapSlug,
  type VenueMapConfig,
  type VenueMapView,
} from "@/lib/venueMaps";

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

function toTitleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function inferViewId(filename: string, venueSlug: string) {
  const extension = path.extname(filename);
  const baseName = path.basename(filename, extension);
  const withoutPrefix = baseName
    .replace(new RegExp(`^${venueSlug}[_-]?`, "i"), "")
    .replace(/^\d+[_-]?/, "");

  return withoutPrefix
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "map";
}

function inferViewLabel(viewId: string) {
  if (viewId.includes("bottle") && viewId.includes("menu")) return "Bottle Menu";
  if (viewId.includes("drink") && viewId.includes("menu")) return "Drink Menu";
  if (viewId.includes("menu")) return "Menu";
  if (viewId.includes("table")) return "Table Map";
  if (viewId.includes("overview")) return "Overview";
  if (viewId.includes("interior")) return "Interior View";
  if (viewId.includes("vip")) return "VIP Section";
  if (viewId.includes("mezzanine")) return "Mezzanine";
  if (viewId.includes("secondary")) return "Secondary Floor";
  if (viewId.includes("main")) return "Main Floor";
  if (viewId.includes("floor")) return "Floor Plan";
  return toTitleCase(viewId);
}

function inferAlt(label: string, title: string) {
  return `${title} ${label}`.trim();
}

function inferViewsFromFiles(files: string[], venueSlug: string, title: string): VenueMapView[] {
  const groupedFiles = new Map<
    string,
    Array<{ filename: string; pageNumber: number | null }>
  >();

  for (const filename of files) {
    const viewId = inferViewId(filename, venueSlug);
    const pageMatch = viewId.match(/^(.*)-page-(\d+)$/);
    const groupId = pageMatch?.[1] || viewId;
    const pageNumber = pageMatch ? Number(pageMatch[2]) : null;
    const group = groupedFiles.get(groupId) ?? [];

    group.push({ filename, pageNumber });
    groupedFiles.set(groupId, group);
  }

  return Array.from(groupedFiles.entries()).map(([groupId, entries]) => {
    entries.sort((a, b) => {
      if (a.pageNumber === null && b.pageNumber === null) {
        return a.filename.localeCompare(b.filename, undefined, { numeric: true });
      }
      if (a.pageNumber === null) return -1;
      if (b.pageNumber === null) return 1;
      return a.pageNumber - b.pageNumber;
    });

    const label = inferViewLabel(groupId);
    const pages = entries.map(({ filename }, index) => ({
      imagePath: `/venue-maps/${venueSlug}/${filename}`,
      alt: `${inferAlt(label, title)}${entries.length > 1 ? ` Page ${index + 1}` : ""}`,
    }));

    return {
      id: groupId,
      label,
      imagePath: pages[0].imagePath,
      alt: pages[0].alt,
      pages: pages.length > 1 ? pages : undefined,
    };
  });
}

function dedupeViews(views: VenueMapView[]) {
  const seen = new Set<string>();
  return views.filter((view) => {
    if (seen.has(view.imagePath)) return false;
    seen.add(view.imagePath);
    return true;
  });
}

type VenueMapRouteContext = {
  params: Promise<{ venueSlug: string }>;
};

export async function GET(
  _request: Request,
  context: VenueMapRouteContext
) {
  try {
    const { venueSlug: requestedSlug } = await context.params;
    const resolvedSlug = resolveVenueMapSlug(requestedSlug);
    const baseConfig = getVenueMapConfig(requestedSlug);
    const venueDir = path.join(process.cwd(), "public", "venue-maps", resolvedSlug);

    let files: string[] = [];

    try {
      const entries = await readdir(venueDir, { withFileTypes: true });
      files = entries
        .filter((entry) => entry.isFile())
        .map((entry) => entry.name)
        .filter((filename) => IMAGE_EXTENSIONS.has(path.extname(filename).toLowerCase()))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    } catch {
      files = [];
    }

    const discoveredPaths = new Set(
      files.map((filename) => `/venue-maps/${resolvedSlug}/${filename}`)
    );

    const curatedViews = baseConfig.views.filter((view) => discoveredPaths.has(view.imagePath));
    const curatedPaths = new Set(curatedViews.map((view) => view.imagePath));

    const extraFiles = files.filter(
      (filename) => !curatedPaths.has(`/venue-maps/${resolvedSlug}/${filename}`)
    );

    const discoveredViews = inferViewsFromFiles(
      extraFiles,
      resolvedSlug,
      baseConfig.isDemo ? toTitleCase(resolvedSlug) : baseConfig.title
    );

    const views = dedupeViews([...curatedViews, ...discoveredViews]);

    const config: VenueMapConfig =
      views.length > 0
        ? {
            title: baseConfig.isDemo ? `${toTitleCase(resolvedSlug)} Layout` : baseConfig.title,
            helperText: baseConfig.isDemo
              ? `Use this map to get a clearer sense of the ${toTitleCase(resolvedSlug)} layout.`
              : baseConfig.helperText,
            badge: baseConfig.isDemo ? undefined : baseConfig.badge,
            isDemo: false,
            views,
          }
        : baseConfig;

    return NextResponse.json(config, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Venue map API error:", error);
    return NextResponse.json(getFallbackVenueMapConfig(), { status: 200 });
  }
}
