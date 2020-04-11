<template>
  <el-container style="height: 100%" class>
    <div class="wHeader" v-if="islogin && userInfo">
      <div class="menuBar" v-if="islogin && menu">
        <el-menu
          style="width: 100%"
          @select="changeSelect"
          :default-active="activeIndex"
          :collapse="isCollapse"
          mode="horizontal"
        >
          <el-menu-item index="/">
            <template slot="title">
              <a v-if="!isCollapse" href="/" class="logo" style="cursor: pointer">
                <img src="../assets/logo.png" width="60" />
              </a>
            </template>
          </el-menu-item>
          <template v-for="topMenu in this.menu.menuList">
            <template v-if="topMenu.subMenuList && topMenu.subMenuList.length>0">
              <el-submenu :index="topMenu.path" :key="topMenu.permissionId">
                <template slot="title">
                  <i :class="topMenu.icon"></i>
                  <span slot="title">{{topMenu.name}}</span>
                </template>
                <el-menu-item
                  v-for="item in topMenu.subMenuList"
                  :key="item.permissionId"
                  :index="item.path"
                >{{item.name}}</el-menu-item>
              </el-submenu>
            </template>
            <template v-else>
              <el-menu-item :key="topMenu.permissionId" :index="topMenu.path">{{topMenu.name}}</el-menu-item>
            </template>
          </template>
        </el-menu>
      </div>
      <el-dropdown @command="handleCommand" style="width: 100px">
        <span class="el-dropdown-link">
          {{userInfo.realName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="changePassword" style="width: 100px">修改密码</el-dropdown-item>
          <el-dropdown-item command="logout" style="width: 100px">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-main id="main_content">
      <router-view />
    </el-main>
    <el-dialog title="修改密码" :visible.sync="changePasswordVisable" width="35%">
      <div slot="header" class="clearfix">
            <span>修改密码</span>
          </div>
          <el-form
            :model="passwordForm"
            status-icon
            :rules="rules"
            ref="passwordForm"
            label-width="100px"
            class="demo-passwordForm"
          >
            <el-form-item label="旧密码" prop="oldPass">
              <el-input type="password" v-model="passwordForm.oldPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="pass">
              <el-input type="password" v-model="passwordForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码" prop="checkPass">
              <el-input type="password" v-model="passwordForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('passwordForm')">提交</el-button>
              <el-button @click="resetForm('passwordForm')">重置</el-button>
            </el-form-item>
          </el-form>
    </el-dialog>
  </el-container>
</template>

<script>
import { setPassword } from "@/api";
import { LOGINAUTHTOKEN } from "@/utils/constants";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "layout",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.passwordForm.checkPass !== "") {
          this.$refs.passwordForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.passwordForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      activeIndex: null,
      isCollapse: false,
      changePasswordVisable: false,
      passwordForm: {
        oldPass: '',
        pass: "",
        checkPass: ""
      },
      rules: {
        oldPass: [{ required: true, message: '请输入旧密码', trigger: "blur" }],
        pass: [{ required: true, validator: validatePass, trigger: "blur" }],
        checkPass: [{ required: true, validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState(["islogin", "userInfo", "menu"]),
  },
  beforeMount() {
    this.permission(this.$router.currentRoute);
  },
  async created() {
    this.activeIndex = "/" + this.$router.currentRoute.fullPath.split("/")[1];

    if (this.activeIndex !== "/login") {
      if (localStorage.getItem(LOGINAUTHTOKEN)) {
        try {
          await this.GET_USER_INFO();
          this.GET_MENU();
        } catch (e) {
          this.$throw(e, this);
        }
      } else {
        this.USERLOGOUT();
        this.$router.replace("login");
      }
    }
  },
  watch: {
    $route: "changeIndex"
  },
  methods: {
    ...mapMutations(["USERLOGOUT"]),
    ...mapActions(["GET_USER_INFO", "GET_MENU"]),
    changeIndex(to) {
      this.permission(to);
      this.activeIndex = "/" + this.$router.currentRoute.fullPath.split("/")[1];
    },
    permission(to) {
      if (this.menu && this.menu.menuNames.indexOf(to.name) < 0) {
        this.$router.replace("/404");
      }
    },
    changeSelect(to) {
      if (this.activeIndex !== to) {
        this.activeIndex = this.$router.currentRoute.fullPath;
        this.$router.push(to);
      }
    },
    userLogout() {
      try {
        this.USERLOGOUT();
        this.$router.replace("/login");
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
    handleCommand(command) {
      switch (command) {
        case "logout":
          this.userLogout();
          break;
        case "changePassword":
          this.changePasswordVisable = true;
          break;
      }
    },
    goto(to) {
      console.log("goto ", to);
      this.$router.push(to);
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        try {
          if (valid) {
            await setPassword(this.passwordForm.oldPass, this.passwordForm.pass);
            this.$message.success('密码修改成功！即将跳转登录页面，请重新登录！')
            this.resetForm('passwordForm')
            setTimeout(() => {
              this.$router.replace('/login')
            }, 3000)
          } else {
            console.log("error submit!!");
            return false;
          }
        } catch (e) {
          this.$throw(e);
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  }
};
</script>

<style lang="scss">
@import "../styles/utils.scss";
.el-container {
  display: flex;
  flex-direction: column !important;
}
.wHeader {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  z-index: 9;
  border-bottom: 1px solid #eee;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 400px;
  padding: 0 0 20px 0px;
}
.pageHeader {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}
.el-main {
  padding-top: 0 !important;
}
.fixHeader {
  position: sticky;
  top: 0;
  background: white;
  z-index: 9;
  margin-left: -20px;
  margin-right: -20px;
  margin-bottom: 10px;
  padding: 0 20px 10px 20px;
}
</style>
<style lang="scss">
.wHeader {
  .el-submenu__title,
  .el-menu-item {
    padding: 0 10px !important;
  }
}
</style>