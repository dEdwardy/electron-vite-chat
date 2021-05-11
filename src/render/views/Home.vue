<template>
  <CustomLayout>
    <template #main>
      <router-view></router-view>
    </template>
  </CustomLayout>
</template>

<script>
import CustomLayout from '@/components/Layout.vue'
export default {
  components: {
    CustomLayout
  }
}
</script>

<style>
</style>