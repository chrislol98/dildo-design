// 不懂  取消请求

import React, { useState } from "react";
import { useRequest } from "./ahooks";
let counter = 0;
function getName() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        time: new Date().toLocaleTimeString(),
        data: `zhufeng` + ++counter,
      });
    }, 2000);
  });
}
function User() {
  const { data, loading } = useRequest(getName, {
    cacheKey: "cacheKey",
  });
  if (!data && loading) {
    return <p>加载中...</p>;
  }
  return (
    <>
      <p>后台加载中: {loading ? "true" : "false"}</p>
      <p>最近的请求时间: {data?.time}</p>
      <p>{data?.data}</p>
    </>
  );
}
function App() {
  const [visible, setVisible] = useState(true);
  return (
    <div>
      <button type="button" onClick={() => setVisible(!visible)}>
        {visible ? "隐藏" : "显示"}
      </button>
      {/* 不懂 这个User里面的useRequest是什么时候执行的，不是很清楚 */}
      {visible && <User />}
    </div>
  );
}
export default App;
