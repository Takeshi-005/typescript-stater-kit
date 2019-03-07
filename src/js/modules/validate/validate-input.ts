import returnInput from "./returnInput";
import inputModel from "./inputModel";
import * as Velocity from "velocity-animate";
import { ANIMATE_DURATION } from "../../const";

/**
 * validateの[view]Classを実装
 * this.$inputにinputModeで使用するruleと同じclassを付与
 * data-module="form-validation"の子要素の[data-validate]の値に
 * バリデーションのトリガーを配列で設定する
 * 設定可能種類は
 * required 必須項目 submit時にチェックします。
 * tel 0-9の半角数字を9桁から12桁
 * email 詳細は"inputModel.ts"の正規表現を確認
 * number 半角数字のみ
 *
 */
export default class Validation {
  private Validates: NodeListOf<Element>;
  private model: inputModel;

  private constructor(private el: HTMLElement) {
    this.Validates = el.querySelectorAll("[data-validate]");
    this.model = new inputModel();
    const submit = el.querySelector(".js-validate-submit");
    const len = this.Validates.length;

    // 各入力フォームのEvent
    for (let i = 0; i < len; i++) {
      const elem = this.Validates[i];
      const attr = elem.getAttribute("data-validate");
      const dataProps = JSON.parse(attr);
      let $target;

      if ($(elem).find("input")[0] !== undefined) {
        $target = $(elem).find("input")
      }
      if ($(elem).find("select")[0] !== undefined) {
        $target = $(elem).find("select")
      }

      $target.on("keyup change", (e) => {
        if (!elem.classList.contains("is-error") && e.type === "keyup") {
          return;
        }
        this.handleChange(elem, dataProps, e.type, $(e.currentTarget))
      });
    }

    // submitのEvent
    if (submit) {
      submit.addEventListener("click", e => {
        e.preventDefault();
        this.el.classList.remove("is-error");

        for (let i = 0; i < len; i++) {
          const elem = this.Validates[i];
          const attr = elem.getAttribute("data-validate");
          const target = elem.querySelector("input") || elem.querySelector("select");
          const dataProps = JSON.parse(attr);
          let $target;

          if ($(elem).find("input")[0] !== undefined) {
            $target = $(elem).find("input")
          }
          if ($(elem).find("select")[0] !== undefined) {
            $target = $(elem).find("select")
          }

          this.handleChange(elem, dataProps, "submit", $target);
        }
      });
    }

    this.eventBind();
  }

  private eventBind() {
    // バリデーションエラー解除
    this.model.on("valid", () => {
      if (!this.model.target.element.classList.contains("is-error")) return;
      this.model.target.element.classList.remove("is-error");
      this.model.target.element.querySelector(".c-validate-error").remove();
    });

    // バリデーションエラー
    this.model.on("invalid", () => {
      const element = this.model.target.element;

      // サブミット時のバリデーションエラー
      if (this.model.target.event.includes("submit") && !this.el.classList.contains("is-error")) {
        this.el.classList.add("is-error")
        Velocity.animate(this.el, "scroll", {
          duration: ANIMATE_DURATION,
        }).then(() => {

        });
      }

      // すでにエラー表示が出ている場合は処理を抜ける
      if (element.classList.contains("is-error")) {return;}

      element.classList.add("is-error");
      for (let i = 0; i < this.model.errors.length; i++) {
        let elem = document.createElement("p");
        elem.setAttribute("class", "c-validate-error");
        elem.innerText = this.model.message[this.model.errors[i]];

        element.appendChild(elem);
      }
    });
  }

  private handleChange(elem, props, event, $target) {
    let val;

    if( $target[0].tagName === "INPUT") {
      val = returnInput($target);
    } else {
      val = $target[0].options[$target[0].selectedIndex].value
    }
    this.model.set(val, elem, props, event);
  }
}
