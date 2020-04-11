<template>
  <div class="myPermissionTree" v-loading="loading">
    <el-tree
      :data="myPermissionTreeData"
      node-key="id"
      ref="tree"
      highlight-current
      show-checkbox
      :check-strictly="true"
      :props="defaultProps"
      :expand-on-click-node="false"
      :check-on-click-node="false"
      :default-checked-keys="defaultCheckedKeys"
    ></el-tree>
    <el-button style="margin:20px" type="primary" size="mini" @click="save">保存</el-button>
  </div>
</template>
<script>
export default {
  name: "myPermissionTree",
  props: [
    "myPermissionTreeData",
    "defaultCheckedKeys",
    "saveAuthorization",
    "saveParam"
  ],
  data() {
    return {
      defaultProps: {
        id: "id",
        children: "subPermissionList",
        label: "name",
        disabled: "disabled"
      },
      loading: false
    };
  },
  methods: {
    async save() {
      this.loading = true;
      try {
        let params = this.saveParam;
        params.permissionIdList = this.$refs.tree.getCheckedKeys();
        await this.saveAuthorization(params);
      } catch (e) {
        this.$throw(e, this);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>