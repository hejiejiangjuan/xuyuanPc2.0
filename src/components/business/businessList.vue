<template>
  <div>
    <a-list itemLayout="horizontal" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a slot="actions" @click="showModal(item)">修改</a>
        <a slot="actions">
          <a-popconfirm
            title="确定要删除吗？"
            okText="是"
            cancelText="否"
            @confirm="confirm"
            @cancel="cancel"
          >
            <a-icon slot="icon" type="question-circle-o" style="color: red"/>
            <a @click="deteleItem(item)">删除</a>
          </a-popconfirm>
        </a>
        <a slot="actions" @click="moveJoinHand(item,1)">上移</a>
        <a slot="actions" @click="moveJoinHand(item,2)">下移</a>
        <a-list-item-meta :description="item.content">
          <a slot="title">{{item.title}}</a>
          <a-avatar slot="avatar" :src="item.logo"/>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
    <a-modal
      title="修改信息"
      centered
      v-model="modalVisible"
      @ok="updateJoinHand"
      okText="修改"
      cancelText="取消"
    >
      <a-upload
        :action="uploadUrl"
        listType="picture-card"
        :fileList="fileList"
        @preview="handlePreview"
        @change="handleChange"
      >
        <div v-if="fileList.length < 1">
          <a-icon type="plus"/>
          <div class="ant-upload-text">Upload</div>
        </div>
      </a-upload>
      <a-input v-model="title"/>
      <div style="margin: 24px 0"/>
      <a-textarea v-model="content" :autosize="{ minRows: 2, maxRows: 6 }"/>
    </a-modal>
  </div>
</template>
<script>
const data = [];
export default {
  data() {
    return {
      data,
      modalVisible: false,
      content: "",
      title: "",
      uploadUrl: "",
      fileList: [],
      logo: "",
      id: "",
      deleteId:''
    };
  },
  mounted: function() {
    //文件服务器地址
    this.uploadUrl = this.$uploadUrl + "fileUpload";
    this.getList();
  },
  methods: {
    //确认删除
    confirm (e) {
    this.deleteJoinHand();
    },
    //取消删除
    cancel (e) {
      this.$message.error('取消删除')
    },
    //删除
    deleteJoinHand(){
      var that = this;
      var params = new URLSearchParams();
      params.append("id", that.deleteId);
      this.$axios.post("/backstage/joinHand/deleteJoinHand", params).then(
        res => {
          if (res.data.code == 200) {
            that.modalVisible = false;
            this.$message.success(res.data.message);
            that.getList();
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //记录要删除的Id
    deteleItem(item){
      this.deleteId=item.id;
    },
    //修改弹框
    showModal(item) {
      debugger;
      this.modalVisible = true;
      this.content = item.content;
      this.title = item.title;
      this.id = item.id;
      this.logo=item.logo;
      this.fileList = [
        {
          uid: "",
          name: "",
          status: "done",
          url: item.logo
        }
      ];
    },
    //提交修改
    updateJoinHand() {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", that.id);
      params.append("title", that.title);
      params.append("content", that.content);
      params.append("logo", that.logo);
      this.$axios.post("/backstage/joinHand/updateJoinHand", params).then(
        res => {
          if (res.data.code == 200) {
            that.modalVisible = false;
            this.$message.success(res.data.message);
            that.getList();
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //获取常见问题列表
    getList() {
      var that = this;
      this.$axios.post("/backstage/joinHand/getJoinHand").then(
        res => {
          if (res.data.code == 200) {
            that.data = res.data.datas;
          } else {
            this.$message.error(`网络波动，请刷新页面`);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //商务合作顺序移动
    moveJoinHand(item, type) {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", item.id);
      params.append("rank", item.rank);
      params.append("type", type);
      this.$axios.post("/backstage/joinHand/moveJoinHand", params).then(
        res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            that.getList();
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
</style>
