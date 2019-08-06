<template>
  <div class="wishtype-div" v-cloak>
    <div class="clearfix" style="display: flex;">
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
      <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </a-modal>
      <br />&nbsp;&nbsp;
      <a-input placeholder="输入类型名称" v-model="typeName" style="width:20%; margin-top: 3%;" />&nbsp;&nbsp;
      <a-button type="primary" @click="setWishType" style=" margin-top: 3%;">保存</a-button>
    </div>
    <a-modal
      title="上传默认图标"
      centered
      v-model="modalVisible"
      @ok="updateWishType"
      okText="确认"
      cancelText="取消"
    >
      <div style="display: flex;">
        <a-upload
          :action="uploadUrl"
          listType="picture-card"
          :fileList="updateFileList"
          @preview="handlePreview1"
          @change="handleChange1"
        >
          <div v-if="updateFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible1" :footer="null" @cancel="handleCancel1">
          <img alt="example" style="width: 100%" :src="updateFileList.icon" />
        </a-modal>
        <br />&nbsp;&nbsp;
        <a-input placeholder="输入类型名称" v-model="updateWishName" style="width:40%; margin-top: 3%;" />
      </div>
    </a-modal>
    <br />
    <a-list itemLayout="horizontal" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item" class="div-list">
        <div v-if="item.type!='默认'">
          <a slot="actions" @click="openWishType(item)">设为默认</a>
        </div>
        <div v-else>
          <a slot="actions" @click="openWishType(item)">修改</a>
        </div>
        <a-list-item-meta :description="'当前使用人数:'+item.useNum">
          <a slot="title">{{item.wishName}}</a>
          <a-avatar slot="avatar" :src="url+'/'+item.icon" />
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
  </div>
</template>
<script>
const data = [];
export default {
  data() {
    return {
      data,
      url:this.$uploadUrl ,
      uploadUrl: "",
      pageNum: 1,
      count: 0,
      pageSize: 8,
      previewVisible: false,
      previewImage: "",
      previewVisible1: false,
      previewImage1: "",
      modalVisible: false,
      icon: "",
      typeName: "",
      fileList: [],
      updateWishName: "",
      updateFileList: [],
      updateWishId: ""
    };
  },
  mounted: function() {
    //文件服务器地址
    this.uploadUrl = this.$uploadUrl + "fileUpload";    //进入页面加载
    this.getwishType();
  },
  methods: {
    //同意修改用户状态
    confirm(e) {
      this.deleteName();
    },
    //取消
    cancel(e) {
      this.$message.error("取消成功");
    },
    //分页查询
    onShowSizeChange(pageNum, pageSize) {
      this.pageNum = pageNum;
      this.getwishType();
    },
    //添加心愿类型
    setWishType() {
      var that = this;
      var params = new URLSearchParams();
      if (this.typeName.length > 4 || this.typeName.length < 1) {
        this.$message.error("类型名称只能输入一到四个字符");
        return;
      }
      let wishType = JSON.stringify({
        wishName: this.typeName,
        icon: this.icon
      });
      params.append("wishType", wishType);
      this.$axios.post("/backstage/type/saveType", params).then(
        res => {
          this.getwishType();
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            this.typeName = "";
            this.fileList = [];
            this.icon = "";
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          this.$message.error(`添加失败`);
        }
      );
    },
    //打开修改页面
    openWishType(item) {debugger
      
      this.updateWishName = item.wishName;
      this.modalVisible = true;
      this.updateWishId = item.id;
      this.updateFileList = [
        {
          uid: "-1",
          name: "xxx.png",
          status: "done",
          url: this.$uploadUrl+"/"+item.icon
        }
      ];
      this.icon=item.icon;
      //this.previewImage1=item.icon;
      // this.updateWishType(item.id);
    },
    //设置为默认
    updateWishType() {
      var that = this;
      var params = new URLSearchParams();
      if (this.updateWishName.length > 4) {
        this.$message.error("类型名称最多只能输入四个字符");
        return;
      }
      let withType = JSON.stringify({
        id: this.updateWishId,
        wishName: this.updateWishName,
        icon: this.icon,
        type: 1
      });
      params.append("withType", withType);
      this.$axios.post("/backstage/type/updateType", params).then(
        res => {
          this.getwishType();
          if (res.data.code == 200) {
            this.updateFileList = [];
            this.icon="";
            this.$message.success(res.data.message);
          } else {
            this.$message.error(res.data.message);
          }
          this.getwishType();
          this.modalVisible = false;
        },
        err => {
          this.$message.error(`设置失败`);
        }
      );
    },
    //心愿类型列表
    getwishType() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      this.$axios.post("/backstage/type/getList", params).then(
        res => {
          that.count = res.data.datas.count;
          that.data = res.data.datas.list;
        },
        err => {
          console.log(err);
        }
      );
    },
    //上传默认类型时
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
          this.icon = fileList[i].response.datas;
        }
      }
      this.fileList = fileList;
    },
    //修改默认类型时
    handleCancel1() {
      this.previewVisible1 = false;
    },
    handlePreview1(file) {
      this.previewImage1 = file.url || file.thumbUrl;
      this.previewVisible1 = true;
    },
    handleChange1({ fileList }) {
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i].status == "done") {
          this.icon = fileList[i].response.datas;
        }
      }
      this.updateFileList = fileList;
    }
  }
};
</script>
<style>
.wishtype-div {
  width: 60%;
  margin-left: 20%;
  align-content: center;
}
.div-list {
  width: 70%;
}
</style>
