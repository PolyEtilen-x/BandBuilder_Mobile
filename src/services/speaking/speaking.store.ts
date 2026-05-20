import { create } from "zustand"
import { io, Socket } from "socket.io-client"
import { Audio } from "expo-av"

export type DialogueTurn = {
  sender: "ai" | "user"
  text: string
  isPartial?: boolean
}

export type SpeakingState = {
  // Socket & Connection
  socket: Socket | null
  isConnected: boolean

  // Call Session State
  callState: "idle" | "calling" | "active" | "thinking" | "feedback"
  selectedVoiceId: string
  timer: number
  isMuted: boolean
  isSpeakerOn: boolean
  activeSound: Audio.Sound | null

  // Dialogue Transcripts
  dialogue: DialogueTurn[]

  // Feedback Report Metrics
  overallBand: number
  metrics: {
    fluency: number
    lexical: number
    grammar: number
    pronunciation: number
  }
  corrections: Array<{
    type: "grammar" | "vocab" | "positive"
    original?: string
    correction?: string
    explanation: string
  }>

  // Actions
  initSocket: () => void
  startCall: (voiceId: string) => void
  sendAudioChunk: (chunk: ArrayBuffer) => void // binary PCM buffer for mobile
  stopRecording: () => void
  hangUp: () => void
  resetStore: () => void

  setMuted: (muted: boolean) => void
  setSpeakerOn: (speakerOn: boolean) => void
  incrementTimer: () => void
}

const WS_URL = process.env.EXPO_PUBLIC_API_URL || "https://aidsense.online"

export const useSpeakingStore = create<SpeakingState>((set, get) => ({
  socket: null,
  isConnected: false,
  callState: "idle",
  selectedVoiceId: "sophia",
  timer: 0,
  isMuted: false,
  isSpeakerOn: true,
  activeSound: null,
  dialogue: [],
  overallBand: 0,
  metrics: { fluency: 0, lexical: 0, grammar: 0, pronunciation: 0 },
  corrections: [],

  initSocket: (): void => {
    // Prevent duplicate connections
    if (get().socket) return

    const socket = io(WS_URL, {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
    })

    socket.on("connect", () => {
      set({ isConnected: true })
    })

    socket.on("disconnect", () => {
      set({ isConnected: false })
    })

    // Listen for session state synchronization
    socket.on("session_state", (data: { state: "idle" | "calling" | "active" | "thinking" | "feedback" }) => {
      set({ callState: data.state })
    })

    // Listen for real-time partial Whisper transcripts
    socket.on("partial_transcript", (data: { text: string }) => {
      const dialogue = [...get().dialogue]

      // If last turn is already a partial user transcript, update it. Otherwise, add new.
      const lastTurn = dialogue[dialogue.length - 1]
      if (lastTurn && lastTurn.sender === "user" && lastTurn.isPartial) {
        lastTurn.text = data.text
      } else {
        dialogue.push({ sender: "user", text: data.text, isPartial: true })
      }
      set({ dialogue })
    })

    // Listen for finalized user transcript
    socket.on("final_transcript", (data: { text: string }) => {
      const dialogue = [...get().dialogue]

      // Remove any partial user transcripts at the end
      while (dialogue.length > 0 && dialogue[dialogue.length - 1].sender === "user" && dialogue[dialogue.length - 1].isPartial) {
        dialogue.pop()
      }

      dialogue.push({ sender: "user", text: data.text, isPartial: false })
      set({ dialogue, callState: "thinking" })
    })

    // Listen for streaming LLM text responses
    socket.on("ai_stream", (data: { token: string }) => {
      const dialogue = [...get().dialogue]
      const lastTurn = dialogue[dialogue.length - 1]

      if (lastTurn && lastTurn.sender === "ai") {
        lastTurn.text += data.token
      } else {
        dialogue.push({ sender: "ai", text: data.token })
      }
      set({ dialogue, callState: "active" })
    })

    // Listen for full voice feedback analysis
    socket.on("feedback_report", (data: {
      overallBand: number
      metrics: { fluency: number; lexical: number; grammar: number; pronunciation: number }
      corrections: Array<{
        type: "grammar" | "vocab" | "positive"
        original?: string
        correction?: string
        explanation: string
      }>
    }) => {
      set({
        overallBand: data.overallBand,
        metrics: data.metrics,
        corrections: data.corrections,
        callState: "feedback"
      })
    })

    // Listen for synthesized voice audio streaming
    socket.on("tts_audio", async (data: { audio: string }) => {
      try {
        const currentSound = get().activeSound
        if (currentSound) {
          try {
            await currentSound.unloadAsync()
          } catch (e) {
            console.error("Error unloading current sound", e)
          }
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: `data:audio/mp3;base64,${data.audio}` },
          { shouldPlay: true }
        )

        set({ activeSound: sound })

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync().catch(() => {})
            if (get().activeSound === sound) {
              set({ activeSound: null })
            }
          }
        })
      } catch (err) {
        console.error("Failed to play mobile TTS sound:", err)
      }
    })

    set({ socket })
  },

  startCall: (voiceId: string): void => {
    const { socket } = get()
    set({
      selectedVoiceId: voiceId,
      callState: "calling",
      dialogue: [],
      timer: 0
    })

    if (socket) {
      socket.emit("start_session", { voiceId })
    }
  },

  sendAudioChunk: (chunk: ArrayBuffer): void => {
    const { socket } = get()
    if (socket && socket.connected) {
      socket.emit("audio_chunk", chunk)
    }
  },

  stopRecording: (): void => {
    const { socket } = get()
    set({ callState: "thinking" })
    if (socket) {
      socket.emit("stop_recording")
    }
  },

  hangUp: (): void => {
    const { socket, activeSound } = get()
    if (activeSound) {
      activeSound.stopAsync().catch(() => {})
      activeSound.unloadAsync().catch(() => {})
    }
    set({ callState: "idle", timer: 0, activeSound: null })
    if (socket) {
      socket.emit("end_session")
    }
  },

  resetStore: (): void => {
    const { socket, activeSound } = get()
    if (activeSound) {
      activeSound.stopAsync().catch(() => {})
      activeSound.unloadAsync().catch(() => {})
    }
    if (socket) {
      socket.disconnect()
    }
    set({
      socket: null,
      isConnected: false,
      callState: "idle",
      timer: 0,
      activeSound: null,
      dialogue: [],
      overallBand: 0,
      corrections: []
    })
  },

  setMuted: (muted: boolean): void => set({ isMuted: muted }),
  setSpeakerOn: (speakerOn: boolean): void => set({ isSpeakerOn: speakerOn }),
  incrementTimer: (): void => set((state) => ({ timer: state.timer + 1 }))
}))
