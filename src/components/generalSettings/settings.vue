<template>
  <div>
    <a-tabs
      :defaultActiveKey="defaultKey"
      tabPosition="left"
      :style="{ height: '800px'}"
      @nextClick="callback"
    >
      <a-tab-pane tab="心愿卡设置" key="1">
        <div style="width:50%">
          <a-input placeholder="最小金额" v-model="minPayment" style="width:20%" />
          <a-input placeholder="最大金额" v-model="maxPayment" style="width:20%" />
          <a-input placeholder="心愿卡数量" v-model="wishCardNum" style="width:20%" />
          <a-input placeholder="实现金额" v-model="realizationNum" style="width:20%" />
          <a-button type="primary" @click="addWishCard" v-if="id ==''">添加</a-button>
          <a-button type="primary" @click="updateWishCard" v-else>修改</a-button>
          <br/>
          <br/>
        </div>
        <div>
          <a-table bordered :dataSource="dataSource" :rowKey="record => record.id" :columns="columns" :pagination="false">
            <template slot="operation" slot-scope="text, record">
              <a href="javascript:;" style="float: left;" @click="clickEidt(record)">编辑</a>
              <div v-if="record.status=='正常'" style="float: left;margin-left: 40px;">
                <a-popconfirm
                  v-if="dataSource.length"
                  title="确认是否要停用?"
                  cancelText="取消"
                  okText="确认"
                  @confirm="() => jinyong(record)"
                >
                  <a href="javascript:;">停用</a>
                </a-popconfirm>
              </div>
              <div v-else style="float: left;margin-left: 40px;">
                <a-popconfirm
                  v-if="dataSource.length"
                  title="确认是否要启用?"
                  cancelText="取消"
                  okText="确认"
                  @confirm="() => jinyong(record)"
                >
                  <a href="javascript:;">启用</a>
                </a-popconfirm>
              </div>
            </template>
          </a-table>
        </div>
      </a-tab-pane>
      <a-tab-pane tab="用户积分设置" key="2">
        <a-list itemLayout="horizontal" :dataSource="typeDate">
          <a-list-item slot="renderItem" slot-scope="item">
            <div style="width:50%;margin-left: 100px;margin-top: 30px;">
              <a-input
                placeholder="Basic usage"
                v-model="item.integralName"
                style="width:30%"
                disabled
              />
              <a-input
                placeholder="Basic usage"
                v-model="item.integralNum"
                style="width:30%"
                v-if="item.updateStatus"
              />
              <a-input
                placeholder="Basic usage"
                v-model="item.integralNum"
                style="width:30%"
                disabled
                v-else
              />
              <a-button type="primary" @click="updateType(item)" v-if="item.updateStatus">保存</a-button>
              <a-button type="primary" @click="updateStatus(item)" v-else>修改</a-button>
            </div>
          </a-list-item>
        </a-list>
      </a-tab-pane>
      <a-tab-pane tab="心愿开奖条件设置" key="3">
        <div style="width:50%;margin-left:10%;margin-top:3%">
          <a-table bordered :dataSource="openDate" :rowKey="record => record.id" :columns="openColumns" :pagination="false">
            <template slot="operation" slot-scope="text, record">
              <a-switch
                checkedChildren="开"
                unCheckedChildren="关"
                :defaultChecked="record.default"
                @change="updateOpenStatus(record)"
              />
            </template>
          </a-table>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      defaultKey: "1",
      minPayment: "",
      maxPayment: "",
      wishCardNum: "",
      realizationNum: "",
      id: "",
      typeDate: [],
      dataSource: [],
      openDate: [],
      openColumns: [
        {
          title: "参数名称",
          dataIndex: "conditionsName"
        },
        {
          title: "是否启用",
          dataIndex: "status"
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "20%",
          scopedSlots: { customRender: "operation" }
        }
      ],
      columns: [
        {
          title: "最小金额",
          dataIndex: "minPaymentString",
          scopedSlots: { customRender: "minPaymentString" }
        },
        {
          title: "最大金额",
          dataIndex: "maxPaymentString"
        },
        {
          title: "需要心愿卡",
          dataIndex: "wishCardNum"
        },
        {
          title: "实现金额",
          dataIndex: "realizationNumString"
        },
        {
          title: "是否使用",
          dataIndex: "status"
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
    //进入页面加载
    this.getWishCardList();
    //查询积分类型列表
    this.getTypeList();
    //查询心愿开奖条件列表
    this.getOpenList();
  },
  methods: {
    //查询心愿开奖条件列表
    getOpenList() {
      var that = this;
      this.$axios.post("/backstage/Opening/getList").then(
        res => {
          that.openDate = res.data.datas;
          for (var i = 0; i < that.openDate.length; i++) {
            if (that.openDate[i].status == "开") {
              that.openDate[i].default = true;
            } else {
              that.openDate[i].default = false;
            }
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //修改开奖条件
    updateOpenStatus(item) {
      var that = this;
      var params = new URLSearchParams();
      var status = "";
      if (item.status == "开") {
        status = 2;
      } else {
        status = 1;
      }
      params.append("id", item.id);
      params.append("status", status);
      this.$axios.post("/backstage/Opening/updateStatus", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
          that.getOpenList();
        },
        err => {
          console.log(err);
        }
      );
    },
    //编辑状态
    updateStatus(item) {
      item.updateStatus = true;
      this.$forceUpdate();
    },
    //修改积分类型分数
    updateType(item) {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", item.id);
      params.append("num", item.integralNum);
      this.$axios.post("/backstage/IntegralRecord/updateType", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
          that.getTypeList();
        },
        err => {
          console.log(err);
        }
      );
    },
    //查询积分类型列表
    getTypeList() {
      var that = this;
      this.$axios.post("/backstage/IntegralRecord/getList").then(
        res => {
          that.typeDate = res.data.datas;
          for (var i = 0; i < that.typeDate.length; i++) {
            that.typeDate[i].updateStatus = false;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //tabs页切换
    callback(val) {
      this.defaultKey = val;
    },
    //删除
    onDelete(key) {
      var that = this;
      this.$axios.post("/backstage/WishPrice/deleteWishPrice").then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
          that.getWishCardList();
        },
        err => {
          console.log(err);
        }
      );
    },
    //禁用OR启用
    jinyong(item) {
      var that = this;
      var status = "";
      if (item.status == "正常") {
        status = 2;
      } else {
        status = 1;
      }
      var params = new URLSearchParams();
      let userInfo = JSON.stringify({
        status: status,
        id: item.id
      });
      params.append("param", userInfo);
      this.$axios.post("/backstage/WishPrice/updateWishPrice", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
          that.getWishCardList();
        },
        err => {
          console.log(err);
        }
      );
    },
    //列表数据
    getWishCardList() {
      var that = this;
      this.$axios.post("/backstage/WishPrice/getWishPriceList").then(
        res => {
          that.dataSource = res.data.datas;
        },
        err => {
          console.log(err);
        }
      );
    },
    //新增数据
    addWishCard() {
      var that = this;
      var params = new URLSearchParams();
      var number=/^\d+$/;
      if(!number.test(that.minPayment)){
        that.$message.error("最小金额只能输入整数");
         return ;
      }
      if(!number.test(that.maxPayment)){
        that.$message.error("最大金额只能输入整数");
         return ;
      }
      if(that.wishCardNum == null || that.wishCardNum ==""){
       that.wishCardNum=0;
      }
      let userInfo = JSON.stringify({
        minPaymentString: that.minPayment,
        maxPaymentString: that.maxPayment,
        wishCardNum: that.wishCardNum,
        realizationNumString: that.realizationNum
      });
      params.append("param", userInfo);
      this.$axios.post("/backstage/WishPrice/addWishPrice", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
          that.minPayment = "";
          that.maxPayment = "";
          that.wishCardNum = "";
          that.realizationNum = "";
          that.getWishCardList();
        },
        err => {
          console.log(err);
        }
      );
    },
    //修改
    updateWishCard() {
      var that = this;
      var params = new URLSearchParams();
      let userInfo = JSON.stringify({
        minPaymentString: that.minPayment,
        maxPaymentString: that.maxPayment,
        wishCardNum: that.wishCardNum,
        realizationNumString: that.realizationNum,
        id: that.id
      });
      params.append("param", userInfo);
      this.$axios.post("/backstage/WishPrice/updateWishPrice", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
          that.minPayment = "";
          that.maxPayment = "";
          that.wishCardNum = "";
          that.realizationNum = "";
          that.id = "";
          that.getWishCardList();
        },
        err => {
          console.log(err);
        }
      );
    },
    //点击编辑按钮
    clickEidt(item) {
      var that = this;
      that.minPayment = item.minPaymentString;
      that.maxPayment = item.maxPaymentString;
      that.wishCardNum = item.wishCardNum;
      that.realizationNum = item.realizationNumString;
      that.id = item.id;
    }
  }
};
</script>
<style>
</style>
