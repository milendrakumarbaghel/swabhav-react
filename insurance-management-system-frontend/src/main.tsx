import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import AppRouter from './routes/AppRouter'
import './index.css'

/**
 * TanStack Query global configuration:
 *  - staleTime: 30 000 ms — data stays fresh for 30 s
 *  - gcTime:   300 000 ms — unused cache garbage-collected after 5 min
 *  - retry: 1             — queries retry once on failure
 *  - mutations retry: 0   — mutations never retry automatically
 *  - refetchOnWindowFocus: false — no background refetch on tab focus
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 300_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
