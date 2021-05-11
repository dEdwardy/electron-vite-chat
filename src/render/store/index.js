import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export default createStore({
  state: {
    username: '',
    users: [],
    onlineUsers: [],
    // 收到的消息
    messages: [],
    // 发出的消息 (主要用作消息记录)
    messages_send: []
  },
  getters: {
    username: state => state.username,
    users: state => state.users,
    onlineUsers: state => state.onlineUsers,
    messages: state => state.messages,
    messages_send: state => state.messages_send,
    unreadMessages: state => state.messages.filter(i => !i.unread).length
  },
  mutations: {
    setUsername (state, username) {
      state.username = username
    },
    setUsers (state, users) {
      state.users = users
    },
    setOnlineUsers (state, onlineUsers) {
      state.onlineUsers = onlineUsers
    },
    // 记录收到的消息
    handleMessage (state, message) {
      state.messages.push(message)
    },
    readMessage (state, idx) {
      state.messages[idx].unread = false
      // state.messages = state.messages.map(i => i)
    },
    // 记录发出的消息
    handleSendMessage (state, message) {
      state.messages_send.push(message)
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [createPersistedState()]
})
