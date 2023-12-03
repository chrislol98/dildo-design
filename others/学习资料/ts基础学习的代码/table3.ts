module Table1{
    export namespace Box1{
        export const a = 1;
        export const b = 1;
    }
    
}
module Table2 {
    namespace Box1 {
        export const a = 1;
        export const b = 1;
        console.log(Table1.Box1.a);
        
    }
    
}