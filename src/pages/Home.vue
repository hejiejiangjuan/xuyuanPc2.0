<template>
  <el-container style="height: 100%;">
    <el-header
      style="background-color:#001529; text-align: right; font-size: 12px;display:flex;justify-content : space-between;"
    >
      <div class="home-header-left">
        <img class="logoimg" src="../assets/logo.png" alt />
        <h2 class="home-h3">许愿树运营平台</h2>
      </div>
      <div style="margin-right: 60px;display:flex;">
        <!-- <i class="el-icon-setting" style="margin-right: 15px"></i> -->
        <div>
          <div style="margin-right:50px">
            <a-dropdown>
              <a class="ant-dropdown-link">
                <a-avatar style="backgroundColor:#87d068" icon="user" />
              </a>
              <a-menu slot="overlay">
                <a-menu-item key="0" disabled>{{username}}</a-menu-item>
                <a-menu-divider />
                <a-menu-item key="2">
                  <a href="javascript:;" @click="() => modal2Visible = true">修改密码</a>
                </a-menu-item>
                <a-menu-item key="3" disabled>
                  <a href="javascript:;" @click="loginOut">退出</a>
                </a-menu-item>
              </a-menu>
            </a-dropdown>
          </div>
        </div>
      </div>
    </el-header>
    <el-container style="height:100%">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246);height:100%;">
        <el-menu background-color="#001529" text-color="#fff" active-text-color="#1890ff">
          <el-submenu v-for="item in all" :key="item.pId" :index="item.pId">
            <template slot="title">
              <i :class="item.icon"></i>
              {{item.powerName}}
            </template>
            <el-menu-item-group v-for="item in item.power" :key="item.id">
              <el-menu-item :index="item.pId" @click="goArtLists(item.powerUrl)">{{item.powerName}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main style="height:100%;">
        <router-view></router-view>
      </el-main>
    </el-container>
    <!-- <el-container>
      <el-footer id="footer" style="background-color: rgb(238, 241, 246);">
        <div style="font-size: 12px">蜀ICP备15003730号-1</div>
        <div style="font-size: 12px">@Copyright2019黑豆旅行.AllRightsReserved.</div>
      </el-footer>
    </el-container>-->
    <a-modal
      title="修改密码"
      centered
      v-model="modal2Visible"
      @ok="amendPassword"
      okText="确认"
      cancelText="取消"
    >
      <p class="modal-input">{{username}}</p>
      <div class="modal-input">
        <a-input
          placeholder="请输入新密码"
          @change="() =>errorName=false"
          v-model="password"
          type="passWord"
        />
        <div style="margin-left:2%;margin-top:2%;color:red" v-show="errorName">{{errorDiv}}</div>
      </div>
    </a-modal>
  </el-container>
</template>
<script>
import Vue from "vue";
import {
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Icon,
  Footer
} from "element-ui";
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Footer);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);

export default {
  data() {
    return {
      isShow: true,
      all: [],
      errorDiv: "",
      username: "",
      password: "",
      errorName: false,
      modal1Visible: false,
      modal2Visible: false
    };
  },
  mounted: function() {
    this.getPowerList();
    this.username = sessionStorage.getItem("username");
  },

  methods: {
    setModal1Visible(modal1Visible) {
      this.modal1Visible = modal1Visible;
    },
    goArtLists(url) {
      this.$router.push({ path: url });
    },
    getPowerList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("roleId", 2);
      this.$axios.post("/backstage/power/getPowerByRoleId").then(
        res => {
          if (res.data.code == "200") {
            that.all = res.data.datas;
          } else if (res.data.code == "205") {
            this.$message.error("身份失效！");
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    loginOut() {
      var that = this;
      var params = new URLSearchParams();
      this.$axios.post("/backstage/login/loginout").then(
        res => {
          if (res.data.code == "200") {
            that.$router.push({ path: "/login" });
            this.$message.success("退出成功");
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    amendPassword() {
      this.modal2Visible = false;
      var params = new URLSearchParams();
      params.append("id", sessionStorage.getItem("userId"));
      params.append("passWord", this.password);
      if (
        this.password.length < 6 ||
        this.password.length > 12 ||
        this.password == ""
      ) {
        this.errorName = true;
        this.errorDiv = "密码必须6~12位数";
        return;
      }
      this.$axios.post("/backstage/userInfo/updatePassWord", params).then();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}
.el-menu {
  min-height: 100%;
}
.el-aside {
  color: #333;
}
.home-header-left {
  width: 600px;
  height: 60px;
  display: flex;
  align-items: center;
  margin-left: 20px;
}
.home-logo {
  width: 100px;
  height: 50px;
  border-radius: 20px;
}
.home-h3 {
  font-size: 20px;
  margin-left: 30px;
  color: #ffffff;
}
#footer {
  width: 100%;
  height: 60px;
  text-align: center;
  line-height: 20px;
  font-size: 12px !important;
  padding-top: 10px;
}
.modal-input {
  width: 100%;
  padding: 10px 20px;
}
.password-input {
  width: 100%;
  height: 40px;
  border: 1px solid #cccccc;
  text-align: center;
}
.logoimg {
  width: 120px;
  height: 32px;
}
</style>


