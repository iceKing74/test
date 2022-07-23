<template>
  <el-container class="control">
    <el-aside width="auto">
      <router-link to="/control" class="logo" />
      <el-menu
      active-text-color="white"
      unique-opened
      router
      :collapse="$store.state.collapsed"
      :default-active="defaultActive"
      >
        <treemenu :data="menus" />
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="search">
          <el-button icon="el-icon-s-fold" size="small" @click="$store.commit('ToggleMenu')" />
          <el-input
          suffix-icon="el-icon-search"
          v-model="keyword"
          placeholder="搜索"
          size="small"
          clearable/>
        </div>
        <div class="rightbar">
          <router-link to="/control">
            <i class="el-icon-house" />
          </router-link>
          <el-badge :value="6">
            <i class="el-icon-bell" />
          </el-badge>
          <el-dropdown trigger="click" @command="handleCommand">
            <p class="iavatar">
              <el-avatar :size="40" :src="info.avatar" />
              <span class="nickname">{{info.nickname}}</span>
            </p>
            <el-dropdown-menu slot="dropdown" style="width: 120px">
              <el-dropdown-item icon="el-icon-setting">个人设置</el-dropdown-item>
              <el-dropdown-item icon="el-icon-lock">修改密码</el-dropdown-item>
              <el-dropdown-item icon="el-icon-refresh">在线升级</el-dropdown-item>
              <el-dropdown-item command="exit" icon="el-icon-switch-button" divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <!-- 嵌套子路由显示 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Treemenu from '../compontents/Treemenu.vue'
export default {
  components: {
    Treemenu
  },
  data () {
    return {
      keyword: '',
      defaultActive: location.hash.slice(1),
      menus: [
        {
          id: 1,
          type: 0,
          icon: 'el-icon-monitor',
          label: '控制面板',
          children: [
            { label: '仪表盘', path: '/control/dashboard' }
          ]
        },
        {
          id: 2,
          type: 0,
          icon: 'el-icon-user',
          label: '用户管理',
          children: [
            { label: '用户列表', path: '/control/admin' }
          ]
        },
        {
          id: 3,
          type: 0,
          icon: 'el-icon-magic-stick',
          label: '角色管理',
          children: [
            { label: '角色列表', path: '/control/user' }
          ]
        },
        {
          id: 4,
          type: 0,
          icon: 'el-icon-picture-outline',
          label: '轮播管理',
          children: [
            { label: '轮播列表', path: '/control/carousel' }
          ]
        },
        {
          id: 5,
          type: 0,
          icon: 'el-icon-suitcase-1',
          label: '会员管理',
          children: [
            { label: '会员列表', path: '/control/a4' }
          ]
        },
        {
          id: 6,
          type: 0,
          icon: 'el-icon-shopping-bag-2',
          label: '产品管理',
          children: [
            { label: '分类列表', path: '/control/productcate' },
            { label: '产品列表', path: '/control/product' }
          ]
        },
        {
          id: 7,
          type: 0,
          icon: 'el-icon-s-operation',
          label: '菜单管理',
          children: [
            { label: '菜单列表', path: '/control/a10' }
          ]
        }
      ]
    }
  },
  created () {
    this.GetInfo()
  },
  computed: {
    ...mapState('admin', ['info'])
  },
  watch: {
    $route () {
      this.defaultActive = location.hash.slice(1)
    }
  },
  methods: {
    ...mapActions('admin', ['GetInfo']),
    handleCommand (command) {
      if (command === 'exit') {
        this.$confirm('确认登出操作').then(_ => {
          localStorage.removeItem('XX-Token')
          this.$router.replace('/login')
        }).catch(_ => {})
      }
    }
  }
}
</script>

<style lang="less">
.control {
  height: 100vh;
  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #F4C8E3 ;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    .search {
      display: flex;
      align-items: center;
      .el-button {
        padding: 7px 12px;
        font-size: 16px;
      }
      .el-input {
        margin-left: 12px;
        width: 200px;
      }
    }
    .rightbar {
      display: flex;
      align-items: center;
      [class*="el-icon"] {
        font-size: 18px;
        margin: 0px 8px;
      }
      .iavatar{
        display: flex;
        align-items: center;
        margin-left: 30px;
        .nickname{
          margin-left: 8px;
        }
      }
    }
  }
  .el-aside {
    background-color: #ffc0cbc9;
    box-shadow: 1px 0 5px rgba(216, 160, 171, 0.6);
    z-index: 9;
    .el-menu {
      &:not( .el-menu--collapse ){
        width: 230px;
      }
      background-color: transparent;
      border-right: none;
    }
    [class*="el-icon-"] {
      color: rgba(255, 255, 255, 0.6)
    }
    .el-submenu__title,
    .el-menu-item{
      color: rgba(255,255,255,.9);
      // 菜单划过样式
      &:hover{
        background-color: rgba(255, 255, 255, 0.25);
      }
    }
    //菜单选中颜色
    .el-menu-item.is-active {
      background-color: rgba(135, 206, 235, 0.4);
      color: white;
      color: skyblue
    }
    .logo {
      display: block;
      height: 60px;
      background: url(../assets/img/logo.png) no-repeat 20px 50%;

    }
  }

  .el-menu-popup{
    .el-submenu_title,
    .el-menu-item{
      color: #606266
    }
  }
}

</style>
