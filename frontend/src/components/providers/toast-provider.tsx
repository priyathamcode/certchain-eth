import React from 'react'
import { useToast } from '@/hooks/use-toast'
import { useAppStore } from '@/store/app'
import { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider as ToastProviderPrimitive, ToastTitle, ToastViewport } from '@/components/ui/toast'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { notifications, removeNotification } = useAppStore()

  return (
    <ToastProviderPrimitive>
      {children}
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          variant={notification.type === 'error' ? 'destructive' : notification.type === 'success' ? 'success' : notification.type === 'warning' ? 'warning' : 'default'}
          onOpenChange={() => removeNotification(notification.id)}
        >
          <div className="grid gap-1">
            <ToastTitle>{notification.title}</ToastTitle>
            {notification.message && (
              <ToastDescription>{notification.message}</ToastDescription>
            )}
          </div>
          {notification.action && (
            <ToastAction altText={notification.action.label} onClick={notification.action.onClick}>
              {notification.action.label}
            </ToastAction>
          )}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProviderPrimitive>
  )
} 