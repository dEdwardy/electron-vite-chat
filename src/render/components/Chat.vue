<template>
  <div class="message">
    <div>
      user: {{ user }}
    </div>
    <div v-if="user">

    </div>
    <div
      class="default"
      v-else
    >
    </div>
  </div>
</template>

<script>
import { watch, ref, reactive } from 'vue';
import bg from "../assets/bg.png";
export default {
  props: {
    user: {
      type: String,
      default: ''
    }
  },
  setup () {
    return {
      bg,
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  height: calc(100% - 32px - 22px);
  margin: 16px;
  .default {
    width: 100%;
    height: 100%;
    background-image: url('../assets/bg.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
}
</style>