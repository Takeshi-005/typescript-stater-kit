/**
 * input[type]によってvalueの取得方法を変更
 * @param  {HTMLInputElement}
 * @return {value}     input要素のvalue
 */
export default function($target: JQuery) {
  const type = $target.attr("type");
  let val;

  // checkboxのvalue 1つのみ取得
  if(type === 'checkbox') {
    let name = $target.attr("name");
    val = $(`input[name=${name}]:checked`).val() || "";
  }

  if(type === 'radio') {
    let name = $target.attr("name");
    val = $(`input[name=${name}]:checked`).val() || "";
  }

  // text or tel or password のvalue
  if (type === "text" || type === "tel" || type === "password") {
    val = $target.val();
  }
  return val;
}
