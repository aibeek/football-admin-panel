import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './i18n'; // Import i18n configuration
import './styles/globals.css'
import { initTelegramMiniApp } from './utils/telegram/webApp'

initTelegramMiniApp();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
