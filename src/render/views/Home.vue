<template>
  <div class="layout">
    <div class="main">
      <div class="sidebar">
        <div class="top">
          <div class="drag-area"></div>
          <a-popover placement="rightBottom" :title="username">
            <template #content>
              <p class="poi">个人资料</p>
              <p
                class="poi"
                @click="logout"
              >退出</p>
            </template>
            <img
              class="avatar poi"
              src="http://47.112.172.255/assets/avatar.jpg"
              alt="avatar"
            >
          </a-popover>
          <div
            title="消息"
            class="menu-item"
            @click="() => choose(0,'message')"
          >
            <svg-icon
              class="icon-menu"
              :name="current === 0 ? 'message-active': 'message'"
            ></svg-icon>
          </div>
          <div
            title="联系人"
            class="menu-item"
            @click="() => choose(1,'contact')"
          >
            <svg-icon
              class="icon-menu"
              :name="current === 1 ? 'user-active': 'user'"
            ></svg-icon>
          </div>
          <div
            class="menu-item"
            @click="() => choose(2,'cloud')"
            title="TIM网盘"
          >
            <svg-icon
              class="icon-menu"
              :name="current === 2? 'cloud-active': 'cloud'"
            ></svg-icon>
          </div>

        </div>
        <div class="bottom">

        </div>
      </div>
      <div class="list">
        <div class="drag-area"></div>
        <div class="content">
          <div class="flex align-center justi px-2 py-1">
            <div class="flex justify-center align-center flex-1">
              <a-input
                placeholder="搜索"
                style="height:30px;width:88%"
                v-model:value="keywords"
                allowClear
              >
                <template #prefix>
                  <svg-icon name="search" />
                </template>
              </a-input>
            </div>
            <div class="flex justify-center align-center px-2">
              <svg-icon
                class="poi"
                name="add"
              ></svg-icon>
            </div>
          </div>
          <div class="friends-list">
            <div
              class="flex friend"
              @click="() => handleTalk(item)"
              v-for="(item,index) of onlines"
              :key="index"
            >
              <div class="avatar">
                <img
                  :src="avatar"
                  style="width:42px;height:42px"
                >
              </div>
              <div class="content">
                <div class="username">{{ item }}</div>
                <div class="msg">{{ item.msg }}</div>
              </div>
              <div class="other">
                <div class="date"> {{ item.date }}</div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="main-content">
        <div class="toolbox">
          <div class="drag-area"></div>
          <div
            title="最小化"
            @click="() => toMain('min')"
            class="icon-wrapper"
          >
            <svg-icon name="min"></svg-icon>
          </div>
          <div
            title="最大化"
            @click="() => toMain('max')"
            class="icon-wrapper"
          >
            <svg-icon
              class="icon"
              name="max"
            ></svg-icon>
          </div>
          <div
            title="关闭"
            @click="() => toMain('close')"
            class="icon-wrapper close"
          >
            <svg-icon
              class="icon close"
              name="close"
            ></svg-icon>
          </div>
        </div>
        <div class="chat">
          <Chat :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chat from '@/components/Chat.vue'
// const { ipcRenderer } = require('electron')
import { computed, inject, nextTick, reactive, ref, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import avatar from '@/assets/avatar.jpg'
import { useStore } from 'vuex'
export default {
  components: {
    Chat
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    const username= store.state.username;
    const socket = inject('socket')
    const keywords = ref('')
    const user = ref('')
    // const state = reactive({
    //   onlines:[{username:'123'},{username:'124443'}]
    // })
    const onlines = computed(() => store.state.onlineUsers.filter(i => i !== username))
    const handleTalk = item => {
      console.error(item)
      nextTick(() => {
        user.value = item
      })
    }
    const toMain = (msg) => {
      if (msg === 'close') {
        socket.disconnect()
      }
      // ipcRenderer.send(msg)
    }
    const current = ref(0)
    const choose = (cur, name) => {

      current.value = cur
    }
    const logout = () => {
      socket.emit('logout', store.state.username)
      router.push({
        name: 'login'
      })
    }
    return {
      toMain,
      current,
      choose,
      keywords,
      logout,
      avatar,
      onlines,
      handleTalk,
      user,
      username
      // ...toRefs(state)
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  .menu-item {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .drag-area {
    height: 22px;
    line-height: 22px;
    // flex: 1;
    width: 100%;
    -webkit-app-region: drag;
  }
  .active {
    background: red;
  }
  .icon-menu {
    &:first-of-type {
      margin-top: 8px;
    }
    cursor: pointer;
    padding: 8px 0;
    width: 36px;
    height: 36px;
  }
  .icon-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 100%;
    margin-left: 12px;
    cursor: pointer;
    &:link,
    &:visited,
    &:hover,
    &:active {
      background: #eee;
    }
  }
  .close {
    &:link,
    &:visited,
    &:hover,
    &:active {
      color: #fff !important;
      background: #fb4d3f;
    }
  }
  .toolbox {
    height: 22px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .main {
    display: flex;
    .sidebar {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border-right: 1px solid #f4f4f4;
      width: 50px;
      height: 100%;
      overflow: hidden;
      .top,
      .bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-bottom: 24px;
      }
    }
    .list {
      min-width: 180px;
      height: 100vh;
      overflow: hidden;
      border-right: 1px solid #f4f4f4;
      .friends-list {
        &::-webkit-scrollbar {
          // 滚动条的背景
          width: 16px;
          height: 14px;
        }

        &::-webkit-scrollbar-track,
        &::-webkit-scrollbar-thumb {
          border-radius: 999px;
          width: 16px;
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
        overflow-y: scroll;
        height: calc(100vh - 50px - 22px);
        .friend {
          padding:12px;
          &:link,
          &:visited,
          &:hover,
          &:active {
            background-color: #ebebeb;
          }
          .avatar {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .content {
            padding: 0 8px;
            flex: 1;
          }
          .other {
            width: 52px;
          }
        }
      }
    }
    .main-content {
      flex: 1;
      background: #f5f6f7;
    }
  }
}
</style>