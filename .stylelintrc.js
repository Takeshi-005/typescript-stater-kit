module.exports = {
  plugins: ['stylelint-scss', 'stylelint-order'],
  extends: [
		'stylelint-config-standard',
		'./node_modules/prettier-stylelint/config.js'
	],
  ignoreFiles: [
    '**/node_modules/**',
  ],
  rules: {
    'at-rule-no-unknown': null,
    // @ の前に改行をいれるかは指定しない
    // TODO: stylefmtが@applyの前に改行を入れてしまう
    "at-rule-empty-line-before": null,
    // コメントの前に改行はいらない
    "comment-empty-line-before": null,
    // 最後を改行するかは不定
    "no-missing-end-of-source-newline": null,
    // .5s のような表記は許容する
    "number-leading-zero": null,
    // 空改行は2個まで
    "max-empty-lines": 2,
    // セレクタの詳細度を制限 #は2つ、.クラスは2つまでのセレクタにする
    // "selector-max-specificity": "2,2,0",
    "declaration-empty-line-before": null,
    // 詳細度が低いセレクタが後に来てもエラーにしない
    "no-descending-specificity": null,
    'indentation': 2,
    'string-quotes': 'double',
    'order/properties-alphabetical-order': true,
    // font-familyの指定についてはエラーにしない
    "font-family-no-missing-generic-family-keyword": null,
    // IEのハックを除外する
    "selector-type-no-unknown": [true, {
      ignoreTypes: ["/^_/", "/[x]/"],
    }]
  },
};
