import React,{useState,useRef} from 'react';
import {toProxy,INTERNAL} from './core';
function useImmerState(baseState){
  //先根据我们的baseState声明一个基本状态
 const [state,setState]= useState(baseState);
 let proxy = toProxy(baseState,()=>{
    queueMicrotask(()=>{
        const {draftState} = draftRef.current[INTERNAL];
        setState({...draftState});
    });
 });
 const draftRef = useRef(proxy);//draftRef.current会指向代理对象
 const updateDraft = (producer)=>producer(draftRef.current);

 return [state,updateDraft];
}
export default useImmerState;