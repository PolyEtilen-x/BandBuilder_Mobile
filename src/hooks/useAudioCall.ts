import { useEffect, useRef, useState } from "react"
import { Audio } from "expo-av"
import * as FileSystem from "expo-file-system"
import { useSpeakingStore } from "@/services/speaking/speaking.store"

/**
 * Helper to decode base64 string to Uint8Array in standard JS
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  const lookup = new Uint8Array(256)
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i
  }

  let bufferLength = base64.length * 0.75
  if (base64[base64.length - 1] === "=") {
    bufferLength--
    if (base64[base64.length - 2] === "=") {
      bufferLength--
    }
  }

  const bytes = new Uint8Array(bufferLength)
  let p = 0
  for (let i = 0; i < base64.length; i += 4) {
    const base64Val1 = lookup[base64.charCodeAt(i)]
    const base64Val2 = lookup[base64.charCodeAt(i + 1)]
    const base64Val3 = lookup[base64.charCodeAt(i + 2)]
    const base64Val4 = lookup[base64.charCodeAt(i + 3)]

    const bytesVal1 = (base64Val1 << 2) | (base64Val2 >> 4)
    const bytesVal2 = ((base64Val2 & 15) << 4) | (base64Val3 >> 2)
    const bytesVal3 = ((base64Val3 & 3) << 6) | (base64Val4 & 63)

    bytes[p++] = bytesVal1
    if (p < bufferLength) bytes[p++] = bytesVal2
    if (p < bufferLength) bytes[p++] = bytesVal3
  }

  return bytes
}

export function useAudioCall() {
  const {
    callState,
    sendAudioChunk,
    stopRecording: triggerStopRecording,
    isMuted
  } = useSpeakingStore()

  const [isRecording, setIsRecording] = useState(false)
  const [rmsVolume, setRmsVolume] = useState(0)
  const recordingRef = useRef<Audio.Recording | null>(null)
  const volumeIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Configure high-quality 16kHz 16-bit linear PCM WAV recording
  const recordingOptions = {
    android: {
      extension: ".wav",
      outputFormat: Audio.AndroidOutputFormat.DEFAULT,
      audioEncoder: Audio.AndroidAudioEncoder.DEFAULT,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 256000,
    },
    ios: {
      extension: ".wav",
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 16000,
      numberOfChannels: 1,
      bitRate: 256000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: {
      mimeType: "audio/wav",
      bitsPerSecond: 128000,
    },
  }

  useEffect(() => {
    return () => {
      cleanupAudio()
    }
  }, [])

  useEffect(() => {
    if (callState === "active") {
      startRecording()
    } else if (callState !== "thinking" && callState !== "feedback") {
      stopRecording()
    }
  }, [callState])

  async function startRecording() {
    try {
      await cleanupAudio()

      // Request permission
      const permission = await Audio.requestPermissionsAsync()
      if (!permission.granted) {
        console.error("Microphone permission denied")
        return
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: false,
      })

      const recording = new Audio.Recording()
      await recording.prepareToRecordAsync(recordingOptions)
      await recording.startAsync()

      recordingRef.current = recording
      setIsRecording(true)

      // Micro-waveform indicator generator
      volumeIntervalRef.current = setInterval(async () => {
        if (recordingRef.current && !isMuted) {
          const status = await recordingRef.current.getStatusAsync()
          if (status.canRecord) {
            // Generate simulated RMS fluctuations between 0.02 and 0.15 for visuals
            const simulatedRms = 0.02 + Math.random() * 0.13
            setRmsVolume(simulatedRms)
          }
        }
      }, 250)

    } catch (err) {
      console.error("Failed to start recording:", err)
      setIsRecording(false)
    }
  }

  async function stopRecording() {
    if (!recordingRef.current) return

    setIsRecording(false)
    setRmsVolume(0)

    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current)
      volumeIntervalRef.current = null
    }

    try {
      const recording = recordingRef.current
      recordingRef.current = null

      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()

      if (uri) {
        // Read file as base64 string
        const base64String = await FileSystem.readAsStringAsync(uri, {
          encoding: "base64",
        })

        // Decode base64 to byte array
        const fullBytes = base64ToUint8Array(base64String)

        // Slices off the 44-byte WAV header to expose pure raw linear 16-bit PCM bytes
        const pcmBytes = fullBytes.subarray(44)

        // Send binary buffer to Speaking Gateway
        sendAudioChunk(pcmBytes.buffer as ArrayBuffer)
      }

      triggerStopRecording()
    } catch (err) {
      console.error("Failed to stop recording & process audio:", err)
    }
  }

  async function cleanupAudio() {
    if (volumeIntervalRef.current) {
      clearInterval(volumeIntervalRef.current)
      volumeIntervalRef.current = null
    }

    if (recordingRef.current) {
      try {
        await recordingRef.current.stopAndUnloadAsync()
      } catch (e) {}
      recordingRef.current = null
    }
    setIsRecording(false)
    setRmsVolume(0)
  }

  return {
    isRecording,
    rmsVolume,
    stopRecording
  }
}
