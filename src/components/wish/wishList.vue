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
        v-for="col in ['心愿名称', '心愿类型', '是否匿名','发起人昵称','微信号', '省份', '地区','状态', '支持人数','达成时间','发起时间']"
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
              title="确认要将此心愿下架?"
              @confirm="confirm"
              @cancel="cancel"
              okText="是"
              cancelText="否"
              v-if="record.status=='上架'"
            >
              <a @click="getwishId(record,2)">下架</a>
            </a-popconfirm>
            <a-popconfirm
              title="确认要恢复此心愿?"
              @confirm="confirm"
              @cancel="cancel"
              okText="是"
              cancelText="否"
              v-if="record.status!='上架'"
            >
              <a @click="getwishId(record,1)" v-if="record.status=='黑名单'">恢复正常</a>
              <a @click="getwishId(record,1)" v-else>上架</a>
            </a-popconfirm>
            <a-popconfirm
              title="确认要将此心愿加入加入黑名单?"
              @confirm="confirm"
              @cancel="cancel"
              okText="是"
              cancelText="否"
              v-if="record.status!='黑名单'"
            >
              <a @click="getwishId(record,3)">加入黑名单</a>
            </a-popconfirm>
            <a-popconfirm
              title="确认要删除此心愿?"
              @confirm="confirm"
              @cancel="cancel"
              okText="是"
              cancelText="否"
            >
              <a @click="getwishId(record,0)">删除</a>
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
        <div v-for="item in pameName" :key="item.id">
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
    width: "10%",
    scopedSlots: { customRender: "wishName" }
  },
  {
    title: "心愿类型",
    dataIndex: "wishTypeName",
    width: "10%",
    scopedSlots: { customRender: "wishTypeName" }
  },
  {
    title: "是否匿名",
    dataIndex: "anonymity",
    width: "6%",
    scopedSlots: { customRender: "anonymity" }
  },
  {
    title: "发起人昵称",
    dataIndex: "nickName",
    width: "10%",
    scopedSlots: { customRender: "nickName" }
  },
  {
    title: "微信号",
    dataIndex: "wechatNo",
    width: "5%",
    scopedSlots: { customRender: "wechatNo" }
  },
  {
    title: "省份",
    dataIndex: "provincial",
    width: "5%",
    scopedSlots: { customRender: "provincial" }
  },
  {
    title: "地区",
    dataIndex: "city",
    width: "5%",
    scopedSlots: { customRender: "city" }
  },
  {
    title: "状态",
    dataIndex: "status",
    width: "5%",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "支持人数",
    dataIndex: "supportNum",
    width: "7%",
    scopedSlots: { customRender: "supportNum" }
  },
  {
    title: "达成时间",
    dataIndex: "reachDate",
    width: "10%",
    scopedSlots: { customRender: "reachDate" }
  },
  {
    title: "发起时间",
    dataIndex: "createDate",
    width: "15%",
    scopedSlots: { customRender: "createDate" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: "30%",
    fixed: "right",
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
    wechatNo:data[i].wechatNo,
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
      this.getWishList();
      this.getWishListCount();
    },
    //分页查询
    onShowSizeChange(pageNum, pageSize) {
      this.pageNum = pageNum;
      this.getWishList();
    },
    //确认操作
    confirm(e) {
      this.updateWishStuatus();
    },
    //取消操作
    cancel(e) {
      this.$message.error("取消操作");
    },
    //修改状态
    updateWishStuatus() {
      var that = this;
      var params = new URLSearchParams();
      let wish = JSON.stringify({
        id: this.wishId,
        status: this.wishDetilStatus
      });
      params.append("wish", wish);
      this.$axios.post("/backstage/wish/updateWish", params).then(
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
      this.$axios.post("/backstage/wish/getWishListCount", params).then(
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
      this.$axios.post("/backstage/wish/getWishList", params).then(
        res => {
          this.loading = false;
          that.data = res.data.datas;
          for (var i = 0; i < that.data.length; i++) {
            if (that.data[i].wechatNo.length > 8) {
              that.data[i].wechatNo =
                that.data[i].wechatNo.substring(0, 7) + "...";
            }
            that.data[i].wishName1=that.data[i].wishName;
            if(that.data[i].wishName.length>8){
              that.data[i].wishName=that.data[i].wishName.substring(0, 7) + "...";
            }else{
              that.data[i].wishName=that.data[i].wishName;
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
  text-indent:32px;
  padding: 18px 0;
}

.gushicenter {
  text-indent:32px;
  padding: 10px 0;
}
</style>
