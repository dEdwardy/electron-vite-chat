<template>
  <CustomLayout v-if="username">
    <template #main>
      <router-view></router-view>
    </template>
  </CustomLayout>
  <Login v-else />
</template>

<script>
import CustomLayout from '@/components/Layout.vue'
import Login from '@/views/Login.vue'
import { ref } from 'vue'
import { useStore } from 'vuex'
export default {
  components: {
    CustomLayout,
    Login
  },
  setup () {
    const store = useStore()
    return {
      username: store.state.username
    }
  }
}
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
</style>
