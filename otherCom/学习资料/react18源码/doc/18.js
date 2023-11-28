
let p = new Promise((resolve) => resolve());
p.then(() => {
  console.log('1');
});
console.log('2');