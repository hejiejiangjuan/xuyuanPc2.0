<template>
  <div>
    <a-modal title="回复消息" v-model="visible" @ok="handleOk" okText="回复" cancelText="取消">
      <a-textarea
        placeholder="输入回复内容"
        :autosize="{ minRows: 2, maxRows: 6 }"
        v-model="replyContent"
      />
    </a-modal>
    <div>
      <a-input placeholder="昵称" style="width:10%" v-model="phone" />
      <a-select
        defaultValue="lucy"
        style="width: 120px"
        allowClear
        v-model="status"
        placeholder="选择状态"
      >
        <a-select-option value="0">选择状态</a-select-option>
        <a-select-option value="1">待回复</a-select-option>
        <a-select-option value="2">已回复</a-select-option>
      </a-select>
      <a-locale-provider :locale="locale">
        <a-range-picker v-model="creatDate" />
      </a-locale-provider>
      <a-button type="primary" @click="getFeedbackList">搜索</a-button>
    </div>
    <br />
    <a-table :columns="columns" :rowKey="record => record.id" :dataSource="data" :pagination="false">
      <a slot="action" slot-scope="text, record" href="javascript:;" @click="clickEidt(record)">回复</a>
      <p slot="expandedRowRender" slot-scope="record" style="margin: 0">
        详情图：
        <span v-if="picList !=null">
          <span v-for="item in picList" :key="item.id">
            <img :src="fileurl+item.addr" style="width:150px;higth:150px;margin-left:10px" />
          </span>
        </span>
        <span v-else>暂无详情图</span>
        反馈内容：{{record.feedbackContent}}
        <span
          v-if="record.replyContent != null"
          style="margin-left:20px"
        >回复内容：{{record.replyContent}}</span>
      </p>
    </a-table>
    <br />
    <a-pagination :total="count" :pageSize="pageNum" :defaultCurrent="1" @change="onChange" />
  </div>
</template>
<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
export default {
  data() {
    return {
      userId:'',
      phone: "",
      status: "0",
      creatDate: [],
      locale: zhCN,
      visible: false,
      replyContent: "",
      recordId: "",
      fileurl: "",
      data: [],
      picList: [],
      pageSize: 1,
      pageNum: 10,
      count: 0,
      columns: [
        { title: "昵称", dataIndex: "nickName", key: "nickName" },
        { title: "反馈时间", dataIndex: "createTime", key: "createTime" },
        { title: "反馈类型", dataIndex: "typeName", key: "typeName" },
        {
          title: "状态",
          dataIndex: "status",
          key: "status"
        },
        {
          title: "操作",
          dataIndex: "",
          key: "x",
          scopedSlots: { customRender: "action" }
        }
      ]
    };
  },
  mounted: function() {
    this.fileurl = this.$uploadUrl;
    //获取意见反馈列表
    this.getFeedbackList();
  },
  methods: {
    //回复
    handleOk() {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", that.recordId);
      params.append("replyContent", that.replyContent);
      params.append("userId", that.userId);
      this.$axios.post("/backstage/feedback/updateFeedBack", params).then(
        res => {
          if (res.data.code == 200) {
            that.visible = false;
            that.$message.success(res.data.message);
            that.getFeedbackList();
          } else {
            that.$message.error(res.data.message);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //下一页
    onChange(val) {
      debugger;
      this.pageSize = val;
      this.getFeedbackList();
    },
    //获取图片
    getPicList(id) {
      var that = this;
      var params = new URLSearchParams();
      params.append("backId", id);
      this.$axios.post("/backstage/feedback/getPicList", params).then(
        res => {
          that.picList = res.data.datas;
        },
        err => {
          console.log(err);
        }
      );
    },
    //获取意见反馈列表
    getFeedbackList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageSize", that.pageSize);
      params.append("pageNum", that.pageNum);
      if (that.phone != null && that.phone != "") {
        params.append("phone", that.phone);
      }
      if (that.status != null && that.status != 0) {
        params.append("status", that.status);
      }
      if (that.creatDate!=null && that.creatDate!=""){debugger
        params.append("startDate",new Date(that.creatDate[0]._d).getTime());
        params.append("endDate",  new Date(that.creatDate[1]._d).getTime());
      }
        this.$axios.post("/backstage/feedback/getFeedbackList", params).then(
          res => {
            that.data = res.data.datas.list;
            that.count = res.data.datas.count;
            for (var i = 0; i < that.data.length; i++) {
              if (that.data[i].status == 1) {
                that.data[i].status = "待回复";
              } else if (that.data[i].status == 2) {
                that.data[i].status = "已回复";
              } else if (that.data[i].status == 3) {
                that.data[i].status = "已删除";
              }
              that.getPicList(that.data[i].id);
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    //回复意见
    clickEidt(item) {
      this.visible = true;
      this.recordId = item.id;
      this.userId=item.userId;
    }
  }
};
</script>