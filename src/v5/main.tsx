import { createRoot } from 'react-dom/client'
import { ArchiveRoot } from '../i18n'
import './v5.css'
import { AppV5 } from './AppV5'

createRoot(document.getElementById('root')!).render(
  <ArchiveRoot>
    <AppV5 />
  </ArchiveRoot>,
)
