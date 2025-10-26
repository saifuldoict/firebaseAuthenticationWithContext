import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { RouterProvider } from 'react-router'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import router from './routes/routes.jsx'
import AuthProvider from './context/AuthProvider.jsx'
import "animate.css";
createRoot(document.getElementById('root')).render(
  <StrictMode>
  <AuthProvider>
    <RouterProvider router={router}>
    <ToastContainer
    position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      pauseOnHover
      draggable
      theme="colored"
    />
  </RouterProvider>
  </AuthProvider>
  </StrictMode>,
