export {}
type T1 = { delay: "One"; setMessage: "Two" };
type K1 = keyof T1;//T1的key组成的联合类型 delay|setMessage
type V1 = T1[K1];//V1=就是T1的值 的联合类型  "One" | "Two"
