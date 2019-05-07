import * as Velocity from "velocity-animate";
import { SCROLL_DURATION, OPACITY_DURATION } from "../const";

/**
 * @export
 * @class PageTop
 * モジュールセット:
 * <div
 *      data-module="page-top"
 *  >
 *  OFFSETの値をスクロールで通過すると要素を表示。
 */
export default class PageTop {
  private pageTop: HTMLElement;
  private static OFFSET = 300;

  private constructor(el) {
    this.pageTop = el;
    this.eventBind();
  }
  private eventBind() {
    this.pageTop.addEventListener("click", () => {
      Velocity.animate(document.body, "scroll", {
        duration: SCROLL_DURATION
      });
    });

    $(window).on("load scroll", () => {
      this.handleScroll();
    });
  }

  private handleScroll() {
    const scrollPos =
      document.documentElement.scrollTop || document.body.scrollTop;

    if (
      scrollPos > PageTop.OFFSET &&
      !this.pageTop.classList.contains("is-active")
    ) {
      this.pageTop.classList.add("is-active");
      Velocity.animate(
        this.pageTop,
        { opacity: 1 },
        {
          duration: OPACITY_DURATION,
          display: "block"
        }
      ).then(() => {});
    } else if (
      scrollPos < PageTop.OFFSET &&
      this.pageTop.classList.contains("is-active")
    ) {
      this.pageTop.classList.remove("is-active");
      Velocity.animate(
        this.pageTop,
        { opacity: 0 },
        {
          duration: OPACITY_DURATION,
          display: "none"
        }
      ).then(() => {});
    }
  }
}
