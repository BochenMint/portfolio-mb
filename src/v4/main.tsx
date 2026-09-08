import { createRoot } from 'react-dom/client'
import { ArchiveRoot } from '../i18n'
import '../index.css'
import './v4.css'
import { AppV4 } from './AppV4'

createRoot(document.getElementById('root')!).render(
  <ArchiveRoot>
    <AppV4 />
  </ArchiveRoot>,
)
