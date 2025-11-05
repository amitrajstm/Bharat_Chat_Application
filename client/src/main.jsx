import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { DarkModeProvider } from './Contexts/DarkModeWrapper.jsx'
import { RecoilRoot } from 'recoil'
import { ChatProvider } from './Contexts/ChatProvider.jsx'
import { SocketProvider } from './Contexts/SocketProvider.jsx'
import { VideoCallProvider } from './Contexts/VideCallContext.jsx'
createRoot(document.getElementById('root')).render(
  <RecoilRoot>
    <SocketProvider>
      <ChatProvider>
      <VideoCallProvider>
        <BrowserRouter>
          <DarkModeProvider>
            <App />
            <ToastContainer />
          </DarkModeProvider>
        </BrowserRouter>
      </VideoCallProvider>
      </ChatProvider>
    </SocketProvider>
  </RecoilRoot>,
)
