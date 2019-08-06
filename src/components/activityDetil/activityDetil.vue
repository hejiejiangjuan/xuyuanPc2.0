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
    <a-table :columns="columns" :rowKey="record => record.id" :dataSource="data" bordered :pagination="false" :loading="loading">
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
            <a @click="getActivityDetailExt(record.extId)">编辑</a>
            <a @click="activease = true,activityId=record.id">推荐给用户</a>
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

    <a-modal
      title="编辑活动"
      cancelText="取消"
      okText="确定"
      v-model="ExditActivity"
      @ok="updateActivityDetailExt"
    >
      <a-upload
        :action="uploadUrl"
        listType="picture-card"
        :fileList="fileList"
        @preview="handlePreview"
        @change="handleChange"
      >
        <div v-if="fileList.length < 1">
          <a-icon type="plus" />
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>公众号内嵌网页地址：
      <a-input
        placeholder="公众号内嵌网页地址"
        style="width:50%"
        v-model="activityDetailExt.publicPageAddr"
      />
      <br />
      <br />公众号引导位置：
      <a-radio-group name="radioGroup" v-model="activityDetailExt.publicStatus">
        <a-radio value="0">不显示</a-radio>
        <a-radio value="1">顶部</a-radio>
        <a-radio value="2">底部</a-radio>
        <a-radio value="3">全部</a-radio>
      </a-radio-group>
      <br />
      <br />花费心愿卡数量：
      <a-input placeholder="花费心愿卡数量" style="width:50%" v-model="activityDetailExt.wishcardNum" />
      <br />
      <br />引导小程序名称：
      <a-input placeholder="引导小程序名称" style="width:50%" v-model="activityDetailExt.miniName" />
      <br />
      <br />引导小程序是否显示：
      <a-radio-group name="radioGroup" v-model="activityDetailExt.miniStatus">
        <a-radio value="0">不显示</a-radio>
        <a-radio value="1">顶部</a-radio>
        <a-radio value="2">底部</a-radio>
        <a-radio value="3">全部</a-radio>
      </a-radio-group>
      <br />
      <br />显示赞助商状态：
      <a-radio-group name="radioGroup" v-model="activityDetailExt.sponsorStatus">
        <a-radio value="0">不显示</a-radio>
        <a-radio value="1">显示赞助商</a-radio>
        <a-radio value="3">品牌赞助商</a-radio>
      </a-radio-group>
      <br />
      <br />赞助商名字：
      <a-input placeholder="赞助商名字" style="width:50%" v-model="activityDetailExt.sponsorName" />
      <br />
      <br />品牌赞助商名字：
      <a-input
        placeholder="品牌赞助商名字"
        style="width:50%"
        v-model="activityDetailExt.brandSponsorName"
      />
      <br />
      <br />公众号引导方式：
      <a-radio-group name="radioGroup" v-model="activityDetailExt.guide">
        <a-radio value="1">不显示</a-radio>
        <a-radio value="2">显示赞助商</a-radio>
      </a-radio-group>
    </a-modal>

    <a-modal
      title="选择推送用户"
      cancelText="取消"
      okText="确定"
      v-model="activease"
      @ok="setUserInfoActivity"
    >
      <div>
        <a-input placeholder="用户昵称" v-model="userInfoNickName" style="width:20%" />
        <a-select
          v-model="userInfoWishType"
          :allowClear="true"
          placeholder="请选择类型"
          style="width:30%"
        >
          <a-select-option v-for="item in typeList" :key="item.id">{{item.wishName}}</a-select-option>
        </a-select>
        <a-select v-model="userInfoSex" :allowClear="true" style="width:30%">
          <a-select-option value="3">选择用户性别</a-select-option>
          <a-select-option value="0">未知</a-select-option>
          <a-select-option value="1">男</a-select-option>
          <a-select-option value="2">女</a-select-option>
        </a-select>
        <a-button type="primary" @click="getUserInfo">搜索</a-button>
      </div>
      <br />
      <a-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="userColumns"
        :dataSource="userData"
        :pagination="false"
        rowKey="id"
      />
      <br />
      <a-pagination
        :total="userInfocount"
        :pageSize="userInfopageSize"
        :current="userInfopageNum"
        @change="userInfoPage"
      />
    </a-modal>
  </div>
</template>
<script>
import { Modal } from "ant-design-vue";

const userColumns = [
  {
    title: "昵称",
    dataIndex: "nickName"
  },
  {
    title: "性别",
    dataIndex: "gender"
  }
];

const userData = [];
for (let i = 0; i < userData.length; i++) {
  userData.push({
    id: userData[i].id,
    name: userData[i].nickName,
    gender: userData[i].gender
  });
}

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
      activityDetailExt: {},
      publicStatus: "0",
      previewVisible: false,
      uploadUrl: "",
      previewImage: "",
      fileList: [],
      ExditActivity: false,
      userInfopageNum: 1,
      userInfopageSize: 5,
      userInfocount: 0,
      userInfoNickName: "",
      userInfoSex: "3",
      userInfoWishType: "0",
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
      detailInfo: [],
      userData,
      userColumns,
      selectedRowKeys: [],
      activityId: "",
      typeList: [],
      imgUrl: "",
      mediaId: ""
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    }
  },
  mounted: function() {
    this.getActivityDetilCount();
    this.getActivityDetilList();
    this.getUserInfo();
    this.getWishType();
    this.uploadUrl = this.$uploadUrl + "fileUpload";
  },
  methods: {
    //修改活动扩展
    updateActivityDetailExt() {
      var that = this;
      var params = new URLSearchParams();
      params.append("params", JSON.stringify(that.activityDetailExt));
      that.$axios
        .post("/backstage/activityDetil/updateActivityDetailExt", params)
        .then(
          res => {
            if ((res.data.code = 200)) {
              that.$message.success(res.data.message);
              that.ExditActivity = false;
            } else {
              that.$message.error(res.data.message);
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    //活动扩展详情
    getActivityDetailExt(id) {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", id);
      that.$axios
        .post("/backstage/activityDetil/getActivityDetailExt", params)
        .then(
          res => {
            if ((res.data.code = 200)) {
              that.activityDetailExt = res.data.datas;
              that.fileList = [
                {
                  uid: "-1",
                  name: "xxx.png",
                  status: "done",
                  url: this.$uploadUrl + that.activityDetailExt.qrcodePosterAddr
                }
              ];
              that.activityDetailExt.qrcodePosterAddr =
                that.activityDetailExt.qrcodePosterAddr;
              that.ExditActivity = true;
            } else {
              that.$message.error(res.data.message);
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    //打开选择文件框
    handleCancel() {
      this.previewVisible = false;
    },
    //选择文件
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    //图片回显
    handleChange({ fileList }) {
      this.fileList = fileList;
      if (fileList.length == 0) {
        this.activityDetailExt.qrcodePosterAddr = "";
      }
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i].status == "done") {
          this.activityDetailExt.qrcodePosterAddr = fileList[i].response.datas;
        }
      }
    },
    //查询心愿类型
    getWishType() {
      var that = this;
      this.$axios.post("/backstage/type/getWishType").then(
        res => {
          that.typeList = res.data.datas;
          that.typeList.push({
            id: "0",
            wishName: "请选择类型"
          });
        },
        err => {
          console.log(err);
        }
      );
    },
    //确定推荐
    setUserInfoActivity() {
      var that = this;
      var params = new URLSearchParams();
      var selectedId = "[" + that.selectedRowKeys + "]";
      var param = JSON.stringify({
        activityId: that.activityId,
        userList: selectedId
      });
      params.append("param", param);
      this.$axios.post("/backstage/message/sendSystemMessage", params).then(
        res => {
          that.userInfoNickName = "";
          that.userInfoSex = "3";
          that.userInfoWishType = "0";
          that.userInfopageNum = 1;
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            that.activease = false;
            that.selectedRowKeys = [];
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //加载用户列表
    getUserInfo() {
      var that = this;
      var params = new URLSearchParams();
      if (that.userInfoNickName != null && that.userInfoNickName != "") {
        params.append("nickName", that.userInfoNickName);
      }
      if (that.userInfoSex != null && that.userInfoSex != 3) {
        params.append("sex", that.userInfoSex);
      }
      if (that.userInfoWishType != null && that.userInfoWishType != 0) {
        params.append("wishType", that.userInfoWishType);
      }
      params.append("pageSize", that.userInfopageSize);
      params.append("pageNum", that.userInfopageNum);
      this.$axios.post("/backstage/wxUser/getUserInfoList", params).then(
        res => {
          this.userData = res.data.datas.userList;
          this.userInfocount = res.data.datas.count;
        },
        err => {
          console.log(err);
        }
      );
    },
    //选择用户
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    //翻页
    modalChange(pageNummodal, pageSizemodal) {
      this.pageNummodal = pageNummodal;
      this.prizeDate();
    },
    userInfoPage(pageNum, pageSize) {
      this.userInfopageNum = pageNum;
      this.getUserInfo();
    },
    //查看活动详情
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
    handleOk1(e) {
      this.activeCook = false;
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
      this.$axios
        .post("/backstage/activityDetil/updateHomeStatus", params)
        .then(
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
        .post("/backstage/activityDetil/getActivityListCount", params)
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
      this.$axios.post("/backstage/activityDetil/getActivityList", params).then(
        res => {
          this.loading = false;
          this.data = res.data.datas;
          for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].activityTheme.length > 6) {
              this.data[i].active =
                this.data[i].activityTheme.substring(0, 5) + "...";
            } else {
              this.data[i].active = this.data[i].activityTheme;
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
