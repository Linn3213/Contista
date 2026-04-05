import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

type Toast = { id: number; message: string }

type ToastContextType = {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 2200)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-28 md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-6 md:translate-x-0 z-[200] flex flex-col gap-2 items-center">
        {toasts.map(t => (
          <div
            key={t.id}
            className="bg-on-surface text-background text-[11px] uppercase tracking-[0.15em] font-medium px-6 py-3 rounded-full shadow-editorial animate-fade-in"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
