import { useState, useEffect } from 'react'

const STORAGE_KEY = 'media-view-preference'

export const useViewPreference = () => {
  const [view, setView] = useState('grid')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedView = localStorage.getItem(STORAGE_KEY)
    if (savedView === 'list' || savedView === 'grid') {
      setView(savedView)
    }
    setIsLoaded(true)
  }, [])

  const updateView = (newView) => {
    if (newView === 'grid' || newView === 'list') {
      setView(newView)
      localStorage.setItem(STORAGE_KEY, newView)
    }
  }

  return { view, updateView, isLoaded }
}
