import { useState } from 'react'
import VideoList from './VideoList'
import Player from './Player'
import type { Video } from './types'

export default function App() {
  const [selected, setSelected] = useState<Video | null>(null)

  return (
    <div className="app">
      <header className="app-header">
        <h1>IfBest Video Player</h1>
      </header>
      <main className="app-main">
        {selected && <Player video={selected} />}
        <VideoList onSelect={setSelected} selectedId={selected?.id} />
      </main>
    </div>
  )
}
