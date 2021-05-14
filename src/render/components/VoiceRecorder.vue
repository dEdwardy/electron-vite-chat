<template>
  <div class="voice-recorder">
    <div v-if="recording">
      recording...
    </div>
    <van-icon
      loading=""
      @touchstart="handleRecordStart"
      @touchend="handleRecordEnd"
      :size="40"
      name="volume-o"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import Recorder from 'js-audio-recorder'
export default {
  name: 'voice-recorder',
  setup (props, context) {
    const recoder = ref('')
    const recording = ref(false)
    onMounted(() => {
      this.recorder = new Recorder()
    })
    onBeforeMount(() => {
      if (recorder.value) {
        recorder.value.destroy().then(() => {
          recorder.value = null
        })
      }
    })
    const handleRecordStart = () => {
      recorder.value.start().then(() => {
        recording.value = true
      })
    }
    const handleRecordEnd = () => {
      recorder.value.stop()
      recording.value = false
      const blob = this.recorder.getWAVBlob()
      context.emit('voice-input', blob)
    }
    return {
      recoder,
      recording,
      handleRecordStart,
      handleRecordEnd
    }
  }
}
</script>

