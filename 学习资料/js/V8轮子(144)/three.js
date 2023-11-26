var a = 1;
function one() {
  var b = 2;
  return function two() {
    console.log(a, b);
  };
}
let two = one();
two();
