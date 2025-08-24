import React from 'react'
import { motion } from 'framer-motion'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { useAppStore } from '@/store/app'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { sidebarOpen, preferences } = useAppStore()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        {/* Sidebar - hidden on mobile, shown on desktop */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        {/* Mobile sidebar overlay */}
        <div className="md:hidden">
          <Sidebar />
        </div>
        
        {/* Main content */}
        <motion.main 
          className="flex-1 min-h-[calc(100vh-4rem)] md:ml-64"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto p-4 md:p-6">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  )
} 