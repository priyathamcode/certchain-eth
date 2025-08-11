import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface UserPreferences {
  autoConnect: boolean
  notifications: boolean
  sound: boolean
  compactMode: boolean
  sidebarCollapsed: boolean
}

interface AppState {
  // Notifications
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  // Loading states
  loadingStates: Record<string, boolean>
  setLoading: (key: string, loading: boolean) => void
  clearLoading: (key: string) => void
  
  // User preferences
  preferences: UserPreferences
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  
  // Sidebar
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  
  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // Breadcrumbs
  breadcrumbs: Array<{ label: string; href?: string }>
  setBreadcrumbs: (breadcrumbs: Array<{ label: string; href?: string }>) => void
  
  // Error boundary
  error: Error | null
  setError: (error: Error | null) => void
  
  // Network status
  isOnline: boolean
  setOnlineStatus: (online: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Notifications
      notifications: [],
      addNotification: (notification) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newNotification = { ...notification, id }
        
        set((state) => ({
          notifications: [...state.notifications, newNotification]
        }))
        
        // Auto-remove after duration
        if (notification.duration !== 0) {
          setTimeout(() => {
            get().removeNotification(id)
          }, notification.duration || 5000)
        }
      },
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },
      clearNotifications: () => {
        set({ notifications: [] })
      },
      
      // Loading states
      loadingStates: {},
      setLoading: (key, loading) => {
        set((state) => ({
          loadingStates: { ...state.loadingStates, [key]: loading }
        }))
      },
      clearLoading: (key) => {
        set((state) => {
          const { [key]: _, ...rest } = state.loadingStates
          return { loadingStates: rest }
        })
      },
      
      // User preferences
      preferences: {
        autoConnect: true,
        notifications: true,
        sound: true,
        compactMode: false,
        sidebarCollapsed: false,
      },
      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        }))
      },
      
      // Sidebar
      sidebarOpen: false,
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }))
      },
      setSidebarOpen: (open) => {
        set({ sidebarOpen: open })
      },
      
      // Search
      searchQuery: '',
      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },
      
      // Breadcrumbs
      breadcrumbs: [],
      setBreadcrumbs: (breadcrumbs) => {
        set({ breadcrumbs })
      },
      
      // Error boundary
      error: null,
      setError: (error) => {
        set({ error })
      },
      
      // Network status
      isOnline: navigator.onLine,
      setOnlineStatus: (online) => {
        set({ isOnline: online })
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
)

// Network status listener
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useAppStore.getState().setOnlineStatus(true)
  })
  
  window.addEventListener('offline', () => {
    useAppStore.getState().setOnlineStatus(false)
  })
} 