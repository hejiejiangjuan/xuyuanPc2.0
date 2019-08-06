<template>
  <div>
    <a-tabs
      defaultActiveKey="1"
      tabPosition="left"
      :style="{ height: '800px'}"
      @nextClick="callback"
    >
      <a-tab-pane tab="心愿卡套餐" key="1">
        <div>
          <a-button type="primary" @click="addCombo">添加套餐</a-button>
          <a-modal :title="title" v-model="visible" @ok="handleOk" cancelText="取消" okText="确认">
            <p>套餐名：</p>
            <a-input placeholder="套餐名" v-model="comboName" />
            <br />
            <br />
            <p>心愿卡数量：</p>
            <a-input placeholder="心愿卡数量" v-model="wishcardNum" />
            <br />
            <br />
            <p>原价格：</p>
            <a-input placeholder="原价格" v-model="originalPrice" />
            <br />
            <br />
            <p>现价格：</p>
            <a-input placeholder="现价格" v-model="price" />
            <br />
            <br />是否上架：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a-radio-group name="radioGroup" v-model="status">
              <a-radio value="1">上架</a-radio>
              <a-radio value="2">下架</a-radio>
            </a-radio-group>
            <br />
            <br />
            <p>说明：</p>
            <a-textarea placeholder="套餐说明" :autosize="{ minRows: 4, maxRows: 6 }" v-model="remark" />
          </a-modal>
        </div>
        <br />
        <a-table bordered :dataSource="cardDate" :rowKey="record => record.id" :columns="cardColums" :pagination="false">
          <template slot="operation" slot-scope="text, record">
            <a href="javascript:;" style="float: left;" @click="clickEidt(record)">编辑</a>
            <div v-if="record.status=='1'" style="float: left;margin-left: 40px;">
              <a-popconfirm
                title="确认是否要停用?"
                cancelText="取消"
                okText="确认"
                @confirm="() => updateStatus(record,2)"
              >
                <a href="javascript:;">下架</a>
              </a-popconfirm>
            </div>
            <div v-else style="float: left;margin-left: 40px;">
              <a-popconfirm
                title="确认是否要上架?"
                cancelText="取消"
                okText="确认"
                @confirm="() => updateStatus(record,1)"
              >
                <a href="javascript:;">上架</a>
              </a-popconfirm>
            </div>
            <div style="float: left;margin-left: 40px;">
              <a-popconfirm
                title="确认是否要删除?"
                cancelText="取消"
                okText="确认"
                @confirm="() =>updateStatus(record,3)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="上首页套餐" key="2">
        <div>
          <a-button type="primary" @click="addHomeCombo">添加套餐</a-button>
          <a-modal
            :title="title"
            v-model="homeCombo"
            @ok="updateHomeCombo"
            cancelText="取消"
            okText="确认"
          >
            <p>套餐名：</p>
            <a-input placeholder="套餐名" v-model="comboName" />
            <br />
            <br />套餐类型：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a-radio-group name="radioGroup" v-model="type">
              <a-radio value="1">活动</a-radio>
              <a-radio value="2">心愿</a-radio>
            </a-radio-group>
            <br />
            <br />
            <p>上架天数：</p>
            <a-input placeholder="上架天数" v-model="days" />
            <br />
            <br />
            <p>原价格：</p>
            <a-input placeholder="原价格" v-model="originalPrice" />
            <br />
            <br />
            <p>现价格：</p>
            <a-input placeholder="现价格" v-model="price" />
            <br />
            <br />是否上架：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a-radio-group name="radioGroup" v-model="status">
              <a-radio value="1">上架</a-radio>
              <a-radio value="2">下架</a-radio>
            </a-radio-group>
            <br />
            <br />
            <p>说明：</p>
            <a-textarea placeholder="套餐说明" :autosize="{ minRows: 4, maxRows: 6 }" v-model="remark" />
          </a-modal>
        </div>
        <br />
        <a-table bordered :dataSource="homeDate" :rowKey="record => record.id" :columns="homeColums" :pagination="false">
          <template slot="operation" slot-scope="text, record">
            <a href="javascript:;" style="float: left;" @click="eidtHomeCombo(record)">编辑</a>
            <div v-if="record.status=='1'" style="float: left;margin-left: 40px;">
              <a-popconfirm
                title="确认是否要停用?"
                cancelText="取消"
                okText="确认"
                @confirm="() => uodateHomeComboStatus(record,2)"
              >
                <a href="javascript:;">下架</a>
              </a-popconfirm>
            </div>
            <div v-else style="float: left;margin-left: 40px;">
              <a-popconfirm
                title="确认是否要上架?"
                cancelText="取消"
                okText="确认"
                @confirm="() => uodateHomeComboStatus(record,1)"
              >
                <a href="javascript:;">上架</a>
              </a-popconfirm>
            </div>
            <div style="float: left;margin-left: 40px;">
              <a-popconfirm
                title="确认是否要删除?"
                cancelText="取消"
                okText="确认"
                @confirm="() =>uodateHomeComboStatus(record,3)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="活动高级版" key="3">
        <div>
          <a-button type="primary" @click="addLeadCombo">添加套餐</a-button>
          <a-modal
            :title="title"
            v-model="leadCombo"
            @ok="updateleadCombo"
            cancelText="取消"
            okText="确认"
          >
            <p>套餐名：</p>
            <a-input placeholder="套餐名" v-model="comboName" />
            <br />
            <br />
            <p>发布次数：</p>
            <a-input placeholder="发布次数" v-model="times" />
            <br />
            <br />
            <p>原价格：</p>
            <a-input placeholder="原价格" v-model="originalPrice" />
            <br />
            <br />
            <p>现价格：</p>
            <a-input placeholder="现价格" v-model="price" />
            <br />
            <br />是否上架：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <a-radio-group name="radioGroup" v-model="status">
              <a-radio value="1">上架</a-radio>
              <a-radio value="2">下架</a-radio>
            </a-radio-group>
            <br />
            <br />
            <p>说明：</p>
            <a-textarea placeholder="套餐说明" :autosize="{ minRows: 4, maxRows: 6 }" v-model="remark" />
          </a-modal>
        </div>
        <br />
        <a-table bordered :dataSource="leadDate" :rowKey="record => record.id" :columns="leadColums" :pagination="false">
          <template slot="operation" slot-scope="text, record">
            <a href="javascript:;" style="float: left;" @click="enditLeadCombo(record)">编辑</a>
            <div v-if="record.status=='1'" style="float: left;margin-left: 40px;">
              <a-popconfirm
                title="确认是否要停用?"
                cancelText="取消"
                okText="确认"
                @confirm="() => updateLeadComboStatus(record,2)"
              >
                <a href="javascript:;">下架</a>
              </a-popconfirm>
            </div>
            <div v-else style="float: left;margin-left: 40px;">
              <a-popconfirm
                title="确认是否要上架?"
                cancelText="取消"
                okText="确认"
                @confirm="() => updateLeadComboStatus(record,1)"
              >
                <a href="javascript:;">上架</a>
              </a-popconfirm>
            </div>
            <div style="float: left;margin-left: 40px;">
              <a-popconfirm
                title="确认是否要删除?"
                cancelText="取消"
                okText="确认"
                @confirm="() =>updateLeadComboStatus(record,3)"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </div>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane tab="活动高级版群益设置" key="4">
        <div>
          权益名称：
          <a-input placeholder="权益名称" style="width:20%" v-model="inviolableName" />是否享有：
          <a-radio-group name="phoneStatus" :defaultValue="0" v-model="inviolableStatus">
            <a-radio value="1">是</a-radio>
            <a-radio value="0">否</a-radio>
          </a-radio-group>
          <a-button type="primary" @click="addInviolable">添加</a-button>
        </div>
        <div>
          <div style="margin-left:10%;width:40%;margin-top:3%">
            <a-table bordered :dataSource="openDate" :rowKey="record => record.id" :columns="openColumns" :pagination="false">
            <template slot="operation" slot-scope="text, record">
              <a-switch
                checkedChildren="开"
                unCheckedChildren="关"
                :defaultChecked="record.default"
                @change="updateInviolable(record)"
              />
            </template>
          </a-table>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      openDate: [],
      openColumns: [
        {
          title: "权益名称",
          dataIndex: "inviolableName"
        },
        {
          title: "是否启用",
          dataIndex: "inviolableStatus"
        },
        {
          title: "操作",
          dataIndex: "operation",
          width: "20%",
          scopedSlots: { customRender: "operation" }
        }
      ],
      inviolableStatus: "1",
      inviolableName: "",
      visible: false,
      homeCombo: false,
      leadCombo: false,
      comboName: "",
      wishcardNum: "",
      price: "",
      originalPrice: "",
      remark: "",
      status: "1",
      comboId: "",
      days: "",
      type: "1",
      times: "",
      title: "新增套餐",
      cardDate: [],
      cardColums: [
        {
          title: "套餐名称",
          dataIndex: "comboName"
        },
        {
          title: "心愿卡数量(张)",
          dataIndex: "wishcardNum"
        },
        {
          title: "原价格(元)",
          dataIndex: "originalPriceString"
        },
        {
          title: "现价格(元)",
          dataIndex: "priceString"
        },
        {
          title: "说明",
          dataIndex: "remark"
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
      ],
      homeDate: [],
      homeColums: [
        {
          title: "套餐名称",
          dataIndex: "comboName"
        },
        {
          title: "指定天数",
          dataIndex: "days"
        },
        {
          title: "首页类型",
          dataIndex: "homeTypeName"
        },
        {
          title: "原价格(元)",
          dataIndex: "originalPriceString"
        },
        {
          title: "现价格(元)",
          dataIndex: "priceString"
        },
        {
          title: "说明",
          dataIndex: "remark"
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
      ],
      leadDate: [],
      leadColums: [
        {
          title: "套餐名称",
          dataIndex: "comboName"
        },
        {
          title: "次数",
          dataIndex: "times"
        },
        {
          title: "原价格(元)",
          dataIndex: "originalPriceString"
        },
        {
          title: "现价格(元)",
          dataIndex: "priceString"
        },
        {
          title: "说明",
          dataIndex: "remark"
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
    //获取心愿卡心愿套餐列表
    this.getCardList();
    //获取上首页套餐列表
    this.gethomeComboList();
    //获取高级版活动套餐
    this.getleadComboList();
    //添加权益
    this.getInviolableList();
  },
  methods: {
    //添加权益
    addInviolable(){
      var that = this;
      var params = new URLSearchParams();
      if(that.inviolableName == null || that.inviolableName==""){
        that.$message.error("请填写权益名称");
        return ;
      }
      let inviolable=JSON.stringify({
        inviolableStatus:'1',
        inviolableName:that.inviolableName
      });
      params.append("params", inviolable);
      this.$axios.post("/backstage/inviolable/addInviolable", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
            that.inviolableName="";
            that.inviolableStatus="1";
          } else {
            that.$message.error(res.data.message);
          }
          that.getInviolableList();
        },
        err => {
          console.log(err);
        }
      );
    },
    //查询权益列表
    getInviolableList(){
      var that = this;
      this.$axios.post("/backstage/inviolable/getInviolableList").then(
        res => {
          that.openDate = res.data.datas;
          for (var i = 0; i < that.openDate.length; i++) {
            if (that.openDate[i].inviolableStatus == "开") {
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
    //修改权益状态
    updateInviolable(item){
      var that = this;
      var params = new URLSearchParams();
      var status = "";
      if (item.inviolableStatus == "开") {
        status = 2;
      } else {
        status = 1;
      }
      let inviolable=JSON.stringify({
        inviolableStatus:status,
        id:item.id
      });
      params.append("params", inviolable);
      this.$axios.post("/backstage/inviolable/updateInviolable", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
          that.getInviolableList();
        },
        err => {
          console.log(err);
        }
      );
    },
    //点击高级版活动套餐添加
    addLeadCombo() {
      this.comboName = "";
      this.times = "";
      this.price = "";
      this.originalPrice = "";
      this.remark = "";
      this.status = "1";
      this.comboId = "";
      this.title = "新增高级版活动套餐";
      this.leadCombo = true;
    },
    //上架或下架或删除高级版活动套餐
    updateLeadComboStatus(item, status) {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", item.id);
      params.append("status", status);
      this.$axios.post("/backstage/leadCombo/updateStatus", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
          that.getleadComboList();
        },
        err => {
          console.log(err);
        }
      );
    },
    //点击高级版活动套餐编辑
    enditLeadCombo(item) {
      this.leadCombo = true;
      this.title = "编辑高级版活动套餐";
      this.comboName = item.comboName;
      this.times = item.times;
      this.price = item.priceString;
      this.originalPrice = item.originalPriceString;
      this.remark = item.remark;
      this.status = item.status;
      this.comboId = item.id;
    },
    //点击添加或修改高级版活动套餐
    updateleadCombo() {
      var that = this;
      var params = new URLSearchParams();
      let cardInfo = JSON.stringify({
        comboName: that.comboName,
        times: that.times,
        priceString: that.price,
        originalPriceString: that.originalPrice,
        remark: that.remark,
        status: that.status,
        id: that.comboId
      });
      params.append("param", cardInfo);
      this.$axios.post("/backstage/leadCombo/updateleadCombo", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
          this.comboName = "";
          this.times = "";
          this.price = "";
          this.originalPrice = "";
          this.remark = "";
          this.status = "";
          this.comboId = "";
          that.getleadComboList();
          that.leadCombo = false;
        },
        err => {
          console.log(err);
        }
      );
    },
    //获取高级版活动套餐
    getleadComboList() {
      var that = this;
      this.$axios.post("/backstage/leadCombo/getleadComboList").then(
        res => {
          that.leadDate = res.data.datas;
          for (var i = 0; i < that.leadDate.length; i++) {
            if (that.leadDate[i].status == "1") {
              that.leadDate[i].statusName = "已上架";
            } else {
              that.leadDate[i].statusName = "已下架";
            }
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //获取上首页套餐列表
    gethomeComboList() {
      var that = this;
      this.$axios.post("/backstage/homeCombo/gethomeComboList").then(
        res => {
          that.homeDate = res.data.datas;
          for (var i = 0; i < that.homeDate.length; i++) {
            if (that.homeDate[i].status == "1") {
              that.homeDate[i].statusName = "已上架";
            } else {
              that.homeDate[i].statusName = "已下架";
            }
            if (that.homeDate[i].homeType == "1") {
              that.homeDate[i].homeTypeName = "活动";
            } else {
              that.homeDate[i].homeTypeName = "心愿";
            }
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //添加或修改上首页套餐
    updateHomeCombo() {
      this.homeCombo = false;
      var that = this;
      var params = new URLSearchParams();
      let cardInfo = JSON.stringify({
        comboName: that.comboName,
        days: that.days,
        homeType: that.type,
        priceString: that.price,
        originalPriceString: that.originalPrice,
        remark: that.remark,
        status: that.status,
        id: that.comboId
      });
      params.append("param", cardInfo);
      this.$axios.post("/backstage/homeCombo/updatehomeCombo", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
          that.comboName = "";
          that.wishcardNum = "";
          that.price = "";
          that.originalPrice = "";
          that.remark = "";
          that.type = "";
          that.days = "";
          that.status = "";
          that.comboId = "";
          that.gethomeComboList();
          that.homeCombo = false;
        },
        err => {
          console.log(err);
        }
      );
    },
    //上首页套餐点击编辑
    eidtHomeCombo(item) {
      debugger;
      this.homeCombo = true;
      this.title = "编辑上首页套餐";
      this.comboName = item.comboName;
      this.days = item.days;
      this.price = item.priceString;
      this.originalPrice = item.originalPriceString;
      this.remark = item.remark;
      this.type = item.homeType;
      this.status = item.status;
      this.comboId = item.id;
    },
    //上架或下架或删除上首页套餐
    uodateHomeComboStatus(item, status) {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", item.id);
      params.append("status", status);
      this.$axios.post("/backstage/homeCombo/updateStatus", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
          that.gethomeComboList();
        },
        err => {
          console.log(err);
        }
      );
    },
    //点击添加上首页套餐按钮
    addHomeCombo() {
      this.homeCombo = true;
      this.title = "新增上首页套餐";
      this.comboName = "";
      this.days = "";
      this.price = "";
      this.originalPrice = "";
      this.remark = "";
      this.type = "1";
      this.status = "1";
    },
    //添加心愿卡套餐
    addCombo() {
      this.comboName = "";
      this.wishcardNum = "";
      this.price = "";
      this.originalPrice = "";
      this.remark = "";
      this.status = "1";
      this.comboId = "";
      this.title = "新增套餐";
      this.visible = true;
    },
    //添加或修改心愿卡套餐弹窗确认按钮
    handleOk(e) {
      var that = this;
      var params = new URLSearchParams();
      let cardInfo = JSON.stringify({
        comboName: that.comboName,
        wishcardNum: that.wishcardNum,
        priceString: that.price,
        originalPriceString: that.originalPrice,
        remark: that.remark,
        status: that.status,
        id: that.comboId
      });
      params.append("params", cardInfo);
      this.$axios.post("/backstage/wishCard/updateCombo", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
          this.comboName = "";
          this.wishcardNum = "";
          this.price = "";
          this.originalPrice = "";
          this.remark = "";
          this.status = "";
          this.comboId = "";
          that.getCardList();
          that.visible = false;
        },
        err => {
          console.log(err);
        }
      );
    },
    //心愿卡套餐编辑
    clickEidt(item) {
      this.visible = true;
      this.title = "编辑套餐";
      this.comboName = item.comboName;
      this.wishcardNum = item.wishcardNum;
      this.price = item.priceString;
      this.originalPrice = item.originalPriceString;
      this.remark = item.remark;
      this.status = item.status;
      this.comboId = item.id;
    },
    //上架或下架或删除心愿卡套餐
    updateStatus(item, status) {
      var that = this;
      var params = new URLSearchParams();
      params.append("id", item.id);
      params.append("status", status);
      this.$axios.post("/backstage/wishCard/updateStatus", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
          } else {
            that.$message.error(res.data.message);
          }
          that.getCardList();
        },
        err => {
          console.log(err);
        }
      );
    },
    //获取心愿卡套餐列表
    getCardList() {
      var that = this;
      this.$axios.post("/backstage/wishCard/getList").then(
        res => {
          that.cardDate = res.data.datas;
          for (var i = 0; i < that.cardDate.length; i++) {
            if (that.cardDate[i].status == "1") {
              that.cardDate[i].statusName = "已上架";
            } else {
              that.cardDate[i].statusName = "已下架";
            }
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //tab页切换
    callback(val) {
      console.log(val);
    }
  }
};
</script>
<style>
</style>

