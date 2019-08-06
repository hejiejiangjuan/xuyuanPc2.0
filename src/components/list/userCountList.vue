<template>
  <div>
    <a-input-search
      placeholder="请输入要搜索的用户昵称"
      @search="onSearch"
      enterButton="搜索"
      size="large"
      style="width: 20%"
    />
    <br>
    <br>
    <a-table :columns="columns" :rowKey="record => record.id" :dataSource="data" bordered :pagination="false">
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
    title: "加入时间",
    dataIndex: "createDate",
    width: "15%",
    scopedSlots: { customRender: "createDate" }
  },
  {
    title: "发起活动数量",
    dataIndex: "sendActivityCount",
    width: "8%",
    scopedSlots: { customRender: "sendActivityCount" }
  },
  {
    title: "发起心愿数量",
    dataIndex: "sendWishCount",
    width: "8%",
    scopedSlots: { customRender: "sendWishCount" }
  },
  {
    title: "参加活动数量",
    dataIndex: "joinActivityCount",
    width: "8%",
    scopedSlots: { customRender: "joinActivityCount" }
  },
  {
    title: "中将次数",
    dataIndex: "prizeActivityCount",
    width: "8%",
    scopedSlots: { customRender: "prizeActivityCount" }
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
      userStatus: 1,
      userRecord: {}
    };
  },
  mounted: function() {
    this.getWxUserList();
  },
  methods: {
    //记录要修改用户的属性
    setUserRecord(record, status) {
      this.status = status;
      this.userRecord = record;
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
      this.$axios
        .post("/backstage/wxUser/getUserCount", params)
        .then(
          res => {
            that.count = res.data.datas.count;
            that.data = res.data.datas.userList;
          },
          err => {
            console.log(err);
          }
        );
    },
    //条件搜索
    onSearch(value) {
      this.userName = value;
      this.pageNum = 1;
      this.getWxUserList();
    },
    //分页查询
    onShowSizeChange(pageNum, pageSize) {
      this.pageNum = pageNum;
      this.getWxUserList();
    }
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>