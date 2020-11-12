<template>
  <div class="fileList">
    <h3>上传文件列表</h3>
    <el-form ref="queryForm" label-width="100px" :model="queryCriteria" :rules="queryCriteriaRules">
      <el-col :span="6">
        <el-form-item prop="ruinDate" label="销毁日期">
          <el-date-picker
            type="date"
            placeholder="请选择销毁日期"
            v-model="queryCriteria.ruinDate"
            value-format="timestamp"
          ></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="fileName" label="文件名">
          <el-input
            clearable
            v-model.trim="queryCriteria.fileName"
            @keyup.enter.native="search('queryForm')"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div class="fl-r ml-x1">
          <el-button class @click="resetForm">重置</el-button>
        </div>
        <el-button class="fl-r" type="primary" @click="search('queryForm')">搜索</el-button>
      </el-col>
    </el-form>
    <el-card class="box-card mt-x2" v-loading="loading">
      <div slot="header" class="clearfix">
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="importExcelVisible = true"
        >导入</el-button>
        <span>第{{queryCriteria.currentPage}}页</span>
      </div>
      <el-table :data="fileList" stripe style="width: 100%" ref="fileListTable">
        <el-table-column prop="id" label="文件ID" min-width="5%"></el-table-column>
        <el-table-column prop="name" label="文件名" min-width="10%"></el-table-column>
        <el-table-column label="下载地址" min-width="30%">
          <template scope="scope">
            <el-link :src="scope.row.url">{{scope.row.url}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="销毁日期" min-width="10%">
          <template scope="scope">{{scope.row.ruinDate | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="创建时间" min-width="10%">
          <template slot-scope="scope">{{scope.row.createTime | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" min-width="15%">
          <template slot-scope="scope">
            <p>
              <el-button type="text" @click="downloadDetail(scope.row)">下载合并明细</el-button>
            </p>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="mv-x2 fl-r"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryCriteria.currentPage"
        :page-sizes="[50, 100, 200, 400]"
        :page-size="queryCriteria.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalSize"
      ></el-pagination>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog title="导入待合并excel" :visible.sync="importExcelVisible" width="35%">
      <el-form
        ref="importForm"
        :model="importParams"
        label-width="140px"
        :rules="importParamsRules"
      >
        <el-form-item label="销毁日期" prop="ruinDate">
          <el-date-picker
            type="date"
            placeholder="请选择销毁日期"
            v-model="importParams.ruinDate"
            value-format="timestamp"
            required
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="上传文件">
          <el-upload
            action
            ref="upload"
            :multiple="false"
            accept=".xls, .xlsx"
            :limit="1"
            :http-request="submitUpload"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xls、xlsx文件</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="importExcelVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitImportExcel('importForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { uploadOSS } from "@/api"
import { dateFormat } from "@/utils/filter"
import { getFileList, uploadExcelCombination, downloadExcelCombination } from '@/api'
import { saveAs } from "file-saver"
const uuid4 = require("uuid/v4")
export default {
  name: 'fileList',
  data () {
    return {
      loading: false,
      queryCriteria: {
        ruinDate: null,
        fileName: null,
        currentPage: 1,
        pageSize: 50
      },
      queryCriteriaRules: {},
      totalSize: null,
      fileList: [],
      importExcelVisible: false,
      importParams: {
        fileName: null,
        ruinDate: null,
        fileUrl: null
      },
      importParamsRules: {}
    }
  },
  created () {
    this.query()
  },
  methods: {
    async query (params) {
      this.fileList = null
      this.loading = true
      try {
        this.queryCriteria = Object.assign(this.queryCriteria, params)
        let result = await getFileList(this.queryCriteria)
        this.fileList = result.list
        this.totalSize = result.pagination.total
      } catch (e) {
        this.$throw(e, this)
      } finally {
        this.loading = false
      }
    },
    async search (formName) {
      this.users = null
      this.loading = true
      try {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            this.query(this.queryCriteria)
          } else {
            console.error("error submit!!")
            return false
          }
        })
      } catch (e) {
        this.$throw(e, this)
      } finally {
        this.loading = false
      }
    },
    resetForm () {
      this.queryCriteria = {
        currentPage: 1,
        pageSize: 50
      }
      this.query()
    },
    async submitUpload (e) {
      try {
        let file = e.file
        let result = await uploadOSS('file/' + uuid4(), file)
        this.importParams.fileUrl = result
        this.importParams.fileName = file.name
        this.$message({
          showClose: true,
          message: "上传成功！",
          type: "success"
        })
      } catch (e) {
        console.log(e)
        this.$message.error("上传失败！")
        this.fileList = []
      }
    },
    async submitImportExcel (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let result = await uploadExcelCombination(this.importParams)
          this.$message({
            showClose: true,
            message: "保存成功",
            type: "success"
          })
        } else {
          console.error("error submit!!")
          return false
        }
      })
    },
    async downloadDetail (row) {
      try {
        let result = await downloadExcelCombination({ excelId: row.id })
        var blob = new Blob([result], { type: "application/octet-stream" })
        saveAs(blob, row.name)
        this.$message({
          showClose: true,
          message: "下载成功！",
          type: "success",
        })
      } catch (e) {
        this.$throw(e, this)
      }
    },
    handleCurrentChange (e) {
      this.queryCriteria.currentPage = Number(e)
      this.query()
    },
    handleSizeChange (e) {
      this.queryCriteria.pageSize = Number(e)
      this.query()
    }
  }
};
</script>

<style lang="scss" scoped>
</style>