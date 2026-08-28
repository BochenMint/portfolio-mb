import { createRoot } from 'react-dom/client'
import { ArchiveRoot } from '../i18n'
import './v6.css'
import { AppV6 } from './AppV6'

createRoot(document.getElementById('root')!).render(
  <ArchiveRoot>
    <AppV6 />
  </ArchiveRoot>,
)
