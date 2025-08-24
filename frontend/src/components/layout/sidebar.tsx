import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home,
  Coins,
  CheckCircle,
  Settings,
  ChevronRight,
  ChevronDown,
  FileText,
  Users,
  BarChart3,
  HelpCircle,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/app'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Main',
    items: [
      { name: 'Dashboard', href: '/', icon: Home },
      { name: 'Mint Certificate', href: '/mint', icon: Coins },
      { name: 'Verify Certificate', href: '/verify', icon: CheckCircle },
      { name: 'Admin Panel', href: '/admin', icon: Settings },
    ]
  },
  {
    name: 'Tools',
    items: [
      { name: 'Documentation', href: '/docs', icon: FileText, external: true },
      { name: 'Analytics', href: '/analytics', icon: BarChart3 },
      { name: 'User Management', href: '/users', icon: Users },
    ]
  },
  {
    name: 'Support',
    items: [
      { name: 'Help Center', href: '/help', icon: HelpCircle },
      { name: 'API Reference', href: '/api', icon: ExternalLink, external: true },
    ]
  }
]

export function Sidebar() {
  const location = useLocation()
  const { sidebarOpen, setSidebarOpen, preferences } = useAppStore()
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(['Main']))

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName)
    } else {
      newExpanded.add(sectionName)
    }
    setExpandedSections(newExpanded)
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile Sidebar with Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Mobile Sidebar */}
            <motion.aside
              className="fixed left-0 top-0 z-50 h-full w-64 bg-background border-r shadow-lg md:hidden"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex h-16 items-center justify-between border-b px-4">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-sm">
                    C
                  </div>
                  <span className="font-bold">CertChain</span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 p-4">
                {navigation.map((section) => (
                  <div key={section.name} className="space-y-1">
                    <button
                      onClick={() => toggleSection(section.name)}
                      className="flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {section.name}
                      {expandedSections.has(section.name) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    <AnimatePresence>
                      {expandedSections.has(section.name) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-1 overflow-hidden"
                        >
                          {section.items.map((item) => {
                            const Icon = item.icon
                            const active = isActive(item.href)
                            
                            return (
                              <Link
                                key={item.name}
                                to={item.href}
                                className={cn(
                                  "flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors",
                                  active
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                                onClick={() => {
                                  if (item.external) {
                                    window.open(item.href, '_blank')
                                  } else {
                                    setSidebarOpen(false)
                                  }
                                }}
                              >
                                <Icon className="h-4 w-4" />
                                <span>{item.name}</span>
                                {item.external && (
                                  <ExternalLink className="h-3 w-3 ml-auto" />
                                )}
                              </Link>
                            )
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </nav>

              {/* Footer */}
              <div className="border-t p-4">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">U</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">User Name</p>
                    <p className="text-xs text-muted-foreground truncate">user@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
      </AnimatePresence>

      {/* Desktop Sidebar - Always Visible */}
      <aside className="hidden md:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-background border-r shadow-lg">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white font-bold text-sm">
                C
              </div>
              <span className="font-bold">CertChain</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-4">
            {navigation.map((section) => (
              <div key={section.name} className="space-y-1">
                <button
                  onClick={() => toggleSection(section.name)}
                  className="flex w-full items-center justify-between px-2 py-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {section.name}
                  {expandedSections.has(section.name) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedSections.has(section.name) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1 overflow-hidden"
                    >
                      {section.items.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)
                        
                        return (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors",
                              active
                                ? "bg-primary/10 text-primary border border-primary/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                            onClick={() => {
                              if (item.external) {
                                window.open(item.href, '_blank')
                              }
                            }}
                          >
                            <Icon className="h-4 w-4" />
                            <span>{item.name}</span>
                            {item.external && (
                              <ExternalLink className="h-3 w-3 ml-auto" />
                            )}
                          </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">User Name</p>
                <p className="text-xs text-muted-foreground truncate">user@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
} 