<template>
  <div class="chat">
    <div>
      <div v-if="user">
        <div style="padding: 0 16px;border-bottom:1px solid #e0e0e0;height:40px;line-height:40px">
          {{ user }}
        </div>
        <div class="main">
          <div class="chat-records">
            <div class="records">
              <div
                class="flex px-2 align-center py-1"
                :class="item.from == username ? 'me' :'other' "
                v-for="(item,index) of records"
                :key="index"
              >
                <img
                  :src="avatar"
                  style="width:36px;height:36px;border-radius:50%;margin:0 12px"
                >
                <div>
                  <div
                    class="flex "
                    :class="item.from == username ? 'justify-end' :'' "
                  >
                    {{item.from}}
                  </div>
                  <!-- text消息 -->
                  <div
                    v-if="item.type=='text'"
                    class="msg"
                  >
                    {{ item.msg }}
                  </div>
                  <!-- 语音消息 -->
                  <div
                    style="margin-top:12px"
                    v-else-if="item.type == 'audio'"
                  >
                    <!-- <CustomAudio
                      v-if="item.src"
                      :showDuration="false"
                      :block="false"
                      :src="item.src"
                    ></CustomAudio> -->
                    <audio
                      :src="item.src"
                      controls
                    ></audio>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="videoVisible"
              class="videos"
            >
              <div
                @click="closeVideo"
                class="poi"
                style="text-align:right"
              >关闭</div>
              <div class="other flex-1">
                <video
                  ref="other"
                  id="other"
                  autoplay
                  style="width:100%;height:100%"
                ></video>
              </div>
              <div class="me flex-1">
                <video
                  ref="me"
                  autoplay
                  style="width:100%;height:100%"
                ></video>
              </div>
            </div>
          </div>
          <div class="voice-record">
            <div v-if="voiceVisible">
              <voice-recorder
                @send="handleSend"
                @cancel="handleCancel"
              ></voice-recorder>
            </div>
          </div>

          <div class="user-input">
            <div class="flex align-center tools">
              <div class="tool">
                <svg-icon
                  class="icon"
                  name="emoji"
                ></svg-icon>
              </div>
              <div class="tool">
                <svg-icon
                  class="icon"
                  name="screenshot"
                ></svg-icon>
              </div>
              <div class="tool">
                <svg-icon
                  class="icon"
                  name="picture"
                ></svg-icon>
              </div>
              <div class="tool">
                <svg-icon
                  class="icon"
                  name="folder"
                ></svg-icon>
              </div>
              <div class="tool">
                <svg-icon
                  class="icon"
                  name="phone"
                ></svg-icon>
              </div>
              <div
                @click="handleCallVideo"
                class="tool"
              >
                <svg-icon
                  class="icon"
                  name="video"
                ></svg-icon>
              </div>
              <div class="tool">
                <a-dropdown
                  :trigger="['click']"
                  placement="topLeft"
                >
                  <svg-icon
                    class="icon"
                    name="more"
                  ></svg-icon>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <span @click="showVoicInput">语音消息</span>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </div>
            <div class="input-area">
              <a-textarea
                v-model:value="msg"
                style="height:100%"
              />
            </div>
            <div class="actions flex align-center justify-end">
              <a-button
                type="primary"
                style="width:75px;height:27px;margin-right:16px"
                @click="handleSendMsg"
              >发送(S)</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="default"
      v-if="!user"
    >

    </div>
  </div>
</template>

<script>
import { useUserMedia } from '@vueuse/core'
import VoiceRecorder from '@/components/VoiceRecorder.vue'
import { ref, computed, inject, watchEffect, nextTick } from 'vue';
import bg from "../assets/bg.png";
import avatar from "../assets/avatar.jpg";
import { useStore } from 'vuex';
export default {
  props: {
    user: {
      type: String,
      default: ''
    }
  },
  components: {
    VoiceRecorder,
  },
  setup (props) {
    const socket = inject('socket')
    const msg = ref('')
    const store = useStore()
    const username = store.state.username;
    const records = computed(() => {
      const from = store.state.messages.filter(i => i.from === props.user)
      const send = store.state.messages_send.filter(i => i.to === props.user)
      const res = [...send, ...from].sort((pre, cur) => pre.time - cur.time).map(i => {
        if (i.type === 'audio') {
          return {
            ...i,
            src: window.URL.createObjectURL(new Blob([i.msg]))
          }
        } else {
          return i
        }
      })
      return res
    })
    const handleSendMsg = () => {
      const data = {
        from: username,
        to: props.user,
        type: 'text',
        msg: msg.value,
        time: Date.now()
      }
      socket.emit('chat', data)
      store.commit('handleSendMessage', data)
      msg.value = ''
    }
    const voiceVisible = ref(false)
    const showVoicInput = () => {
      voiceVisible.value = true
    }
    //发送语音消息
    const handleSend = (blob) => {
      const data = {
        from: username,
        to: props.user,
        msg: blob,
        type: 'audio',
        time: Date.now()
      }
      store.commit('handleSendMessage', data)
      socket.emit('chat', data)
      voiceVisible.value = false
    }
    //取消语音消息
    const handleCancel = () => {
      voiceVisible.value = false
    }
    //视频通话
    const videoVisible = ref(false)
    const me = ref(null)
    const other = ref(null)
    let peer;
    //answer
    socket.on('answer', ({ answer }) => {
      console.error('answer', peer)
      peer && peer.setRemoteDescription(answer)
    })
    //called
    socket.on('called', async (callingInfo) => {
      if (!confirm(`是否接受${props.user}的视频通话`)) {
        socket.emit('rejectCall', callingInfo.id)
        return
      }
      videoVisible.value = true
      let localMedia = await navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' }, audio: true })
        .catch((e) => {
          console.log(e)
        })
      me.value.srcObject = localMedia
      peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.services.mozilla.com" }], sdpSemantics: 'plan-b' }, {
        optional: [{ RtpDataChannels: true }]
      })
      console.error('create peer')
      peer.addEventListener('icegatheringstatechange', e => {
        console.error('ice协商中: ', e.target.iceGatheringState)
      })
      peer.addEventListener('track', e => {
        console.error('track事件触发', e.stream)
        console.error(other.value, e.stream)
      })
      peer.addEventListener('addstream', e => {
        console.error('addstream事件触发', e.stream)
        console.error(other.value)
        other.value.srcObject = e.stream
      })
      peer.addEventListener('icecandidate', (e) => {
        let icecandidate = e.candidate
        if (icecandidate) {
          console.error('发送candidate给远端')
          socket.emit('icecandidate', {
            icecandidate,
            username: callingInfo.username
          })
        }
      })
      peer.setRemoteDescription(callingInfo.offer)
      let answer = await peer.createAnswer({
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
      })
      peer.setLocalDescription(answer)
      socket.emit('answer', { answer, username: props.user })
      console.error('emit answer to:', props.user)
    })
    //icecandidate
    socket.on('icecandidate', ({ icecandidate }) => {
      if (icecandidate) {
        peer && peer.addIceCandidate(new RTCIceCandidate(icecandidate))
        console.error('远端添加iceCandidate', icecandidate)
      }

    })
    const startVideo = async () => {

      let username = props.user
      let localMedia = await navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' }, audio: true })
        .catch((e) => {
          console.log(e)
        })
      peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.services.mozilla.com" }], sdpSemantics: 'plan-b' }, {
        optional: [{ RtpDataChannels: true }]
      })
       peer.addEventListener('addstream', e => {
        console.error('addstream事件触发')
        cosnole.error(other.value)
        cosnole.error(e.stream)
        other.value.srcObject = e.stream
      })
      peer.addEventListener('icegatheringstatechange', e => {
        console.error('ice协商中: ', e.target.iceGatheringState)
      })
      console.error('addStream')
      peer && localMedia && peer.addStream(localMedia)
      peer.addEventListener('track', e => {
        console.error('track事件触发', e.stream)
      })
     
      // 监听候选加入
      peer.addEventListener('icecandidate', e => {
        if (e.candidate) {
          // console.error(e.candidate)
          //发送  icecandidate
          // console.error('emit', 'icecandidate')
          socket.emit('icecandidate', {
            icecandidate: e.candidate,
            username,
          })
        }

      })
      let offer = await peer.createOffer({
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true,
      })
      // console.error(offer)
      //发送offer到 信令服务器
      peer.setLocalDescription(offer)
      socket.emit('offer', {
        offer,
        username
      })
    }
    const { stream, start, stop } = useUserMedia()
    const handleCallVideo = async () => {
      videoVisible.value = true
      start()
      await startVideo()
    }
    watchEffect(() => {
      if (me.value) {
        me.value.srcObject = stream.value
      }
    })
    const closeVideo = () => {
      stop()
      videoVisible.value = false
    }
    return {
      bg,
      msg,
      records,
      username,
      avatar,
      handleSendMsg,
      voiceVisible,
      showVoicInput,
      handleSend,
      handleCancel,
      videoVisible,
      handleCallVideo,
      closeVideo,
      me,
      other
    }
  }
}
</script>

<style lang="scss" scoped>
.chat {
  // height: calc(100vh- 32px - 22px - 22px);
  // height: 100vh;
  .main {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 62px);
    .chat-records {
      background: #f5f6f7;
      display: flex;
      flex-direction: row;
      .videos {
        border-left: 1px solid #e0e0e0;
        width: 340px;
        padding: 0 2px;
        display: flex;
        flex-direction: column;
      }
      .records {
        flex: 1;
        .me {
          flex-direction: row-reverse;
          .msg {
            box-shadow: 0px 2px 19px 0px rgba(0, 0, 0, 0.13);
            position: relative;
            padding: 4px 8px;
            background-color: #1e6eff;
            color: #fff;
            &::after {
              box-shadow: 0px 2px 19px 0px rgba(0, 0, 0, 0.13);
              position: absolute;
              top: 0;
              right: -4px;
              content: '';
              width: 0;
              height: 0;
              border-width: 0 4px 4px;
              border-style: solid;
              border-color: transparent transparent #1e6eff;
              transform: rotate(-45deg);
            }
          }
        }
        .other {
          flex-direction: row;
          .msg {
            box-shadow: 0px 2px 19px 0px rgba(0, 0, 0, 0.13);
            position: relative;
            padding: 4px 8px;
            background-color: #fff;
            color: #000;
            &::before {
              box-shadow: 0px 2px 19px 0px rgba(0, 0, 0, 0.13);
              position: absolute;
              color: transparent;
              top: 0;
              left: -4px;
              content: '';
              width: 0;
              height: 0;
              border-width: 0 4px 4px;
              border-style: solid;
              border-color: transparent transparent #fff;
              transform: rotate(45deg);
            }
          }
        }
      }
      .voice-record {
        outline: none !important;
        & ::v-deep(.ant-dropdown-open.ant-dropdown-open:focus) {
          border: none;
          outline: none !important;
        }
        height: 25px;
      }
      padding: 0 0 0 16px;
      height: 900px;
      overflow-y: scroll;
      flex: 1;
      &::-webkit-scrollbar {
        // 滚动条的背景
        width: 16px;
        height: 40px;
      }

      &::-webkit-scrollbar-track,
      &::-webkit-scrollbar-thumb {
        border-radius: 999px;
        width: 20px;
        border: 5px solid transparent;
      }

      &::-webkit-scrollbar-track {
        // box-shadow: 1px 1px 5px #191a37 inset;
      }

      &::-webkit-scrollbar-thumb {
        //滚动条的滑块样式修改
        width: 20px;
        min-height: 20px;
        background-clip: content-box;
        box-shadow: 0 0 0 5px #999 inset;
      }

      &::-webkit-scrollbar-corner {
        background: #191a37;
      }
    }
    .user-input {
      // background: blue;
      display: flex;
      flex-direction: column;
      height: 136px;
      .tools {
        padding: 0 4px;
        .tool {
          margin: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          &:hover {
            background: #e7e8e9;
          }
          .icon {
            width: 24px;
            height: 24px;
          }
        }
      }
      .input-area {
        flex: 1;
        ::v-deep(.ant-input) {
          resize: none;
          background: #f5f6f7;
          &::-webkit-scrollbar {
            // 滚动条的背景
            width: 16px;
            height: 40px;
          }

          &::-webkit-scrollbar-track,
          &::-webkit-scrollbar-thumb {
            border-radius: 999px;
            width: 20px;
            border: 5px solid transparent;
          }

          &::-webkit-scrollbar-track {
            // box-shadow: 1px 1px 5px #191a37 inset;
          }

          &::-webkit-scrollbar-thumb {
            //滚动条的滑块样式修改
            width: 20px;
            min-height: 20px;
            background-clip: content-box;
            box-shadow: 0 0 0 5px #999 inset;
          }

          &::-webkit-scrollbar-corner {
            background: #191a37;
          }
          border: none;
          &:link,
          &:visited,
          &:hover,
          &:active {
            border: none;
          }
        }
        ::v-deep(.ant-input:focus) {
          border: none;
          box-shadow: none;
        }
      }
      .actions {
        height: 50px;
      }
    }
  }
  .default {
    height: calc(100vh - 44px);
    background-image: url('../assets/bg.png');
    background-size: cover;
    background-repeat: no-repeat;
  }
}
</style>