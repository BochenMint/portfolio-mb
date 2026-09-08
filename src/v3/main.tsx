import { createRoot } from 'react-dom/client'
import { ArchiveRoot } from '../i18n'
import '../index.css'
import './v3.css'
import { AppV3 } from './AppV3'

createRoot(document.getElementById('root')!).render(
  <ArchiveRoot>
    <AppV3 />
  </ArchiveRoot>,
)
