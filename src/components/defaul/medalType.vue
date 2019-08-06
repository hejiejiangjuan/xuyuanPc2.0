<template>
  <div>
    <a-button type="primary" @click="visible = true,title='添加勋章'">添加勋章</a-button>
    <br />
    <br />
    <a-list :grid="{ gutter: 6, column: 6 }" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card hoverable style="width: 200px">
          <img alt="example" :src="fileurl+'/'+item.addr" slot="cover" />
          <template class="ant-card-actions" slot="actions">
            <a-icon type="edit" @click="setType(item)" />
            <a-popconfirm
              title="确认要删除该勋章?"
              @confirm="confirm"
              @cancel="cancel"
              okText="是"
              cancelText="否"
            >
              <a-icon type="delete" @click="deleteType(item.id)" />
            </a-popconfirm>
          </template>
          <a-card-meta :title="'勋章名称：'+item.medalName" :description="'勋章所需积分：'+item.integralNum"></a-card-meta>
        </a-card>
      </a-list-item>
    </a-list>
    <div>
      <a-modal :title="title" v-model="visible" @ok="onClick" cancelText="取消" okText="确认">
        <a-upload
          :action="uploadurl"
          listType="picture-card"
          :fileList="fileList"
          :beforeUpload="beforeUpload"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="fileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-input placeholder="勋章名称" v-model="medalTypeName" />
        <br />
        <br />
        <a-input placeholder="勋章所需分数" v-model="medalTypeNum" />
      </a-modal>
    </div>
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
      pageNum: 1,
      count: 0,
      pageSize: 10,
      title: "",
      visible: false,
      uploadurl: "",
      previewVisible: false,
      previewImage: "",
      fileList: [],
      icon: "",
      medalTypeName: "",
      medalTypeNum: "",
      medalTypeId: "",
      fileurl: ""
    };
  },
  mounted: function() {
    //进入页面加载
    this.getNickNameList();
    this.uploadurl = this.$uploadUrl + "fileUpload";
    this.fileurl = this.$uploadUrl;
  },
  methods: {
    // 验证图片大小
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";

      let _this = this;
      return new Promise(function(resolve, reject) {
        let width = 140; // 限制图片尺寸为654X270
        let height = 160;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width === width && img.height === height; //如果上传图片为固定尺寸，则用此项。
          // let valid = img.width / img.height == 1;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          _this.$message.error("图片尺寸限制为140*160！");
          return Promise.reject();
        }
      );
    },
    //记录要删除的Id
    deleteType(id) {
      this.medalTypeId = id;
    },
    //打开修改弹窗
    setType(item) {
      this.title = "修改勋章";
      this.visible = true;
      this.icon = item.addr;
      this.medalTypeName = item.medalName;
      this.medalTypeNum = item.integralNum;
      this.medalTypeId = item.id;
      this.fileList = [
        {
          uid: "-1",
          name: "xxx.png",
          status: "done",
          url: this.$uploadUrl + "/" + item.addr
        }
      ];
    },
    //点击Ok按钮
    onClick() {
      var that = this;
      if (this.medalTypeId != null && this.medalTypeId != "") {
        that.update();
      } else {
        that.addMedalType();
      }
    },
    //同意修改用户状态
    confirm(e) {
      this.deleteMedalType();
    },
    //取消
    cancel(e) {
      this.$message.error("取消成功");
    },
    //新增勋章类型
    addMedalType() {
      var that = this;
      if(this.medalTypeName ==''){
         this.$message.error("勋章名称为空！");
         return
      }
      if(this.medalTypeNum ==''){
         this.$message.error("勋章积分为空！");
         return
      }
      if(this.icon ==''){
         this.$message.error("勋章图为空！");
         return
      }
      var params = new URLSearchParams();
      params.append("name", this.medalTypeName);
      params.append("addr", this.icon);
      params.append("num", this.medalTypeNum);
      this.$axios.post("/backstage/medalType/addMedalType", params).then(
        res => {
          this.visible = false;
          this.medalTypeName = "";
          this.medalTypeNum = "";
          this.fileList = [];
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            this.getNickNameList();
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          this.$message.error(`添加失败`);
        }
      );
    },
    //删除昵称
    deleteMedalType() {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", this.medalTypeId);
      this.$axios.post("/backstage/medalType/deleteMedalType", params).then(
        res => {
          this.getNickNameList();
          this.$message.success(`删除成功`);
          this.medalTypeId = "";
        },
        err => {
          this.$message.error(`删除失败`);
        }
      );
    },
    //修改勋章
    update() {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", this.medalTypeId);
      params.append("name", this.medalTypeName);
      params.append("addr", this.icon);
      params.append("num", this.medalTypeNum);
      this.$axios.post("/backstage/medalType/updateMedalType", params).then(
        res => {
          this.visible = false;
          this.medalTypeName = "";
          this.medalTypeNum = "";
          this.fileList = [];
          this.medalTypeId = "";
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            this.getNickNameList();
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          this.$message.error(`修改失败`);
        }
      );
    },
    //查询列表
    getNickNameList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      this.$axios.post("/backstage/medalType/getList", params).then(
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
      this.getNickNameList();
    },
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
    }
  }
};
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
