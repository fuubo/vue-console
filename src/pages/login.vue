<template>
  <div class="container login_page flex column">

    <a href="/" class="logo" style="cursor: pointer">
      <img src="../assets/logo.png" />
    </a>
    <h2 class="text-xlarge pl-x2">后台管理系统</h2>
    <el-card class="login_box">
      <div>
        <h2 class="text-center">登录</h2>
        <el-form ref="loginForm" :model="data" :rules="rules" v-loading="loading">
          <el-form-item prop="username" label="用户名">
            <el-input
              class="b-input normal"
              v-model="data.username"
              @keyup.native.enter="submitForm('loginForm')"
              placeholder="请输入用户名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input
              class="b-input normal"
              v-model="data.password"
              type="password"
              @keyup.native.enter="submitForm('loginForm')"
              placeholder="请输入您的密码"
            ></el-input>
          </el-form-item>
          <el-form-item class="mt-x2">
            <el-button
              round
              @click="submitForm('loginForm')"
              :disabled="!(data.username && data.password)"
              style="width: 100%"
            >立即登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { ruleMessage } from "../utils/constants";
import { mapActions, mapMutations } from "vuex";
export default {
  name: "login",
  data() {
    return {
      loading: false,
      data: {
        username: null,
        password: null
      },
      rules: {
        username: [
          {
            required: true,
            message: ruleMessage.password.required,
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: ruleMessage.password.required,
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.userLogout()
  },
  methods: {
    ...mapMutations(["USERLOGOUT"]),
    ...mapActions(["LOGIN_ACTION"]),
    async submitForm(formName) {
      try {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            try {
              this.loading = true;
              await this.LOGIN_ACTION(this.data);
              window.localStorage.setItem("username", this.data.username);
              this.$message({
                showClose: true,
                message: "登录成功！",
                type: "success"
              });
              this.$router.push({ path: "home" });
            } catch (e) {
              this.$throw(e, this);
            } finally {
              this.loading = false;
            }
          }
        });
      } catch (e) {
        this.$throw(e, this);
      }
    },
    userLogout() {
      try {
        this.USERLOGOUT();
      } catch (e) {
        console.error(e);
        this.$message({
          showClose: true,
          message: "登出失败！" + e.message,
          type: "error"
        });
        this.$throw(e, this);
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.login_page {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-image: url(https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg);
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;
    img{
      height: 140px;
    }
    .login_box{
      width: 600px;
    }
}
@media screen and (max-width: 640px) {
  .login_page {
    padding-top: 40px;
  }
}
</style>
