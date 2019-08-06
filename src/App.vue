<template>
  <div id="app" class="wh100">
    <router-view></router-view>
  </div>
  
</template>

<script>
export default {
  name: "App"
};
</script>
<style>
#app{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.el-form-item__content {
  line-height: 28px;
}
</style>

