import { useState, useEffect, useRef, useMemo } from "react"
import { WebView } from "react-native-webview"
import { PronunciationSentenceDto, PronunciationTopicDetailDto } from "@/api/practiceGeneral.api"

export function extractYoutubeVideoId(url: string | null): string | null {
  if (!url) return null
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

export function useYoutubeShadowing(
  detail: PronunciationTopicDetailDto | null,
  webViewRef: React.RefObject<WebView | null>
) {
  const [isPlayerReady, setIsPlayerReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [isLooping, setIsLooping] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playerError, setPlayerError] = useState<number | null>(null)
  
  const [selectedSentence, setSelectedSentence] = useState<PronunciationSentenceDto | null>(null)
  const [activeSentence, setActiveSentence] = useState<PronunciationSentenceDto | null>(null)

  const selectedSentenceRef = useRef<PronunciationSentenceDto | null>(null)
  const isLoopingRef = useRef(isLooping)
  const sentencesRef = useRef<PronunciationSentenceDto[]>([])

  useEffect(() => {
    selectedSentenceRef.current = selectedSentence
  }, [selectedSentence])

  useEffect(() => {
    isLoopingRef.current = isLooping
  }, [isLooping])

  useEffect(() => {
    sentencesRef.current = detail?.sentences || []
  }, [detail])

  // Reset states when detail changes
  useEffect(() => {
    setIsPlayerReady(false)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setSelectedSentence(null)
    setActiveSentence(null)
    setPlayerError(null)
  }, [detail?.id])

  const injectJS = (code: string) => {
    webViewRef.current?.injectJavaScript(`${code}; true;`)
  }

  const playVideo = () => injectJS("playVideo()")
  const pauseVideo = () => injectJS("pauseVideo()")
  const seekTo = (seconds: number) => injectJS(`seekTo(${seconds})`)
  
  const setSpeed = (rate: number) => {
    setPlaybackSpeed(rate)
    injectJS(`setPlaybackRate(${rate})`)
  }

  const togglePlay = () => {
    if (isPlaying) pauseVideo()
    else playVideo()
  }

  const toggleLoop = () => {
    setIsLooping((p) => !p)
  }

  const playSentence = (sentence: PronunciationSentenceDto) => {
    setSelectedSentence(sentence)
    setActiveSentence(sentence)
    seekTo(sentence.startTime)
    playVideo()
  }

  const clearSelectedSentence = () => {
    setSelectedSentence(null)
  }

  const onWebViewMessage = (event: any) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data)
      if (msg.type === "ready") {
        setIsPlayerReady(true)
        if (msg.duration) setDuration(msg.duration)
      } else if (msg.type === "timeupdate") {
        const time = msg.currentTime
        setCurrentTime(time)

        const sel = selectedSentenceRef.current
        if (sel) {
          // Shadowing Mode loop & pause
          if (time >= sel.endTime) {
            if (isLoopingRef.current) {
              seekTo(sel.startTime)
            } else {
              pauseVideo()
              setSelectedSentence(null)
            }
          }
          setActiveSentence(sel)
        } else {
          // Continuous scroll highlighting
          const sentences = sentencesRef.current
          const match = sentences.find((s) => time >= s.startTime && time <= s.endTime)
          setActiveSentence(match || null)
        }
      } else if (msg.type === "statechange") {
        if (msg.state === 1) {
          setIsPlaying(true)
        } else {
          setIsPlaying(false)
        }
      } else if (msg.type === "error") {
        setPlayerError(msg.error)
      }
    } catch (e) {
      console.warn("Failed to parse webview postMessage:", e)
    }
  }

  const videoId = useMemo(() => {
    return detail ? extractYoutubeVideoId(detail.videoUrl) : null
  }, [detail])

  const htmlSource = useMemo(() => {
    if (!videoId) return ""
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; background-color: black; overflow: hidden; }
          #player { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="player"></div>
        <script>
          var tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

          var player;
          function onYouTubeIframeAPIReady() {
            player = new YT.Player('player', {
              height: '100%',
              width: '100%',
              videoId: '${videoId}',
              playerVars: {
                playsinline: 1,
                controls: 1,
                rel: 0,
                showinfo: 0,
                modestbranding: 1,
                autoplay: 0
              },
              events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
              }
            });
          }

          function onPlayerReady(event) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'ready',
              duration: player.getDuration()
            }));
            setInterval(function() {
              if (player && typeof player.getCurrentTime === 'function') {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'timeupdate',
                  currentTime: player.getCurrentTime()
                }));
              }
            }, 100);
          }

          function onPlayerStateChange(event) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'statechange',
              state: event.data
            }));
          }

          function onPlayerError(event) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              error: event.data
            }));
          }

          function playVideo() {
            if (player && player.playVideo) player.playVideo();
          }

          function pauseVideo() {
            if (player && player.pauseVideo) player.pauseVideo();
          }

          function seekTo(seconds) {
            if (player && player.seekTo) player.seekTo(seconds, true);
          }

          function setPlaybackRate(rate) {
            if (player && player.setPlaybackRate) player.setPlaybackRate(rate);
          }
        </script>
      </body>
      </html>
    `
  }, [videoId])

  return {
    isPlayerReady,
    isPlaying,
    playbackSpeed,
    isLooping,
    currentTime,
    duration,
    selectedSentence,
    activeSentence,
    htmlSource,
    videoId,
    playerError,
    onWebViewMessage,
    playVideo,
    pauseVideo,
    seekTo,
    setSpeed,
    togglePlay,
    toggleLoop,
    playSentence,
    clearSelectedSentence
  }
}
