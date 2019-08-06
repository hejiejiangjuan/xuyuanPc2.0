<template>
  <div class="addcommon">
    <br><br>
    <a-textarea placeholder="请输入标题" v-model="titleval" autosize style="width:60%;margin-bottom:24px "/>
    <a-textarea placeholder="请输入常见问题内容" v-model="taxtval" :autosize="{ minRows: 10, maxRows: 20 }" style="width:60%;margin-bottom:24px "/>
     <a-button type="primary" style="display: block;width:60%" @click="addcomBtn">添加</a-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      titleval: "",
      taxtval: ""
    };
  },
  methods: {
    addcomBtn() {
      var that = this;
      if (that.titleval != "" && that.taxtval != "") {
        var params = new URLSearchParams();
        params.append("title", that.titleval);
        params.append("content", that.taxtval);
        this.$axios
          .post("/backstage/commonQuestion/addCommonQuestion", params)
          .then(
            res => {
              this.$message.success('提交成功');
              that.$router.push({ path: "/home/commonQuestionList" });
            },
            err => {
              console.log(err);
            }
          );
      }else{
        this.$message.error('表单为空！');
      }
    }
  }
};
</script>

<style>
.addcommon {
   width: 60%;
  margin-left: 30%;
}
.btntijiao {
  width: 150px;
  height: 40px;
  background: #1890ff;
  margin: 20px auto;
  text-align: center;
  line-height: 40px;
  border-radius: 20px;
  color: aliceblue;
  font-size: 18px;
}
</style>
