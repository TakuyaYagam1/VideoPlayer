import { useEffect, useRef } from 'react'
import Hls from 'hls.js'

export function useHls(src: string | null, videoRef: React.RefObject<HTMLVideoElement | null>) {
  const hlsRef = useRef<Hls | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return

    if (Hls.isSupported()) {
      const hls = new Hls()
      hlsRef.current = hls
      hls.loadSource(src)
      hls.attachMedia(video)
      return () => {
        hls.destroy()
        hlsRef.current = null
      }
    }

    // Safari: native HLS via ManagedMediaSource or canPlayType
    const canNative =
      'ManagedMediaSource' in window ||
      video.canPlayType('application/vnd.apple.mpegurl') !== ''
    if (canNative) {
      video.src = src
    }
  }, [src, videoRef])

  return hlsRef
}
