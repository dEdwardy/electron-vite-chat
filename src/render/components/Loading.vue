<template>
  <span class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
  </span>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.spinner {
  position: relative;
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 4px;
  transition: all 0.3s ease-in-out;
  .bounce1 {
    background-color: green;
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0.6;
    top: 0;
    left: 0;
    right: 0;
    border-radius: 50%;
    animation: bounce1 3s infinite ease-in-out;
  }
  .bounce2 {
    background-color: green;
    width: 100%;
    height: 100%;
    opacity: 0.6;
    top: 0;
    left: 0;
    right: 0;
    position: absolute;
    border-radius: 50%;
    animation: bounce2 3s infinite ease-in-out;
  }
  @keyframes bounce1 {
    0%,
    100% {
      transform: scale(0);
    }
    50% {
      transform: scale(1);
    }
  }
  @keyframes bounce2 {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(0);
    }
  }
}
</style>