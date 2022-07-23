<template>
  <!-- 轮播模块
  采用前端搜索与分页 -->
  <div class="xx-panel">

    <!-- 修改弹层信息 -->
    <el-dialog
    :title="(action === 'add' ? '新增' : '修改')+'图片'"
    :visible.sync="visible"
    width="430px"
    :close-on-click-modal="false"
    @closed="$refs.form.clearValidate()"
    >

      <el-form :rules="rules" ref="form" :model="form">
        <el-form-item label="图片标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="图片链接">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="上传图片" prop="thumb" >
          <el-input v-model="form.thumb">
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
        <el-form-item label="排序数字">
          <el-input-number v-model="form.orderid" />
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
      <h1>轮播管理</h1>
      <el-breadcrumb>
        <el-breadcrumb-item to="/control">后台首页</el-breadcrumb-item>
        <el-breadcrumb-item to="/control/carousel">轮播管理</el-breadcrumb-item>
        <el-breadcrumb-item >轮播列表</el-breadcrumb-item>
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
          placeholder="输入标题或链接"
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
        <el-table-column  label="排序" prop="orderid" width="90px" sortable />

        <!-- 如果作用域插槽只存在一个标签，则可以不可template，将v-slot放在父级标签即可 -->
        <el-table-column  label="缩略图" v-slot="scope">
          <el-image
          style="width: 100px; height: 100px"
          :src="scope.row.thumb"
          fit="cover" />
        </el-table-column>

        <el-table-column  label="链接" prop="url" />

        <el-table-column  label="标题" prop="title" />

        <el-table-column  label="发布日期" :formatter="handleDate" prop="pudate"  sortable  />

        <el-table-column  label="审核" v-slot="scope">
          <el-switch
          v-model="scope.row.state"
          :active-value="2"
          :inactive-value="1"
          @change="handleSwitchChange(scope.row)"
          />
        </el-table-column>

        <el-table-column  label="操作" v-slot="scope">
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
        title: { required: true, message: '必须存在标题' },
        thumb: { required: true, message: '必须存在链接' }
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
        (keyword ? [item.title, item.url].some(item => item.includes(keyword)) : true)
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
      this.$http.patch('carousel/state', { id, state }).then(res => {
        if (res.err > 0) {
          this.$message.error(res.desc)
        }
      })
    },
    handleRemove (ids) {
      this.$confirm('是否删除数据', '提示').then(_ => {
        this.$http.post('carousel/remove', JSON.stringify({ ids })).then(res => {
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
      this.form = { orderid: 1 }
    },
    edit (row) {
      this.visible = true
      this.action = 'edit'
      this.form = pick(row, ['id', 'title', 'url', 'thumb', 'orderid', 'state'])
      console.log(row, this.form)
    },
    save () {
      this.$refs.form.validate(vaild => {
        if (vaild) {
          this.$http.post(`carousel/${this.action}`, this.form).then(res => {
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
      if (!isPic.includes(ext)) this.$message.error('上传图片只能是 ' + isPic + ' 格式!')
      if (!isLt2M) this.$message.error('上传图片大小不能超过 2MB!')
      return isPic && isLt2M
    },
    uploadSuccess (res) {
      if (res.err > 0) {
        this.$message.error(res.desc)
      } else {
        this.$message.success(res.desc)
        this.$set(this.form, 'thumb', res.result)
      }
    },
    query () {
      this.$http.get('carousel/list').then(res => {
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
