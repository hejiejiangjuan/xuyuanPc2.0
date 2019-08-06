<template>
  <div>
    <div>
      <a-tabs @change="callback" :animated="false">
        <a-tab-pane tab="添加客服信息" key="1">
          标题名称：
          <a-input placeholder="标题名称" style="width:20%" v-model="titleName" />
          <br />
          <br />标题内容：
          <a-input placeholder="标题内容" style="width:20%" v-model="titleValue" />
          <br />
          <br />是否可以拨打电话：
          <a-radio-group name="phoneStatus" :defaultValue="0" v-model="phoneStatus">
            <a-radio value="0">否</a-radio>
            <a-radio value="1">是</a-radio>
          </a-radio-group>
          <br />
          <br />是否可以复制：
          <a-radio-group name="copyStatus" :defaultValue="0" v-model="copyStatus">
            <a-radio value="0">否</a-radio>
            <a-radio value="1">是</a-radio>
          </a-radio-group>
          <a-button type="primary" @click="addContactUs">添加</a-button>
          <br />
          <br />
          <a-table bordered :dataSource="dataSource" :rowKey="record => record.id" :columns="columns" :pagination="false">
            <template slot="operation" slot-scope="text, record">
              <a-popconfirm
                v-if="dataSource.length"
                title="确定要删除?"
                okText="是"
                cancelText="否"
                style="float: left;"
                @confirm="() => onDelete(record.id)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
              <a
                href="javascript:;"
                style="float: left;margin-left: 40px;"
                @click="updateRank(record,1)"
              >上移</a>
              <a
                href="javascript:;"
                style="float: left;margin-left: 40px;"
                @click="updateRank(record,2)"
              >下移</a>
            </template>
          </a-table>
        </a-tab-pane>
        <a-tab-pane tab="添加客服二维码" key="2">
          添加客服二维码：
          <div>
            <a-upload
              :action="uploadurl"
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
          </div>
          <div style="display: flex;
    padding: 10px;" v-if="icon != null">
            <div class="icon-dibv">
              <img :src="fileurl+titleValue" />
            </div>
          </div>
          <a-button style="margin-left:5%;margin-top:5%;" type="primary" @click="addContactUs">添加</a-button>
        </a-tab-pane>
        <a-tab-pane tab="添加关于我们" key="3">
          <div class="gunayuwomen">
          <div class="guanyuadming">关于我们：</div>
           <div class="textarea-div">
              <a-textarea
              placeholder="输入关于我们详情"
              :autosize="{ minRows: 2, maxRows: 6 }"
              v-model="titleValue"
            />
            <a-button type="primary" class="anniubtn"  @click="addContactUs">确认</a-button>
           </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      titleId: "",
      titleName: "",
      titleValue: "",
      phoneStatus: "0",
      copyStatus: "0",
      key: "1",
      uploadurl: "",
      fileurl: "",
      fileList: [],
      dataSource: [],
      count: 2,
      previewVisible: false,
      icon: "",
      columns: [
        {
          title: "标题",
          dataIndex: "titleName"
        },
        {
          title: "内容",
          dataIndex: "titleValue"
        },
        {
          title: "是否可以复制",
          dataIndex: "copyStatus"
        },
        {
          title: "是否可以拨打电话",
          dataIndex: "phoneStatus"
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ]
    };
  },
  mounted: function() {
    this.uploadurl = this.$uploadUrl + "fileUpload";
    this.fileurl = this.$uploadUrl;
    //获取客服信息列表
    this.getList();
  },
  methods: {
    //获取客服信息列表
    getList() {
      var params = new URLSearchParams();
      params.append("titleType", this.key);
      this.$axios.post("/backstage/contactUs/getList", params).then(
        res => {
          if (res.data.code == 200) {
            this.dataSource = res.data.datas;
            if (this.key == 3) {
              this.titleId = this.dataSource[0].id;
              this.titleName = "关于我们";
              this.titleValue = this.dataSource[0].titleValue;
            } else if (this.key == 2) {
              this.titleId = this.dataSource[0].id;
              this.titleValue = this.dataSource[0].titleValue;
              this.titleName = "客服微信二维码";
              this.fileList = [
                {
                  uid: "-1",
                  name: "xxx.png",
                  status: "done",
                  url: this.fileurl + this.dataSource[0].titleValue
                }
              ];
            }
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //添加客服信息
    addContactUs() {
      var that = this;
      
      if(that.key ==1 ){
        if(that.titleName == null || that.titleName ==""){
            that.$message.error("请输入标题名称");
          return ;
        }
        if(that.titleValue == null || that.titleValue ==""){
            that.$message.error("请输入标题内容");
          return ;
        }
      }
      var params = new URLSearchParams();
      let title = JSON.stringify({
        titleName: that.titleName,
        titleValue: that.titleValue,
        phoneStatus: that.phoneStatus,
        copyStatus: that.copyStatus,
        titleType: that.key,
        id: that.titleId
      });
      params.append("params", title);
      that.$axios.post("/backstage/contactUs/addContactUs", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
            that.titleName = "";
            that.titleValue = "";
            that.phoneStatus = "0";
            that.copyStatus = "0";
            that.getList();
          } else {
            that.$message.error(res.data.message);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //删除客服信息
    onDelete(id) {
      var params = new URLSearchParams();
      params.append("id", id);
      this.$axios.post("/backstage/contactUs/deleteContactUs", params).then(
        res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            this.getList();
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //上移或下移客服信息
    updateRank(record, type) {
      var params = new URLSearchParams();
      params.append("rank", record.rank);
      params.append("type", type);
      params.append("id", record.id);
      this.$axios.post("/backstage/contactUs/updateRank", params).then(
        res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            this.getList();
          } else {
            this.$message.error(res.data.message);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //选择图片
    handleCancel() {
      this.previewVisible = false;
    },
    //上传图片
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl;
      this.previewVisible = true;
    },
    //上传图片回显
    handleChange({ fileList }) {
      for (var i = 0; i < fileList.length; i++) {
        if (fileList[i].status == "done") {
          this.titleValue = fileList[i].response.datas;
        }
      }
      this.fileList = fileList;
    },
    //tabs页切换
    callback(val) {
      this.key = val;
      this.getList();
      this.titleName = "";
      this.titleValue = "";
      this.phoneStatus = "0";
      this.copyStatus = "0";
      this.fileList = [];
      if (val == 2) {
        this.titleName = "客服微信二维码";
      } else if (val == 3) {
        this.titleName = "关于我门";
      } else if (val == 1) {
        this.titleId = "";
      }
    }
  }
};
</script>
<style>
.addDiv {
  width: 30%;
  float: left;
}
.getDiv {
  text-align: center;
  float: left;
  margin-left: 3%;
}
.btnDiv {
  float: left;
  margin-top: 10%;
}
.icon-dibv {
  width: 320px;
  height: 246px;
}
.icon-dibv img {
  max-width: 100%;
  max-height: 100%;
}
.gunayuwomen{
  display: flex;
  align-items: center;
}
.guanyuadming{
  margin-left: 20px;
}
.textarea-div{
  width: 500px;
  margin-top: 50px;
  text-align: center;
}
.anniubtn{
  margin-top: 30px;
}
</style>
