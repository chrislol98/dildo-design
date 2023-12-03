function co(gen) {
  let it = gen();
  return new Promise(function (resolve, reject) {
    !(function next(lastVal) {
      let { value, done } = it.next(lastVal);
      if (done) {
        resolve(value);
      } else {
        value.then(next, (reason) => reject(reason));
      }
    })();
  });
}



async function read() {
  let template = await readFile("./template.txt");
  let data = await readFile("./data.txt");
  return template + "+" + data;
}

// 等同于
function read() {
  return co(function* () {
    let template = yield readFile("./template.txt");
    let data = yield readFile("./data.txt");
    return template + "+" + data;
  });
}
