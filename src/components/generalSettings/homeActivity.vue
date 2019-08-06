<template>
  <div>
    <div style="width:100%;higth:20%">
      <a-input placeholder="活动名称" style="width:10%" v-model="activityTheme" />
      <!-- <a-select style="width: 10%;higth:100%" v-model="openPrize">
        <a-select-option value="2">是否开奖</a-select-option>
        <a-select-option value="1">已开奖</a-select-option>
        <a-select-option value="0">未开奖</a-select-option>
      </a-select>-->
      <a-select style="width: 10%" v-model="activityStatus">
        <a-select-option value="4">选择状态</a-select-option>
        <a-select-option value="1">上架</a-select-option>
        <a-select-option value="2">下架</a-select-option>
        <a-select-option value="3">黑名单</a-select-option>
      </a-select>
      <a-date-picker placeholder="开始时间" v-model="statusDate" format="YYYY-MM-DD" />
      <a-date-picker placeholder="结束时间" v-model="endDate" format="YYYY-MM-DD" />
      <a-button type="primary" @click="getWishListBy">查询</a-button>
    </div>
    <br />
    <a-table
      :columns="columns"
      :rowKey="record => record.id"
      :dataSource="data"
      bordered
      :pagination="false"
      :loading="loading"
    >
      <template
        v-for="col in ['活动主题', '是否引导', '粉丝参与','需要助力', '助力人数', '是否分享','手机号', '发起人','发起时间','是否开奖','活动状态']"
        :slot="col"
      ></template>
      <template slot="active" slot-scope="text, record">
        <a-popover>
          <template slot="content">
            <p>{{record.activityTheme}}</p>
          </template>
          {{record.active}}
        </a-popover>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class="editable-row-operations">
          <span>
            <a @click="info(record)">查看详情</a>
            <a-popconfirm
              title="确认要通过此活动上架首页?"
              @confirm="() => updateWishStuatus(record,1)"
              @cancel="cancel"
              okText="是"
              cancelText="否"
              v-show="record.checkStatus==0"
            >
              <a>通过</a>
            </a-popconfirm>
            <a-popconfirm
              title="确认拒绝此活动上架首页?"
              @confirm="() => updateWishStuatus(record,2)"
              @cancel="cancel"
              okText="是"
              cancelText="否"
              v-show="record.checkStatus ==0"
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
    <a-modal
      title="活动详情"
      class="modal-sx"
      cancelText="取消"
      okText="确定"
      v-model="activeCook"
      @ok="handleOk1"
    >
      <div class="modal-list" v-if="detailInfo != ''">
        <div v-for="item in detailInfo" :key="item.id">
          <div class="huodongcenter" v-if="item.type == 0">{{item.info}}</div>
          <div class="huodongcenter" v-if="item.type == 1">
            <img :src="item.info" alt />
          </div>
        </div>
      </div>
      <div v-else style="width:100%;text-align: center;">未添加活动详情！</div>
    </a-modal>
    <a-modal title="中奖名单" cancelText="取消" okText="确定" v-model="activease" @ok="handleOk">
      <a-list
        class="demo-loadmore-list"
        :loading="loading"
        itemLayout="horizontal"
        :dataSource="modaldata"
        v-if="modaldata != ''"
      >
        <div
          v-if="showLoadingMore"
          slot="loadMore"
          :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
        >
          <a-spin v-if="loadingMore" />
          <a-pagination
            :total="modalcount"
            :pageSize="pageSizemodal"
            :current="pageNummodal"
            @change="modalChange"
          />
        </div>
        <a-list-item slot="renderItem" slot-scope="item">
          <a-list-item-meta :description="'中奖心愿类型：'+item.wishName">
            <a slot="title">中奖人昵称：{{item.nickName}}</a>
            <a-avatar slot="avatar" :src="item.avatar_url" />
          </a-list-item-meta>
        </a-list-item>
      </a-list>
      <div v-else style="width:100%;text-align: center;">暂无中奖名单！</div>
    </a-modal>
  </div>
</template>
<script>
import { Modal } from "ant-design-vue";

const modaldata = [];
const columns = [
  {
    title: "活动",
    dataIndex: "active",
    scopedSlots: { customRender: "active" }
  },
  {
    title: "引导",
    dataIndex: "lead",
    scopedSlots: { customRender: "lead" }
  },
  {
    title: "粉丝",
    dataIndex: "onlyFans",
    scopedSlots: { customRender: "onlyFans" }
  },
  {
    title: "助力",
    dataIndex: "needHelp",
    scopedSlots: { customRender: "needHelp" }
  },
  {
    title: "助力人数",
    dataIndex: "helpNum",
    scopedSlots: { customRender: "helpNum" }
  },
  {
    title: "分享",
    dataIndex: "share",
    scopedSlots: { customRender: "share" }
  },
  {
    title: "手机号",
    dataIndex: "phone",
    scopedSlots: { customRender: "phone" }
  },
  {
    title: "发起人",
    dataIndex: "nickName",
    scopedSlots: { customRender: "nickName" }
  },
  {
    title: "时间",
    dataIndex: "createDate",
    scopedSlots: { customRender: "createDate" }
  },
  {
    title: "首页是否显示",
    dataIndex: "homeStatusName",
    scopedSlots: { customRender: "homeStatusName" }
  },
  {
    title: "审核状态",
    dataIndex: "checkStatusName",
    scopedSlots: { customRender: "checkStatusName" }
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
    activityTheme: data[i].activityTheme,
    lead: data[i].lead,
    onlyFans: data[i].onlyFans,
    needHelp: data[i].needHelp,
    helpNum: data[i].helpNum,
    share: data[i].share,
    phone: data[i].phone,
    nickName: data[i].nickName,
    createDate: data[i].createDate,
    openPrize: data[i].openPrize
  });
}
export default {
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      modalcount: 1,
      pageSizemodal: 5,
      pageNummodal: 1,
      loading: true,
      loadingMore: false,
      showLoadingMore: true,
      activeCook: false,
      modaldata,
      data,
      columns,
      pageNum: 1,
      count: 0,
      pageSize: 10,
      endDate: null,
      statusDate: null,
      openPrize: "2",
      activityStatus: "4",
      activityTheme: "",
      loading: false,
      wishId: "",
      wishDetilStatus: "",
      modalVisible: false,
      activease: false,
      detailInfo: []
    };
  },
  mounted: function() {
    this.getActivityDetilCount();
    this.getActivityDetilList();
  },
  methods: {
    modalChange(pageNummodal, pageSizemodal) {
      this.pageNummodal = pageNummodal;
      this.prizeDate();
    },
    // 中奖弹框
    handleOk(e) {
      this.activease = false;
    },
    handleOk1(e) {
      this.activeCook = false;
    },
    prizeDate(item) {
      var params = new URLSearchParams();
      params.append("id", item.id);
      params.append("pageNum", this.pageNummodal);
      params.append("pageSize", this.pageSizemodal);
      this.$axios.post("/backstage/activityDetil/getPrizeList", params).then(
        res => {
          this.modaldata = res.data.datas;
          this.activease = true;
        },
        err => {
          console.log(err);
        }
      );
    },
    info(record) {
      var wishContent = [];
      var params = new URLSearchParams();
      params.append("id", record.id);
      this.$axios
        .post("/backstage/activityDetil/getActivityDetilInfo", params)
        .then(
          res => {
            this.detailInfo = this.restoreNewLine(
              JSON.parse(res.data.datas.introduce.detailContent)
            );
            this.activeCook = true;
          },
          err => {
            console.log(err);
          }
        );
    },
    //解析活动详情
    restoreNewLine(content) {
      if (content != "" && content > 0) {
        for (var i in content) {
          var obj = content[i];
          if (obj.type == 0) {
            obj.info = obj.info.join("&hc").split("<br>");
            content[i] = obj;
          }
        }
      }
      return content;
    },
    //获取当前Id
    getwishId(record, value) {
      this.wishId = record.id;
      if (record.status == "黑名单") {
        this.wishDetilStatus = 2;
      } else {
        this.wishDetilStatus = value;
      }
    },
    //条件查询
    getWishListBy() {
      this.pageNum = 1;
      this.getActivityDetilList();
      this.getActivityDetilCount();
    },
    //分页查询
    onShowSizeChange(pageNum, pageSize) {
      this.pageNum = pageNum;
      this.getActivityDetilList();
    },
    //取消操作
    cancel(e) {
      this.$message.error("取消操作");
    },
    //修改状态
    updateWishStuatus(item, status) {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", item.extId);
      params.append("homeStatus", status);
      params.append("homeId", item.homeId);
      params.append("days", item.homeDays);
      this.$axios.post("/backstage/activityDetil/updateHomeStatus", params).then(
        res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            this.getActivityDetilCount();
            this.getActivityDetilList();
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
    getActivityDetilCount() {
      var that = this;
      var params = new URLSearchParams();
      if (this.activityStatus != null && this.activityStatus != 4) {
        params.append("status", this.activityStatus);
      }
      if (this.openPrize != null && this.openPrize != 2) {
        params.append("openPrize", this.openPrize);
      }
      if (this.statusDate != null) {
        params.append("startDate", new Date(this.statusDate).getTime());
      }
      if (this.endDate != null) {
        params.append("endDate", new Date(this.endDate).getTime());
      }
      if (this.activityTheme != null && this.activityTheme != "") {
        params.append("activityTheme", this.activityTheme);
      }
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      this.$axios
        .post("/backstage/activityDetil/getHomeActivityListCount", params)
        .then(
          res => {
            that.count = res.data.datas;
          },
          err => {
            console.log(err);
          }
        );
    },
    //活动列表
    getActivityDetilList() {
      var that = this;
      var params = new URLSearchParams();
      if (this.activityStatus != null && this.activityStatus != 4) {
        params.append("status", this.activityStatus);
      }
      if (this.openPrize != null && this.openPrize != 2) {
        params.append("openPrize", this.openPrize);
      }
      if (this.statusDate != null) {
        params.append("startDate", new Date(this.statusDate).getTime());
      }
      if (this.endDate != null) {
        params.append("endDate", new Date(this.endDate).getTime());
      }
      if (this.activityTheme != null && this.activityTheme != "") {
        params.append("activityTheme", this.activityTheme);
      }
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      this.loading = true;
      this.$axios
        .post("/backstage/activityDetil/getHomeActivityList", params)
        .then(
          res => {
            this.loading = false;
            this.data = res.data.datas;
            for (var i = 0; i < this.data.length; i++) {
              if (this.data[i].activityTheme.length > 6) {
                this.data[i].active =
                  this.data[i].activityTheme.substring(0, 5) + "...";
              }else{
                this.data[i].active =
                  this.data[i].activityTheme;
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
.img {
  width: 80%;
  height: 250px;
  margin-top: 2%;
  margin-bottom: 2%;
}
.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.modal-list {
  width: 100%;
  height: 450px;
  overflow-x: hidden;
}
.huodonghuaname {
  font-size: 16px;
  font-weight: 600;
  padding-top: 10px;
}
.huodongcenter {
  padding: 5px 0;
}
.huodongcenter img {
  max-width: 100%;
  max-height: 100%;
}

.modal-sx > .ant-modal-content > .ant-modal-body {
  padding: 0 !important;
}
</style>
