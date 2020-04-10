<template>
  <div class="home">
    <h1 v-if="userInfo">你好，{{userInfo.realName}}</h1>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Home",
  computed: {
    ...mapState(["userInfo"])
  }
};
</script>
<style lang="scss" scoped>
</style>
