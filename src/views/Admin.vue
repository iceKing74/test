<template>
  <!-- 用户模块
  采用前端搜索与分页 -->
  <div class="xx-panel">

    <!-- 修改弹层信息 -->
    <el-dialog
    :title="(action === 'add' ? '新增' : '修改')+'用户'"
    :visible.sync="visible"
    width="430px"
    :close-on-click-modal="false"
    @closed="$refs.form.clearValidate()"
    >

      <el-form :rules="rules" ref="form" :model="form" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" />
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" />
        </el-form-item>

        <el-form-item
        label="密码"
        prop="password"
        :rules="{required: action==='add', message: '必须存在密码'}"
        >
          <el-input
          type="password"
          v-model="form.password"
          :placeholder="action==='edit'?'不修改则保持为空':''"
          show-password
          />
        </el-form-item>

         <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="form.mobile" />
        </el-form-item>

        <el-form-item label="上传头像" prop="avatar" >
          <el-input v-model="form.avatar">
            <el-upload
            action="http://cloud.scnew.com.cn/api/user/upload"
            slot="append"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="uploadSuccess"
            >
              <el-button icon="el-icon-upload2" />
             </el-upload>
          </el-input>
        </el-form-item>

        <el-form-item
        label="性别"
        prop="gender"
        >
          <el-radio v-model="form.gender" :label="1">女</el-radio>
          <el-radio v-model="form.gender" :label="2">男</el-radio>
        </el-form-item>

        <el-form-item
        label="所属角色"
        prop="role"
        >
          <el-select v-model="form.role" clearabl>
            <el-option
            v-for="item in []"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核">
          <el-switch
          v-model="form.state"
          :active-value="2"
          :inactive-value="1"
          />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>

    <div class="heading">
      <h1>用户管理</h1>
      <el-breadcrumb>
        <el-breadcrumb-item to="/control">后台首页</el-breadcrumb-item>
        <el-breadcrumb-item to="/control/admin">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/control/carousel">轮播列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="search">

      <el-form :inline="true">

        <el-form-item v-if="ids.length">
          <el-button
          type="danger"
          size="small"
          @click="handleRemove(ids)"
          >批量删除</el-button>
        </el-form-item>

        <el-form-item>
          <el-select
          v-model="condition.state"
          placeholder="是否审核"
          size="small"
          clearable
          style="width: 110px"
          >
            <el-option label="未审核" :value="1" />
            <el-option label="已审核" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
          v-model.trim="condition.keyword"
          placeholder="输入账号、昵称或手机"
          size="small"
          clearable />
        </el-form-item>

      </el-form>

      <el-button
      type="danger"
      icon="el-icon-plus"
      size="small"
      @click="add"
      >新增</el-button>

    </div>

    <div class="datagrid">
      <el-table
      :data="pageDate"
      @selection-change="handleSelectionChange"
      ref="table"
      >
        <el-table-column
        type="selection"
        width="55" />
        <el-table-column  label="头像" v-slot="scope">
          <el-image
          style="height: 40px"
          :src="scope.row.avatar"
          fit="cover" />
        </el-table-column>

        <el-table-column  label="账号" prop="username" />

        <el-table-column  label="昵称" prop="nickname" />

        <el-table-column  label="手机号码" prop="mobile" />

        <el-table-column  label="注册日期" :formatter="handleDate" prop="pudate"  sortable  />

        <el-table-column  label="审核" v-slot="scope" :width="110">
          <el-switch
          v-model="scope.row.state"
          :active-value="2"
          :inactive-value="1"
          @change="handleSwitchChange(scope.row)"
          />
        </el-table-column>

        <el-table-column  label="操作" :width="170" v-slot="scope">
          <template>
            <el-button
            size="mini"
            @click="edit(scope.row)"
            >修改</el-button>
            <el-button
            type="danger"
            size="mini"
            @click="handleRemove([scope.row.id])">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <!-- 此处为了剞劂 -->
      <el-pagination
        class="xx-pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[1, 2, 3]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="searchData.length" />
    </div>

  </div>
</template>

<script>
import Moment from 'moment'
import { pick } from '@/utils'
export default {
  data () {
    return {
      condition: {},
      listData: [],
      // 复选框的id值
      ids: [],
      page: 1,
      pageSize: 2, // 每页分多少条

      visible: false,
      action: 'add',
      form: {},
      rules: {
        username: { required: true, message: '必须存在用户名' },
        nickname: { required: true, message: '必须存在昵称' }
      }
    }
  },
  created () {
    this.query()
  },
  computed: {
    searchData () {
      const { state, keyword } = this.condition
      return this.listData.filter(item => {
        return (state ? item.state === state : true) &&
        (keyword ? [item.username, item.nickname, item.mobile].some(item => item.includes(keyword)) : true)
      })
    },
    pageDate () {
      const start = this.pageSize * (this.page - 1)
      return this.searchData.slice(start, start + this.pageSize)
    }
  },
  methods: {
    handleDate (row) {
      return Moment(row.pubdate).format('YYYY年MM月DD日')
    },
    handleSelectionChange (arr) {
      this.ids = arr.map(item => item.id)
      console.log(this.ids)
    },
    handleCurrentChange (page) {
      this.page = page
    },
    handleSizeChange (size) {
      this.pageSize = size
    },
    handleSwitchChange ({ id, state }) {
      this.$http.patch('admin/state', { id, state }).then(res => {
        if (res.err > 0) {
          this.$message.error(res.desc)
        }
      })
    },
    handleRemove (ids) {
      this.$confirm('是否删除数据', '提示').then(_ => {
        this.$http.post('admin/remove', JSON.stringify({ ids })).then(res => {
          if (res.err > 0) {
            this.$message.error(res.desc)
          } else {
            this.query()
            this.$message.success(res.desc)
          }
        })
      }).catch(_ => {
        // 调用table组件的methods方法 clearSelection 清除选择
        this.$refs.table.clearSelection()
      })
    },
    add () {
      this.visible = true
      this.action = 'add'
      this.form = { state: 2 }
    },
    edit (row) {
      this.visible = true
      this.action = 'edit'
      this.form = pick(row, ['id', 'username', 'nickname', 'avatar', 'mobile', 'gender', 'role', 'state'])
      console.log(this.form)
    },
    save () {
      this.$refs.form.validate(vaild => {
        if (vaild) {
          this.$http.post(`admin/${this.action}`, this.form).then(res => {
            if (res.err > 0) {
              this.$message.error(res.desc)
            } else {
              this.query()
              this.$message.success(res.desc)
              this.visible = false
            }
          })
        }
      })
    },
    beforeUpload (file) {
      const ext = file.name.match(/\.(\w+)$/i)[1].toLowerCase()
      const isPic = ['jpeg', 'png', 'gif', 'jpg', 'webp']
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isPic.includes(ext)) this.$message.error('上传用户只能是 ' + isPic + ' 格式!')
      if (!isLt2M) this.$message.error('上传用户大小不能超过 2MB!')
      return isPic && isLt2M
    },
    uploadSuccess (res) {
      if (res.err > 0) {
        this.$message.error(res.desc)
      } else {
        this.$message.success(res.desc)
        this.$set(this.form, 'avatar', res.result)
      }
    },
    query () {
      this.$http.get('admin/list').then(res => {
        if (res.err > 0) {
          this.$message.error(res.desc)
        } else {
          this.listData = res.result
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
