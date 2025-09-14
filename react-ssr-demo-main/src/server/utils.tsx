// server/utils.js
import AppRoutes from '../Routes';
//重要是要用到StaticRouter
import { StaticRouter } from 'react-router-dom/server'; 
import React from 'react'
import fs from 'fs';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import store from '../store';

const clientDistDir = path.join(__dirname, '..\\dist\\client');

export const ssrRender = (req: any) => {
  // 读取编译好的index.html文件
  const html = fs.readFileSync(path.join(clientDistDir, 'index.html'), 'utf-8');
    //构建服务端的路由
  // const appHtml = ReactDOMServer.renderToString( <AppServer location={req.path} />);
  const appHtml = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={req.path} >
        <AppRoutes/>
      </StaticRouter>
    </Provider>
  );
  console.log('appHtml:', appHtml);
  const finalHtml = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  return finalHtml
}
