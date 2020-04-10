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

          <el-submenu
            v-for="list in cols"
            :key="list.name"
            :index="list.name"
          >
            <template slot="title">
              <i :class="list.icon"></i>
              <span slot="title">{{list.name}}</span>
            </template>
            <el-menu-item
              v-for="item in list.subMenuList"
              :key="item.path"
              :index="item.path"
            >{{item.name}}</el-menu-item>
          </el-submenu>

          <el-menu-item
            v-for="list in _cols"
            :key="list.name"
            :index="list.path"
          >
            <template slot="title">
              <i :class="list.icon"></i>
              <span slot="title">{{list.name}}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </div>
      <el-dropdown @command="handleCommand" style="width: 100px">
        <span class="el-dropdown-link">
          {{userInfo.realName}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="center">个人中心</el-dropdown-item>
          <el-dropdown-item command="logout">登出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-main id="main_content">
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import { LOGINAUTHTOKEN } from "@/utils/constants";
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "layout",
  data() {
    return {
      activeIndex: null,
      isCollapse: false
    };
  },
  computed: {
    ...mapState(["islogin", "userInfo", "menu"]),
    cols: function() {
      let result = [];
      for(var item in this.menu.menuList){
        if(item['subMenuList']){
          result.push(item);
        }
      }
      return result;
    },
    _cols: function() {
      let result = [];
      for(var item in this.menu.menuList){
        if(!item['subMenuList']){
          result.push(item);
        }
      }
      return result;
    }
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
    ...mapActions([
      "GET_USER_INFO",
      "GET_MENU"
    ]),
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
        case "center":
          this.goto("/center");
          break;
      }
    },
    goto(to) {
      console.log("goto ", to);
      this.$router.push(to);
    }
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