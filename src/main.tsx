// ReactDOM.createRoot(...) 부분에서 앱이 마운트됩니다.
/**
 * 이 코드는 React 애플리케이션의 진입점(main entry point)입니다.
 * 각 부분의 역할을 자세히 설명하면 다음과 같습니다:
 * 
 * 1. import React from 'react'
 *    - React 라이브러리를 불러옵니다. JSX 문법을 사용하기 위해 필요합니다.
 * 
 * 2. import ReactDOM from 'react-dom/client'
 *    - ReactDOM은 React 컴포넌트를 실제 브라우저의 DOM에 렌더링하는 역할을 합니다.
 *    - 'react-dom/client'의 createRoot API를 사용하여 React 18의 새로운 동시성 기능을 활용할 수 있습니다.
 * 
 * 3. import './index.css'
 *    - 전역 CSS 파일을 import하여 전체 앱에 스타일을 적용합니다.
 * 
 * 4. import App from './App.tsx'
 *    - App 컴포넌트를 import합니다. 이 컴포넌트가 애플리케이션의 루트(최상위) 컴포넌트입니다.
 * 
 * 5. import { BrowserRouter } from 'react-router-dom'
 *    - React Router의 BrowserRouter를 import합니다.
 *    - BrowserRouter는 SPA(Single Page Application)에서 URL을 관리하고, 라우팅 기능을 제공합니다.
 * 
 * 6. ReactDOM.createRoot(document.getElementById('root')!).render(...)
 *    - public/index.html에 있는 id가 'root'인 DOM 요소에 React 앱을 마운트합니다.
 *    - createRoot를 사용하면 React 18의 새로운 기능(동시성 등)을 사용할 수 있습니다.
 *    - render 함수 안에서 <React.StrictMode>로 감싸 개발 중 잠재적인 문제를 감지할 수 있습니다.
 *    - <BrowserRouter>로 <App />을 감싸서 라우팅 기능을 사용할 수 있게 합니다.
 *    - 최종적으로 <App />이 렌더링되어 전체 애플리케이션이 동작하게 됩니다.
 * 
 * 요약: 이 파일은 React 앱의 시작점으로, 전역 스타일을 적용하고, 라우팅 기능을 추가하며, 
 * App 컴포넌트를 실제 DOM에 마운트하는 역할을 합니다.
 */


import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <App />을 <BrowserRouter>로 감싸기</> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)