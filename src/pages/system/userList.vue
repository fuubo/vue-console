<template>
  <div class="userList">
    <h3>用户列表</h3>
    <el-form
      ref="userListQueryform"
      label-width="100px"
      :model="userListQueryform"
      :rules="userListQueryformRules"
    >
      <el-col :span="6">
        <el-form-item prop="userName" label="用户名">
          <el-input
            v-model="userListQueryform.userName"
            placeholder="用户名"
            @keydown.native.enter.prevent="search('userListQueryform')"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="realName" label="真实姓名">
          <el-input
            v-model="userListQueryform.realName"
            placeholder="真实姓名"
            @keydown.native.enter.prevent="search('userListQueryform')"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div class="fl-r ml-x1">
          <el-button class @click="resetForm('userListQueryform')">重置</el-button>
        </div>
        <el-button class="fl-r" type="primary" @click="search('userListQueryform')">搜索</el-button>
      </el-col>
    </el-form>
    <el-card class="box-card mt-x2" v-loading="loading">
      <div slot="header" class="clearfix">
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="addUserVisable = true"
        >添加</el-button>
        <span>第{{params.currentPage}}页</span>
      </div>
      <el-table
        :data="users"
        stripe
        style="width: 100%"
        ref="userListTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="id" label="用户ID" min-width="5%"></el-table-column>
        <el-table-column prop="userName" label="用户名" min-width="10%"></el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="10%"></el-table-column>
        <el-table-column prop="realName" label="真实姓名" min-width="10%"></el-table-column>
        <el-table-column label="是否禁用" min-width="5%">
          <template slot-scope="scope">
            <p v-if="scope.row.removeFlag">禁用</p>
            <p v-else>正常</p>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="10%">
          <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="角色" min-width="25%">
          <template slot-scope="scope">
            <el-tag class="mr-x1" v-for="roleName in scope.row.roleNameList" :key="roleName">{{roleName}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="15%">
          <template slot-scope="scope">
            <p>
              <el-button type="text" @click="authorization(`${scope.row.id}`)">分配权限</el-button>
            </p>
            <p>
              <el-button type="text" @click="setUserRoleInfo(`${scope.row.id}`,`${scope.row.roleIdList}`)">分配角色</el-button>
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

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addUserVisable" width="35%">
      <el-form ref="addUserForm" :model="addUserForm" label-width="140px" :rules="addUserFormRules">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addUserForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="addUserForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="addUserForm.realName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserVisable = false">取 消</el-button>
        <el-button type="primary" @click="submitAddUser('addUserForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 授权 -->
    <el-dialog title="用户授权" :visible.sync="userAuthorizationVisable" width="35%">
      <myPermissionTree
        :myPermissionTreeData="myPermissionTreeData"
        :defaultCheckedKeys="defaultCheckedKeys"
        :saveAuthorization="saveAuthorization"
        :saveParam="saveParam"
      ></myPermissionTree>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="setUserRoleVisable" width="35%">
      <template v-if="roles">
        <el-select v-model="roleIds" multiple
                filterable placeholder="请选择角色" style="width:100%">
          <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id"></el-option>
        </el-select>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setUserRoleVisable = false">取 消</el-button>
        <el-button type="primary" @click="saveUserRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  getAllRole,
  addUser,
  setUserRole,
  userAuthorization,
  getPermissionsByCondition
} from "@/api";
import myPermissionTree from "@/components/system/myPermissionTree";
export default {
  name: "userList",
  props: ["filter"],
  components: { myPermissionTree },
  data() {
    return {
      myPermissionTreeData: null,
      saveParam: null,
      roles:null,
      setRoleUserId:null,
      roleIds:null,
      defaultCheckedKeys: null,
      userAuthorizationVisable: false,
      setUserRoleVisable:false,
      filterLoading: false,
      loading: false,
      maps: null,
      totalSize: 0,
      users: null,
      selectedUsers: null,
      addUserVisable: false,
      params: {
        currentPage: 1,
        pageSize: 50
      },
      userListQueryform: {
        userName: null,
        realName: null
      },
      userListQueryformRules: {},
      addUserForm: {
        userName: null,
        password: null,
        phone: null,
        realName:null
      },
      addUserFormRules: {
        userName: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        phone: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ],
        realName: [
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
      this.users = null;
      this.loading = true;
      try {
        this.params = Object.assign(this.params, params);
        this.roles = await getAllRole();
        let result = await getUserList(this.params);
        this.users = result.list;
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
            let params = Object.assign({}, this.userListQueryform);
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
    async submitAddUser(formName) {
      this.loading = true;
      try {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            await addUser(this.addUserForm);
            this.$message({
          showClose: true,
              message: "添加成功",
              type: "success"
            });
            await this.query();
            this.addUserVisable = false;
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
        userId: id
      };
      let result = await getPermissionsByCondition(params);
      this.myPermissionTreeData = result.sysPermissionDtoList;
      this.defaultCheckedKeys = result.checkedIdList;
      this.saveParam = params;
      this.userAuthorizationVisable = true;
    },
    async saveAuthorization(params) {
      await userAuthorization(params);
      this.userAuthorizationVisable = false;
      this.$message({
          showClose: true,
        message: "添加成功",
        type: "success"
      });
    },
    async setUserRoleInfo(userId,roleIds) {
      this.roleIds = roleIds.split(',').map(Number);
      this.setRoleUserId = userId;
      this.setUserRoleVisable = true;
    },
    async saveUserRole() {
      let params = {
        userId: this.setRoleUserId,
        roleIds: this.roleIds
      }
      await setUserRole(params);
      this.$message({
          showClose: true,
        message: "添加成功",
        type: "success"
      });
      this.setUserRoleVisable = false;
      await this.query();
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
      this.selectedUsers = e;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
