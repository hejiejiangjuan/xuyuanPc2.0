<template>
  <div>
    <div style="width:100%;higth:20%">
      <a-select style="width: 10%;higth:100%" v-model="anonymity">
        <a-select-option value="2">是否匿名</a-select-option>
        <a-select-option value="0">匿名</a-select-option>
        <a-select-option value="1">不匿名</a-select-option>
      </a-select>
      <a-select style="width: 10%" v-model="wishStatus">
        <a-select-option value="4">选择状态</a-select-option>
        <a-select-option value="1">上架</a-select-option>
        <a-select-option value="2">下架</a-select-option>
        <a-select-option value="3">黑名单</a-select-option>
      </a-select>
      <a-date-picker placeholder="开始时间" v-model="startstartReachDate" format="YYYY-MM-DD" />
      <a-date-picker placeholder="结束时间" v-model="endReachDate" format="YYYY-MM-DD" />
      <a-button type="primary" @click="getWishListBy">查询</a-button>
    </div>
    <br />
    <a-table :columns="columns" :rowKey="record => record.id" :dataSource="data" bordered :loading="loading" :pagination="false">
      <template
        v-for="col in ['心愿名称', '心愿类型', '是否匿名','发起人昵称','微信号', '省份', '地区','状态', '上首页天数','首页是否显示','达成时间','发起时间']"
        :slot="col"
      ></template>
      <template slot="wishName" slot-scope="text, record">
        <a-popover>
          <template slot="content">
            <p>{{record.wishName1}}</p>
          </template>
          {{record.wishName}}
        </a-popover>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span>
            <a @click="info(record)">查看详情</a>
            <a-popconfirm
                title="确认要将此心愿上架到首页?"
                @confirm="() => updateWishStuatus(record,1)"
                @cancel="cancel"
                okText="是"
                cancelText="否"
                v-show="record.checkStatus == 0"
              >
                <a>通过</a>
              </a-popconfirm>
              <a-popconfirm
                title="确认拒绝将此心愿上架到首页?"
                @confirm="() => updateWishStuatus(record,2)"
                @cancel="cancel"
                okText="是"
                cancelText="否"
                v-show="record.checkStatus == 0"
              >
                <a>拒绝</a>
              </a-popconfirm>
          </span>
        </div>
      </template>
    </a-table>
    <br />
    <div>
      <a-pagination
        :total="count"
        :pageSize="pageSize"
        :current="pageNum"
        @change="onShowSizeChange"
      />
    </div>
    <a-modal :title="createName+'的心愿'" cancelText="取消" okText="确定" v-model="visible" @ok="handleOk">
      <div class="modal-list">
        <div v-for="item in pameName" :key="item">
          <span class="xinyhuaname">
            心愿名称：
            <b style="color:red;">{{item.wishName}}</b>
          </span>
          <div class="nemcenter">{{item.wishContent}}</div>
        </div>
        <div>
          <span class="xinyhuaname">心愿故事：</span>
          <div class="gushicenter">{{story}}</div>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { Modal } from "ant-design-vue";
const columns = [
  {
    title: "心愿名称",
    dataIndex: "wishName",
    scopedSlots: { customRender: "wishName" }
  },
  {
    title: "心愿类型",
    dataIndex: "wishTypeName",
    scopedSlots: { customRender: "wishTypeName" }
  },
  {
    title: "是否匿名",
    dataIndex: "anonymity",
    scopedSlots: { customRender: "anonymity" }
  },
  {
    title: "发起人昵称",
    dataIndex: "nickName",
    scopedSlots: { customRender: "nickName" }
  },
  {
    title: "微信号",
    dataIndex: "wechatNo",
    scopedSlots: { customRender: "wechatNo" }
  },
  {
    title: "省份",
    dataIndex: "provincial",
    scopedSlots: { customRender: "provincial" }
  },
  {
    title: "地区",
    dataIndex: "city",
    scopedSlots: { customRender: "city" }
  },
  {
    title: "状态",
    dataIndex: "checkStatusName",
    scopedSlots: { customRender: "checkStatusName" }
  },
  {
    title: "上首页天数",
    dataIndex: "homeDays",
    scopedSlots: { customRender: "homeDays" }
  },
  {
    title: "首页是否显示",
    dataIndex: "homeStatusName",
    scopedSlots: { customRender: "homeStatusName" }
  },
  {
    title: "达成时间",
    dataIndex: "reachDate",
    scopedSlots: { customRender: "reachDate" }
  },
  {
    title: "发起时间",
    dataIndex: "createDate",
    scopedSlots: { customRender: "createDate" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" }
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
    wechatNo: data[i].wechatNo,
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
      pageSize: 8,
      endReachDate: null,
      startstartReachDate: null,
      anonymity: "2",
      wishStatus: "4",
      loading: false,
      wishId: "",
      wishDetilStatus: "",
      visible: false,
      pameName: [],
      story: "",
      createName: ""
    };
  },
  mounted: function() {
    this.getWishList();
    this.getWishListCount();
  },
  methods: {
    handleOk(e) {
      this.visible = false;
    },
    info(record) {
      this.visible = true;
      const h = this.$createElement;
      var wishContent = [];
      var params = new URLSearchParams();
      params.append("id", record.id);
      this.$axios.post("/backstage/wish/getWishDetil", params).then(
        res => {
          if (res.data.code == 200) {
            this.pameName = res.data.datas;
            this.story = record.story;
            this.createName = record.createName;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //条件查询
    getWishListBy() {
      this.pageNum = 1;
      this.getWishList();
      this.getWishListCount();
    },
    //分页查询
    onShowSizeChange(pageNum, pageSize) {
      this.pageNum = pageNum;
      this.getWishList();
    },
    //取消操作
    cancel(e) {
      this.$message.error("取消操作");
    },
    //修改状态
    updateWishStuatus(item, status) {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", item.id);
      params.append("homeStatus", status);
      params.append("homeId", item.homeId);
      params.append("days", item.homeDays);
      this.$axios.post("/backstage/wish/updateHomeStatus", params).then(
        res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            this.getWishListCount();
            this.getWishList();
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //获取总数
    getWishListCount() {
      var that = this;
      var params = new URLSearchParams();
      if (this.wishStatus != null && this.wishStatus != 4) {
        params.append("status", this.wishStatus);
      }
      if (this.anonymity != null && this.anonymity != 2) {
        params.append("anonymity", this.anonymity);
      }
      if (this.startstartReachDate != null) {
        params.append(
          "startstartReachDate",
          new Date(this.startstartReachDate).getTime()
        );
      }
      if (this.endReachDate != null) {
        params.append("endReachDate", new Date(this.endReachDate).getTime());
      }
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      this.$axios.post("/backstage/wish/getHomeWishListCount", params).then(
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
      if (this.wishStatus != null && this.wishStatus != 4) {
        params.append("status", this.wishStatus);
      }
      if (this.anonymity != null && this.anonymity != 2) {
        params.append("anonymity", this.anonymity);
      }
      if (this.startstartReachDate != null) {
        params.append(
          "startstartReachDate",
          new Date(this.startstartReachDate).getTime()
        );
      }
      if (this.endReachDate != null) {
        params.append("endReachDate", new Date(this.endReachDate).getTime());
      }
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      this.loading = true;
      this.$axios.post("/backstage/wish/getHomeWishList", params).then(
        res => {
          this.loading = false;
          that.data = res.data.datas;
          for (var i = 0; i < that.data.length; i++) {
            if (that.data[i].wechatNo.length > 8) {
              that.data[i].wechatNo =
                that.data[i].wechatNo.substring(0, 7) + "...";
            }
            that.data[i].wishName1 = that.data[i].wishName;
            if (that.data[i].wishName.length > 8) {
              that.data[i].wishName =
                that.data[i].wishName.substring(0, 7) + "...";
            } else {
              that.data[i].wishName = that.data[i].wishName;
            }
            if (that.data[i].checkStatus == 0) {
              that.data[i].checkStatusName = "待审核";
            } else if (that.data[i].checkStatus == 1) {
              that.data[i].checkStatusName = "已通过";
            } else if (that.data[i].checkStatus == 2) {
              that.data[i].checkStatusName = "已拒绝";
            }
            if (that.data[i].homeStatus == 0) {
              that.data[i].homeStatusName = "不显示";
            } else if (that.data[i].homeStatus == 1) {
              that.data[i].homeStatusName = "显示";
            }
          }
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
.ant-modal-confirm-content > div > p {
  text-indent: 2em;
  color: #131e5e;
}
.ant-modal-confirm-content > div > h3 {
  color: #490657;
}
.modal-list {
  width: 100%;
  height: 450px;
  overflow-x: hidden;
}
.xinyhuaname {
  font-size: 16px;
  font-weight: 600;
  padding-top: 10px;
}
.nemcenter {
  text-indent: 32px;
  padding: 18px 0;
}

.gushicenter {
  text-indent: 32px;
  padding: 10px 0;
}
</style>
