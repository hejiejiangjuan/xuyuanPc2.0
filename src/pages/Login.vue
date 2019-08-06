<template>
  <div class="login">
    <div class="login-from">
      <div class="login-logo">
        <img src="../assets/logo.png"/>
      </div>
      <a-form
        id="components-form-demo-normal-login"
        :form="form"
        class="login-form"
        @submit="handleSubmit"
      >
        <a-form-item>
          <a-input
            v-decorator="[
          'userName',
          { rules: [{ required: true, message: '请输入正确用户名!' }] }
        ]"
            placeholder="用户名"
          >
            <a-icon slot="prefix" type="user" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-decorator="[
          'passWord',
          { rules: [{ required: true, message: '请输入正确密码!' }] }
        ]"
            type="password"
            placeholder="密码"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-form-button">登录</a-button>
        </a-form-item>
      </a-form>
      
    </div>
    <div class="shuoming">
      <div>蜀ICP备15003730号-1</div>
      <div class="footer">@Copyright2019黑豆旅行.AllRightsReserved.</div>
    </div>
  </div>
</template>

<script>
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },

  methods: {
    handleSubmit(e) {
      var that = this;
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          var params = new URLSearchParams();
          params.append("userName", values.userName);
          params.append("passWord", values.passWord);
          that.$axios.post("/backstage/login/dologin", params).then(
            res => {
              if (res.data.code == 200) {
                that.$message.success(res.data.message);
                sessionStorage.setItem("userId",res.data.datas)
                sessionStorage.setItem("username",values.userName)
                that.$router.push({ path: "/home" });
              } else if (res.data.code == 300) {
                that.$message.warning(res.data.message);
              } else if (res.data.code == 205) {
                sessionStorage.setItem("code", res.data.code);
                this.$message.error(response.data.message);
              } else {
                that.$message.error(res.data.message);
              }
            },
            err => {
              that.message = res.data.message;
              that.type = "error";
              that.msgShow = true;
            }
          );
        }
      });
    }
  }
};
</script>
<style lang="scss">
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
.login {
  width: 100%;
  height: 100%;
}
.login-from {
  width: 40%;
  height: 40%;
  margin-left: 30% ;
  margin-bottom: 5%;
}
.login-logo {
  width: 40%;
  height: 40%;
  margin-left: 30% ;
  margin-top: 30% ;
}
.shuoming {
  width: 300px;
  height: 60px;
  margin: 0 auto;
  position: relative;
  bottom: 0;
  text-align: center;
}
.footer{
  font-size: 12px;
}
</style>


