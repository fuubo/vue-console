<template>
  <div class="activityList">
    <h3>活动列表</h3>
    <el-form
      ref="activityListQueryform"
      label-width="100px"
      :model="activityListQueryform"
      :rules="activityListQueryformRules"
    >
      <el-col :span="6">
        <el-form-item prop="title" label="标题">
          <el-input
            v-model="activityListQueryform.title"
            placeholder="标题"
            @keydown.native.enter.prevent="search('activityListQueryform')"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div class="fl-r ml-x1">
          <el-button class @click="resetForm('activityListQueryform')">重置</el-button>
        </div>
        <el-button class="fl-r" type="primary" @click="search('activityListQueryform')">搜索</el-button>
      </el-col>
    </el-form>
    <el-card class="box-card mt-x2" v-loading="loading">
      <div slot="header" class="clearfix">
        <el-link style="float: right; padding: 3px 0" type="text" :href="`/addActivity`">添加</el-link>
        <span>第{{params.currentPage}}页</span>
      </div>
      <el-table
        :data="activityList"
        stripe
        style="width: 100%"
        ref="userListTable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="id" label="活动ID" min-width="5%">
          <template slot-scope="scope">
            <el-link :href="`/activityInfo/${scope.row.id}`">{{scope.row.id}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="活动标题" min-width="10%"></el-table-column>
        <el-table-column label="封面" min-width="10%">
          <template slot-scope="scope">
            <el-image
              style="width: 100px;"
              :src="scope.row.picture"
              :preview-src-list="[scope.row.picture]"
            >
              <div slot="error" class="image-slot text-disable text-small">无图片</div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="clubName" label="俱乐部" min-width="10%"></el-table-column>
        <el-table-column label="时间" min-width="20%">
          <template slot-scope="scope">
            <p>开始日期：{{scope.row.startDate | dateFormat}}</p>
            <p>结束日期：{{scope.row.endDate | dateFormat}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="province" label="省份" min-width="4%"></el-table-column>
        <el-table-column prop="city" label="城市" min-width="4%"></el-table-column>
        <el-table-column prop="location" label="具体位置" min-width="18%"></el-table-column>
        <el-table-column prop="category" label="类别" min-width="5%">
          <template
            slot-scope="scope"
          >{{activityCategories && activityCategories[scope.row.categoryId]}}</template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="10%">
          <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="创建人" min-width="10%">
          <template slot-scope="scope">{{systemUserMap && systemUserMap[scope.row.createAt]}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="15%">
          <template slot-scope="scope">
            <p>
              <el-button type="text" @click="editById(`${scope.row.id}`)">编辑</el-button>
            </p>
            <p>
              <el-button type="text" @click="deleteById(`${scope.row.id}`)">删除</el-button>
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
  </div>
</template>

<script>
import { getActivityList } from "@/api";
import { mapState, mapActions } from "vuex";
export default {
  name: "userList",
  props: ["filter"],
  computed: {
    ...mapState(["systemUserMap", "activityCategories"])
  },
  data() {
    return {
      defaultCheckedKeys: null,
      loading: false,
      totalSize: 0,
      activityList: null,
      selectedActivityList: null,
      params: {
        currentPage: 1,
        pageSize: 50
      },
      activityListQueryform: {
        title: null
      },
      activityListQueryformRules: {}
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
        let result = await getActivityList(this.params);
        this.activityList = result.list;
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
            let params = Object.assign({}, this.activityListQueryform);
            this.query(params);
          } else {
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
      this.selectedActivityList = e;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
