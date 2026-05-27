import { useState } from 'react'
import { HomeContext } from '../contexts/HomeContext'
import { useMedias } from '../hooks/useMedias'

export const HomeProvider = ({ children }) => {
  const [loved, setLoved] = useState(false)
  const [mediasWatching, setMediasWatching] = useState([])
  const [selectedMediaId, setSelectedMediaId] = useState(null)


  const { mediasCollection, bannerTrailers, bannerLogos, isLoading, isError, error } = useMedias()

  
  const activeMediaId =
    selectedMediaId || mediasCollection?.mediaBanner?.[0]?.id


  return (
    <HomeContext.Provider
      value={{
        mediaBanner: mediasCollection.mediaBanner || [],
        activeMediaId,
        setActiveMediaId: setSelectedMediaId,
        loved,
        setLoved,
        bannerTrailers,
        setMediasWatching,
        mediasPopular: mediasCollection.mediasPopular || [],
        mediasReleased: mediasCollection.mediasReleased || [],
        mediasTopRated: mediasCollection.mediasTopRated || [],
        mediasAnime: mediasCollection.mediasAnime || [],
        mediasWatching,
        bannerLogos,
        isLoading,
        isError,
        error,
      }}
    >
      {children}
    </HomeContext.Provider>
  )
}
