import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import SplitCheck from './App/SplitCheck' 
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SplitCheck />
  </StrictMode>
)
