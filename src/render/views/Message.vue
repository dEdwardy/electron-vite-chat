<template>
  <div class="message">
    <div>
      id: {{ id }}
    </div>
    <div v-if="id">
      
    </div>
    <div :style="{ 'background-image': id ? bg : 'none' }" class="default" v-else>

    </div>
  </div>
</template>

<script>
import { watch,ref} from 'vue';
import { useRoute } from 'vue-router'
import bg from "../assets/bg.png";
export default {
  setup () {
    const route = useRoute()
    const id = ref()
    id.value = route.params.id;
    watch(id,v => console.error('id',v),{
      immediate:true
    })
    return {
      id,
      bg
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  height: calc(100% - 32px - 22px);
  margin:16px;
  .default{
    width: 100%;
    height: 100%;
    // background-image: url('../assets/bg.png');
    background-size:100% 100%;
    background-repeat: no-repeat;
  }
}
</style>