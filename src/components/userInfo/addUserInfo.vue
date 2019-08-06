<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-form-item label="用户姓名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-input
        v-decorator="[
          'userName',
          {rules: [{ required: true, message: '请输入用户姓名！' }]}
        ]"
        placeholder="请输入用户姓名"
      />
    </a-form-item>
    <a-form-item label="手机号" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-input
        v-decorator="[
          'userPhone',
          {rules: [{ required: true, message: '请输入用户手机号！' }]}
        ]"
        placeholder="请输入用户手机号"
      />
    </a-form-item>
    <a-form-item label="性别" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-select
        v-decorator="[
          'userSex',
          {rules: [{ required: true, message: '请选择用户性别!' }]}
        ]"
        placeholder="请选择用户性别"
      >
        <a-select-option value="0">请选择用户性别</a-select-option>
        <a-select-option value="1">男</a-select-option>
        <a-select-option value="2">女</a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="用户角色" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-select
        v-decorator="[
          'userRole',
          {rules: [{ required: true, message: '请选择用户角色!' }]}
        ]"
        placeholder="请选择用户角色"
      >
        <a-select-option v-for="item in optionList" :key="item.val">{{item.name}}</a-select-option>
        <!-- <a-select-option value="1">管理员</a-select-option>
        <a-select-option value="2">运营人员</a-select-option>-->
      </a-select>
    </a-form-item>
    <!-- <a-form-item label="用户类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-select
        v-decorator="[
          'userType',
          {rules: [{ required: true, message: '请选择用户类型!' }]}
        ]"
        placeholder="请选择用户类型"
      >
        <a-select-option value="1">工作人员</a-select-option>
        <a-select-option value="2">商家</a-select-option>
      </a-select>
    </a-form-item>-->
    <a-form-item label="用户昵称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-input
        v-decorator="[
          'userNickName',
          {rules: [{ required: true, message: '请输入用户昵称！' }]}
        ]"
        placeholder="请输入用户昵称"
      />
    </a-form-item>
    <a-form-item label="登录账号" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
      <a-input
        v-decorator="[
          'userCode',
          {rules: [{ required: true, message: '请输入用户登录账号！' }]}
        ]"
        placeholder="请输入用户登录账号"
      />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
      <a-button type="primary" html-type="submit" style="width:80%">添加</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      optionList: []
    };
  },
  mounted: function() {
    //进入页面加载所有角色
    this.getRoleList();
  },
  methods: {
    getRoleList() {
      var that = this;
      this.$axios.post("/backstage/userInfo/roleList").then(
        res => {
          if (res.data.code == 200) {
            that.optionList = res.data.datas;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    handleSubmit(e) {
      var that = this;
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          var params = new URLSearchParams();
          let userInfo = JSON.stringify({
            userName: values.userName,
            userPhone: values.userPhone,
            userSex: values.userSex,
            // userType: values.userType,
            userNickname: values.userNickName,
            userCode: values.userCode,
            userId: values.userId
          });
          params.append("userInfo", userInfo);
          params.append("roleId", values.userRole);
          this.$axios.post("/backstage/userInfo/addUser", params).then(
            res => {
              if (res.data.code == 200) {
                that.$message.success(res.data.message);
                that.$router.push({ path: "/home/userInfoList" });
              } else {
                that.$message.error(res.data.message);
              }
            },
            err => {
              console.log(err);
            }
          );
        }
      });
    }
  }
};
</script>