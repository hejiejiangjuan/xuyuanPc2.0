<template>
  <div>
    <a-form :form="form">
      <a-locale-provider :locale="locale">
      <a-form-item label="选择上架时间" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-date-picker
          :disabledDate="disabledStartDate"
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          v-model="beginTime"
          placeholder="选择上架时间"
          @openChange="handleStartOpenChange"
        />
      </a-form-item>
      </a-locale-provider>
      <a-locale-provider :locale="locale">
      <a-form-item label="选择下架时间" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-date-picker
          :disabledDate="disabledEndDate"
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择下架时间"
          v-model="endTime"
          :open="endOpen"
          @openChange="handleEndOpenChange"
        />
      </a-form-item>
      </a-locale-provider>
      <a-form-item label="是否立刻显示" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-radio-group v-model="showStatus">
          <a-radio :style="radioStyle" :value="1">立即显示</a-radio>
          <a-radio :style="radioStyle" :value="0">暂停显示</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- <a-form-item label="是否上架" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-radio-group v-model="stauts">
          <a-radio :style="radioStyle" :value="1">上架</a-radio>
          <a-radio :style="radioStyle" :value="0">下架</a-radio>
        </a-radio-group>
      </a-form-item> -->
      <!-- <a-form-item label="活动来源" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-radio-group v-model="showPosition">
          <a-radio :style="radioStyle" :value="1">星海</a-radio>
          <a-radio :style="radioStyle" :value="2">活动</a-radio>
        </a-radio-group>
      </a-form-item> -->
      <a-form-item label="关联活动" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a  @click="activityDetilByName" v-if="actitityName ==''">选择活动</a>
        <a  @click="activityDetilByName" v-else>{{actitityName}}</a>
      </a-form-item>
      <a-form-item label="选择广告栏位" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-select v-model="activitySite" @change="site">
          <a-select-option v-for="item in optionList" :key="item.val">{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit" style="width:40%" @click="setActivity">添加</a-button>
      </a-form-item>
    </a-form>
    <a-modal title="选择要关联的活动" centered v-model="modalVisible"  @ok="() => modalVisible = false">
      <a-input-search
          placeholder="请输入要关联的活动名称"
          @search="onSearch"
          enterButton="搜索"
          size="large"
        />
        <br><br>
      <a-list itemLayout="horizontal" :dataSource="data">
        <a-list-item slot="renderItem" slot-scope="item">
          <a slot="actions" @click="selectActivity(item)">选择</a>
          <a-list-item-meta
            :description="'由  '+item.nickName+item.createDate+'发送。 活动说明:'+item.creativityExplain"
          >
            <a slot="title" >{{item.activityTheme}}</a>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
      <div>
      <a-pagination
        :total="count"
        :pageSize="pageSize"
        :current="pageNum"
        @change="onShowSizeChange"
      />
    </div>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment';
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
const data = []
export default {
  data() {
    return {
      locale: zhCN,
      data,
      optionList: [],
      activityOption: [],
      showStatus: 1,
      stauts: 0,
      showPosition: 2,
      activitySite: 0,
      activityId: 0,
      beginTime: null,
      endTime: null,
      formLayout: "horizontal",
      form: this.$form.createForm(this),
      radioStyle: {
        height: "30px",
        lineHeight: "30px"
      },
      endOpen: false,
      modalVisible: false,
      pageNum: 1,
      count: 0,
      pageSize: 5,
      userName:'',
      actitityName:''
    };
  },
  mounted: function() {
    //进入页面加载所有广告位
    this.getAcvititySite();
  },
  methods: {
    //选择活动
    selectActivity(item){
      this.actitityName=item.activityTheme;
      this.activityId=item.id;
      this.modalVisible=false;
    },
    //条件查询
    onSearch(value) {
      this.userName = value;
      this.pageNum=1;
      this.activityDetilByName();
    },
    //分页查询
    onShowSizeChange(pageNum, pageSize) {
      this.pageNum = pageNum;
      this.activityDetilByName();
    },
    //获取活动列表
    activityDetilByName(){
      var that = this;
       var params = new URLSearchParams();
       params.append("pageNum",that.pageNum);
       params.append("pageSize",that.pageSize);
       params.append("activity",that.userName);
      this.$axios
        .post("/backstage/activityDetil/activityDetilByName",params)
        .then(
          res => {
            if (res.data.code == 200) {
              that.data = res.data.datas.list;
              that.count= res.data.datas.count;
              that.modalVisible = true;
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    //获取所有广告位
    getAcvititySite() {
      var that = this;
      this.$axios
        .post("/backstage/activityAd/putActivitySite")
        .then(
          res => {
            if (res.data.code == 200) {
              that.optionList = res.data.datas;
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    //提交表单
    setActivity() {
      var that = this;
      ;
      if (this.beginTime == null) {
        that.$message.error("请选择上架时间");
        return;
      }
      if (this.endTime == null) {
        that.$message.error("请选择下架时间");
        return;
      }
      if (this.activityId == 0) {
        that.$message.error("请关联活动");
        return;
      }
      if (this.activitySite == 0) {
        that.$message.error("请选择广告位");
        return;
      }
      var params = new URLSearchParams();
      let userInfo = JSON.stringify({
        activityId: this.activityId,
        activitySite: this.activitySite,
        beginTime: new Date(this.beginTime).getTime(),
        endTime: new Date(this.endTime).getTime(),
        showStatus: this.showStatus,
        stauts: this.stauts,
        showPosition: this.showPosition
      });
      params.append("activityAd", userInfo);
      this.$axios
        .post("/backstage/activityAd/creatActivityAd", params)
        .then(
          res => {
            if (res.data.code == 200) {
              that.$message.success(res.data.message);
              that.$router.push({ path: "/home/activityList" });
            } else {
              that.$message.error(res.data.message);
            }
          },
          err => {
            console.log(err);
          }
        );
    },
    //关联活动赋值
    activity(value) {
      this.activityId = value;
    },
    //广告栏位赋值
    site(value) {
      this.activitySite = value;
    },
    disabledStartDate(startValue) {
      return startValue && startValue < moment().startOf('day');
    },
    disabledEndDate(endValue) {
      return endValue<this.beginTime;
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
      if(this.beginTime>new Date()){
        this.stauts=0;
      }else{
        this.stauts=1;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    }
  }
};
</script>