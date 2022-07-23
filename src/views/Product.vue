<template>
  <!-- 产品模块
  采用后端搜索与分页 -->
  <div class="xx-panel">

    <!-- 修改弹层信息 -->
    <el-dialog
    width="430px"
    :title="(action === 'add' ? '新增' : '修改')+'产品'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @closed="$refs.form.clearValidate()"
    >
      <el-form label-width="90px" :rules="rules" :model="form" ref="form" >
        <el-form-item label="类别名称" prop="title">
          <el-input v-model="form.title" />
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

    <!-- 头部 -->
    <div class="heading">
      <h1>产品管理</h1>
      <el-breadcrumb>
        <el-breadcrumb-item to="/control">后台首页</el-breadcrumb-item>
        <el-breadcrumb-item to="/control/product">产品管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/control/carousel">轮播列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 搜索栏 -->
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
          <el-select
          v-model="condition.pid"
          placeholder="所属分类"
          size="small"
          clearable
          style="width:150px"
          >
            <el-option
            v-for="item in cates"
            :key="item.id"
            :label="item.title"
            :value="item.id" />
          </el-select>
        </el-form-item>

         <el-form-item>
          <el-select
          v-model="condition.price"
          placeholder="价格范围"
          size="small"
          clearable
          style="width:150px"
          >
            <el-option label="0-99￥" value="0-99" />
            <el-option label="100-999￥" value="100-999" />
            <el-option label="1000-9999￥" value="1000-9999" />
            <el-option label="10000-99999￥" value="100000-99999" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input
          v-model.trim="condition.keyword"
          placeholder="输入产品名称"
          size="small"
          clearable />
        </el-form-item>
      </el-form>
      <!-- 新增按钮 -->
      <el-button
      type="danger"
      icon="el-icon-plus"
      size="small"
      @click="add"
      >新增</el-button>
    </div>

    <!-- 表格部分 -->
    <div class="datagrid">
      <el-table
      :data="listInfo.result"
      style="width:100%"
      @selection-change="handleSelectionChange"
      ref="table"
      >
        <!-- 多选框 -->
        <el-table-column width="55" type="selection" />
        <el-table-column
        label="所属分类"
        prop="pid"
        :width="80"
        />
        <el-table-column label="产品缩略图" v-slot="scope" :width="120">
          <el-image
          style="width: 60px;"
          fit="cover"
          :src="scope.row.thumb"
          />
        </el-table-column>
        <el-table-column  label="标题" prop="title" />
        <el-table-column  label="产品单价" prop="price" :formatter="formatPrice" />
        <el-table-column  label="发布日期" prop="pubdate" :formatter="formatDate" />
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
      <!-- 此处为了分页 -->
      <el-pagination
      class="xx-pagination"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="condition.page"
      :page-sizes="[1, 2, 3]"
      :page-size.sync="condition.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="listInfo.pageCount"
      />
    </div>
  </div>
</template>

<script>
import Moment from 'moment'
import { pick } from '@/utils'
export default {
  data () {
    return {
      // 用于后端处理搜索分页的功能
      condition: {
        page: 1,
        pageSize: 2
      },
      listInfo: {
        result: [],
        pageCount: 0
      },
      // 复选框的id值
      ids: [],
      visible: false, // 为了弹层的可见与不可见
      action: 'add',
      form: {},
      rules: {
        title: { required: true, message: '必须存在分类名称' },
        thumb: { required: true, message: '必须存在产品图片' }
      },
      cates: []
    }
  },
  created () {
    this.getCates()
  },
  watch: {
    condition: {
      handler () {
        this.query()
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    formatPrice (row) {
      return '￥' + row.price.toFixed(2)
    },
    formatDate (row) {
      return Moment(row.pubdate).format('YYYY年MM月DD日')
    },
    query () {
      this.$http.post('product/list', this.condition).then(res => {
        if (res.err > 0) {
          this.$message.error(res.desc)
        } else {
          this.listInfo = res.info
        }
      })
    },
    getCates () {
      this.$http.get('productcate/allist').then(res => {
        if (res.err > 0) {
          this.$message.error(res.desc)
        } else {
          this.cates = res.result
        }
      })
    },
    handleDate (row) {
      return Moment(row.pubdate).format('YYYY年MM月DD日') // format 一个非常好用的时间格式插件
    },
    handleSelectionChange (arr) {
      this.ids = arr.map(item => item.id)
    },
    handleCurrentChange (page) {
      this.condition.page = page
      this.query()
    },
    handleSizeChange (size) {
      this.condition.pageSize = size
      this.query()
    },
    handleSwitchChange ({ id, state }) {
      this.$http.patch('product/state', { id, state }).then(res => {
        if (res.err > 0) {
          this.$message.error(res.desc)
        }
      })
    },
    handleRemove (ids) {
      this.$confirm('是否删除数据', '提示').then(_ => {
        this.$http.post('product/remove', JSON.stringify({ ids })).then(res => {
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
      this.form = pick(row, ['id', 'thumb', 'title', 'orderid', 'state'])
    },
    save () {
      this.$refs.form.validate(vaild => {
        if (vaild) {
          this.$http.post(`product/${this.action}`, this.form).then(res => {
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
    }
  }
}
</script>

<style scoped>

</style>
