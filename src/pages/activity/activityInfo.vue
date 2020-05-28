<template>
  <div class="activityInfo" v-if="id">
    <activityForm :id="id"></activityForm>
  </div>
</template>

<script>
import activityForm from "@/components/activity/activityForm.vue";
export default {
  name: "activityInfo",
  components: { activityForm },
  data() {
    return {
      id: null
    };
  },
  created() {
    this.changeId();
  },
  methods: {
    changeId() {
      this.id = this.$route.params.id;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
