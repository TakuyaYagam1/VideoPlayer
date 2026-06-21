import { useState, useCallback } from 'react'
import VideoList from './VideoList'
import Player from './Player'
import type { Video } from './types'

export default function App() {
  const [selected, setSelected] = useState<Video | null>(null)
  const [views, setViews] = useState<number | null>(null)

  const handleSelect = useCallback((video: Video) => {
    setSelected(video)
    setViews(video.views)
  }, [])

  const handleViewRecorded = useCallback((newViews: number) => {
    setViews(newViews)
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <h1>IfBest Video Player</h1>
      </header>
      <main className="app-main">
        {selected && (
          <>
            <Player video={selected} onViewRecorded={handleViewRecorded} />
            <p className="view-count">Просмотров: {views ?? selected.views}</p>
          </>
        )}
        <VideoList onSelect={handleSelect} selectedId={selected?.id} />
      </main>
    </div>
  )
}
