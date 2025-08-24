import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { ToastProvider } from '@/components/providers/toast-provider'
import { Layout } from '@/components/layout/layout'
import { ErrorBoundary } from '@/components/error-boundary'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

// Lazy load pages for code splitting
const Mint = React.lazy(() => import('./pages/Mint'))
const Verify = React.lazy(() => import('./pages/Verify'))
const Admin = React.lazy(() => import('./pages/Admin'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="certchain-theme">
        <ToastProvider>
          <BrowserRouter>
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/mint" element={<Mint />} />
                    <Route path="/verify" element={<Verify />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AnimatePresence>
              </Suspense>
            </Layout>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App 