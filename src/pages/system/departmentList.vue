<template>
  <div class="departmentList">
    <h3>部门列表</h3>
    <el-form
      ref="departmentListQueryform"
      label-width="100px"
      :model="departmentListQueryform"
      :rules="departmentListQueryformRules"
    >
      <el-col :span="8">
        <el-form-item prop="name" label="部门">
          <el-input
            v-model="departmentListQueryform.name"
            placeholder="部门名"
            @keydown.native.enter.prevent="search('departmentListQueryform')"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div class="fl-r ml-x1">
          <el-button class @click="resetForm('departmentListQueryform')">重置</el-button>
        </div>
        <el-button class="fl-r" type="primary" @click="search('departmentListQueryform')">搜索</el-button>
      </el-col>
    </el-form>
    <el-card class="box-card mt-x2" v-loading="loading">
      <div slot="header" class="clearfix">
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="addDepartmentVisable = true"
        >添加</el-button>
        <span>第{{params.currentPage}}页</span>
      </div>
      <el-table
        :data="departments"
        stripe
        style="width: 100%"
        ref="departmentListTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="id" label="部门ID" width="400"></el-table-column>
        <el-table-column prop="name" label="部门名" width="400"></el-table-column>
        <el-table-column label="是否禁用" width="120">
          <template slot-scope="scope">
            <p v-if="scope.row.removeFlag">禁用</p>
            <p v-else>正常</p>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
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

    <!-- 添加优惠券 -->
    <el-dialog title="添加部门" :visible.sync="addDepartmentVisable" width="35%">
      <el-form
        ref="addDepartmentForm"
        :model="addDepartmentForm"
        label-width="140px"
        :rules="addDepartmentFormRules"
      >
        <el-form-item label="部门名" prop="name">
          <el-input v-model="addDepartmentForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDepartmentVisable = false">取 消</el-button>
        <el-button type="primary" @click="submitAddDepartment('addDepartmentForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartmentList, addDepartment } from "@/api";
import { dateFormat } from "@/utils/filter";
export default {
  name: "departmentList",
  props: ["filter"],
  components: {},
  data() {
    return {
      filterLoading: false,
      loading: false,
      maps: null,
      totalSize: 0,
      departments: null,
      selectedDepartments: null,
      addDepartmentVisable: false,
      params: {
        currentPage: 1,
        pageSize: 50
      },
      departmentListQueryform: {
        name: null
      },
      departmentListQueryformRules: {},
      addDepartmentForm: {
        name: null
      },
      addDepartmentFormRules: {
        name: [
          {
            required: true,
            message: "请输入",
            trigger: "blur"
          }
        ]
      },
    };
  },
  created() {
    this.query();
  },
  methods: {
    async query(params) {
      this.departments = null;
      this.loading = true;
      try {
        this.params = Object.assign(this.params, params);
        let result = await getDepartmentList(this.params);
        this.departments = result.list;
        this.totalSize = result.pagination.total;
      } catch (e) {
        this.$throw(e, this);
      } finally {
        this.loading = false;
      }
    },
    async search(formName) {
      this.departments = null;
      this.loading = true;
      try {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            let params = Object.assign({}, this.departmentListQueryform);
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
    async submitAddDepartment(formName) {
      this.loading = true;
      try {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            await addDepartment(this.addDepartmentForm);
            this.$message({
          showClose: true,
              message: "添加成功",
              type: "success"
            });
            await this.query();
            this.addDepartmentVisable = false;
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
      this.selectedDepartments = e;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
