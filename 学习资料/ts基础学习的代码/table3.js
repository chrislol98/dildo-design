var Table1={};
(function (Table1) {
    var Box1={};
    Table1.Box1=Box1;
    (function (Box1) {
        Box1.a = 1;
        Box1.b = 1;
    })(Box1);
})(Table1);

var Table2;
(function (Table2) {
    var Box1;
    (function (Box1) {
        Box1.a = 1;
        Box1.b = 1;
        console.log(Table1.Box1.a);
    })(Box1 || (Box1 = {}));
})(Table2 || (Table2 = {}));


