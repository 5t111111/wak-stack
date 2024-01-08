const dateTImeFormat = new Intl.DateTimeFormat(["ja-JP", "en-US"], {
  dateStyle: "medium",
  timeStyle: "medium",
  // WordPress から取得した post_date は JST だが、TZ 情報を持たないので UTC として扱うことで時刻ズレを防ぐ
  timeZone: "UTC",
});

export const formatDate = (date: Date): string => {
  return dateTImeFormat.format(date);
};
