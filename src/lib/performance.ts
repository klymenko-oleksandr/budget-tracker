import React from 'react'

// Performance monitoring utilities
export const measureApiCall = async <T>(
  apiCall: () => Promise<T>,
  label: string
): Promise<T> => {
  const start = performance.now()
  try {
    const result = await apiCall()
    const duration = performance.now() - start
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${label}: ${duration.toFixed(2)}ms`)
      
      // Warn if API call takes longer than 1 second
      if (duration > 1000) {
        console.warn(`⚠️ Slow API call detected: ${label} took ${duration.toFixed(2)}ms`)
      }
    }
    
    return result
  } catch (error) {
    const duration = performance.now() - start
    console.error(`❌ ${label} failed after ${duration.toFixed(2)}ms:`, error)
    throw error
  }
}

// Database query performance monitoring
export const logQueryPerformance = (queryName: string, startTime: number) => {
  const duration = performance.now() - startTime
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`🗄️ DB Query ${queryName}: ${duration.toFixed(2)}ms`)
    
    if (duration > 500) {
      console.warn(`⚠️ Slow database query: ${queryName} took ${duration.toFixed(2)}ms`)
    }
  }
  
  return duration
}

// Component render performance monitoring
export const useRenderPerformance = (componentName: string) => {
  if (process.env.NODE_ENV === 'development') {
    const renderStart = performance.now()
    
    React.useEffect(() => {
      const renderTime = performance.now() - renderStart
      console.log(`⚛️ ${componentName} render: ${renderTime.toFixed(2)}ms`)
    })
  }
}
