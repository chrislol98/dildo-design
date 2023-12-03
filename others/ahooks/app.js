import React from "react";
import { useRequest } from "./ahooks";
let counter = 0;
function getName() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        time: new Date().toLocaleTimeString(),
        data: "zhufeng"(counter),
      });
    }, 2000);
  });
}
function User() {
  const { data, loading, refresh } = useRequest(getName, {
    cacheKey: "cacheKey",
  });
  return (
    <>
      <p>后台加载中: {loading ? "true" : "false"}</p>
      <button onClick={refresh} type="button">
        更新
      </button>
      <p>最近的请求时间: {data?.time}</p>
      <p>{data?.data}</p>
    </>
  );
}
function App() {
  return (
    <div>
      <User />
      <hr />
      <User />
    </div>
  );
}
export default App;
