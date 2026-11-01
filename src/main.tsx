import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/shrikhand/400.css'
import '@fontsource-variable/source-serif-4/index.css'
import '@fontsource/ibm-plex-mono/400.css'
import './index.css'
import App from './App'
import { LanguageProvider } from './i18n/LanguageContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
)
