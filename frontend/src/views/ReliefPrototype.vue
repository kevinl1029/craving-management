<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

type ScriptLine = {
  id: string
  text: string
  pauseSecondsAfter?: number
  expectUserResponse?: boolean
}

const steps: { id: string; label: string; lines: ScriptLine[] }[] = [
  {
    id: 'center',
    label: 'Center',
    lines: [
      { id: 'center-1', text: 'Let’s take one slow breath together.', pauseSecondsAfter: 1.2 },
      { id: 'center-2', text: 'Inhale gently through your nose… two… three… four.', pauseSecondsAfter: 2.0 },
      { id: 'center-3', text: 'Hold for a moment.', pauseSecondsAfter: 1.0 },
      { id: 'center-4', text: 'Now exhale through your mouth… three… four.', pauseSecondsAfter: 1.8 }
    ]
  },
  {
    id: 'observe',
    label: 'Observe',
    lines: [
      { id: 'observe-1', text: 'Good. Notice the craving like a small wave of energy.', pauseSecondsAfter: 1.4 },
      { id: 'observe-2', text: 'You don’t have to stop it — just watch it rise… crest… and fall.', pauseSecondsAfter: 2.0 }
    ]
  },
  {
    id: 'release',
    label: 'Release',
    lines: [
      { id: 'release-1', text: 'Now check your body.', pauseSecondsAfter: 1.0 },
      { id: 'release-2', text: 'Are your shoulders lifted? Let them drop, just a little.', pauseSecondsAfter: 1.4 },
      { id: 'release-3', text: 'Unclench your jaw, soften your face.', pauseSecondsAfter: 1.4 },
      { id: 'release-4', text: 'Let your hands rest loosely on your lap.', pauseSecondsAfter: 1.2 },
      { id: 'release-5', text: 'This is what real release feels like — calm you created yourself.', pauseSecondsAfter: 1.6 }
    ]
  },
  {
    id: 'reframe',
    label: 'Reframe',
    lines: [
      { id: 'reframe-1', text: 'You’re not missing out on anything right now.', pauseSecondsAfter: 1.4 },
      { id: 'reframe-2', text: 'What you felt was your body coming back into balance.', pauseSecondsAfter: 1.6 },
      { id: 'reframe-3', text: 'Each breath and each release remind you that freedom is already happening.', pauseSecondsAfter: 1.6 }
    ]
  },
  {
    id: 'checkin',
    label: 'Check-in',
    lines: [
      { id: 'checkin-1', text: 'On a scale of 1 to 10, how strong is the craving now?', expectUserResponse: true }
    ]
  }
]

const currentStepIndex = ref(0)
const currentLineIndex = ref(0)
const playing = ref(false)
const userRating = ref<number | null>(null)
const intensityPre = ref(6) // you can make this dynamic later

const currentStep = computed(() => steps[currentStepIndex.value])
const currentLine = computed(
  () => currentStep.value?.lines[currentLineIndex.value] ?? null
)

function speak(text: string) {
  if (!('speechSynthesis' in window)) return
  const utter = new SpeechSynthesisUtterance(text)
  utter.rate = 1
  utter.pitch = 1
  window.speechSynthesis.speak(utter)
}

function nextLine() {
  const step = steps[currentStepIndex.value]
  if (!step) return
  const lineCount = step.lines.length

  if (currentLineIndex.value < lineCount - 1) {
    currentLineIndex.value++
    playCurrentLine()
  } else {
    // move to next step
    if (currentStepIndex.value < steps.length - 1) {
      currentStepIndex.value++
      currentLineIndex.value = 0
      playCurrentLine()
    } else {
      playing.value = false
    }
  }
}

function playCurrentLine() {
  const line = currentLine.value
  if (!line) return
  playing.value = true
  speak(line.text)
  if (line.expectUserResponse) {
    // stop auto-advance, wait for user rating
    playing.value = false
    return
  }
  const pause = (line.pauseSecondsAfter ?? 1.0) * 1000
  setTimeout(() => {
    nextLine()
  }, pause)
}

function startSession() {
  currentStepIndex.value = 0
  currentLineIndex.value = 0
  playCurrentLine()
}

function submitRating() {
  console.log('relief_intensity_delta', {
    intensity_pre: intensityPre.value,
    intensity_post: userRating.value
  })
  playing.value = false
}
onMounted(() => {
  // auto-start if you want:
  // startSession()
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-700 to-teal-400 text-white p-6 gap-6">
    <div class="text-sm uppercase tracking-wide opacity-80">
      Stage 2 – Relief
    </div>
    <div class="text-3xl font-semibold text-center">
      {{ currentStep?.label || 'Relief Session' }}
    </div>

    <div class="mt-4 w-full max-w-xl bg-white/10 rounded-2xl p-6 shadow-lg backdrop-blur">
      <p class="text-lg leading-relaxed min-h-[96px]">
        {{ currentLine?.text || 'Session complete.' }}
      </p>

      <!-- simple breathing/wave indicator -->
      <div class="mt-4 flex items-center gap-3">
        <div class="w-3 h-3 rounded-full bg-white animate-pulse"></div>
        <div class="text-sm opacity-80">
          {{ playing ? 'Guiding…' : 'Paused' }}
        </div>
      </div>
    </div>

    <div class="flex gap-4">
      <button
        v-if="!playing && currentStepIndex < steps.length - 1"
        @click="nextLine"
        class="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
      >
        Next
      </button>
      <button
        v-if="!playing && currentStepIndex === 0 && currentLineIndex === 0"
        @click="startSession"
        class="px-4 py-2 bg-white text-teal-700 rounded-lg hover:bg-white/90 transition"
      >
        Start Session
      </button>
    </div>

    <!-- Check-in UI -->
    <div v-if="currentStep?.id === 'checkin'" class="w-full max-w-md bg-white/5 rounded-xl p-4">
      <label class="block mb-2 text-sm">Rate your craving now (1–10)</label>
      <input
        type="range"
        min="1"
        max="10"
        v-model="userRating"
        class="w-full"
      />
      <div class="mt-2 text-sm">
        Current: {{ userRating ?? '—' }}
      </div>
      <button
        @click="submitRating"
        class="mt-3 px-4 py-2 bg-white text-teal-700 rounded-lg"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<style scoped>
/* you can make fancier breathing/wave animations here */
</style>
