import {EventEmitter} from 'events';
let e = new EventEmitter();
e.on('message',(text:string)=>{
    console.log(text);
});
e.emit('message','hello');