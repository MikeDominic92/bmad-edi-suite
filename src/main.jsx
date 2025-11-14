import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { InvestigationProvider } from './contexts/InvestigationContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InvestigationProvider>
      <App />
    </InvestigationProvider>
  </React.StrictMode>,
)
