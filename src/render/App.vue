<template>
  <Layout>
    <template #main>
       <router-view></router-view>
    </template>
  </Layout>
</template>

<script>
import Layout from '@/components/Layout.vue'
export default {
  components: {
    Layout
  }
}
// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
</style>
