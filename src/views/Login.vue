<template>
  <div class="login">
    <h1 class="heading">用户登入</h1>
    <el-form :model="form" :rules="rules" ref="form" label-width="50px" autocomplete="off">
      <el-form-item label="账户" prop="username">
        <el-input type="text" v-model="form.username"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"  show-password />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit()">登入</el-button>
        <el-button type="info">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {},
      rules: {
        username: { required: true, message: '账号无法为空' },
        password: { required: true, message: '密码无法为空' }
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$http.post('admin/login', this.form).then(res => {
            if (res.err > 0) {
              this.$message.error(res.desc)
            } else {
              localStorage.setItem('XX-Token', res.token)
              this.$router.replace('/control')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.login {
  position: fixed;
  width: 320px;
  border-radius: 4px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
  padding: 20px;
  left: 50%;
  top: 20%;
  margin-left: -150px;
  background-color: white;
  .heading {
    text-align: center;
    font-size: 24px;
    margin-bottom: 15px;
  }
}
</style>
