export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'
export const defaultWindow = typeof window !== 'undefined' ? window : undefined
