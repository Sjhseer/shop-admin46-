<template>
  <div class="cate">
    <el-button type="success" plain @click="addcate">添加分类</el-button>
    <el-table :data="categoryList" row-key="cat_id">
      <el-table-column prop="cat_name" label="分类名称"></el-table-column>
      <el-table-column label="是否有效">
        <template v-slot:default="{row}">{{row.cat_deleted?"否":"是"}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" plain icon="el-icon-edit"></el-button>
          <el-button @click="delcate(row.cat_id)" type="danger" plain icon="el-icon-delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- fenye -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[5, 10, 15]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框 -->

    <el-dialog title="添加分类" :visible.sync="dialogVisible" @closed="closeDialog">
      <el-form :model="form" :rules="rules" ref="form" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="form.cat_name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级名称" prop="cat_pid">
          <el-cascader v-model="form.cat_pid" :options="options" :props="props" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="diao-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button @click="addCategory">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      categoryList: [],
      pagesize: 5,
      pagenum: 1,
      total: 0,
      dialogVisible: false,
      form: {
        cat_level: '',
        cat_name: '',
        cat_pid: ''
      },
      rules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: ['change', 'blur']
          }
        ]
      },
      options: [],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        checkStrictly: true
      }
    }
  },
  created () {
    this.getCatelist()
  },
  methods: {
    async getCatelist () {
      const { data, meta } = await this.$axios.get('categories', {
        params: {
          pagesize: this.pagesize,
          pagenum: this.pagenum,
          type: 3
        }
      })
      // console.log(data)
      if (meta.status === 200) {
        this.categoryList = data.result
        this.total = data.total
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getCatelist()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getCatelist()
    },
    async addcate () {
      this.dialogVisible = true
      const { data, meta } = await this.$axios.get('categories?type=2')
      if (meta.status === 200) {
        this.options = data
      }
    },
    async addCategory () {
      // const catName = this.form.cat_name
      const catPid = this.form.cat_pid
      const { meta } = await this.$axios.post('categories', {
        cat_name: this.form.cat_name,
        cat_pid: catPid[catPid.length - 1] || 0,
        cat_level: catPid.length
      })

      if (meta.status === 201) {
        this.$message.success(meta.msg)
        this.dialogVisible = false
        this.getCatelist()
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delcate (id) {
      const { meta } = await this.$axios.delete(`categories/${id}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)

        this.getCatelist()
      } else {
        this.$message.error(meta.msg)
      }
    },
    closeDialog () {
      this.dialogVisible = false
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style>
</style>
