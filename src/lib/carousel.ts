/** Page math for paged carousels: `perPage` equal-width items per page, pages start every perPage items. */

export function pageCount(itemCount: number, perPage: number): number {
  if (perPage <= 0) return 1;
  return Math.max(1, Math.ceil(itemCount / perPage));
}

/** Empty slots appended so a short last page can scroll to its own start. */
export function spacerCount(itemCount: number, perPage: number): number {
  if (perPage <= 1) return 0;
  const remainder = itemCount % perPage;
  return remainder === 0 ? 0 : perPage - remainder;
}

export function pageFromScroll(scrollLeft: number, pageWidth: number, pages: number): number {
  if (pageWidth <= 0) return 0;
  return Math.min(pages - 1, Math.max(0, Math.round(scrollLeft / pageWidth)));
}

export function pageScrollLeft(page: number, pageWidth: number): number {
  return Math.max(0, page) * pageWidth;
}
