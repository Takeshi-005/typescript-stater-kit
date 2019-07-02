// nの数で配列を生成
export default (n: number) => (n < 0 ? [] : Array.from(Array(n), (_, i) => i));
