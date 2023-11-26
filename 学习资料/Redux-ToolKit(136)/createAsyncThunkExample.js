import { configureStore, createSlice, createAsyncThunk } from './toolkit';
import axios from 'axios';
//接收redux动作类型字符串和一个返回promise回调的函数
//它会基于你传递的动作类型前缀生成promise生命周期的动作类型
//并且返回一个thunk动作创建者，这个thunk动作创建者会运行promise回调并且派发生命周期动作
export const getTodosList = createAsyncThunk(
  "todos/list",  async () =>  await axios.get(`http://localhost:8080/todos/list`)
);

const initialState = {
  todos: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {},
  extraReducers: {
    [getTodosList.pending]: (state) => {
      state.loading = true;
    },
    [getTodosList.fulfilled]: (state, action) => {
      state.todos = action.payload.data;
      state.loading = false;
    },
    [getTodosList.rejected]: (state, action) => {
      state.todos = [];
      state.error = action.error.message;
      state.loading = false;
    }
  }
})
const { reducer } = todoSlice;
const store = configureStore({
  reducer
})

// 不懂 为什么store.dispatch能返回promise
let promise = store.dispatch(getTodosList());
console.log('请求开始',store.getState());
//promise.abort();
promise.then((response)=>{
  console.log('成功',response);
  setTimeout(()=>{
    console.log('请求结束',store.getState());
  },);
},error=>{
  console.log('失败',error);
  setTimeout(()=>{
    console.log('请求结束',store.getState());
  },);
});
