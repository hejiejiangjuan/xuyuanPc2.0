<template>
  <div>
    <a-tabs defaultActiveKey="1" @change="callback" :animated="false">
      <a-tab-pane tab="活动" key="1">
        <br>
        <a-table :columns="columns" :rowKey="record => record.id" :dataSource="data" bordered :pagination="false">
          <template v-for="col in ['用户昵称','举报对象','对象名称', '举报内容', '举报时间','举报类型','当前状态']" :slot="col"></template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span >
                  <a @click="info(record)">查看详情</a>
                  <span v-if="record.status!='上架'">
                  <a-popconfirm
                    title="确认要将此活动回复正常?"
                    @confirm="confirm"
                    @cancel="cancel"
                    okText="是"
                    cancelText="否"
                  >
                  <a @click="setUserRecord(record,1)">恢复正常</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a-popconfirm
                    title="确认要将此活动下架?"
                    @confirm="confirm"
                    @cancel="cancel"
                    okText="是"
                    cancelText="否"
                  >
                    <a @click="setUserRecord(record,2)">下架</a>
                  </a-popconfirm>
                  <a-popconfirm
                    title="确认要删除此活动?"
                    @confirm="confirm"
                    @cancel="cancel"
                    okText="是"
                    cancelText="否"
                  >
                    <a @click="setUserRecord(record,0)">删除</a>
                  </a-popconfirm>
                  <a-popconfirm
                    title="确认要将此活动加入黑名单?"
                    @confirm="confirm"
                    @cancel="cancel"
                    okText="是"
                    cancelText="否"
                  >
                    <a @click="setUserRecord(record,3)">加入黑名单</a>
                  </a-popconfirm>
                </span>
              </span>
            </div>
          </template>
        </a-table>
        <br>
        <div>
          <a-pagination
            :total="count"
            :pageSize="pageSize"
            :current="pageNum"
            @change="onShowSizeChange"
          />
        </div>
        <a-modal
      title="活动详情"
      class="modal-sx"
      cancelText="取消"
      okText="确定"
      v-model="activeCook"
      @ok="handleOk"
    >
      <div class="modal-list" v-if="detailInfo != ''">
        <div v-for="item in detailInfo" :key="item.id">
          <div class="huodongcenter" v-if="item.type == 0">{{item.info}}</div>
          <div class="huodongcenter" v-if="item.type == 1">
            <img :src="item.info" alt />
          </div>
        </div>
      </div>
      <div v-else style="width:100%;text-align: center;">未添加活动详情！</div>
    </a-modal>
      </a-tab-pane>
      <a-tab-pane tab="心愿" key="2" forceRender>
        <br>
        <a-table :columns="columns" :dataSource="data" bordered :pagination="false" :rowKey="record => record.id">
          <template v-for="col in ['用户昵称','举报对象','对象名称', '举报内容', '举报时间','举报类型','当前状态']" :slot="col"></template>
          <template slot="operation" slot-scope="text, record">
            <div class="editable-row-operations">
              <span>
                  <a >查看详情</a>
                <span v-if="record.status!='上架'">
                  <a-popconfirm
                    title="确认要将此用户回复正常?"
                    @confirm="confirm"
                    @cancel="cancel"
                    okText="是"
                    cancelText="否"
                  >
                  <a @click="setUserRecord(record,1)">恢复正常</a>
                  </a-popconfirm>
                </span>
                <span v-else>
                  <a-popconfirm
                    title="确认要将此用户加入黑名单?"
                    @confirm="confirm"
                    @cancel="cancel"
                    okText="是"
                    cancelText="否"
                  >
                    <a @click="setUserRecord(record,2)">下架</a>
                  </a-popconfirm>
                  <a-popconfirm
                    title="确认要删除此用户?"
                    @confirm="confirm"
                    @cancel="cancel"
                    okText="是"
                    cancelText="否"
                  >
                    <a @click="setUserRecord(record,0)">删除</a>
                  </a-popconfirm>
                  <a-popconfirm
                    title="确认要禁用此用户?"
                    @confirm="confirm"
                    @cancel="cancel"
                    okText="是"
                    cancelText="否"
                  >
                    <a @click="setUserRecord(record,3)">加入黑名单</a>
                  </a-popconfirm>
                </span>
              </span>
            </div>
          </template>
        </a-table>
        <br>
        <div>
          <a-pagination
            :total="count"
            :pageSize="pageSize"
            :current="pageNum"
            @change="onShowSizeChange"
          />
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
const columns = [
  {
    title: "用户昵称",
    dataIndex: "nickName",
    width: "8%",
    scopedSlots: { customRender: "nickName" }
  },
  {
    title: "类型",
    dataIndex: "type",
    width: "3%",
    scopedSlots: { customRender: "type" }
  },
  {
    title: "名称",
    dataIndex: "activityTheme",
    width: "6%",
    scopedSlots: { customRender: "activityTheme" }
  },
  {
    title: "举报内容",
    dataIndex: "content",
    width: "10%",
    scopedSlots: { customRender: "content" }
  },
  {
    title: "举报时间",
    dataIndex: "date",
    width: "8%",
    scopedSlots: { customRender: "date" }
  },
  {
    title: "举报类型",
    dataIndex: "name",
    width: "5%",
    scopedSlots: { customRender: "name" }
  },
  {
    title: "当前状态",
    dataIndex: "status",
    width: "5%",
    scopedSlots: { customRender: "status" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: "10%",
    scopedSlots: { customRender: "operation" }
  }
];

const data = [];
for (let i = 0; i < data.length; i++) {
  data.push({
    key: data[i].id,
    nickName: data[i].nickName,
    type: data[i].type,
    activityTheme: data[i].activityTheme,
    content: data[i].content,
    date: data[i].date,
    name: data[i].name,
    status: data[i].status,
    objectId: data[i].objectId
  });
}
export default {
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      data,
      columns,
      pageNum: 1,
      count: 0,
      pageSize: 10,
      userName: "",
      status: "",
      userStatus: 1,
      userRecord: {},
      detailInfo: [],
      activeCook:false
    };
  },
  mounted: function() {
    this.getWxUserList();
  },
  methods: {
    //确定
    handleOk(e) {
      this.activeCook = false;
    },
    //查看活动详情
    info(record) {
      var wishContent = [];
      var params = new URLSearchParams();
      params.append("id", record.id);
      this.$axios
        .post("/backstage/activityDetil/getActivityDetilInfo", params)
        .then(
          res => {
            this.detailInfo = this.restoreNewLine(
              JSON.parse(res.data.datas.introduce.detailContent)
            );
            this.activeCook = true;
          },
          err => {
            console.log(err);
          }
        );
    },
    //解析活动详情
    restoreNewLine(content) {
      if (content != "" && content > 0) {
        for (var i in content) {
          var obj = content[i];
          if (obj.type == 0) {
            obj.info = obj.info.join("&hc").split("<br>");
            content[i] = obj;
          }
        }
      }
      return content;
    },
    //Tab页切换
    callback(key) {
      this.userStatus = key;
      this.getWxUserList();
    },
    //同意修改用户状态
    confirm(e) {
      this.prohibitUser(this.userRecord);
    },
    //取消
    cancel(e) {
      this.$message.error("取消成功");
    },
    //记录要修改用户的属性
    setUserRecord(record, status) {
      this.status = status;
      this.userRecord = record;
    },
    //修改用户状态
    prohibitUser(record) {
      var that = this;
      var params = new URLSearchParams();
      var type = "";
      if (this.status == 0) {
        type = "删除";
      } else if (this.status == 2) {
        type = "下架";
      } else if (this.status == 3) {
        type = "加入黑名单";
      } else {
        type = "恢复正常";
      }
      params.append("id", record.objectId);
      params.append("status", this.status);
      params.append("type", this.userStatus);
      params.append("userId", record.userId);
      params.append("activityName", record.activityTheme);
      this.$axios
        .post("/backstage/rePort/updateStatus", params)
        .then(
          res => {
            if (res.data.code == 200) {
              that.$message.success(type + res.data.message);
              that.getWxUserList();
            } else {
              that.$message.error(type + res.data.message);
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    //获取列表
    getWxUserList() {
      var that = this;
      var params = new URLSearchParams();
      ;
      params.append("type", this.userStatus);
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      this.$axios
        .post("/backstage/rePort/getRePortList", params)
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
      this.getWxUserList();
    }
  }
};
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
.modal-sx > .ant-modal-content > .ant-modal-body {
  padding: 0 !important;
}
.modal-list {
  width: 100%;
  height: 450px;
  overflow-x: hidden;
}
.huodongcenter {
  padding: 5px 0;
}
.huodongcenter img {
  max-width: 100%;
  max-height: 100%;
}
</style>