<template>
  <div>
    <a-upload
      name="file"
      :multiple="true"
      :action="uploadUrl"
      :showUploadList="false"
      :headers="headers"
      @change="handleChange"
    >
      <a-button>
        <a-icon type="upload"/>上传头像
      </a-button>
    </a-upload>
    <br><br>
    <a-list :grid="{ gutter: 2, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 24  }" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item" style="width:5%">
        <a-avatar :size="64" :src="item.addr"/>
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
      headers: {
        authorization: "authorization-text"
      },
      data,
      pageNum: 1,
      count: 0,
      pageSize: 200,
      uploadUrl: "",
      imgUrl: ""
    };
  },
  mounted: function() {
    //文件服务器地址
    this.uploadUrl = this.$uploadUrl + "fileUpload";
    //进入页面加载
    this.getPhotoList();
  },
  methods: {
    handleChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        this.imgUrl = info.file.response.datas;
        var params = new URLSearchParams();
        params.append("imgUrl", this.imgUrl);
        this.$axios
          .post("/backstage/portrait/upload", params)
          .then(
            res => {
              if (res.data.code == 200) {
                this.getPhotoList();
                this.$message.success(
                  `${info.file.name} 上传成功`
                );
              }else{
                this.$message.error(`网络波动，${info.file.name} 未能保存成功，请重新上传`);
              }
            },
            err => {
              console.log(err);
            }
          );
      } else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 上传失败，请重新上传`);
      }
    },
    //查询列表
    getPhotoList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      this.$axios
        .post("/backstage/portrait/getList", params)
        .then(
          res => {
            that.count = res.data.datas.count;
            that.data = res.data.datas.list;
          },
          err => {
            console.log(err);
          }
        );
    },
    //分页查询
    onShowSizeChange(pageNum, pageSize) {
      this.pageNum = pageNum;
      this.getPhotoList();
    }
  }
};
</script>
<style>
</style>
