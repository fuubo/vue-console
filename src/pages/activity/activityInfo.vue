<template>
  <div class="activityInfo">
    <el-container>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple"></div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple"></div>
        </el-col>
      </el-row>
    </el-container>
  </div>
</template>

<script>
import { getActivityInfo } from "@/api";
import { mapState, mapActions } from "vuex";
export default {
  name: "activityInfo",
  computed: {
    ...mapState(["systemUserMap", "activityCategories"])
  },
  data() {
    return {
      id: null,
      activityInfo: null
    };
  },
  watch: {
    $route: "changeId"
  },
  created() {
    this.changeId();
    this.getData();
  },
  methods: {
    changeId() {
      this.id = this.$route.params.id;
    },
    async getData() {
      try {
        this.activityInfo = await getActivityInfo(Number(this.id));
      } catch (e) {
        this.$throw(e, this);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
