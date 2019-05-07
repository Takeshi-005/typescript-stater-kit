/**
 * @export
 * @class SelectBox
 * モジュールセット例:
 * <div data-module="selectbox">
 *   <div class="c-select__container">
 *      <p class="c-select__label js-label"></p>
 *      <select class="c-select js-select" name="select01">
 *        <option value="" data-value="選択して下さい">選択して下さい</option>
 *        <option value="value1-1" data-value="value1-1">value1-1</option>
 *        <option value="value1-2" data-value="value1-2">value1-2</option>
 *      </select>
 *   </div>
 * </div>
 *
 * Selectのブラウザごとでレイアウトが崩れため使用する
 * 選択されたoptionのdata-valueを描画します。
 */
export default class SelectBox {
  private select: HTMLSelectElement;
  private label: HTMLLabelElement;

  private constructor(el) {
    this.select = el.querySelector(".js-select");
    this.label = el.querySelector(".js-label");
    if (!this.select || !this.label) {
      return;
    }
    this.init();
  }

  private init() {
    this.setLabelText();
    this.eventBind();
  }

  private eventBind() {
    this.select.addEventListener("change", () => {
      this.setLabelText();
    });
  }

  private setLabelText() {
    const value = this.select.options[this.select.selectedIndex].getAttribute(
      "data-value"
    );
    this.label.innerText = value;
  }
}
