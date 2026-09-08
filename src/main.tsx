import { createRoot } from 'react-dom/client'
import { ArchiveRoot } from './i18n'
import './index.css'
import App from './App.tsx'

// StrictMode disabled: double mount/unmount races WebGL dispose with React DOM
// reconciliation (removeChild). Re-enable after all effects are StrictMode-safe.
createRoot(document.getElementById('root')!).render(
  <ArchiveRoot>
    <App />
  </ArchiveRoot>,
)
