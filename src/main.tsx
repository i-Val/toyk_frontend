import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { UiFeedbackProvider } from './components/UiFeedbackProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UiFeedbackProvider>
          <App />
        </UiFeedbackProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
