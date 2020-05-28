<template>
  <div class="addActivity">
    <activityForm :id="id"></activityForm>
  </div>
</template>
<script>
import activityForm from "@/components/activity/activityForm.vue";
export default {
  name: "addActivity",
  components: { activityForm },
  data() {
    return {
      id: null
    };
  }
};
</script>
<style lang="scss" scoped>
</style>
