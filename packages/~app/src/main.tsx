import '@/styles/index.scss'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from '@/App'
import { env } from '@ecommerce/config'

const rootDom = document.getElementById('root')

if (rootDom != null) {
  switch (env.VITE_MODE.value) {
    case 'development':
    case 'test': {
      ReactDOM.createRoot(rootDom).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      )

      break
    }
    case 'staging': {
      ReactDOM.createRoot(rootDom).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      )

      break
    }
    case 'production': {
      ReactDOM.createRoot(rootDom).render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      )

      break
    }
  }
}
