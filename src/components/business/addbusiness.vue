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
      <div v-if="fileList.length < 1" >
        <a-icon type="plus"/>
        <div class="ant-upload-text" >Upload</div>
      </div>
    </a-upload>
    </div>
    <a-input v-model="title" style="width:60%;margin-bottom:24px " placeholder="输入商务合作标题"/>
    <a-textarea v-model="content" :autosize="{ minRows: 5, maxRows: 10 }" placeholder="输入商务合作内容" style="width:60%;margin-bottom:24px"/>
    <a-button type="primary" style="display: block;width:60%" @click="addJoinHand">添加</a-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: "",
      title: "",
      uploadUrl: "",
      fileList: [],
      logo: ""
    };
  },
  mounted: function() {
    //文件服务器地址
    this.uploadUrl = this.$uploadUrl + "fileUpload";
  },
  methods: {
    //添加商务合作
    addJoinHand(){
      var that = this;
      var params = new URLSearchParams();
      params.append("title", that.title);
      params.append("content", that.content);
      params.append("logo", that.logo);
      this.$axios.post("/backstage/joinHand/addJoinHand", params).then(
        res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            that.$router.push({ path: "/home/businessList" });
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          console.log(err);
        }
      );
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
.joinDiv{
  width: 60%;
  margin-left: 30%;
 
}
</style>
