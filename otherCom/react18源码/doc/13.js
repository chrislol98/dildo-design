siblings: while (true) {
  console.log('1');
  while (true) {
    console.log(2);
    continue siblings;
  }
}