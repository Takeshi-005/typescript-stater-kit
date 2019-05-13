import {getDocumentScroll} from './getDocumentScroll';

export function documentOffset(target: HTMLElement) {
  let offset = {x: 0, y: 0};
  const rect = target.getBoundingClientRect();
  const bodyScroll = getDocumentScroll();
  offset.y = rect.top + bodyScroll.y;
  offset.x = rect.left + bodyScroll.x;

  return offset;
}
