import returnInput from './returnInput';
import { access } from 'fs';
/**
 * validateの[model]classを実装
 * this.attrs, this.message にvalidateで使用する関数をセット
 */
export default class InputModel {
  private val: any;
  listeners: any[];

  constructor($elem) {
    this.val = "";
    this.$elem = $elem;

    this.listeners = {
      valid: [],
      invalid: [],
      submit: []
    };
    

    // 現在の日時を取得
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // バリデートのルールを定義
    this.attrs = {
      mail: /^[a-zA-Z0-9]+$/,
      // mail: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
      birthday: [year, month, day],
      required_radio: '',
      required_check: '',
      maxInput: parseInt(this.$elem.attr('data-maxinput'), 10),
      autoLength: parseInt(this.$elem.attr('data-length'), 10)
    };

    // エラーメッセージを定義
    this.message = {
      mail: '使用可能な文字で入力してください。',
      birthday: '無効な日付が入力されています。',
      required_radio: 'いずれかを選択してください。',
      required_check: 'チェックボックスに同意のうえ、お手続きください。',
      maxInput: 'お取引金額に対して円普通預金残高が不足しています。円普通預金残高以内の金額をご入力ください。',
      autoLength: ''
    };
  }

  // 要素の値をセット
  set(val,t) {
    this.val = val;
    this.t = t || {};
    this.validate();
  }

  setSubmit() {
    this.validateSubmit()
  }


  validateSubmit() {
    this.eve = [];

    this.required();

    for(let i=0, len=this.eve.length; i<len; i++) {
      this.trigger(this.eve[i]);
    }
  }

  validate() {
    // バリデーションエラーの配列を用意
    this.errors = [];

    // this.attrsのkeyで関数を実行
    for(const key in this.attrs) {
      const val = this.attrs[key];
      if(this[key](val, key)) return;
    }

    this.trigger(!this.errors.length ? 'valid' : 'invalid');
  }

  // メールのバリデートチェック
  mail(rule, str) {
    const key = str;

    if(this.val === '') return;

    if(this.$elem.hasClass(`js-validate-${key}`)) {
      if(!this.val.match(rule)) {
        this.errors.push(key);
      }
    }
  }


  // 生年月日のバリデート
  birthday(rule, str) {
    const key = str;
    
    if(this.val === '') return;
    if(this.$elem.hasClass(`js-validate-${key}`)) {
      const valDate = new Date(this.val[0], (this.val[1] -1), this.val[2]);
      const nowDate = new Date(rule[0], (rule[1] -1), rule[2]);
      if(valDate.valueOf() > nowDate.valueOf() ) {
        this.errors.push(key);
      }
    }
  }

  // 必須項目ラジオボタン
  required_radio(rule, str) {
    const key = str;
    if(this.$elem.hasClass(`js-validate-${key}`)) {
      if(this.val === '' && $(this.t).hasClass('js-validate-submit')) {
        this.errors.push(key);
      }
    }
  }

  // 必須項目チェックボックス
  required_check(rule, str) {
    const key = str;
    const $error = this.$elem.closest('.js-validate').find('.js-validate-error');

    if(this.$elem.hasClass(`js-validate-${key}`)) {
      // サブミットボタンの挙動
      if( this.val === ''  && $(this.t).hasClass('js-validate-submit')) {
        this.errors.push(key);
      }

      // エラーが表示されている時の挙動
      if($error.hasClass('is-active') && this.val === '') {
        this.errors.push(key);

      }

    }
  }

  // 最大数値のバリデート
  maxInput(rule, str) {
    const key = str;
    if(this.val === '') return;

    if(this.$elem.hasClass(`js-validate-${key}`)) {
      if(this.val > rule) {
        this.errors.push(key);
      }
    }
  }

  // 文字数を自動整形
  autoLength(rule, str) {
    const key = str;

    if(this.val === '') return;

    if(this.$elem.hasClass(`js-validate-${key}`)) {
      if(this.val.length > rule) {
        this.$elem.val(this.val.slice(0,rule));
      }
    }
  }

  // 必須項目のチェック
  required() {
    const $el =  $('.js-validate-required');
    const key = 'submit';
    let flg = true;

    $el.each((index, element) => {
      const $input = $(element).find('js-validate-input');
      const val = returnInput($(element));
      if(val === '') {
        flg = false;
      }
    });

    if(flg) {
      this.eve.push(key);
    }
  }


  on(event, func) {
    this.listeners[event].push(func);
  }

  trigger(event) {
    $.each(this.listeners[event], function() {
      this();
    });
  }


}