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
}

export default async function PreloadedCategoryEventsBrowser({
  category,
  title,
  description,
  anchorId,
  allowCategorySwitching = false,
  enableSearch = false,
}: Props) {
  const initialDate = buildTodayDateKey();
  const initialMonth = buildMonthKeyFromDateKey(initialDate);
  const initialEvents = await getCategoryMonthEvents(category, initialMonth);

  return (
    <CategoryEventsBrowser
      category={category}
      title={title}
      description={description}
      anchorId={anchorId}
      allowCategorySwitching={allowCategorySwitching}
      enableSearch={enableSearch}
      initialDate={initialDate}
      initialEvents={initialEvents}
    />
  );
}
