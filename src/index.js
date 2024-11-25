import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './AppContext';
import { ConfigProvider } from 'antd';
import esES from "antd/locale/es_ES"

ReactDOM.render(
  <BrowserRouter>
    <AppContextProvider>
      <ConfigProvider locale={esES}>
        <App />
      </ConfigProvider>
    </AppContextProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
