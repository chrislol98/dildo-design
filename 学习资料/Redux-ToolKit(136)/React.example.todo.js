//React entry point 会自动根据endpoints生成hooks
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import axios from 'axios'
axios.interceptors.response.use(function (response) {
  return {data:response.data};//成功的响应体
},function (error){//失败
  return {error:{error:error.message}};
});
const axiosBaseQuery = ({ baseUrl }) => (
  async (url) => {
    try {
      const result = await axios({ url: baseUrl + url })
      return result;
    } catch (error) {
      return error;
    }
  }
)
//import { createApi, fetchBaseQuery } from './toolkit/query/react'
//使用base URL 和endpoints 定义服务
const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: axiosBaseQuery({ baseUrl: 'http://localhost:8080' }),
  endpoints: (builder) => {
    return {
      //从参数生成查询参数 转变响应并且缓存
      getTodos: builder.query({query: (id) => `/todos/detail/${id}`}),
      getTodos1: builder.query({query: (id) => `/todos/detail/${id}`}),
      getTodos2: builder.query({query: (id) => `/todos/detail/${id}`}),
      getTodos3: builder.query({query: (id) => `/todos/detail/${id}`}),
    }
  }
})
//导出可在函数式组件使用的hooks,它是基于定义的endpoints自动生成的
//export const { useGetTodosQuery } = todosApi
export default todosApi;