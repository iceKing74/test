<template>
  <div class="dashboard">
    <h2>仪表盘</h2>
    {{collapsed}}---{{age}}---{{name}}
    <el-button icon="el-icon-s-fold" size="small" @click="$store.commit('ToggleMenu')" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      collapsed: 'collapsed'
    }),
    ...mapState('admin', {
      age: 'age',
      name: 'name'
    })
  }
}
</script>

<style>

</style>
