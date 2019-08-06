<template>
  <a-tabs defaultActiveKey="1" @change="callback" :animated="false">
    <a-tab-pane tab="上架" key="1">
      <div>
        <a-select v-model="suspend" style="width:15%">
          <a-select-option value="2">是否暂停</a-select-option>
          <a-select-option value="1">正常</a-select-option>
          <a-select-option value="0">暂停</a-select-option>
        </a-select>
        <!-- <a-select v-model="source" style="width:15%">
          <a-select-option value="0">选择活动来源</a-select-option>
          <a-select-option value="1">心海</a-select-option>
          <a-select-option value="2">活动</a-select-option>
        </a-select> -->
        <a-button type="primary" @click="getActivityPageList">搜索</a-button>
      </div>
      <br>
      <a-table :columns="columns" :rowKey="record => record.id" :dataSource="data" bordered :pagination="false">
        <template
          v-for="col in ['活动名称', '广告栏位', '广告上架时间','广告下架时间', '显示状态', '上架状态', '广告来源']"
          :slot="col"
        ></template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a-popconfirm
                title="是否要暂停显示此广告"
                @confirm="confirm"
                @cancel="cancel"
                okText="是"
                cancelText="否"
                v-if="record.showStatus=='正常'"
              >
                <a @click="setActivity(record,0,2)">暂停显示</a>
              </a-popconfirm>
              <a-popconfirm
                title="是否要显示此广告"
                @confirm="confirm"
                @cancel="cancel"
                okText="是"
                cancelText="否"
                v-if="record.showStatus!='正常'"
              >
                <a @click="setActivity(record,1,2)">显示</a>
              </a-popconfirm>
              <a-popconfirm
                title="是否要下架此广告"
                @confirm="confirm"
                @cancel="cancel"
                okText="是"
                cancelText="否"
              >
                <a @click="setActivity(record,0,1)">下架</a>
              </a-popconfirm>
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
    <a-tab-pane tab="下架" key="0" forceRender>
      <div>
        <!-- <a-select v-model="source" style="width:15%">
          <a-select-option value="0">选择活动来源</a-select-option>
          <a-select-option value="1">心海</a-select-option>
          <a-select-option value="2">活动</a-select-option>
        </a-select> 
        <a-button type="primary" @click="getActivityPageList">搜索</a-button>-->
      </div>
      <br>
      <a-table :columns="columns" :dataSource="data" bordered :pagination="false">
        <template
          v-for="col in ['活动名称', '广告栏位', '广告上架时间','广告下架时间', '显示状态', '上架状态', '广告来源']"
          :slot="col"
        ></template>
        <template slot="operation" slot-scope="text, record">
          <div class="editable-row-operations">
            <span>
              <a-popconfirm
                title="是否要上架此广告"
                @confirm="confirm"
                @cancel="cancel"
                okText="是"
                cancelText="否"
              >
                <a @click="setActivity(record,1,1)">上架</a>
              </a-popconfirm>
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
</template>
<script>
const columns = [
  {
    title: "活动名称",
    dataIndex: "activityDetil",
    width: "10%",
    scopedSlots: { customRender: "activityDetil" }
  },
  {
    title: "广告栏位",
    dataIndex: "activitySite",
    width: "10%",
    scopedSlots: { customRender: "activitySite" }
  },
  {
    title: "广告上架时间",
    dataIndex: "beginTime",
    width: "20%",
    scopedSlots: { customRender: "beginTime" }
  },
  {
    title: "广告下架时间",
    dataIndex: "endTime",
    width: "20%",
    scopedSlots: { customRender: "endTime" }
  },
  {
    title: "显示状态",
    dataIndex: "showStatus",
    width: "10%",
    scopedSlots: { customRender: "showStatus" }
  },
  {
    title: "上架状态",
    dataIndex: "stauts",
    width: "10%",
    scopedSlots: { customRender: "stauts" }
  },
  {
    title: "广告来源",
    dataIndex: "position",
    width: "10%",
    scopedSlots: { customRender: "position" }
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" }
  }
];
const data = [];
for (let i = 0; i < data.length; i++) {
  data.push({
    key: data[i].id,
    activityDetil: data[i].activityDetil,
    activitySite: data[i].activitySite,
    beginTime: data[i].beginTime,
    endTime: data[i].endTime,
    showStatus: data[i].showStatus,
    stauts: data[i].stauts,
    position: data[i].position
  });
}
export default {
  data() {
    this.cacheData = data.map(item => ({ ...item }));
    return {
      data,
      columns,
      userStatus: 1,
      pageNum: 1,
      count: 0,
      pageSize: 10,
      activityId: "",
      activityStatus: "",
      activityShowStatus: "",
      lowerTime: "",
      activityName: "",
      suspend: "2",
      source: "0",
      huodongId:""
    };
  },
  //进入页面默认加载
  mounted: function() {
    this.getActivityList();
  },
  methods: {
    //同意修改用户状态
    confirm(e) {
      this.updateActivityStatus(
        this.activityId,
        this.activityStatus,
        this.activityShowStatus,
        this.lowerTime
      );
    },
    //取消
    cancel(e) {
      this.$message.error("取消成功");
    },
    //分页查询
    onShowSizeChange(pageNum, pageSize) {
      this.pageNum = pageNum;
      this.getActivityList();
    },
    //Tab页切换
    callback(key) {
      this.userStatus = key;
      this.getActivityList();
    },
    //记录要修改的广告信息
    setActivity(id, status, type) {
      this.huodongId=id.activityId;
      this.activityId = id.id;
      this.lowerTime = id.endTime;
      this.activityStatus = status;
      this.activityShowStatus = type;
    },
    //修改广告状态
    updateActivityStatus(id, status, type, endTime) {
      var that = this;
      var params = new URLSearchParams();
      if (type == 1) {
        //上架或下架
        params.append("status", status);
        params.append("endTime", endTime);
        params.append("activityId",this.huodongId)
      } else {
        //暂停或显示
        params.append("showStatus", status);
      }
      params.append("id", id);
      this.$axios
        .post("/backstage/activityAd/updateStatus", params)
        .then(
          res => {
            if (res.data.code == 200) {
              that.$message.success(res.data.message);
            } else {
              that.$message.error(res.data.message);
            }
            this.getActivityList();
          },
          err => {
            console.log(err);
          }
        );
    },
    //条件查询
    getActivityPageList(){
      this.pageNum=1;
      this.getActivityList();
    },
    //获取列表数据
    getActivityList() {
      var that = this;
      var params = new URLSearchParams();
      params.append("pageNum", this.pageNum);
      params.append("pageSize", this.pageSize);
      params.append("status", this.userStatus);
      if(this.suspend != 2 || this.suspend != '2'){
        params.append("showStatus", this.suspend);
      }
      if(this.source !=0 || this.source != '0'){
        params.append("showPosition", this.source);
      }
      this.$axios
        .post("/backstage/activityAd/getActivityAdList", params)
        .then(
          res => {
            that.count = res.data.datas.count;
            that.data = res.data.datas.ActivityAdList;
            for(var i=0;i<that.data.length;i++){
              that.data[i].activitySite="广告栏"+that.data[i].activitySite;
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
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
