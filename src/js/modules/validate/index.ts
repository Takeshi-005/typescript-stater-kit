import * as Pubsub from "pubsub-js";
import returnInput from "./returnInput";
import inputModel from "./inputModel";
import * as Velocity from "velocity-animate";
import { ANIMATE_DURATION } from "../../const";
import { EVENT_INPUT_DONE } from "../../action";

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
  private el: HTMLFormElement;

  private constructor(el) {
    this.el = el;
    this.Validates = el.querySelectorAll("[data-validate]");
    this.model = new inputModel();
    const submit = el.querySelector(".js-validate-submit");
    const len = this.Validates.length;

    // 各入力フォームのEvent
    for (let i = 0; i < len; i++) {
      const elem = this.Validates[i];
      const attr = elem.getAttribute("data-validate");
      const dataProps = JSON.parse(attr);
      let $target = null;

      if ($(elem).find("input")[0] !== undefined) {
        $target = $(elem).find("input");
      }
      if ($(elem).find("select")[0] !== undefined) {
        $target = $(elem).find("select");
      }
      if ($(elem).find("textarea")[0] !== undefined) {
        $target = $(elem).find("textarea");
      }

      if (!$target) {
        return;
      }
      $target.on("keyup change", e => {
        if (!elem.classList.contains("is-error") && e.type === "keyup") {
          return;
        }
        this.handleChange(elem, dataProps, e.type, $(e.currentTarget));
      });
    }

    // submitのEvent
    if (submit) {
      submit.addEventListener("click", e => {
        e.preventDefault();
        submit.disabled = true;
        this.el.classList.remove("is-error");
        const errors = [];
        for (let i = 0; i < len; i++) {
          const elem = this.Validates[i];
          const attr = elem.getAttribute("data-validate");
          const dataProps = JSON.parse(attr);
          let $target;

          if ($(elem).find("input")[0] !== undefined) {
            $target = $(elem).find("input");
          }
          if ($(elem).find("textarea")[0] !== undefined) {
            $target = $(elem).find("textarea");
          }
          if ($(elem).find("select")[0] !== undefined) {
            $target = $(elem).find("select");
          }

          this.handleChange(elem, dataProps, "submit", $target);
          // エラーの配列を格納する
          if (this.model.errors.length) {
            errors.push(this.model.errors);
          }
        }

        // サブミット時のバリデーションエラー
        if (errors.length) {
          Velocity.animate(this.el, "scroll", {
            duration: ANIMATE_DURATION
          }).then(() => {
            submit.disabled = false;
          });
        } else {
          this.el.submit();
        }
      });
    }
    this.eventBind();
  }

  private eventBind() {
    // バリデーションエラー解除
    this.model.on("valid", () => {
      // 入力完了の場合は「is-completion」を付与し未完了の場合は削除する
      const required = this.model.target.element.querySelectorAll(
        ".is-required"
      );
      [].map.call(required, elem => {
        if (this.model.val === "") {
          elem.classList.remove("is-completion");
        } else {
          if (elem.classList.contains("is-completion")) return;
          elem.classList.add("is-completion");
        }
      });

      // エラー表示がない場合は処理を抜ける
      if (this.model.target.element.classList.contains("is-error")) {
        this.model.target.element.classList.remove("is-error");
        this.model.target.element.querySelector(".c-validate-error").remove();
      }
    
      Pubsub.publish(EVENT_INPUT_DONE, {
        target: this.model.target.element
      });
    });

    // バリデーションエラー
    this.model.on("invalid", () => {
      // 入力完了の場合は「is-completion」を付与する
      const required = this.model.target.element.querySelectorAll(
        ".is-required"
      );
      [].map.call(required, elem => {
        if (!elem.classList.contains("is-completion")) return;
        elem.classList.remove("is-completion");
      });
      const element: HTMLElement = this.model.target.element;
      for (let i = 0; i < this.model.errors.length; i++) {
        // すでにエラー表示が出ている場合はテキストのみ書き換える
        if (element.classList.contains("is-error")) {
          element.querySelector(
            ".c-validate-error"
          ).textContent = this.model.message[this.model.errors[i]];
        } else {
          let elem = document.createElement("p");
          elem.setAttribute("class", "c-validate-error");
          elem.innerText = this.model.message[this.model.errors[i]];
          element.appendChild(elem);
        }
      }
      element.classList.add("is-error");

      if (!this.el.classList.contains("is-error")) {
        this.el.classList.add("is-error");
        this.el.classList.remove("is-error");
      }
      Pubsub.publish(EVENT_INPUT_DONE, {
        target: this.model.target.element
      });
    });
  }

  private handleChange(elem, props, event, $target) {
    const tagName = $target[0].tagName;
    let val;

    if (tagName === "INPUT") {
      val = returnInput($target);
    } else if (tagName === "TEXTAREA") {
      val = $target[0].value;
    } else {
      val = $target[0].options[$target[0].selectedIndex].value;
    }
    this.model.set(val, elem, props, event);
  }
}
