<template>
  <div class="permissionTree">
    <h3>权限管理</h3>
    <el-row>
      <el-col :span="12">
        <div class="grid-content bg-purple"></div>
        <el-card v-loading="loading">
          <el-button type="text" size="mini" @click="() => addMainMenu()">添加一级菜单</el-button>
          <el-tree
            :data="permissionTreeData"
            node-key="id"
            ref="tree"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node="false"
            draggable
            @node-drag-end="handleDragEnd"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span>
                <el-tag v-if="data.publicFlag" class="mr-x2" size="mini">公共权限</el-tag>
                <el-button type="text" size="mini" @click="() => append(node,data)">
                  <i class="el-icon-plus"></i>
                </el-button>
                <el-button type="text" size="mini" @click="() => edit(node,data)">
                  <i class="el-icon-edit-outline"></i>
                </el-button>
                <el-button
                  type="text"
                  v-if="data.removeFlag"
                  size="mini"
                  @click="() => reopen(data)"
                >
                  <i class="el-icon-refresh-right"></i>
                </el-button>
                <el-button
                  type="text"
                  style="color:red"
                  v-else
                  size="mini"
                  @click="() => close(data)"
                >
                  <i class="el-icon-close"></i>
                </el-button>
              </span>
            </span>
          </el-tree>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="添加权限" :visible.sync="addPermissionVisable" width="35%">
      <el-form
        ref="addPermissionForm"
        :model="addPermissionForm"
        label-width="100px"
        :rules="addPermissionFormRules"
      >
        <el-form-item label="父节点" prop="parentName">
          <el-input v-model="addPermissionForm.parentName" disabled></el-input>
        </el-form-item>
        <el-form-item prop="name" label="权限名">
          <el-input v-model="addPermissionForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="访问地址">
          <el-input v-model="addPermissionForm.url"></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="图标样式">
          <el-input v-model="addPermissionForm.icon"></el-input>
        </el-form-item>
        <el-form-item prop="path" label="页面path">
          <el-input v-model="addPermissionForm.path"></el-input>
        </el-form-item>
        <el-form-item label="公共权限">
          <el-switch v-model="addPermissionForm.publicFlag"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPermissionVisable = false">取 消</el-button>
        <el-button type="primary" @click="submitAddPermission('addPermissionForm')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑权限" :visible.sync="editPermissionVisable" width="35%">
      <el-form
        ref="editPermissionForm"
        :model="editPermissionForm"
        label-width="100px"
        :rules="editPermissionFormRules"
      >
        <el-form-item label="父节点" prop="parentName">
          <el-input v-model="editPermissionForm.parentName" disabled></el-input>
        </el-form-item>
        <el-form-item prop="name" label="权限名">
          <el-input v-model="editPermissionForm.name"></el-input>
        </el-form-item>
        <el-form-item prop="url" label="访问地址">
          <el-input v-model="editPermissionForm.url"></el-input>
        </el-form-item>
        <el-form-item prop="icon" label="图标样式">
          <el-input v-model="editPermissionForm.icon"></el-input>
        </el-form-item>
        <el-form-item prop="path" label="页面path">
          <el-input v-model="editPermissionForm.path"></el-input>
        </el-form-item>
        <el-form-item label="公共权限">
          <el-switch v-model="editPermissionForm.publicFlag"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPermissionVisable = false">取 消</el-button>
        <el-button type="primary" @click="submitEditPermission('editPermissionForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getPermissionTree,
  addPermission,
  editPermission,
  closePermission,
  reopenPermission
} from "@/api";
export default {
  name: "permissionTree",
  components: {},
  data() {
    return {
      addPermissionFormRules: {
        name: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ]
      },
      addPermissionForm: {
        parentName: null,
        parentId: null,
        name: null,
        url: null,
        icon: null,
        path: null,
        sort: null,
        publicFlag: null,
        menuFlag: null
      },
      editPermissionFormRules: {
        name: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ]
      },
      editPermissionForm: {
        parentName: null,
        parentId: null,
        name: null,
        url: null,
        icon: null,
        path: null,
        sort: null,
        publicFlag: null
      },
      addPermissionVisable: false,
      editPermissionVisable: false,
      permissionTreeData: null,
      loading: false,
      defaultProps: {
        id: "id",
        children: "subPermissionList",
        label: "name"
      }
    };
  },
  created() {
    this.render();
  },
  methods: {
    async render() {
      try {
        let result = await getPermissionTree();
        this.permissionTreeData = result;
      } catch (e) {
        this.$throw(e, this);
      } finally {
        this.loading = false;
      }
    },
    append(node, data) {
      this.addPermissionForm.sort = node.childNodes.length + 1;
      this.addPermissionForm.parentId = data.id;
      this.addPermissionForm.parentName = node.label;
      this.addPermissionForm.menuFlag =
        node.data.parentId === 0 && node.data.menuFlag;
      this.addPermissionVisable = true;
    },
    async close(data) {
      try {
        await closePermission(data.id);
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        this.render();
      } catch (e) {
        this.$throw(e, this);
      } finally {
        this.loading = false;
      }
    },
    async reopen(data) {
      try {
        await reopenPermission(data.id);
        this.$message({
          showClose: true,
          message: "修改成功",
          type: "success"
        });
        this.render();
      } catch (e) {
        this.$throw(e, this);
      } finally {
        this.loading = false;
      }
    },
    edit(node, data) {
      this.editPermissionForm.id = data.id;
      this.editPermissionForm.sort = data.sort;
      this.editPermissionForm.parentId = data.parentId;
      this.editPermissionForm.parentName = node.parent.label;
      this.editPermissionForm.path = data.path;
      this.editPermissionForm.name = data.name;
      this.editPermissionForm.url = data.url;
      this.editPermissionForm.publicFlag = data.publicFlag;
      this.editPermissionVisable = true;
    },
    async handleDragEnd(draggingNode, dropNode, dropType, ev) {
      this.editPermissionForm.id = draggingNode.data.id;
      if (dropType === "inner") {
        this.editPermissionForm.parentId = dropNode.data.id;
        this.editPermissionForm.sort = dropNode.children
          ? dropNode.children.length + 1
          : 1;
      } else if (dropType === "before") {
        this.editPermissionForm.parentId = dropNode.data.parentId;
        this.editPermissionForm.sort = dropNode.data.sort;
      } else if (dropType === "after") {
        this.editPermissionForm.parentId = dropNode.data.parentId;
        this.editPermissionForm.sort = dropNode.data.sort + 1;
      }
      await editPermission(this.editPermissionForm);
      this.$message({
          showClose: true,
        message: "添加成功",
        type: "success"
      });
      await this.render();
    },
    async submitAddPermission(formName) {
      this.loading = true;
      try {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            await addPermission(this.addPermissionForm);
            this.$message({
          showClose: true,
              message: "添加成功",
              type: "success"
            });
            await this.render();
            this.addPermissionVisable = false;
            this.$refs[formName].resetFields();
          } else {
            console.error("error submit!!");
            return false;
          }
        });
      } catch (e) {
        this.$throw(e, this);
      } finally {
        this.loading = false;
      }
    },
    async submitEditPermission(formName) {
      this.loading = true;
      try {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            await editPermission(this.editPermissionForm);
            this.$message({
          showClose: true,
              message: "添加成功",
              type: "success"
            });
            await this.render();
            this.editPermissionVisable = false;
            this.$refs[formName].resetFields();
          } else {
            console.error("error submit!!");
            return false;
          }
        });
      } catch (e) {
        this.$throw(e, this);
      } finally {
        this.loading = false;
      }
    },
    async addMainMenu() {
      this.addPermissionForm.sort = this.permissionTreeData.length + 1;
      this.addPermissionForm.parentId = 0;
      this.addPermissionForm.menuFlag = true;
      this.addPermissionForm.parentName = "根节点";
      this.addPermissionVisable = true;
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