<template>
  <router-view></router-view>
</template>

<script>
import io from 'socket.io-client'
import { defineComponent, provide, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  setup () {
    const store = useStore()
    const username = store.state.username
    let socket = io.connect('http://192.168.79.228:3000', {
      transports: ['websocket']
    })
    if (username) {
      console.log('start 监听 onlineChange')
      socket.on('onlineChange', () => {
        console.error('更新好友列表')
        socket.emit('online_users')
      })
      
      console.log('start 监听 online_users')
      socket.on('online_users', users => {
        console.error(users)
        store.commit('setOnlineUsers', users)
      })

      socket.on('chat', msg => {
        store.commit('handleMessage', msg)
      })
    }
    onBeforeUnmount(() => {
      socket.disconnect()
      socket = null
    })
    provide('socket', socket)
  }
})

</script>

<style>
body,
html {
  height: 100%;
}
</style>
