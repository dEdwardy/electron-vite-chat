<template>
  <div class="t-audio">
    <audio :src="src"></audio>
  </div>  
</template>

<script>
export default {
  props:{
    src:{
      type:String
    }
  }
}
</script>

<style>

</style>