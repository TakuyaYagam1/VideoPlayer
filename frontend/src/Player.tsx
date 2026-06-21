import { useRef } from 'react'
import { useHls } from './useHls'
import type { Video } from './types'

interface Props {
  video: Video
}

export default function Player({ video }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useHls(video.m3u8_url, videoRef)

  return (
    <div className="player-container">
      <video
        ref={videoRef}
        className="player-video"
        controls
      />
    </div>
  )
}
