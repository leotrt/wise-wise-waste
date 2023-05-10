import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.scss'
import '@fontsource/dosis/200.css';
import '@fontsource/dosis/400.css';
import '@fontsource/dosis/800.css';
import '@fontsource/source-code-pro/700.css';
import '@fontsource/source-code-pro/400.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
<React.StrictMode>
  <App/>
</React.StrictMode>,
)
