import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'

type ToastType = 'success' | 'error'

interface ToastItem {
  id: number
  message: string
  type: ToastType
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void
}

interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)
const ConfirmContext = createContext<ConfirmContextValue | undefined>(undefined)

interface PageLoaderContextValue {
  startLoading: () => void
  stopLoading: () => void
}

const PageLoaderContext = createContext<PageLoaderContextValue | undefined>(undefined)

interface UiFeedbackProviderProps {
  children: ReactNode
}

export const UiFeedbackProvider = ({ children }: UiFeedbackProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [confirmState, setConfirmState] = useState<{
    open: boolean
    options: ConfirmOptions | null
    resolver: ((value: boolean) => void) | null
  }>({
    open: false,
    options: null,
    resolver: null,
  })
  const [loadingCount, setLoadingCount] = useState(0)

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random()
    const toast: ToastItem = { id, message, type }
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({
        open: true,
        options,
        resolver: resolve,
      })
    })
  }, [])

  const startLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1)
  }, [])

  const stopLoading = useCallback(() => {
    setLoadingCount((prev) => (prev > 0 ? prev - 1 : 0))
  }, [])

  const handleConfirm = useCallback(
    (value: boolean) => {
      setConfirmState((prev) => {
        if (prev.resolver) {
          prev.resolver(value)
        }
        return {
          open: false,
          options: null,
          resolver: null,
        }
      })
    },
    [],
  )

  const toastContextValue = useMemo<ToastContextValue>(
    () => ({
      showToast,
    }),
    [showToast],
  )

  const confirmContextValue = useMemo<ConfirmContextValue>(
    () => ({
      confirm,
    }),
    [confirm],
  )

  const pageLoaderContextValue = useMemo<PageLoaderContextValue>(
    () => ({
      startLoading,
      stopLoading,
    }),
    [startLoading, stopLoading],
  )

  const isLoading = loadingCount > 0

  return (
    <ToastContext.Provider value={toastContextValue}>
      <ConfirmContext.Provider value={confirmContextValue}>
        <PageLoaderContext.Provider value={pageLoaderContextValue}>
          {children}
          {isLoading && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />
                <div className="text-sm font-medium text-white">Loading...</div>
              </div>
            </div>
          )}
          <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`min-w-[220px] max-w-sm rounded-md px-4 py-2 shadow-lg text-sm text-white ${
                  toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                }`}
              >
                {toast.message}
              </div>
            ))}
          </div>
          {confirmState.open && confirmState.options && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
              <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
                {confirmState.options.title && (
                  <h2 className="mb-2 text-lg font-semibold text-gray-900">
                    {confirmState.options.title}
                  </h2>
                )}
                <p className="mb-4 text-sm text-gray-700">{confirmState.options.message}</p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="rounded border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => handleConfirm(false)}
                  >
                    {confirmState.options.cancelText || 'Cancel'}
                  </button>
                  <button
                    type="button"
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                    onClick={() => handleConfirm(true)}
                  >
                    {confirmState.options.confirmText || 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </PageLoaderContext.Provider>
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within UiFeedbackProvider')
  }
  return context
}

export const useConfirm = () => {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within UiFeedbackProvider')
  }
  return context
}

export const usePageLoader = () => {
  const context = useContext(PageLoaderContext)
  if (!context) {
    throw new Error('usePageLoader must be used within UiFeedbackProvider')
  }
  return context
}
