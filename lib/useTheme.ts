'use client'
import { useEffect, useState } from 'react'

export type Theme = 'system' | 'light' | 'dark'

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system')

  useEffect(() => {
    // Read from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as Theme | null
    if (savedTheme) {
      setThemeState(savedTheme)
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const currentTheme = localStorage.getItem('theme') as Theme | null
      if (!currentTheme || currentTheme === 'system') {
        const root = document.documentElement
        if (mediaQuery.matches) {
          root.classList.add('dark')
          root.classList.remove('light')
        } else {
          root.classList.add('light')
          root.classList.remove('dark')
        }
      }
    }

    // Align classes on mount in case the head script missed it or didn't sync
    handleChange()

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    const root = document.documentElement
    
    if (newTheme === 'system') {
      localStorage.removeItem('theme')
      root.classList.remove('dark', 'light')
      
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (systemDark) {
        root.classList.add('dark')
      } else {
        root.classList.add('light') // Ensure light is applied explicitly
      }
    } else {
      localStorage.setItem('theme', newTheme)
      if (newTheme === 'dark') {
        root.classList.add('dark')
        root.classList.remove('light')
      } else {
        root.classList.add('light')
        root.classList.remove('dark')
      }
    }
  }

  return { theme, setTheme }
}
