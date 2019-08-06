<template>
  <div>
    <a-list itemLayout="horizontal" :dataSource="data">
      <a-list-item slot="renderItem" slot-scope="item">
        <a slot="actions" @click="btnAmend(item)">修改</a>
        <a slot="actions">
          <a-popconfirm
            title="确定要删除吗？"
            @confirm="confirm"
            @cancel="cancel"
            okText="是"
            cancelText="否"
          >
            <a-icon slot="icon" type="question-circle-o" style="color: red"/>
            <a @click="removeID(item.id)">删除</a>
          </a-popconfirm>
        </a>
        <a slot="actions" @click="ontheMobile(item,1)">上移</a>
        <a slot="actions" @click="ontheMobile(item,2)">下移</a>
        <a-list-item-meta :description="item.content">
          <a slot="title" href="javascript:;">{{item.title}}</a>
          <!-- <a-avatar
          slot="avatar"
          src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />-->
        </a-list-item-meta>
      </a-list-item>
      <a-modal title="修改常见问题" cancelText="取消" v-model="visible" @ok="btnhandleOk">
        <a-textarea placeholder="请输入标题" v-model="titleval" autosize/>
        <div style="margin: 24px 0"/>
        <a-textarea
          placeholder="请输入常见问题内容"
          v-model="taxtval"
          :autosize="{ minRows: 2, maxRows: 10 }"
        />
      </a-modal>
    </a-list>
  </div>
</template>
<script>
const data = [];
export default {
  data() {
    return {
      data,
      visible: false,
      titleval: "",
      taxtval: "",
      conID: "",
      removeid: ""
    };
  },
  mounted: function() {
    this.postcommonlist();
  },
  methods: {
    //初始化页面
    postcommonlist() {
      var that = this;
      var params = new URLSearchParams();
      this.$axios.post("/backstage/commonQuestion/getCommonQuestion").then(
        res => {
          that.data = res.data.datas;
        },
        err => {
          console.log(err);
        }
      );
    },
    //修改
    btnAmend(item) {
      this.titleval = item.title;
      this.taxtval = item.content;
      this.conID = item.id;
      this.visible = true;
    },
    // 确定修改
    btnhandleOk() {
      var that = this;
      console.log(that.titleval, that.taxtval, that.conID);
      var params = new URLSearchParams();
      params.append("id", that.conID);
      params.append("title", that.titleval);
      params.append("content", that.taxtval);
      this.$axios
        .post("/backstage/commonQuestion/updateCommonQuestion", params)
        .then(
          res => {
            if (res.data.code == 200) {
              that.visible = false;
              this.$message.success(res.data.message);
              this.postcommonlist();
            } else {
              this.$message.error(res.data.message);
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    //移动
    ontheMobile(item, type) {
      var that = this;
      console.log(item.rank, type, item.id);
      var params = new URLSearchParams();
      params.append("id", item.id);
      params.append("rank", item.rank);
      params.append("type", type);
      this.$axios
        .post("/backstage/commonQuestion/moveCommonQuestion", params)
        .then(
          res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.message);
              this.postcommonlist();
            } else {
              this.$message.error(res.data.message);
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    // 删除
    // 确认删除
    confirm(e) {
      this.removeAmend();
    },
    // 取消删除
    cancel(e) {
      this.$message.error("取消删除");
    },
    // 获取ID
    removeID(item) {
      this.removeid = item;
    },
    removeAmend() {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", that.removeid);
      this.$axios
        .post("/backstage/commonQuestion/deleteCommonQuestion", params)
        .then(
          res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.message);
              this.postcommonlist();
            } else {
              this.$message.error(res.data.message);
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
<style>
</style>
