/**
 * @export
 * @param {string} booleanStr
 * @returns {boolean}
 */
export function toBoolean(booleanStr: string): boolean {
  // "true"文字列と比較した結果を返す
  // 念のため小文字化しておく
  return booleanStr.toLowerCase() === 'true';
}
