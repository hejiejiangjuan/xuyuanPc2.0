<template>
  <div class="startistics">
    <div>
      <a-date-picker v-model="startDate" placeholder="选择开始日期" format="YYYY-MM-DD"/>
      <a-date-picker v-model="endDate" placeholder="选择结束日期" format="YYYY-MM-DD"/>
      <a-button type="primary" @click="getCount">统计</a-button>
    </div>
    <br>
    <div style="color:red">注：默认显示今天之前的七天</div>
    <br>
    <div>
      <div id="activityLevel"></div>
    </div>
  </div>
</template>
<script>
import G2 from "@antv/g2";
export default {
  data() {
    return {
      startDate: null,
      endDate: null,
      data: []
    };
  },
  mounted: function() {
    this.tubiao();
  },
  methods: {
    getCount() {
      document.getElementById("activityLevel").innerHTML = "";
      this.tubiao();
    },
    tubiao() {
      var that = this;
      var params = new URLSearchParams();
      if (this.startDate != null) {
        params.append("startDate", new Date(this.startDate).getTime());
      }
      if (this.endDate != null) {
        params.append("endDate", new Date(this.endDate).getTime());
      }
      this.$axios.post("/backstage/activityDetil/getCount", params).then(
        res => {
          if (res.data.code == 200) {
            if (res.data.datas.length > 0) {
              this.data = res.data.datas;
              var chart = new G2.Chart({
                container: "activityLevel",
                forceFit: true,
                height: window.innerHeight / 1.5,
                padding: [100, 40, 30, 60]
              });
              chart.source(this.data);
              chart.tooltip({
                follow: false,
                crosshairs: "y",
                htmlContent: function htmlContent(title, items) {
                  var alias = {
                    "发起心愿数量": title+"<br>发起心愿数量",
                    "发起活动数量": title+"<br>发起活动数量",
                    "发起活动心愿数量": title+"<br>发起活动心愿数量"
                  };

                  var html = '<div class="custom-tooltip">';
                  for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var color = item.color;
                    var name = alias[item.name];
                    var value = item.value;
                    var domHead =
                      '<div class="custom-tooltip-item" style="border-left-color:' +
                      color +
                      '">';
                    var domName =
                      '<div class="custom-tooltip-item-name">' +
                      name +
                      "</div>";
                    var domValue =
                      '<div class="custom-tooltip-item-value">' +
                      value +
                      "</div>";
                    var domTail = "</div>";
                    html += domHead + domName + domValue + domTail;
                  }
                  return html + "</div>";
                }
              });
              chart.axis("date", {
                label: {
                  textStyle: {
                    fill: "#aaaaaa"
                  }
                }
              });
              chart.axis("value", {
                label: {
                  textStyle: {
                    fill: "#aaaaaa"
                  },
                  formatter: function formatter(text) {
                    return text.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
                  }
                }
              });
              chart.legend({
                useHtml: true,
                position: "bottom",
                reactive: true,
                legendStyle: {
                  MARKER_CLASS: {
                    width: "18px",
                    height: "18px",
                    lineHeight: "18px",
                    borderRadius: "50px",
                    display: "inline-block",
                    marginRight: "4px",
                    textAlign: "center",
                    fontZize: "10px",
                    marginTop: "3px",
                    color: "white",
                    float: "left",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: "#ccc"
                  }
                },
              });
              chart
                .line()
                .position("date*value")
                .color("type");
              chart.render();
              
            } else {
              document.getElementById("activityLevel").innerHTML =
                "当前时间没有心愿与活动";
            }
          } else {
            that.$message.error("数据加载失败");
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
.example {
  text-align: center;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 30px 50px;
  margin: 20px 0;
}
.startistics {
  width: 100%;
  height: 100%;
}
.startistics-top {
  width: 100%;
  height: 10%;
  background: #cccccc;
}

#mountNode {
  width: 100%;
  padding-left: 100px;
}

.custom-tooltip {
  width: 100% !important;
  height: 10% !important;
  position: absolute;
  top: 0px;
  left: 0px;
}

.custom-tooltip-item {
  width: 150px;
  height: 60px;
  position: relative;
  float: left;
  margin-left: 20px;
  border-left-style: solid;
  border-left-width: 5px;
}

.custom-tooltip-item:first-child {
  margin-left: 0;
}

.custom-tooltip-item-name {
  width: 80%;
  height: 20px;
  position: absolute;
  top: 0px;
  left: 10px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.custom-tooltip-item-value {
  width: 80%;
  height: 20px;
  position: absolute;
  bottom: 0px;
  left: 10px;
  color: #262626;
  font-size: 22px;
  /*font-weight: bold*/
}
</style>

