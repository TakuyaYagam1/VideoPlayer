import { useRef, useState, useEffect, useCallback } from 'react'
import { useHls } from './useHls'
import type { Video } from './types'

function formatTime(sec: number): string {
  if (!isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

interface Props {
  video: Video
}

export default function Player({ video }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useHls(video.m3u8_url, videoRef)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const isLive = duration === Infinity

  useEffect(() => {
    const el = videoRef.current
    if (!el) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onTimeUpdate = () => setCurrentTime(el.currentTime)
    const onDurationChange = () => setDuration(el.duration)

    el.addEventListener('play', onPlay)
    el.addEventListener('pause', onPause)
    el.addEventListener('timeupdate', onTimeUpdate)
    el.addEventListener('durationchange', onDurationChange)

    return () => {
      el.removeEventListener('play', onPlay)
      el.removeEventListener('pause', onPause)
      el.removeEventListener('timeupdate', onTimeUpdate)
      el.removeEventListener('durationchange', onDurationChange)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    if (el.paused) el.play()
    else el.pause()
  }, [])

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const el = videoRef.current
    if (!el) return
    el.currentTime = Number(e.target.value)
  }, [])

  return (
    <div className="player-container">
      <video ref={videoRef} className="player-video" />
      <div className="player-controls">
        <button className="ctrl-btn" onClick={togglePlay} aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}>
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="progress-wrap">
          <input
            type="range"
            className="progress-bar"
            min={0}
            max={isLive ? 0 : (duration || 0)}
            step={0.5}
            value={isLive ? 0 : currentTime}
            onChange={seek}
            disabled={isLive}
          />
        </div>

        <span className="time-display">
          {isLive ? 'LIVE' : `${formatTime(currentTime)} / ${formatTime(duration)}`}
        </span>
      </div>
    </div>
  )
}
