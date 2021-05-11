<template>
  <div class="login">
    <div class="toolbox">
      <div class="drag-area">

      </div>
      <div
        @click="() => toMain('min')"
        class="icon-wrapper"
      >
        <svg-icon name="min"></svg-icon>
      </div>
      <div
        @click="() => toMain('max')"
        class="icon-wrapper"
      >
        <svg-icon
          class="icon"
          name="max"
        ></svg-icon>
      </div>
      <div
        @click="() => toMain('close')"
        class="icon-wrapper close"
      >
        <svg-icon
          class="icon close"
          name="close"
        ></svg-icon>
      </div>
    </div>
    <div class="login-form">
      <a-form
        :model="form"
        layout="vertical"
      >
        <a-form-item label="Username">
          <a-input v-model:value="form.username" />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            @click="login"
          >Login</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import { defineComponent, inject, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
const { ipcRenderer } = require('electron')

export default defineComponent({
  setup () {
    const socket = inject('socket')
    const router = useRouter()
    const store = useStore()
    const state = reactive({
      form: {
        username: ''
      }
    })
    // toolbox 通知主进程
    const toMain = (msg) => {
      ipcRenderer.send(msg)
      console.log(msg)
    }
    const login = () => {
      if (!state.form.username) return
      console.log(state.form.username)
      store.commit('setUsername',state.form.username)
      socket.emit('login',state.form.username)
      router.push({
        path: '/home'
      })
    }
    return {
      ...toRefs(state),
      toMain,
      login
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  overflow: hidden;
  .toolbox {
    display: flex;
    justify-content: flex-end;
    height: 22px;
    align-items: center;
    .drag-area {
      height: 100%;
      flex: 1;
      -webkit-app-region: drag;
    }
    & > div {
      margin-left: 12px;
    }
  }

  .login-form {
    width: 280px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
      background: #aaa;
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
}
</style>
