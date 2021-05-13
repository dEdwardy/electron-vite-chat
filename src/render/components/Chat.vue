<template>
  <div class="chat">
    <div>
      <div v-if="user">
        <div style="padding: 0 16px;border-bottom:1px solid #e0e0e0;height:40px;line-height:40px">
          {{ user }}
        </div>
        <div class="main">
          <div class="chat-records">
            2222
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
                  <!-- <m-audio
                    v-if="item.src"
                    :showDuration="false"
                    :block="false"
                    :src="item.src"
                  ></m-audio> -->
                </div>
              </div>
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
              <div class="tool">
                <svg-icon
                  class="icon"
                  name="video"
                ></svg-icon>
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
import { ref, computed, inject } from 'vue';
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
  setup (props) {
    const socket = inject('socket')
    console.error(socket)
    const msg = ref('')
    const store = useStore()
    const username = store.state.username;
    const records = computed(() => {
      console.error('computed ...................................')
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
      console.error((res))
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
    return {
      bg,
      msg,
      records,
      username,
      avatar,
      handleSendMsg
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
      .me {
        flex-direction: row-reverse;
        .msg {
          box-shadow: 0px 2px 19px 0px rgba(0, 0, 0, 0.13);
          position: relative;
          padding:4px 8px;
          background-color: #1e6eff;
          color: #fff;
          &::after {
            box-shadow: 0px 2px 19px 0px rgba(0, 0, 0, 0.13);
            position: absolute;
            top:0;
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
          padding:4px 8px;
          background-color: #fff;
          color: #000;
          &::before {
            box-shadow: 0px 2px 19px 0px rgba(0, 0, 0, 0.13);
            position: absolute;
            color: transparent;
            top:0;
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
      padding: 0 0 0 16px;
      overflow-y: scroll;
      height: 900px;
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