import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import AppRouter from './routes/AppRouter.jsx'
import './index.css'

/**
 * QueryClient — global TanStack Query configuration.
 *
 * Defaults:
 * - staleTime:          30 000 ms  (data stays fresh for 30 s)
 * - gcTime:            300 000 ms  (inactive cache garbage collected after 5 min)
 * - queries retry:           1     (retry failed queries once)
 * - mutations retry:         0     (do not retry failed mutations)
 * - refetchOnWindowFocus:  false   (no background refetch on tab focus)
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

/**
 * Provider hierarchy (outermost → innermost):
 * StrictMode → QueryClientProvider → BrowserRouter → AuthProvider → ToastProvider → AppRouter
 */
createRoot(document.getElementById('root')).render(
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
