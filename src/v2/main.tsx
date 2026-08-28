import { createRoot } from 'react-dom/client'
import { ArchiveRoot } from '../i18n'
import '../index.css'
import './v2.css'
import { AppV2 } from './AppV2'

createRoot(document.getElementById('root')!).render(
  <ArchiveRoot>
    <AppV2 />
  </ArchiveRoot>,
)
