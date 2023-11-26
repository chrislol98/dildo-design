import todosApi from './todos'
//使用自定义查询 hook可以自动获取数据并且返回查询结果
function App() {
    // 使用一个查询Hook，它会自动获取数据并且返回查询的值
    //const { data, error, isLoading } = useGetTodosQuery(1)
    const { data, error, isLoading } = todosApi.endpoints.getTodos.useQuery(1)
    // Individual hooks are also accessible under the generated endpoints:
    // 每个hook也
    console.log('isLoading=', isLoading, 'error=', error, 'data=', data);
    if(isLoading){
        return <div>加载中....</div>;
    }else{
        if(error){
            return <div>{error.error}</div>;
        }else if(data){
            return <div>{data.text}</div>;
        }else{
            return null;
        }
    }
}
export default App;