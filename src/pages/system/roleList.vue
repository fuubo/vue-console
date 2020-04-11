<template>
  <div class="roleList">
    <h3>角色列表</h3>
    <el-form
      ref="roleListQueryform"
      label-width="100px"
      :model="roleListQueryform"
      :rules="roleListQueryformRules"
    >
      <el-col :span="8">
        <el-form-item prop="name" label="角色名">
          <el-input
            v-model="roleListQueryform.name"
            placeholder="角色名"
            @keydown.native.enter.prevent="search('roleListQueryform')"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div class="fl-r ml-x1">
          <el-button class @click="resetForm('roleListQueryform')">重置</el-button>
        </div>
        <el-button class="fl-r" type="primary" @click="search('roleListQueryform')">搜索</el-button>
      </el-col>
    </el-form>
    <el-card class="box-card mt-x2" v-loading="loading">
      <div slot="header" class="clearfix">
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="addRoleVisable = true"
        >添加</el-button>
        <span>第{{params.currentPage}}页</span>
      </div>
      <el-table
        :data="roles"
        stripe
        style="width: 100%"
        ref="roleListTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="id" label="角色ID" min-width="20%"></el-table-column>
        <el-table-column prop="name" label="角色名" min-width="20%"></el-table-column>
        <el-table-column label="是否禁用" min-width="20%">
          <template slot-scope="scope">
            <p v-if="scope.row.removeFlag">禁用</p>
            <p v-else>正常</p>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="20%">
          <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="20%">
          <template slot-scope="scope">
            <p>
              <el-button type="text" @click="authorization(`${scope.row.id}`)">分配权限</el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="mv-x2 fl-r"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.currentPage"
        :page-sizes="[50, 100, 200, 400]"
        :page-size="params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize"
      ></el-pagination>
    </el-card>

    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRoleVisable" width="35%">
      <el-form ref="addRoleForm" :model="addRoleForm" label-width="140px" :rules="addRoleFormRules">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="addRoleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisable = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRole('addRoleForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 授权 -->
    <el-dialog title="角色授权" :visible.sync="roleAuthorizationVisable" width="35%">
      <myPermissionTree
        :myPermissionTreeData="myPermissionTreeData"
        :defaultCheckedKeys="defaultCheckedKeys"
        :saveAuthorization="saveAuthorization"
        :saveParam="saveParam"
      ></myPermissionTree>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  addRole,
  roleAuthorization,
  getPermissionsByCondition
} from "@/api";
import { dateFormat } from "@/utils/filter";
import myPermissionTree from "@/components/system/myPermissionTree";
export default {
  name: "roleList",
  props: ["filter"],
  components: { myPermissionTree },
  data() {
    return {
      myPermissionTreeData: null,
      saveParam: null,
      defaultCheckedKeys: null,
      roleAuthorizationVisable: false,
      filterLoading: false,
      loading: false,
      maps: null,
      totalSize: 0,
      roles: null,
      selectedRoles: null,
      addRoleVisable: false,
      params: {
        currentPage: 1,
        pageSize: 50
      },
      roleListQueryform: {
        name: null
      },
      roleListQueryformRules: {},
      addRoleForm: {
        name: null
      },
      addRoleFormRules: {
        name: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.query();
  },
  methods: {
    async query(params) {
      this.roles = null;
      this.loading = true;
      try {
        this.params = Object.assign(this.params, params);
        let result = await getRoleList(this.params);
        this.roles = result.list;
        this.totalSize = result.pagination.total;
      } catch (e) {
        this.$throw(e, this);
      } finally {
        this.loading = false;
      }
    },
    async search(formName) {
      this.users = null;
      this.loading = true;
      try {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            let params = Object.assign({}, this.roleListQueryform);
            this.query(params);
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
    async submitAddRole(formName) {
      this.loading = true;
      try {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            await addRole(this.addRoleForm);
            this.$message({
          showClose: true,
              message: "添加成功",
              type: "success"
            });
            await this.query();
            this.addRoleVisable = false;
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
    async authorization(id) {
      let params = {
        roleId: id
      };
      let result = await getPermissionsByCondition(params);
      this.myPermissionTreeData = result.sysPermissionDtoList;
      this.defaultCheckedKeys = result.checkedIdList;
      this.saveParam = params;
      this.roleAuthorizationVisable = true;
    },
    async saveAuthorization(params) {
      let result = await roleAuthorization(params);
      this.roleAuthorizationVisable = false;
      this.$message({
          showClose: true,
        message: "修改成功",
        type: "success"
      });
    },
    resetForm() {
      this.params = {
        currentPage: 1,
        pageSize: 50
      };
      this.query();
    },
    handleCurrentChange(e) {
      this.params.currentPage = Number(e);
      this.query();
    },
    handleSizeChange(e) {
      this.params.pageSize = Number(e);
      this.query();
    },
    handleSelectionChange(e) {
      this.selectedRoles = e;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
