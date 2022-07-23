<template>
  <div class="user">
    <h2>会员管理</h2>
    <el-button type="primary" @click="add()" icon="el-icon-plus">增加</el-button>
    <hr>
    <ul>
      <li v-for="item in list" :key="item.id">
        {{item.username}}---{{item.nickname}}
      </li>
    </ul>
     <el-button size="mini">修改</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query () {
      this.$http.get('user/list').then(res => {
        if (res.err > 0) {
        } else {
          console.log(res)
          this.list = res.result
        }
      })
    },
    add () {
      const username = prompt('请输入账号')
      const nickname = prompt('请输入昵称')
      if (username && nickname) {
        this.$http.post('user/add', JSON.stringify({ username, nickname })).then(res => {
          if (res.err > 0) console.error(res.desc)
          else this.query()
        })
      }
    }
  }
}
</script>

<style>

</style>
