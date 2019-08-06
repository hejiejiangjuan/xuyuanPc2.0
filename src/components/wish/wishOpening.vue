<template>
  <div>
    <div>
      <a-input
        placeholder="最低使用心愿卡数量"
        v-model="conditionsDate.wishCardNum"
        v-if="fileNameDate.wishCardNum"
        class="divInput"
      />
      <a-date-picker
        @change="onChange"
        v-if="fileNameDate.creatDate"
        class="divInput"
        placeholder="最早关注时间"
      />
      <a-input
        placeholder="发起心愿的次数"
        v-model="conditionsDate.wishNum"
        v-if="fileNameDate.wishNum"
        class="divInput"
      />
      <a-input
        placeholder="心愿支持人数"
        v-model="conditionsDate.supportNum"
        v-if="fileNameDate.supportNum"
        class="divInput"
      />
      <a-input
        placeholder="实现心愿最小金额"
        v-model="conditionsDate.minPayment"
        v-if="fileNameDate.minPayment"
        class="divInput"
      />
      <a-input
        placeholder="实现心愿最大金额"
        v-model="conditionsDate.maxPayment"
        v-if="fileNameDate.maxPayment"
        class="divInput"
      />
      <a-select
        class="divInput"
        v-model="wishType"
        v-if="fileNameDate.wishType"
        :allowClear="true"
        placeholder="请选择类型"
      >
        <a-select-option v-for="item in typeList" :key="item.id">{{item.wishName}}</a-select-option>
      </a-select>
      <a-select class="divInput" v-model="gender" v-if="fileNameDate.gender">
        <a-select-option value="3">选择用户性别</a-select-option>
        <a-select-option value="0">未知</a-select-option>
        <a-select-option value="1">男</a-select-option>
        <a-select-option value="2">女</a-select-option>
      </a-select>
      <a-select
        class="divInput"
        v-model="provincial"
        v-if="fileNameDate.provincial"
        :allowClear="true"
        placeholder="请选择省份"
        @change="getCity"
      >
        <a-select-option v-for="item in provincialDate" :key="item.id">{{item.provincial}}</a-select-option>
      </a-select>
      <a-select
        class="divInput"
        v-model="city"
        v-if="fileNameDate.city"
        :allowClear="true"
        placeholder="请选择城市"
      >
        <a-select-option v-for="item in cityDate" :key="item.id">{{item.city}}</a-select-option>
      </a-select>
      <a-select class="divInput" v-model="member" v-if="fileNameDate.member">
        <a-select-option value="2">是否会员</a-select-option>
        <a-select-option value="1">是</a-select-option>
        <a-select-option value="0">否</a-select-option>
      </a-select>
      <a-input
        placeholder="参与活动次数"
        v-model="conditionsDate.activityNum"
        v-if="fileNameDate.activityNum"
        class="divInput"
      />
      <a-button type="primary" v-if="fileNameDate.butten" @click="getWishList">筛选</a-button>
    </div>
    <div class="divdisplay">
      <div class="userInfoDiv">
        <a-list :grid="{ gutter: 8, column: 8 }" :dataSource="userInfoData">
          <a-list-item slot="renderItem" slot-scope="item" style="width:10%">
            <a-avatar :size="64" :src="item.avatar_url" />
          </a-list-item>
        </a-list>
        <a-pagination
          :total="total"
          :pageSize="pageNum"
          :current="pageSize"
          @change="onShowSizeChange"
        />
      </div>
      <div class="prizeDiv">
        中奖列表
        <a-list class="aliser" :grid="{ gutter: 2, column: 24 }" :dataSource="prizeUser">
          <a-list-item slot="renderItem" slot-scope="item" style="width:10%">
            <a @click="info(item)">
              <a-avatar :size="64" :src="item.avatar_url" />
            </a>
          </a-list-item>
        </a-list>
        <a-modal
          :title="'中奖的心愿'"
          cancelText="取消"
          okText="确定"
          v-model="userWish"
          @ok="userWish=false"
        >
          <div class="modal-list">
            <div v-for="item in pameName" :key="item.id">
              <span class="xinyhuaname">
                心愿名称：
                <b style="color:red;">{{item.wishName}}</b>
              </span>
              <div class="nemcenter">{{item.wishContent}}</div>
            </div>
            <div>
              <span class="xinyhuaname">心愿故事：</span>
              <div class="gushicenter">{{story}}</div>
            </div>
          </div>
        </a-modal>
      </div>
    </div>
    <div class="openingDiv">
      <a-button type="primary" @click="openPrize(1)" v-if="btndisbale">开始抽取</a-button>
      <a-button type="primary" @click="openPrize(1)" v-else>重新抽取</a-button>
      <br />
      <br />
      <a-button type="primary" @click="okOpening()">确认中奖</a-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pameName: [],
      story: "",
      createName: "",
      userWish: false,
      btndisbale: true,
      creatDate: "",
      gender: "3",
      provincial: "0",
      city: "0",
      wishType: "0",
      member: "2",
      typeList: [],
      conditionsDate: {},
      fileNameDate: {},
      userInfoData: [],
      prizeUser: [],
      randoms: [],
      pageSize: 1,
      pageNum: 90,
      total: 0,
      prizeUserWish: [],
      provincialDate: [],
      cityDate: [
        {
          id: "0",
          city: "请选择城市"
        }
      ]
    };
  },
  mounted: function() {
    //查询心愿开奖条件列表
    this.getOpenList();
    //默认开奖列表
    this.getWishList();
    //查询心愿类型
    this.getWishType();
    //查询省份列表
    this.getProvincia();
  },
  methods: {
    //查看详情
    info(record) {
      this.userWish = true;
      const h = this.$createElement;
      var wishContent = [];
      var params = new URLSearchParams();
      params.append("id", record.id);
      this.$axios.post("/backstage/wish/getWishDetil", params).then(
        res => {
          if (res.data.code == 200) {
            this.pameName = res.data.datas;
            this.story = record.story;
            this.createName = record.createName;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //查询心愿类型
    getWishType() {
      var that = this;
      this.$axios.post("/backstage/type/getWishType").then(
        res => {
          that.typeList = res.data.datas;
          that.typeList.push({
            id: "0",
            wishName: "请选择类型"
          });
        },
        err => {
          console.log(err);
        }
      );
    },
    //查询省份列表
    getProvincia() {
      var that = this;
      this.$axios.post("/backstage/Opening/getProvincia").then(
        res => {
          that.provincialDate = res.data.datas;
          that.provincialDate.push({
            id: "0",
            provincial: "请选择省份"
          });
        },
        err => {
          console.log(err);
        }
      );
    },
    //根据省份查询城市列表
    getCity() {
      var that = this;
      that.city = "请选择城市";
      var params = new URLSearchParams();
      params.append("pid", that.provincial);
      this.$axios.post("/backstage/Opening/getCity", params).then(
        res => {
          that.cityDate = res.data.datas;
        },
        err => {
          console.log(err);
        }
      );
    },
    //确认开奖
    okOpening() {
      var that = this;
      var params = new URLSearchParams();
      params.append("params", JSON.stringify(that.prizeUserWish));
      this.$axios.post("/backstage/Opening/setUserPrizeInfo", params).then(
        res => {
          if (res.data.code == 200) {
            that.$message.success(res.data.message);
            that.prizeUserWish = "";
            that.prizeUser = "";
          } else {
            that.$message.error(res.data.message);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    onShowSizeChange(pageNum, pageSize) {
      debugger;
      this.pageSize = pageNum;
      this.getWishList();
    },
    //替换
    chageUser(num, index) {
      var that = this;
      that.btndisbale = false;
      var params = new URLSearchParams();
      params.append("num", num);
      this.$axios.post("/backstage/Opening/getPrizeList", params).then(
        res => {
          var user = res.data.datas[0];
          that.prizeUser.splice(index, 1);
          that.prizeUser.push(user);
          var userInfo = {
            wishListId: user.wish_detail_id,
            userId: user.user_id
          };
          that.prizeUserWish.push(userInfo);
        },
        err => {
          console.log(err);
        }
      );
    },
    //抽奖
    openPrize(num) {
      var that = this;
      that.btndisbale = false;
      var params = new URLSearchParams();
      params.append("num", num);
      that.prizeUserWish=[];
      this.$axios.post("/backstage/Opening/getPrizeList", params).then(
        res => {
          if (res.data.code == 200) {
            that.prizeUser = res.data.datas;
            for (var i = 0; i < that.prizeUser.length; i++) {
              var user = {
                wishDetailId: that.prizeUser[i].wish_detail_id,
                userId: that.prizeUser[i].user_id
              };
              that.prizeUserWish.push(user);
            }
          } else {
            that.$message.error(res.data.message);
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    //点击筛选按钮
    getWishList() {
      var that = this;
      var params = new URLSearchParams();
      that.conditionsDate.creatDate = that.creatDate;
      that.conditionsDate.gender = that.gender;
      that.conditionsDate.provincial = that.provincial;
      that.conditionsDate.city = that.city;
      that.conditionsDate.member = that.member;
      that.conditionsDate.pageSize = that.pageSize;
      that.conditionsDate.pageNum = that.pageNum;
      let param = JSON.stringify(that.conditionsDate);
      params.append("params", param);
      this.$axios.post("/backstage/Opening/getWishList", params).then(
        res => {
          that.userInfoData = res.data.datas.listMap;
          that.total = res.data.datas.count;
        },
        err => {
          console.log(err);
        }
      );
    },
    //时间控件赋值
    onChange(date, dateString) {
      this.creatDate = date;
    },
    //查询心愿开奖条件列表
    getOpenList() {
      var that = this;
      this.$axios.post("/backstage/Opening/getOpening").then(
        res => {
          that.conditionsDate = res.data.datas.conditionsDate;
          that.fileNameDate = res.data.datas.fileNameDate;
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
.userInfoDiv {
  /* float: left; */
  width: 50%;
  margin-top: 2%;
  border: 1;
}
.openingDiv {
  /* float: left; */
  width: 100%;
  text-align: center;
  margin-top: 20px;
  /* padding: 3%;
  margin-top: 20%; */
}
.divInput {
  width: 15%;
  margin-top: 10px;
}
.prizeDiv {
  /* float: left; */
  width: 50%;
  margin-top: 2%;
  text-align: center;
}
.divdisplay {
  display: flex;
  align-items: center;
}
.aliser .ant-spin-nested-loading .ant-spin-container .ant-row {
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
</style>
