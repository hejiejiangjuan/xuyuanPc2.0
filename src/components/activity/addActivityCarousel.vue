<template>
  <div class="joinDiv">
    <div style="display: block;">
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
      </a-upload>
    </div>选择类型：
    <a-select defaultValue="0" style="margin-bottom:24px;width:30% " v-model="type">
      <a-select-option value="0">选择广告类型</a-select-option>
      <a-select-option value="1">活动详情</a-select-option>
      <a-select-option value="2">小程序</a-select-option>
      <a-select-option value="3">内嵌网页</a-select-option>
      <a-select-option value="4">外部链接</a-select-option>
    </a-select>
    <br />
    <div v-show="type==1" style="margin-bottom:24px ">
      选择活动：
      <a @click="activityDetilByName" v-if="actitityName ==''">选择活动</a>
      <a @click="activityDetilByName" v-else>{{actitityName}}</a>
    </div>
    <div v-show="type==3 || type==4">
      额外跳转地址：
      <!-- <a-input v-model="extJumpAddr" style="width:50%;margin-bottom:24px " placeholder="输入额外跳转地址" /> -->
      <a-input addonBefore="Https://" v-model="extJumpAddr" style="width:50%;margin-bottom:24px " placeholder="输入额外跳转地址" addonAfter=".com"/>
    </div>是否上架：
    <a-radio-group v-model="status" style="width:50%;margin-bottom:24px ">
      <a-radio value="1" disabled>上架</a-radio>
      <a-radio value="2" disabled>下架</a-radio>
    </a-radio-group>
    <br />上架时间：
    <a-locale-provider :locale="locale">
      <a-date-picker
        :disabledDate="disabledStartDate"
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        v-model="beginTime"
        placeholder="选择上架时间"
        @openChange="handleStartOpenChange"
        style="margin-bottom:24px "
      />
    </a-locale-provider>
    <br />下架时间：
    <a-locale-provider :locale="locale">
      <a-date-picker
        :disabledDate="disabledEndDate"
        showTime
        format="YYYY-MM-DD HH:mm:ss"
        placeholder="选择下架时间"
        v-model="endTime"
        :open="endOpen"
        @openChange="handleEndOpenChange"
        style="margin-bottom:24px "
      />
    </a-locale-provider>
    <div v-show="type==2">
      小程序AppId：
      <a-input style="width:50%;margin-bottom:24px " placeholder="输入小程序AppId" v-model="miniAppid" />
      <br />小程序地址：
      <!-- <a-input style="width:50%;margin-bottom:24px " placeholder="输入小程序地址" v-model="miniPath" /> -->
       <a-input addonBefore="Https://" addonAfter=".com" style="width:50%;margin-bottom:24px " placeholder="输入小程序地址" v-model="miniPath"  />
    </div>
    <a-button type="primary" style="display: block;width:30%" @click="updateActivityCarousel">添加</a-button>
    <div>
      <a-modal title="选择要关联的活动" centered v-model="modalVisible" @ok="() => modalVisible = false">
        <a-input-search placeholder="请输入要关联的活动名称" @search="onSearch" enterButton="搜索" size="large" />
        <br />
        <br />
        <a-list itemLayout="horizontal" :dataSource="data">
          <a-list-item slot="renderItem" slot-scope="item">
            <a slot="actions" @click="selectActivity(item)">选择</a>
            <a-list-item-meta
              :description="'由  '+item.nickName+item.createDate+'发送。 活动说明:'+item.creativityExplain"
            >
              <a slot="title">{{item.activityTheme}}</a>
            </a-list-item-meta>
          </a-list-item>
        </a-list>
        <div>
          <a-pagination
            :total="count"
            :pageSize="pageSize"
            :current="pageNum"
            @change="onShowSizeChange"
          />
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
export default {
  data() {
    return {
      locale: zhCN,
      actitityName: "",
      modalVisible: false,
      pageNum: 1,
      data: [],
      count: 0,
      pageSize: 5,
      activityId: "",
      content: "",
      uploadUrl: "",
      fileList: [],
      logo: "",
      status: "1",
      type: "0",
      beginTime: null,
      endTime: null,
      endOpen: false,
      userName: "",
      extJumpAddr: "",
      miniPath: "",
      miniAppid: "",
    };
  },
  mounted: function() {
    //文件服务器地址
    this.uploadUrl = this.$uploadUrl + "fileUpload";
  },
  methods: {
    //选择活动
    selectActivity(item) {
      this.actitityName = item.activityTheme;
      this.activityId = item.id;
      this.modalVisible = false;
    },
    //添加广告轮播
    updateActivityCarousel() {
      var that = this;
      var http;
      var httpcom;
      if (that.type == 1) {
        that.miniAppid = "";
        that.miniPath = "";
        that.extJumpAddr = "";
      } else if (that.type == 2) {
        that.extJumpAddr = "";
        that.activityId = "";
        if(that.miniPath != ''){
          httpcom = 'https://'+that.miniPath+'.com'
        }
      } else if (that.type == 3) {
        that.miniAppid = "";
        that.miniPath = "";
        that.activityId = "";
        if(that.extJumpAddr != ''){
         http ='https://'+that.extJumpAddr+'.com'
        }
      } else if (that.type == 4) {
        that.miniAppid = "";
        that.miniPath = "";
        that.activityId = "";
        if(that.extJumpAddr != ''){
          http ='https://'+that.extJumpAddr+'.com'
        }
      }
      var params = new URLSearchParams();
      let userInfo = JSON.stringify({
        activityId: that.activityId,
        imgAddr: that.logo,
        putawayTime: new Date(that.beginTime).getTime(),
        outTime: new Date(that.endTime).getTime(),
        extJumpAddr: http,
        status: that.status,
        jumpType: that.type,
        miniAppid: that.miniAppid,
        miniPath: httpcom,
      });
      debugger
      params.append("param", userInfo);
      this.$axios
        .post("/backstage/activityCarousel/updateActivityCarousel", params)
        .then(
          res => {
            if (res.data.code == 200) {
              that.$message.success(res.data.message);
              that.$router.push({ path: "/home/activityCarousel" });
            } else {
              that.$message.error(res.data.message);
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    //条件查询
    onSearch(value) {
      this.userName = value;
      this.pageNum = 1;
      this.activityDetilByName();
    },
    //分页查询
    onShowSizeChange(pageNum, pageSize) {
      this.pageNum = pageNum;
      this.activityDetilByName();
    },
    //获取活动列表
    activityDetilByName() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageNum", that.pageNum);
      params.append("pageSize", that.pageSize);
      params.append("activity", that.userName);
      this.$axios
        .post("/backstage/activityDetil/activityDetilByName", params)
        .then(
          res => {
            if (res.data.code == 200) {
              that.data = res.data.datas.list;
              that.count = res.data.datas.count;
              that.modalVisible = true;
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    //不可选开始日期
    disabledStartDate(startValue) {
      return startValue && startValue < moment().startOf("day");
    },
    //不可选结束日期
    disabledEndDate(endValue) {
      return endValue < this.beginTime;
    },
    //选择开始日期
    handleStartOpenChange(open) {debugger
      if (!open) {
        this.endOpen = true;
      }
      if (this.beginTime > new Date()) {
        this.status = '2';
      } else {
        this.status = '1';
      }
    },
    //选择结束日期
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    //是否上架
    onChange(e) {
      // console.log("radio checked", e.target.value);
    },
    //上传logo
    handleCancel() {
      this.previewVisible = false;
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    handleChange({ fileList }) {
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i].status == "done") {
          this.logo = fileList[i].response.datas;
        }
      }
      this.fileList = fileList;
    }
  }
};
</script>
<style>
.joinDiv {
  width: 60%;
  margin-left: 30%;
}
</style>
