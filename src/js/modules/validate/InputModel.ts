/**
 * validateの[model]classを実装
 * this.attrs, this.message にvalidateで使用する関数をセット
 */
export default class InputModel {
  private listeners: {};
  private attrs: any;
  public message: {};
  public val: any;
  public target: {
    element: HTMLInputElement;
    event: string;
  };
  public errors: any;
  private dataProps: string[];

  public constructor() {
    this.listeners = {
      valid: [],
      invalid: [],
      submitInvalid: [],
    };

    this.attrs = {
      // email: /^[a-zA-Z0-9\.!#\$%&'\*\+\/=\?\^_`\{\|\}\[\]\~\-@]+$/,
      email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
      tel: /^([0-9\-]{10,13})$/,
      number: /^[0-9]+$/,
      zip: /^\d{3}[-]\d{4}$|^\d{3}[-]\d{2}$|^\d{3}$|^\d{5}$|^\d{7}$/,
      required: '',
    };

    this.message = {
      email: '正しく入力してください。',
      tel: '正しく入力してください。',
      number: '半角数字で入力してください。',
      zip: '正しく入力してください。',
      required: '入力してください。',
    };
  }

  // Event登録
  public on(event, func) {
    this.listeners[event].push(func);
  }

  // バリデートをセット
  public set(val = '', target, props = [], event = '') {
    this.val = val;
    this.target = {
      element: target,
      event: event,
    };
    this.dataProps = props;
    this.errors = [];

    // this.attrsのkeyで関数を実行
    for (const key in this.attrs) {
      const val = this.attrs[key];
      if (this[key](val, key)) return;
    }

    this.trigger(!this.errors.length ? 'valid' : 'invalid');
  }

  private trigger(event) {
    $.each(this.listeners[event], (index, func) => {
      func();
    });
  }

  // メールのバリデートチェック
  private email(rule, key) {
    if (this.val === '') return;

    if (this.dataProps.indexOf(key) !== -1) {
      if (!this.val.match(rule)) {
        this.errors.push(key);
      }
    }
  }

  // 電話番号のバリデートチェック
  private tel(rule, key) {
    if (this.val === '') return;

    if (this.dataProps.indexOf(key) !== -1) {
      if (this.target.event.indexOf('change') !== -1) {
        const val = this.val.replace(/[０-９]/g, function(s) {
          return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
        });
        this.val = val;
        this.target.element.querySelector('input').value = this.val;
      }
      if (!this.val.replace(/-/g, '').match(rule)) {
        this.errors.push(key);
      }
    }
  }

  // 半角数字のバリデートチェック１
  private number(rule, key) {
    if (this.val === '') return;

    if (this.dataProps.indexOf(key) !== -1) {
      if (this.target.event.indexOf('change') !== -1) {
        const val = this.val.replace(/[０-９]/g, function(s) {
          return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
        });
        this.val = val;
        this.target.element.querySelector('input').value = this.val;
      }

      if (!this.val.match(rule)) {
        this.errors.push(key);
      }
    }
  }

  // 郵便番号のバリデートチェック１
  private zip(rule, key) {
    if (this.val === '') return;

    if (this.dataProps.indexOf(key) !== -1) {
      if (this.target.event.indexOf('change') !== -1) {
        const val = this.val
          .replace(/[‐−—ー]/g, '-')
          .replace(/[０-９]/g, function(s) {
            return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
          });
        this.val = val;
        this.target.element.querySelector('input').value = this.val;
      }

      if (!this.val.match(rule)) {
        this.errors.push(key);
      }
    }
  }

  // 必須項目のチェック
  // サブミット時のみ
  private required(rule, key) {
    // if (!this.target.event.includes("submit")) return;
    if (this.target.event.indexOf('submit') === -1) return;
    if (this.dataProps.indexOf(key) !== -1) {
      if (this.val === rule) {
        this.errors.push(key);
      }
    }
  }
}
