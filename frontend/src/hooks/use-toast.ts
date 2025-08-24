import { useAppStore } from '@/store/app'

export function useToast() {
  const { addNotification, removeNotification } = useAppStore()

  return {
    toast: addNotification,
    dismiss: removeNotification,
  }
} 