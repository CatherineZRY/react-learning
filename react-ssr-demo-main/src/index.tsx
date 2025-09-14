import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

// ReactDOM.render(<App />, document.getElementById('root')); // CSR渲染时使用
ReactDOM.hydrate(<App/>, document.getElementById('root')); // SSR渲染时使用
