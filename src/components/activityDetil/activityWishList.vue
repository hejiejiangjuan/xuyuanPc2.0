<template>
  <div>
    <a-input-search
      placeholder="请输入要搜索的活动名称"
      @search="onSearch"
      enterButton="搜索"
      size="large"
      style="width: 20%"
    />
    <br>
    <br>
    <a-table :columns="columns" :rowKey="record => record.id" :dataSource="data" bordered :pagination="false" :loading="loading">
      <template v-for="col in ['中奖活动名称', '中奖心愿名称', '中奖人昵称','中奖奖品名称', '中奖时间']" :slot="col"></template>
      <!-- <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span>
            <a @click="info(record)">查看中奖名单</a>
          </span>
        </div>
      </template> -->
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
import { Modal } from "ant-design-vue";
const columns = [
  {
    title: "中奖活动名称",
    dataIndex: "activityTheme",
    width: "20%",
    scopedSlots: { customRender: "activityTheme" }
  },
  {
    title: "中奖心愿名称",
    dataIndex: "wishName",
    width: "12%",
    scopedSlots: { customRender: "wishName" }
  },
  {
    title: "中奖人昵称",
    dataIndex: "nickName",
    width: "10%",
    scopedSlots: { customRender: "nickName" }
  },
  {
    title: "中奖奖品名称",
    dataIndex: "prizeName",
    width: "12%",
    scopedSlots: { customRender: "prizeName" }
  },
  {
    title: "中奖时间",
    dataIndex: "create_date",
    width: "10%",
    scopedSlots: { customRender: "create_date" }
  }
];

const data = [];
for (let i = 0; i < data.length; i++) {
  data.push({
    key: data[i].id,
    wishName: data[i].wishName,
    wishTypeName: data[i].wishTypeName,
    customRender: data[i].customRender,
    anonymity: data[i].anonymity,
    nickName: data[i].nickName,
    Provincial: data[i].Provincial,
    city: data[i].city,
    status: data[i].status,
    supportNum: data[i].supportNum,
    reachDate: data[i].reachDate,
    createDate: data[i].createDate
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
      endReachDate: null,
      startstartReachDate: null,
      anonymity: "2",
      wishStatus: "4",
      loading: false,
      wishId: "",
      wishDetilStatus: "",
      userName: ""
    };
  },
  mounted: function() {
    this.getWishList();
    this.getWishListCount();
  },
  methods: {
    //获取当前Id
    getwishId(record, value) {
      this.wishId = record.id;
      this.wishDetilStatus = value;
    },
    //分页查询
    onShowSizeChange(pageNum, pageSize) {
      this.pageNum = pageNum;
      this.getWishList();
    },
    //条件搜索
    onSearch(value) {
      this.userName = value;
      this.pageNum = 1;
      this.getWishListCount();
      this.getWishList();
    },
    //获取总数
    getWishListCount() {
      var that = this;
      var params = new URLSearchParams();
      params.append("activityName", this.userName);
      this.$axios.post("/backstage/activityDetil/getListCount", params).then(
        res => {
          that.count = res.data.datas;
        },
        err => {
          console.log(err);
        }
      );
    },
    //心愿列表
    getWishList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      params.append("activityName", this.userName);
      this.loading = true;
      this.$axios
        .post("/backstage/activityDetil/getUserJoinActivityList", params)
        .then(
          res => {
            this.loading = false;
            that.data = res.data.datas;
          },
          err => {
            console.log(err);
          }
        );
    }
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
