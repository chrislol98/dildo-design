let person = {
    name:'zhufeng'
}
let proxyPerson = new Proxy(person,{
    get(target,key){
        console.log('proxyPerson get'+key);
        return target[key];
    },
    set(target,key,value){
        console.log('proxyPerson set'+key,value);
        target[key]=value;
    }
});
console.log(proxyPerson.name);
proxyPerson.name='jiagou';
console.log(proxyPerson.name);