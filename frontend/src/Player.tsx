import { useRef, useState, useEffect, useCallback } from 'react'
import { useHls } from './useHls'
import type { Video } from './types'

interface Props {
  video: Video
}

export default function Player({ video }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useHls(video.m3u8_url, videoRef)

  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) el.play()
    else el.pause()
  }, [])

  return (
    <div className="player-container">
      <video ref={videoRef} className="player-video" />
      <div className="player-controls">
        <button className="ctrl-btn" onClick={togglePlay} aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}>
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  )
}
