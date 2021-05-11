<template>
  <div class="layout">

    <div class="main">
      <div class="sidebar">
        <div class="top">
          <img
            class="avatar"
            src="http://47.112.172.255/assets/avatar.jpg"
            alt="avatar"
          >
          <svg-icon title="消息" :class="current === 0 ? 'active' : ''" @click="() => choose(0)" class="icon-menu" name="message"></svg-icon>
          <svg-icon title="联系人" :class="current === 1 ? 'active' : ''"  @click="() => choose(1)" class="icon-menu" name="user"></svg-icon>
          <svg-icon title="TIM网盘" :class="current === 2 ? 'active' : ''"  @click="() => choose(2)"  class="icon-menu" name="cloud"></svg-icon>
        </div>
        <div class="bottom">

        </div>
      </div>
      <div class="list">
        list
      </div>
      <div class="main-content">
        <div class="toolbox">
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
        <slot name="main" />
      </div>
    </div>
  </div>
</template>

<script>
// import { ipcRenderer } from 'electron'
const { ipcRenderer } = require('electron')
import { ref } from 'vue'
export default {
  name:'custom-layout',
  setup () {
    const toMain = (msg) => ipcRenderer.send(msg)
    const current = ref(0)
    const choose = cur => current.value = cur
    return {
      toMain,
      current,
      choose
    }
  }
}
</script>

<style lang="scss" scoped>
.layout {
  .active{
    background: red;
  }
  .icon-menu{
    &:first-of-type{
      margin-top:28px;
    }
    cursor: pointer;
    padding:8px 0;
    width:32px;
    height:32px;
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
      padding-top: 22px;
      background: #fff;
      border-right: 1px solid #f4f4f4;
      width: 50px;
      height: 100vh;
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
      }
    }
    .list {
      padding-top: 22px;
      min-width: 160px;
      height: 100vh;
      overflow: hidden;
      border-right: 1px solid #f4f4f4;
    }
    .main-content {
      flex: 1;
      height: 100vh;
      overflow: hidden;
    }
  }
}
</style>