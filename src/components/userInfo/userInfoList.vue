<template >
  <div>
    <a-input-search
      placeholder="请输入要搜索的登录账号"
      @search="onSearch"
      enterButton="搜索"
      size="large"
      style="width: 20%"
    />
    <br>
    <br>
    <a-table :columns="columns" :rowKey="record => record.id" :dataSource="data" bordered :pagination="false">
      <template v-for="col in ['用户姓名', '手机号', '性别','用户类型', '状态', '昵称','登录账号']" :slot="col"></template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations" style="mar">
          <span>
            <a @click="showModal(record)">修改</a>
            <a-popconfirm
              title="确认要禁用此账户?"
              @confirm="confirm"
              @cancel="cancel"
              okText="是"
              cancelText="否"
              v-if="record.userFlag=='正常'"
            >
              <a @click="setUserRecord(record)">禁用</a>
            </a-popconfirm>
            <a-popconfirm
              title="确认要启用此账户?"
              @confirm="confirm"
              @cancel="cancel"
              okText="是"
              cancelText="否"
              v-else
            >
              <a @click="setUserRecord(record)">启用</a>
            </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
    <a-modal title="修改信息" centered v-model="isShow" @ok="handleOk" okText="确认" cancelText="取消">
      <div style="width:80%;margin-left:20%;display:flex;">
        <div style="margin-top:2%">姓名：</div>
        <a-input v-model="adminName" style="width:60%"/>
        <div style="margin-left:2%;margin-top:2%;color:red" v-show="errorName">请输入姓名</div>
      </div>
      <br>
      <div style="width:80%;margin-left:17%;display:flex;">
        <div style="margin-top:2%">手机号：</div>
        <a-input v-model="adminPhone" style="width:60%"/>
        <div style="margin-left:2%;margin-top:2%;color:red" v-show="errorPhone">请输入手机号</div>
      </div>
      <br>
      <div style="width:80%;margin-left:20%;display:flex;">
        <div style="margin-top:2%">性别：</div>
        <a-select v-model="adminSex" style="width: 60%">
          <a-select-option value="0">请选择性别</a-select-option>
          <a-select-option value="1">男</a-select-option>
          <a-select-option value="2">女</a-select-option>
        </a-select>
        <div style="margin-left:2%;margin-top:2%;color:red" v-show="errorSex">请选择性别</div>
      </div>
      <br>
      <!-- <div style="width:80%;margin-left:20%;display:flex;">
        <div style="margin-top:2%">类型：</div>
        <a-select v-model="adminType" style="width: 60%">
          <a-select-option value="0">请选择用户类型</a-select-option>
          <a-select-option value="1">工作人员</a-select-option>
          <a-select-option value="2">商家</a-select-option>
        </a-select>
        <div style="margin-left:2%;margin-top:2%;color:red" v-show="errorType">请选择用户类型</div>
      </div>
      <br> -->
      <div style="width:80%;margin-left:20%;display:flex;">
        <div style="margin-top:2%">昵称：</div>
        <a-input v-model="adminNickName" style="width:60%"/>
        <div style="margin-left:2%;margin-top:2%;color:red" v-show="errorNickName">请输入用户昵称</div>
      </div>
      <br>
      <div style="width:80%;margin-left:20%;display:flex;">
        <div style="margin-top:2%">账号：</div>
        <a-input v-model="adminLogin" style="width:60%"/>
        <div style="margin-left:2%;margin-top:2%;color:red" v-show="errorLogin">请输入登录账号</div>
      </div>
      <br>
      <div style="width:80%;margin-left:20%;display:flex;">
        <div style="margin-top:2%">角色：</div>
        <a-select v-model="adminRole" style="width: 60%">
          <a-select-option v-for="item in optionList" :key="item.val">{{item.name}}</a-select-option>
          <!-- <a-select-option value="0">请选择性别</a-select-option>
          <a-select-option value="1">管理员</a-select-option>
          <a-select-option value="2">运营人员</a-select-option> -->
        </a-select>
        <div style="margin-left:2%;margin-top:2%;color:red" v-show="errorRole">请选择用户角色</div>
      </div>
    </a-modal>
    <br>
    <div>
      <a-pagination
        :total="count"
        :pageSize="pageSize"
        :current="pageNum"
        @change="onShowSizeChange"
      />
    </div>
  </div>
</template>
<script>
const columns = [
  {
    title: "用户姓名",
    dataIndex: "userName",
    width: "10%",
    scopedSlots: { customRender: "userName" }
  },
  {
    title: "手机号",
    dataIndex: "userPhone",
    width: "10%",
    scopedSlots: { customRender: "userPhone" }
  },
  {
    title: "性别",
    dataIndex: "userSex",
    width: "5%",
    scopedSlots: { customRender: "userSex" }
  },
  {
    title: "用户类型",
    dataIndex: "userType",
    width: "10%",
    scopedSlots: { customRender: "userType" }
  },
  {
    title: "账号状态",
    dataIndex: "userFlag",
    width: "10%",
    scopedSlots: { customRender: "userFlag" }
  },
  {
    title: "用户昵称",
    dataIndex: "userNickname",
    width: "10%",
    scopedSlots: { customRender: "userNickname" }
  },
  {
    title: "登录账号",
    dataIndex: "userCode",
    width: "10%",
    scopedSlots: { customRender: "userCode" }
  },
  {
    title: "用户角色",
    dataIndex: "roleName",
    width: "10%",
    scopedSlots: { customRender: "roleName" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: "10%",
    scopedSlots: { customRender: "operation" }
  }
];
const data = [];
for (let i = 0; i < data.length; i++) {
  data.push({
    key: data[i].id,
    userName: data[i].userName,
    userPhone: data[i].userPhone,
    userSex: data[i].userSex,
    userType: data[i].userType,
    userFlag: data[i].userFlag,
    userNickname: data[i].userNickname,
    userCode: data[i].userCode,
    roleName: data[i].roleName
  });
}
export default {
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      data,
      columns,
      pageNum: 1,
      count: 0,
      pageSize: 10,
      userName: "",
      isShow: false,
      userForm: {},
      userRecord: {},
      message: "",
      adminName: "",
      adminPhone: "",
      adminSex: "",
      adminType: "",
      adminNickName: "",
      adminLogin: "",
      adminRole: "",
      optionList:"",
      errorName: false,
      errorPhone: false,
      errorSex: false,
      errorType: false,
      errorNickName: false,
      errorRole: false,
      errorLogin: false,
      adminId: ""
    };
  },
  mounted: function() {
    this.getUserInfo();
    this.getRoleList();
  },
  methods: {
    getRoleList(){
      var that = this;
      this.$axios
        .post("/backstage/userInfo/roleList")
        .then(
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
    confirm(e) {
      this.prohibitUser(this.userRecord);
    },
    cancel(e) {
      this.$message.error("取消成功");
    },
    setUserRecord(record) {
      this.userRecord = record;
    },
    //用户禁用启用
    prohibitUser(record) {
      var that = this;
      var params = new URLSearchParams();
      var flag = "";
      var type = "";
      if (record.userFlag == "正常") {
        flag = 2;
        type = "禁用";
      } else {
        flag = 1;
        type = "启用";
      }
      let userInfo = JSON.stringify({
        id: record.id,
        userFlag: flag
      });
      params.append("userInfo", userInfo);
      this.$axios
        .post("/backstage/userInfo/updateUser", params)
        .then(
          res => {
            if (res.data.code == 200) {
              that.$message.success(type + res.data.datas);
              that.getUserInfo();
            } else {
              that.$message.error(type + res.data.datas);
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    //分页查询
    onShowSizeChange(pageNum, pageSize) {
      this.pageNum = pageNum;
      this.getUserInfo();
    },
    getUserInfo() {
      var that = this;
      var params = new URLSearchParams();
      if (this.userName != "") {
        params.append("userName", this.userName);
      }
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      this.$axios
        .post("/backstage/userInfo/getUserList", params)
        .then(
          res => {
            that.count = res.data.datas.userInfoCount;
            that.data = res.data.datas.userInfoList;
          },
          err => {
            console.log(err);
          }
        );
    },
    onSearch(value) {
      this.pageNum=1;
      this.userName = value;
      this.getUserInfo();
    },
    //修改用户信息
    showModal(key) {
      this.adminId = key.id;
      this.adminName = key.userName;
      this.adminPhone = key.userPhone;
      this.adminSex = key.userSex;
      // this.adminType = key.userType;
      this.adminNickName = key.userNickname;
      this.adminLogin = key.userCode;
      this.adminRole = key.roleName;
      this.isShow = true;
    },
    //表单提交，修改信息
    handleOk() {
      if (this.adminName == null || this.adminName == "") {
        this.errorName = true;
        return;
      }
      if (this.adminPhone == null || this.adminPhone == "") {
        this.errorPhone = true;
        return;
      }
      if (this.adminSex == null || this.adminName == 0) {
        this.errorSex = true;
        return;
      }
      // if (this.adminType == null || this.adminType == 0) {
      //   this.errorType = true;
      //   return;
      // }
      if (this.adminNickName == null || this.adminNickName == "") {
        this.errorNickName = true;
        return;
      }
      if (this.adminLogin == null || this.adminLogin == "") {
        this.errorLogin = true;
        return;
      }
      if (this.adminRole == null || this.adminRole == 0) {
        this.errorRole = true;
        return;
      }
      var that = this;
      if (this.adminSex == "未知") {
        this.adminSex = 0;
      } else if (this.adminSex == "男") {
        this.adminSex = 1;
      } else if (this.adminSex == "女") {
        this.adminSex = 2;
      }
      // if (this.adminType == "工作人员") {
      //   this.adminType = 1;
      // } else if (this.adminType == "商家") {
      //   this.adminType = 2;
      // }
      if (this.adminRole == "管理员") {
        this.adminRole = 1;
      } else if (this.adminRole == "运营人员") {
        this.adminRole = 2;
      }
      var params = new URLSearchParams();
      let userInfo = JSON.stringify({
        id: this.adminId,
        userName: this.adminName,
        userPhone: this.adminPhone,
        userSex: this.adminSex,
        // userType: this.adminType,
        userNickname: this.adminNickName,
        userCode: this.adminLogin
      });
      params.append("userInfo", userInfo);
      params.append("roleId", this.adminRole);
      this.$axios
        .post("/backstage/userInfo/updateUser", params)
        .then(
          res => {
            if (res.data.code == 200) {
              that.isShow = false;
              that.$message.success(res.data.message);
              that.getUserInfo();
            } else {
              that.$message.error(res.data.message);
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    okBtn(e) {
      console.log(e);
    },
    save(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        delete target.editable;
        this.data = newData;
        this.cacheData = newData.map(item => ({ ...item }));
      }
    },
    cancel(key) {
      const newData = [...this.data];
      const target = newData.filter(item => key === item.key)[0];
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter(item => key === item.key)[0]
        );
        delete target.editable;
        this.data = newData;
      }
    }
  }
};
</script>
<style scoped>
.userinfo-h2 {
  margin-top: 1%;
}
.editable-row-operations a {
  margin-right: 2%;
}
.divaa {
  width: 100%;
  height: 800%;
  /* display: none; */
  background: black;
  opacity: 0.5;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
}
.div-from {
  width: 50%;
  height: 480px;
  background: #ffffff;
  border-radius: 10px;
  position: fixed;
  top: 10%;
  left: 20%;
  padding: 10px 60px;
  z-index: 3000;
}
.divfromtop {
  width: 100% !important;
  height: 100% !important;
}
.userinfolist-from-botton {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-botn1 {
  margin: 0 20px;
}
</style>