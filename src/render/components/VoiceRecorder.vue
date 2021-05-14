<template>
  <div class="voice-recorder">
    <div class="progress">
      <div
        class="left"
        :style="{ width: progress +'%' }"
      ></div>
      <div class="right"></div>
    </div>
    <div class="wrapper flex justify-between align-center">
      <div class="left flex justify-center align-center">
        <Loading />
        正在录音...
      </div>
      <div class="btns">
        <a-button
          class="btn"
          size="small"
          style="margin-right:4px"
          @click="send"
        >发送</a-button>
        <a-button
          class="btn"
          size="small"
          @click="cancel"
        >取消</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
import { useIntervalFn } from '@vueuse/core'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Recorder from 'js-audio-recorder'
export default {
  name: 'voice-recorder',
  components:{
    Loading
  },
  setup (props, context) {
    const recorder = ref('')
    const recording = ref(false)
    const count = ref(120)
    const progress = ref(0)
    onMounted(() => {
      recorder.value = new Recorder()
      handleRecordStart()
    })
    onBeforeUnmount(() => {
      if (recorder.value) {
        recorder.value.destroy().then(() => {
          recorder.value = null
        })
      }
    })
    const { start, stop } = useIntervalFn(() => {
      count.value--
      progress.value = 100 * (120 - count.value) / 120;
      console.error(count.value, progress.value)
      if (count.value === 0) {
        stop()
        send()
      }
    })
    const cancel = () => {
      stop()
      recorder.value.stop()
      recording.value = false
      context.emit('cancel')
    }
    const send = () => {
      recorder.value.stop()
      recording.value = false
      const blob = recorder.value.getWAVBlob()
      context.emit('send', blob)
    }
    const handleRecordStart = () => {
      recorder.value.start().then(() => {
        recording.value = true
        start()
      })
    }

    return {
      recorder,
      recording,
      handleRecordStart,
      send,
      cancel,
      count,
      progress
    }
  }
}
</script>
<style lang="scss" scoped>
.voice-recorder {
  position: relative;
  .wrapper {
    top: 0;
    left: 20px;
    right: 20px;
    position: absolute;
    height: 24px;
    line-height: 24px;
    .left {
      font-size: 14px;
    }
    .btn {
      height: 20px;
      line-height: 20px;
    }
  }
  ::v-deep(.ant-btn) {
    font-size: 12px;
  }
  .progress {
    display: flex;
    height: 24px;
    .left {
      height: 24px;
      background-color: #bee8f8;
    }
    .right {
      flex: 1;
      height: 24px;
      background-color: #dfe6ec;
    }
  }
}
</style>
