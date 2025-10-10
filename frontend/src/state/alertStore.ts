import { create } from 'zustand'

export interface Alert {
  id: string
  title: string
  message: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: Date
}

interface AlertState {
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, 'id' | 'timestamp'>) => void
  dismissAlert: (id: string) => void
  clearAlerts: () => void
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  addAlert: (alert) => set((state) => ({
    alerts: [...state.alerts, {
      ...alert,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    }]
  })),
  dismissAlert: (id) => set((state) => ({
    alerts: state.alerts.filter(alert => alert.id !== id)
  })),
  clearAlerts: () => set({ alerts: [] })
}))