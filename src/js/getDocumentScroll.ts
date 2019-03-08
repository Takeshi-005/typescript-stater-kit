export function getDocumentScroll(): { x: number; y: number } {
  const x: number = Math.max(
    window.pageXOffset,
    document.documentElement.scrollLeft,
    document.body.scrollLeft
  );
  const y: number = Math.max(
    window.pageYOffset,
    document.documentElement.scrollTop,
    document.body.scrollTop
  );
  return { x, y };
}
