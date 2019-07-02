export default (number: number, length: number) => {
  return (Array(length).join("0") + number).slice(-length);
};
