<template>
  <div class="permission">
    <div class="permission-tree">
      <!-- <i class="permission-i" >新增</button> -->
      <ul class="permission-ul">
        <li class="permission-ul-li" v-for="item in role" :key="item.val">
          <span class="permission-ul-li-span permission-ul-li-spanadmin">角色：{{item.name}}</span>
          <div class="permission-div-span">
            <span class="permission-span permission-ul-li-spanadlook" @click="lookList(item.val)">查看</span>
            <span
              v-if="username != 'admin'"
              class="permission-span permission-ul-li-spanadminbianji"
              @click="editorList(item.val)"
            >编辑</span>
          </div>
        </li>
      </ul>
      <div class="divbtn-ing" v-if="addshow">
        <input class="btn-ing" type="text" v-model="btnvalue" placeholder="请输入角色名称">
        <button class="okBtn" @click="okBtn">确定</button>
      </div>
      <div class="permission-btnn" @click="permissionBtn">+</div>
    </div>
    <div class="permission-tree-right">
      <!-- 新增角色 -->
      <div class="permission-treeright-left" v-if="incransedShow">
        <div style="color:red; font-size:18px;">请选择该角色权限！</div>
        <a-tree
          checkable
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          v-model="checkedKeys"
          :autoExpandParent="autoExpandParent"
          @select="onSelect"
          :selectedKeys="selectedKeys"
          :treeData="treeData"
        />
      </div>
      <!-- 查看内容 -->
      <div class="permission-treeright-left" v-if="lookoverShow">
        <a-tree
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          @select="onSelect"
          :selectedKeys="selectedKeys"
          :treeData="treeData"
        />
      </div>
      <div class="permission-treeright-right" v-if="submitShow">
        <!-- 修改权限 -->
        <button class="permissiontijao-button" @click="idBtn">提交</button>
        <a-tree
          checkable
          @expand="onExpand"
          v-model="checkedKeys"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          @select="onSelect"
          :selectedKeys="selectedKeys"
          :treeData="treeData"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      a:true,
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
      treeData: [],
      role: [],
      btnvalue: "",
      lookoverShow: false,
      submitShow: false,
      addshow: false,
      incransedShow: false,
      roleId: "",
      rolePowerList: [],
      username:"",
    };
  },
  watch: {
    checkedKeys(val) {
      var that = this;
      that.rolePowerList = [];
      //原始数据
      const tdchildren = [];
      //对比val后数据
      const tdval = [];
      for (const i in that.treeData) {
        for (const k in that.treeData[i].children) {
          tdchildren.push(that.treeData[i].children[k]);
        }
      }
      for (const k in tdchildren) {
        for (const n in val) {
          if (tdchildren[k].key == val[n]) {
            tdval.push(tdchildren[k].powerId);
            tdval.push(val[n]);
          }
        }
      }
      // 去掉重复的父节点
      var newArr = [];
      tdval.forEach(function(e) {
        if (!newArr.includes(e)) {
          newArr.push(e);
        }
      });
      for (const i in newArr) {
        var rolePower = {};
        rolePower.rId = that.roleId;
        rolePower.pId = newArr[i];
        that.rolePowerList.push(rolePower);
      }
    }
  },
  mounted: function() {
    this.getPermissionList();
    this.roleList();
   this.username = sessionStorage.getItem("username");
  
  },
  methods: {
    idBtn() {
      var that = this;
      var params = new URLSearchParams();
      params.append("roleId", that.roleId);
      params.append("rolePower", JSON.stringify(that.rolePowerList));
      that.$axios.post("/backstage/role/updateRolePower", params).then(
        res => {
          this.getPermissionList();
          this.roleList();
          this.$message.success("提交成功");
          this.submitShow = false;
        },
        err => {
          console.log(err);
        }
      );
    },

    // 新增
    permissionBtn() {
      this.addshow = true;
      var that = this;
      var params = new URLSearchParams();
      this.$axios.post("/backstage/power/getPowerByRoleList").then(
        res => {
          if (res.data.code == 200) {
            that.treeData = res.data.datas;
            that.lookoverShow = false;
            that.submitShow = false;
            that.incransedShow = true;
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    okBtn() {
      var that = this;
      if (that.btnvalue != "" && that.rolePowerList != "") {
        var params = new URLSearchParams();
        params.append("roleName", that.btnvalue);
        params.append("rolePower", JSON.stringify(that.rolePowerList));
        that.$axios.post("/backstage/role/addRolePower", params).then(
          res => {
            if (res.data.code == 200) {
              that.lookoverShow = false;
              that.addshow = false;
              that.incransedShow = false;
              this.roleList();
            } else {
            }
          },
          err => {
            console.log(err);
          }
        );
      } else if (that.btnvalue.length >= "8") {
        this.$message.error("角色名不能超过8位数！");
      } else {
        this.$message.error("角色权限权限和用户名不能为空！");
      }
    },
    onExpand(expandedKeys) {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onCheck(checkedKeys) {
      this.checkedKeys = checkedKeys;
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys;
    },
    //初始化菜单选项列表
    getPermissionList() {
      var that = this;
      var params = new URLSearchParams();
      this.$axios.post("/backstage/power/getPowerByRoleList").then(
        res => {
          that.treeData = res.data.datas;
        },
        err => {
          console.log(err);
        }
      );
    },
    //初始化角色列表
    roleList() {
      var that = this;
      var params = new URLSearchParams();
      this.$axios.post("/backstage/role/getRoleList").then(
        res => {
          that.role = res.data.datas;
        },
        err => {
          console.log(err);
        }
      );
    },
    //查看
    lookList(val) {
      var that = this;
      var params = new URLSearchParams();
      params.append("roleId", val);
      this.$axios.post("/backstage/power/getPowerByRoleId", params).then(
        res => {
          var ondata = [];
          var power = res.data.datas;
          for (var i = 0; i < power.length; i++) {
            var role = {};
            role.title = power[i].powerName;
            role.key = power[i].pId;
            var children = [];
            for (var k = 0; k < power[i].power.length; k++) {
              var rolePower = {};
              rolePower.title = power[i].power[k].powerName;
              rolePower.key = power[i].power[k].pId;
              children.push(rolePower);
              role.children = children;
            }
            ondata.push(role);
          }
          that.treeData = ondata;
          that.lookoverShow = true;
          that.submitShow = false;
          that.incransedShow = false;
        },
        err => {
          console.log(err);
        }
      );
    },
    //编辑
    editorList(val) {
      this.roleId = val;
      var that = this;
      var params = new URLSearchParams();

      this.$axios.post("/backstage/power/getPowerByRoleList").then(
        res => {
          that.treeData = res.data.datas;
          that.lookoverShow = false;
          that.submitShow = true;
          that.incransedShow = false;
        },
        err => {
          console.log(err);
        }
      );
      params.append("roleId", val);
      this.$axios.post("/backstage/power/getPowerByRoleId", params).then(
        res => {
          const arr = res.data.datas;

          var pId = [];
          for (const i in arr) {
            for (const k in arr[i].power) {
              pId.push(arr[i].power[k].pId);
            }
          }
          that.checkedKeys = pId;
        },
        err => {
          // console.log(err);
        }
      );
    }
  }
};
</script>
<style>
.permission {
  width: 100%;
  height: 100%;
  display: flex;
}
.permission-tree {
  width: 540px;
  height: 100%;
  overflow-x: hidden;
  border: 1px solid #cccccc;
}
.permission-ul {
  width: 100%;
  list-style: none;
}
.permission-ul-li {
  width: 100%;
  padding: 10px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.permission-ul-li-span {
  display: block;
}
.permission-span {
  display: inline-block;
  width: 68px;
  height: 32px;
  border-radius: 50px;
  text-align: center;
  line-height: 32px;
  background: #cccccc;
}
.permission-ul-li-spanadminbianji {
  background: #409eff;
}
.permission-tree-right {
  width: 50%;
  height: 100%;
  display: flex;
  overflow-x: hidden;
  margin-left: 30px;
}
.permission-treeright-left {
  width: 50%;
  height: 100%;
}
.permission-treeright-right {
  width: 50%;
  height: 100%;
}
.permissiontijao-button {
  width: 103px;
  background: #409eff;
  border: none;
  border-radius: 5px;
  padding: 8px 11px;
  margin: 10px;
}

.permission-btnn {
  width: 50px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  font-size: 30px;
  margin: 10px auto;
  border: 1px solid #cccccc;
  border-radius: 50%;
}
.divbtn-ing {
  width: 100%;
  height: 40px;
  margin: 10px 5px;
}
.btn-ing {
  width: 65%;
  height: 100%;
  border: 1px solid #cccccc;
  text-align: center;
}
.okBtn {
  width: 30%;
  height: 100%;
  border: none;
  background: #cccccc;
}
</style>
