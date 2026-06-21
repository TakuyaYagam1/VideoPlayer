import { useState } from 'react'
import VideoList from './VideoList'
import type { Video } from './types'

export default function App() {
  const [selected, setSelected] = useState<Video | null>(null)

  return (
    <div className="app">
      <header className="app-header">
        <h1>IfBest Video Player</h1>
      </header>
      <main className="app-main">
        <VideoList onSelect={setSelected} selectedId={selected?.id} />
        {selected && (
          <div className="player-placeholder">
            <p>Выбрано: {selected.title}</p>
            <p>{selected.m3u8_url}</p>
          </div>
        )}
      </main>
    </div>
  )
}
