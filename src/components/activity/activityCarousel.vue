<template>
  <div>
    <div></div>
    <a-tabs @change="callback" :animated="false">
      <a-tab-pane tab="已上架" key="1">
        <a-table
          bordered
          :dataSource="leadDate"
          :rowKey="record => record.id"
          :columns="leadColums"
          :pagination="false"
        >
          <template slot="operation" slot-scope="text, record">
            <a style="float: left;" href="javascript:;" @click="activityEdit(record)">编辑</a>
            <div style="float: left;margin-left: 20px;">
              <a-popconfirm
                title="确认是否要下架?"
                cancelText="取消"
                okText="确认"
                @confirm="() => updateActivityCarouselStatus(record,2)"
              >
                <a href="javascript:;">下架</a>
              </a-popconfirm>
            </div>
            <div style="float: left;margin-left: 20px;">
              <a-popconfirm
                title="确认是否要删除?"
                cancelText="取消"
                okText="确认"
                @confirm="() =>updateActivityCarouselStatus(record,3)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </div>
            <a
              href="javascript:;"
              style="float: left;margin-left: 20px;"
              @click="updateActivityCarouselRank(record,1)"
            >上移</a>
            <a
              href="javascript:;"
              style="float: left;margin-left: 20px;"
              @click="updateActivityCarouselRank(record,2)"
            >下移</a>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="已下架" key="2">
        <a-table bordered :dataSource="leadDate" :columns="leadColums" :pagination="false">
          <template slot="operation" slot-scope="text, record">
            <div style="float: left;">
              <a-popconfirm
                title="确认是否要上架?"
                cancelText="取消"
                okText="确认"
                @confirm="() => updateActivityCarouselStatus(record,1)"
              >
                <a href="javascript:;">上架</a>
              </a-popconfirm>
            </div>
            <div style="float: left;margin-left: 40px;">
              <a-popconfirm
                title="确认是否要删除?"
                cancelText="取消"
                okText="确认"
                @confirm="() =>updateActivityCarouselStatus(record,3)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>
    <a-modal title="编辑广告" v-model="visible" @ok="handleOk">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
      key: "1",
      leadDate: [],
      leadColums: [
        {
          title: "上架时间",
          dataIndex: "putawayTime"
        },
        {
          title: "下架时间",
          dataIndex: "outTime"
        },
        {
          title: "跳转类型",
          dataIndex: "jumpTypeName"
        },
        {
          title: "状态",
          dataIndex: "statusName"
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "20%",
          scopedSlots: { customRender: "operation" }
        }
      ]
    };
  },
  mounted: function() {
    this.getActivityCarouselList();
  },
  methods: {
    //点击编辑
    activityEdit(item) {
      this.visible = true;
      var that = this;
      var params = new URLSearchParams();
      params.append("id", item.id);
      this.$axios
        .post("/backstage/activityCarousel/getActivityCarouseById", params)
        .then(
          res => {
           console.log(res.data.datas)
          },
          err => {
            console.log(err);
          }
        );
    },
    //修改
    handleOk() {
      this.visible = false;
    },
    //tab页切换
    callback(key) {
      this.key = key;
      this.getActivityCarouselList();
    },
    //获取广告轮播列表
    getActivityCarouselList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("status", that.key);
      this.$axios
        .post("/backstage/activityCarousel/getActivityCarouselList", params)
        .then(
          res => {
            that.leadDate = res.data.datas;
            for (var i = 0; i < that.leadDate.length; i++) {
              if (that.leadDate[i].status == "1") {
                that.leadDate[i].statusName = "已上架";
              } else {
                that.leadDate[i].statusName = "已下架";
              }
              if (that.leadDate[i].jumpType == "1") {
                that.leadDate[i].jumpTypeName = "活动详情";
              } else if (that.leadDate[i].jumpType == "2") {
                that.leadDate[i].jumpTypeName = "小程序";
              } else if (that.leadDate[i].jumpType == "3") {
                that.leadDate[i].jumpTypeName = "内嵌网页";
              } else if (that.leadDate[i].jumpType == "4") {
                that.leadDate[i].jumpTypeName = "外部链接";
              }
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    //上移或下移
    updateActivityCarouselRank(item, status) {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", item.id);
      params.append("status", status);
      params.append("rank", item.rank);
      this.$axios
        .post("/backstage/activityCarousel/updateActivityCarouselRank", params)
        .then(
          res => {
            if (res.data.code == 200) {
              that.$message.success(res.data.message);
            } else {
              that.$message.error(res.data.message);
            }
            that.getActivityCarouselList();
          },
          err => {
            console.log(err);
          }
        );
    },
    //上架或下架或删除
    updateActivityCarouselStatus(item, status) {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", item.id);
      params.append("status", status);
      this.$axios
        .post(
          "/backstage/activityCarousel/updateActivityCarouselStatus",
          params
        )
        .then(
          res => {
            if (res.data.code == 200) {
              that.$message.success(res.data.message);
            } else {
              that.$message.error(res.data.message);
            }
            that.getActivityCarouselList();
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
