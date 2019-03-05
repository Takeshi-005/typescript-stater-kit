/**
 * input[type]によってvalueの取得方法を変更
 * @param  {Object}    inputのwrap要素
 * @return {value}     input要素のvalue
 */
export default function($el) {
  const $input = $el.find('.js-validate-input');
  const type = $input.attr('type');

  let val = '';

  // checkboxのvalue
  if(type === 'checkbox') {
    // val = [];
    $input.each((index, element) => {
      if(!$(element).prop('checked')) {
        val = 'off';
      }
    });
    if(val === 'off') {
      val = '';
    } else {
      val = 'on';
    }
  }

  // radioのvalue
  if(type === 'radio') {
    $input.each((index, element) => {
      if($(element).prop('checked')) {
        val = $input.val();
      }
    });
  }

  // text or tel のvalue
  if(type === 'text' || type === 'tel') {
    val = $input.val();
  }

  return val;
}