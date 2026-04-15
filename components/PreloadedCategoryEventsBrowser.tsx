import CategoryEventsBrowser from "@/components/CategoryEventsBrowser";
import {
  buildMonthKeyFromDateKey,
  buildTodayDateKey,
  getCategoryMonthEvents,
} from "@/lib/categoryEvents";
import type { CategoryEventsKey } from "@/lib/categoryVenueData";

interface Props {
  category: CategoryEventsKey;
  title: string;
  description: string;
  anchorId: string;
  allowCategorySwitching?: boolean;
  enableSearch?: boolean;
  initialDate?: string;
  syncDateToUrl?: boolean;
}

export default async function PreloadedCategoryEventsBrowser({
  category,
  title,
  description,
  anchorId,
  allowCategorySwitching = false,
  enableSearch = false,
  initialDate,
  syncDateToUrl = false,
}: Props) {
  const seededDate = initialDate || buildTodayDateKey();
  const initialMonth = buildMonthKeyFromDateKey(seededDate);
  const initialEvents = await getCategoryMonthEvents(category, initialMonth);

  return (
    <CategoryEventsBrowser
      category={category}
      title={title}
      description={description}
      anchorId={anchorId}
      allowCategorySwitching={allowCategorySwitching}
      enableSearch={enableSearch}
      initialDate={seededDate}
      initialEvents={initialEvents}
      syncDateToUrl={syncDateToUrl}
    />
  );
}
