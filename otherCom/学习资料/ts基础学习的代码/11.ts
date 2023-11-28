export type TreeNodeInterface<T> = T & {
  level?: number
  expand?: boolean
  children?: TreeNodeInterface<T>[]
  parent?: TreeNodeInterface<T> | null
}
let t: TreeNodeInterface<{ name: string }> = {
  name: '1',
}
interface UserInterface4 {
  [a: string]: Object
  [b: number]: Function
}
type UserInterface<T> = {
  [k in keyof T]: T[k]
}

