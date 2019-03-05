import InputModel from './InputModel';
import returnInput from './returnInput';
/**
 * validateの[view]classを実装
 * this.$inputにinputModeで使用するruleと同じclassを付与
 */
export default class ValidateInput {
  private $el: JQuery;
  private 
  private constructor(el:HTMLElement) {
    this.$el = $(el);

    this.$input = this.$el.find('.js-validate-input');
    this.$select = this.$el.find('.js-validate-select');
    this.$error = this.$el.find('.js-validate-error');
    this.$submit = $('.js-validate-submit');
    this.$prohibitedInput = this.$el.find('.js-validate-no-paste');

    this.init();
    this.eventBind();
  }

  init() {
    if(this.$input[0] !== undefined) {
      this.model = new InputModel(this.$input)
    }

    if(this.$select[0] !== undefined) {
      this.model = new InputModel(this.$select)
    }
  }

  /**
   * Eventを登録
   */
  eventBind() {
    // フォーカスアウト時
    this.$input.on('blur change', (e) => {
      this.onBlur(e);
    });

    // 生年月日
    this.$select.on('change', (e) => {
      this.onChange();
    });

    this.$submit.on('click', (e) => {
      e.preventDefault();
      this.onClick(e);
    });


    this.$prohibitedInput.on('paste', (e) => {
      return false;
    })



    this.model.on('valid', () => {
      this.onValid();
    });

    this.model.on('invalid', () => {
      this.onInvalid();
    });

    this.model.on('submit', () => {
      this.onSubmit();
    });
  }

  // フォーカスアウト時のイベント
  onBlur(e) {
    const $target = $(e.currentTarget).closest('.js-validate');
    const val = returnInput($target);
    this.model.set(val, e.currentTarget);
  }

  // selectチェンジイベント
  onChange(e) {
    let date = [];
    this.$select.each( function() {
        date.push($(this).val());
    });

    this.model.set(date)
  }

  // サブミット時のイベント
  onClick(e) {
    const $target = this.$el;
    if($target.hasClass('js-validate-required')) {
      const val = returnInput($target);

      this.model.set(val, e.currentTarget)
      this.model.setSubmit();
    }
  }

  // バリデートエラーを解除
  onValid() {
    this.$input.removeClass('is-error');
    this.$select.removeClass('is-error');
    this.$error
      .removeClass('is-active')
      .text('');
  }

  // バリデートエラー
  onInvalid() {
    this.message = this.model.message;
    this.$input.addClass('is-error');
    this.$select.addClass('is-error');
    this.$error.addClass('is-active');

    $.each(this.model.errors, (index, val) => {
      const message = this.message[val];
      this.$error.text(message);
    })
  }

  // ページ遷移を許可
  onSubmit() {
    const url = this.$submit[0].getAttribute('href');
    location.href = url;
  }
}