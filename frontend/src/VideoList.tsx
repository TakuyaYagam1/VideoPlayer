import { useEffect, useState } from 'react'
import { getVideos } from './api'
import type { Video } from './types'

interface Props {
  onSelect: (video: Video) => void
  selectedId?: number
}

export default function VideoList({ onSelect, selectedId }: Props) {
  const [videos, setVideos] = useState<Video[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .catch(() => setError('Не удалось загрузить список видео'))
  }, [])

  if (error) return <p className="vl-error">{error}</p>

  return (
    <ul className="video-list">
      {videos.map((v) => (
        <li
          key={v.id}
          className={`video-item${v.id === selectedId ? ' video-item--active' : ''}`}
          onClick={() => onSelect(v)}
        >
          <span className="video-item__title">{v.title}</span>
          <span className="video-item__views">{v.views} просм.</span>
        </li>
      ))}
    </ul>
  )
}
