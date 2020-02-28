const flatten =
  <T>(xs:T[][]):T[] => xs.reduce((acc, value) => acc.concat(value), [])
export default flatten;
