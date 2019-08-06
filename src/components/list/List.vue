<template>
  <div>
    <a-tabs defaultActiveKey="1" @change="callback"  :animated="false">
      <a-tab-pane tab="用户列表" key="1">
        <a-input-search
          placeholder="请输入要搜索的用户昵称"
          @search="onSearch"
          enterButton="搜索"
          size="large"
          style="width: 20%"
        />
        <br>
        <br>
        <a-table :columns="columns" :rowKey="record => record.id" :dataSource="data" bordered :pagination="false" :loading="loading">
          <template v-for="col in ['用户昵称',  '性别','国家', '省份', '地区','是否会员','状态','加入时间']" :slot="col"></template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm
                  title="确认要将此用户加入黑名单?"
                  @confirm="confirm"
                  @cancel="cancel"
                  okText="是"
                  cancelText="否"
                >
                  <a @click="setUserRecord(record,2)">加入黑名单</a>
                </a-popconfirm>
                <a-popconfirm
                  title="确认要禁用此用户?"
                  @confirm="confirm"
                  @cancel="cancel"
                  okText="是"
                  cancelText="否"
                >
                  <a @click="setUserRecord(record,0)">禁用</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <br>
        <div>
          <a-pagination
            :total="count"
            :pageSize="pageSize"
            :current="pageNum"
            @change="onShowSizeChange"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane tab="黑名单" key="2" forceRender>
        <a-input-search
          placeholder="请输入要搜索的用户昵称"
          @search="onSearch"
          enterButton="搜索"
          size="large"
          style="width: 20%"
        />
        <br>
        <br>
        <a-table :columns="columns" :rowKey="record => record.id" :dataSource="data" bordered :pagination="false" :loading="loading">
          <template v-for="col in ['用户昵称',  '性别','国家', '省份', '地区','是否会员','状态','加入时间']" :slot="col"></template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm
                  title="确认要将此用户回复正常?"
                  @confirm="confirm"
                  @cancel="cancel"
                  okText="是"
                  cancelText="否"
                >
                  <a @click="setUserRecord(record,1)">恢复正常</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <br>
        <div>
          <a-pagination
            :total="count"
            :pageSize="pageSize"
            :current="pageNum"
            @change="onShowSizeChange"
          />
        </div>
      </a-tab-pane>
      <a-tab-pane tab="禁用名单" key="0">
        <a-input-search
          placeholder="请输入要搜索的用户昵称"
          @search="onSearch"
          enterButton="搜索"
          size="large"
          style="width: 20%"
        />
        <br>
        <br>
        <a-table :columns="columns" :rowKey="record => record.id" :dataSource="data" bordered :pagination="false" :loading="loading">
          <template v-for="col in ['用户昵称',  '性别','国家', '省份', '地区','是否会员','状态','加入时间']" :slot="col"></template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                <a-popconfirm
                  title="确认要将此用户回复正常?"
                  @confirm="confirm"
                  @cancel="cancel"
                  okText="是"
                  cancelText="否"
                  v-if="record.status!='正常'"
                >
                  <a @click="setUserRecord(record,1)">恢复正常</a>
                </a-popconfirm>
              </span>
            </div>
          </template>
        </a-table>
        <br>
        <div>
          <a-pagination
            :total="count"
            :pageSize="pageSize"
            :current="pageNum"
            @change="onShowSizeChange"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
const columns = [
  {
    title: "用户昵称",
    dataIndex: "nickName",
    width: "10%",
    scopedSlots: { customRender: "nickName" }
  },
  {
    title: "性别",
    dataIndex: "gender",
    width: "5%",
    scopedSlots: { customRender: "gender" }
  },
  {
    title: "国家",
    dataIndex: "country",
    width: "8%",
    scopedSlots: { customRender: "country" }
  },
  {
    title: "省份",
    dataIndex: "province",
    width: "8%",
    scopedSlots: { customRender: "province" }
  },
  {
    title: "地区",
    dataIndex: "city",
    width: "8%",
    scopedSlots: { customRender: "city" }
  },
  {
    title: "是否会员",
    dataIndex: "member",
    width: "5%",
    scopedSlots: { customRender: "member" }
  },
  {
    title: "状态",
    dataIndex: "status",
    width: "5%",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "加入时间",
    dataIndex: "createDate",
    width: "20%",
    scopedSlots: { customRender: "createDate" }
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
    nickName: data[i].nickName,
    avatarUrl: data[i].avatarUrl,
    gender: data[i].gender,
    province: data[i].province,
    country: data[i].country,
    city: data[i].city,
    status: data[i].status,
    member: data[i].member
  });
}
export default {
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      data,
      columns,
      pageNum: 1,
      count: 0,
      pageSize: 10,
      userName: "",
      status: "",
      userStatus:1,
      userRecord: {},
      loading: false,
    };
  },
  mounted: function() {
    this.getWxUserList();
    this.getCountUser();
  },
  methods: {
    //Tab页切换
    callback (key) {
      this.userStatus=key;
      this.getWxUserList();
      this.getCountUser();
    },
    //同意修改用户状态
    confirm(e) {
      this.prohibitUser(this.userRecord);
    },
    //取消
    cancel(e) {
      this.$message.error("取消成功");
    },
    //记录要修改用户的属性
    setUserRecord(record, status) {
      this.status = status;
      this.userRecord = record;
    },
    //修改用户状态
    prohibitUser(record) {
      var that = this;
      var params = new URLSearchParams();
      var type = "";
      if (this.status == 0) {
        ;
        type = "禁用";
      } else if (this.status == 2) {
        type = "加入黑名单";
      } else {
        type = "恢复正常";
      }
      let userInfo = JSON.stringify({
        id: record.id,
        status: this.status
      });
      params.append("wxUser", userInfo);
      this.$axios
        .post("/backstage/wxUser/updateUser", params)
        .then(
          res => {
            if (res.data.code == 200) {
              that.$message.success(type + res.data.datas);
              that.getWxUserList();
            } else {
              that.$message.error(type + res.data.datas);
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    //获取用户列表
    getWxUserList() {
      var that = this;
      var params = new URLSearchParams();
      ;
      if (this.userName != "") {
        params.append("phone", this.userName);
      }
      params.append("status", this.userStatus);
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      this.loading = true;
      this.$axios
        .post("/backstage/wxUser/getUserList", params)
        .then(
          res => {
            this.loading = false;
            that.data = res.data.datas.userList;
          },
          err => {
            console.log(err);
          }
        );
    },

//获取用户总数
    getCountUser() {
      var that = this;
      var params = new URLSearchParams();
      ;
      if (this.userName != "") {
        params.append("phone", this.userName);
      }
      params.append("status", this.userStatus);
      this.$axios
        .post("/backstage/wxUser/getCountUser", params)
        .then(
          res => {
            that.count = res.data.datas;
          },
          err => {
            console.log(err);
          }
        );
    },


    //条件搜索
    onSearch(value) {
      this.userName = value;
      this.pageNum=1;
      this.getWxUserList();
      this.getCountUser();
    },
    //分页查询
    onShowSizeChange(pageNum, pageSize) {
      this.pageNum = pageNum;
      this.getWxUserList();
      this.getCountUser();
    }
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>