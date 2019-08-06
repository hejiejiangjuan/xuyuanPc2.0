<template>
  <div>
    <a-input placeholder="请输入要添加的昵称" style="width:20%" v-model="userNickName"/>&nbsp;&nbsp;&nbsp;
    <a-button type="primary" @click="addNickName" >添加昵称</a-button>
    <br>
    <br>
    <a-list :grid="{ gutter: 8, column: 8 }" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a-card hoverable style="width: 200px">
          <template class="ant-card-actions" slot="actions">
            <a-icon type="edit" @click="updateName(item)"/>
            <a-popconfirm
              title="确认要删除该昵称?"
              @confirm="confirm"
              @cancel="cancel"
              okText="是"
              cancelText="否"
            >
              <a-icon type="delete" @click="setUserRecord(item)"/>
            </a-popconfirm>
          </template>
          <a-card-meta :title="item.name"></a-card-meta>
        </a-card>
      </a-list-item>
    </a-list>
    <div>
      <a-modal
        title="修改默认昵称"
        centered
        v-model="modal2Visible"
        @ok="update()"
        okText="确认"
        cancelText="取消"
      >
        <a-input
          placeholder="请输入昵称"
          v-model="nickName"
          :defaultValue="nickName"
          style="width: 100%"
        />
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
      pageSize: 30,
      modal1Visible: false,
      modal2Visible: false,
      nickName: "",
      id: "",
      userNickName: ""
    };
  },
  mounted: function() {
    //进入页面加载
    this.getNickNameList();
  },
  methods: {
    setUserRecord(item) {
      this.id = item.id;
    },
    //同意修改用户状态
    confirm(e) {
      this.deleteName();
    },
    //取消
    cancel(e) {
      this.$message.error("取消成功");
    },
    //修改昵称弹出框
    updateName(item) {
      this.id = item.id;
      this.nickName = item.name;
      this.modal1Visible = true;
      this.modal2Visible = true;
    },
    //添加昵称
    addNickName() {
      if( this.userNickName == null ||  this.userNickName ==""){
        this.$message.error("请输入要添加的昵称");
        return ;
      }
      var that = this;
      var params = new URLSearchParams();
      params.append("nickName", this.userNickName);
      this.$axios.post("/backstage/nickName/setNickName", params).then(
        res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.message);
            this.userNickName = "";
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
    deleteName() {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", this.id);
      this.$axios.post("/backstage/nickName/deleteNickName", params).then(
        res => {
          this.getNickNameList();
          this.$message.success(`删除成功`);
          this.id = "";
        },
        err => {
          this.$message.error(`删除失败`);
        }
      );
    },
    //修改昵称
    update() {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", this.id);
      params.append("nickName", this.nickName);
      this.$axios.post("/backstage/nickName/updateNickName", params).then(
        res => {
          if (res.data.code == 200) {
            this.modal1Visible = false;
            this.modal2Visible = false;
            this.$message.success(res.data.message);
            this.userNickName = "";
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
      this.$axios.post("/backstage/nickName/getNickname", params).then(
        res => {
          that.count = res.data.datas.count;
          that.data = res.data.datas.nickNameList;
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
    }
  }
};
</script>
<style>
</style>
