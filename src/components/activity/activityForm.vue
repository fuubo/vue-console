<template>
  <div class="activityForm">
    <el-container class="pd-x3" style="margin:0 auto;width:1000px">
      <el-form ref="form" :model="form" label-width="80px" :rules="formRules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" type="text" required></el-input>
        </el-form-item>
        <el-form-item label="集合城市" prop="province">
          <el-select v-model="form.province" @change="clearCityInfo">
            <el-option
              v-for="item in provinces"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
          <el-select v-model="form.city" class="ml-x2" prop="city">
            <el-option
              v-for="item in citys"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动地点" prop="location">
          <el-input v-model="form.location" placeholder="多个城市请用逗号隔开"></el-input>
        </el-form-item>
        <el-form-item label="活动时间" prop="startDate">
          <el-col :span="6">
            <el-date-picker
              type="datetime"
              placeholder="选择开始日期"
              v-model="form.startDate"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
          <el-col class="line text-center" :span="1">-</el-col>
          <el-col :span="6">
            <el-date-picker
              type="datetime"
              placeholder="选择结束日期"
              v-model="form.endDate"
              style="width: 100%;"
            ></el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="类型" prop="categoryId">
          <el-select v-model="form.categoryId" placeholder="请选择类型">
            <el-option
              v-for="(value,key) in activityCategories"
              :key="key"
              :label="value"
              :value="key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="俱乐部" prop="clubId">
          <el-select v-model="form.clubId" required>
            <el-option v-for="(value,key) in clubs" :key="key" :label="value" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="封面图片" prop="picture">
          <el-upload
            class="avatar-uploader"
            action
            :http-request="uploadToOSS"
            :limit="1"
            accept=".jpeg, .jpg, .png"
            :show-file-list="false"
          >
            <img v-if="form.picture" :src="form.picture" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="首页推荐" prop="recommendFlag">
          <el-switch v-model="form.recommendFlag"></el-switch>
        </el-form-item>

        <el-form-item label="编辑明细">
          <el-button type="default" @click="editContent('destinationDetail')">
            <i
              v-if="form.contents.destinationDetail.contentText"
              class="el-icon-success text-success"
            ></i>
            <i v-else class="el-icon-circle-check"></i> 目的地介绍
          </el-button>
          <el-button type="default" @click="editContent('journeyDetail')">
            <i v-if="form.contents.journeyDetail.contentText" class="el-icon-success text-success"></i>
            <i v-else class="el-icon-circle-check"></i> 行程介绍
          </el-button>
          <el-button type="default" @click="editContent('activityReference')">
            <i
              v-if="form.contents.activityReference.contentText"
              class="el-icon-success text-success"
            ></i>
            <i v-else class="el-icon-circle-check"></i> 活动参考数据
          </el-button>
          <el-button type="default" @click="editContent('necessaryGear')">
            <i v-if="form.contents.necessaryGear.contentText" class="el-icon-success text-success"></i>
            <i v-else class="el-icon-circle-check"></i> 必备装备
          </el-button>
          <el-button type="default" @click="editContent('costDetail')">
            <i v-if="form.contents.costDetail.contentText" class="el-icon-success text-success"></i>
            <i v-else class="el-icon-circle-check"></i> 费用介绍
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox inline v-model="form.agree">我已阅读并同意了《商家入驻须知》和《用户预订须知》</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">保存</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-container>
    <el-dialog
      :title="content.contentTitle"
      :visible.sync="contentEditVisable"
      width="80%"
      :destroy-on-close="true"
    >
      <editor v-model="content.contentText"></editor>
      <span slot="footer" class="dialog-footer">
        <el-button @click="contentEditVisable = false">取 消</el-button>
        <el-button type="primary" @click="saveContent">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { uploadOSS, addActivity, getActivityInfo } from "@/api";
import editor from "@/components/common/editor.vue";
import { mapState } from "vuex";

const uuid4 = require("uuid/v4");
export default {
  name: "activityForm",
  components: { editor },
  props: ["id"],
  computed: {
    ...mapState(["activityCategories", "clubs", "systemUserMap"]),
    editor() {
      return this.$refs.myQuillEditor.quill;
    },
    provinces: function () {
      let districtList = this.$store.state.districts;
      let result = [{ label: "请选择省份", value: null }];
      if (districtList) {
        result = result.concat(
          districtList.map(function (district) {
            return { label: district.name, value: district.id };
          })
        );
      }
      return result;
    },
    citys: function () {
      let result = [{ label: "请选择城市", value: null }];
      let districtList = this.$store.state.districts;
      if (this.form.province && districtList) {
        let targetProvince = districtList.find(
          (item) => item.name == this.form.province
        );
        if (targetProvince.childrenList) {
          result = result.concat(
            targetProvince.childrenList.map(function (district) {
              return { label: district.name, value: district.id };
            })
          );
        }
      }
      return result;
    },
  },
  created() {
    this.getData();
  },
  data() {
    return {
      file: null,
      showData: false,
      content: {
        contentTitle: "",
        contentType: null,
        contentText: "",
      },
      form: {
        id: null,
        title: null,
        clubId: null,
        startDate: null,
        endDate: null,
        province: null,
        city: null,
        location: null,
        categoryId: null,
        picture: null,
        recommendFlag: false,
        contents: {
          destinationDetail: {
            contentTitle: "目的地介绍",
            contentType: null,
            contentText: "",
          },
          journeyDetail: {
            contentTitle: "行程介绍",
            contentType: null,
            contentText: "",
          },
          activityReference: {
            contentTitle: "活动参考数据",
            contentType: null,
            contentText: "",
          },
          necessaryGear: {
            contentTitle: "必备装备",
            contentType: null,
            contentText: "",
          },
          costDetail: {
            contentTitle: "费用介绍",
            contentType: null,
            contentText: "",
          },
        },
        agree: false,
      },
      contentEditVisable: false,
      formRules: {
        title: [
          {
            required: true,
            message: "必填",
            trigger: "blur",
          },
        ],
        recommendFlag: [
          {
            required: true,
            message: "必填",
            trigger: "blur",
          },
        ],
        clubId: [
          {
            required: true,
            message: "必选",
            trigger: "blur",
          },
        ],
        startDate: [
          {
            required: true,
            message: "必选",
            trigger: "blur",
          },
        ],
        province: [
          {
            required: true,
            message: "必选",
            trigger: "blur",
          },
        ],
        city: [
          {
            required: true,
            message: "必选",
            trigger: "blur",
          },
        ],
        location: [
          {
            required: true,
            message: "必填",
            trigger: "blur",
          },
        ],
        categoryId: [
          {
            required: true,
            message: "必选",
            trigger: "blur",
          },
        ],
        picture: [
          {
            required: true,
            message: "必传",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    async getData() {
      if (this.id) {
        try {
          let activityInfo = await getActivityInfo(Number(this.id));
          this.form.id = this.id;
          this.form.title = activityInfo.title;
          this.form.title = activityInfo.title;
          this.form.clubId = String(activityInfo.clubId);
          this.form.startDate = activityInfo.startDate;
          this.form.endDate = activityInfo.endDate;
          this.form.province = activityInfo.province;
          this.form.city = activityInfo.city;
          this.form.location = activityInfo.location;
          this.form.categoryId = String(activityInfo.categoryId);
          this.form.picture = activityInfo.picture;
          this.form.recommendFlag = activityInfo.recommendFlag;
          if (activityInfo.contents.destinationDetail) {
            this.form.contents.destinationDetail =
              activityInfo.contents.destinationDetail;
          }
          if (activityInfo.contents.journeyDetail) {
            this.form.contents.journeyDetail =
              activityInfo.contents.journeyDetail;
          }
          if (activityInfo.contents.activityReference) {
            this.form.contents.activityReference =
              activityInfo.contents.activityReference;
          }
          if (activityInfo.contents.necessaryGear) {
            this.form.contents.necessaryGear =
              activityInfo.contents.necessaryGear;
          }
          if (activityInfo.contents.costDetail) {
            this.form.contents.costDetail = activityInfo.contents.costDetail;
          }
        } catch (e) {
          this.$throw(e, this);
        }
      }
    },
    async uploadToOSS(e) {
      try {
        let file = e.file;
        let result = await uploadOSS("activity/" + uuid4(), file);
        this.form.picture = result;
      } catch (err) {
        if (err !== "cancel" && err !== "close") {
          console.error("business error", err);
          this.$message.error("出错了！" + err.message);
        }
      }
    },
    async submitForm(formName) {
      this.loading = true;
      try {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            if (this.form.agree) {
              await addActivity(this.form);
              this.$message({
                showClose: true,
                message: "添加成功",
                type: "success",
              });
              this.$router.push("/activityList");
            } else {
              this.$message.error(
                "请先阅读并同意《商家入驻须知》和《用户预订须知》"
              );
            }
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
    resetForm(formName) {
      this.form = {
        title: null,
        clubId: null,
        startDate: null,
        endDate: null,
        province: null,
        city: null,
        location: null,
        categoryId: null,
        picture: null,
        agree: false,
        recommendFlag: false,
      };
    },
    clearCityInfo() {
      this.form.city = null;
    },
    upScuccess(url) {
      if (url != null && url.length > 0) {
        let value = url;
        console.log(url);
        this.addRange = this.editor.getSelection();
        this.editor.insertEmbed(
          this.addRange !== null ? this.addRange.index : 0,
          this.uploadType,
          value
        );
      } else {
        this.$message.error(`${this.uploadType}插入失败`);
      }
    },
    async uploadImage(img) {
      let result = await uploadOSS("activity/" + uuid4(), img);
      this.$message({
        showClose: true,
        message: "上传成功",
        type: "success",
      });
      return result;
    },
    editContent(contentKey) {
      this.contentEditVisable = true;
      this.content = this.form.contents[contentKey];
      this.content.contentType = contentKey;
    },
    saveContent() {
      this.form.contents[this.content.contentType] = this.content;
      this.contentEditVisable = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.avatar-uploader .el-icon-plus {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: auto;
  height: 178px;
  display: block;
}
</style>
