let obj = {}
Object.defineProperty(obj, 'age1', {
  value: 1,
  enumerable: true
})
let obj2 = { age2: '2' };
Object.setPrototypeOf(obj2, obj)
for (let key in obj2) {
  console.log(key);
}