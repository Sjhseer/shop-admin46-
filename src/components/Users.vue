<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input
      @keyup.enter.native="searchUser"
      placeholder="请输入搜索关键字"
      v-model="query"
      class="input-with-select"
    >
      <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button @click="showaddDialog" class="addbtn" type="success" plain>添加用户</el-button>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" @close="closeDialog" :visible.sync="dialogVisible" width="40%">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input placeholder="请输入邮箱" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input placeholder="请输入手机号" v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button @click="addUser" type="primary">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editVisible" width="40%">
      <el-form ref="editform" :model="editform" :rules="rules" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{ editform.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button @click="ttuser" type="primary">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="userlist" style="width: 100%">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="obj">
          <el-switch
            @change="changeUser(obj.row)"
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="obj">
          <el-button @click="edituser(obj.row)" size="small" type="primary" icon="el-icon-edit"></el-button>
          <el-button @click="deluser(obj.row.id)" size="small" type="danger" icon="el-icon-delete"></el-button>
          <el-button size="small" type="success" icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2,4,6,8]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      query: '', // 搜索关键字
      pagenum: 1, // 当前页
      pagesize: 2, // 每页条数
      userlist: [],
      total: 0,
      dialogVisible: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur', 'change']
          },
          {
            min: 6,
            max: 12,
            message: '长度在 6到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            type: 'email',
            message: '请输入正确的邮箱',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号',
            trigger: ['blur', 'change']
          }
        ]
      },
      // 修改数据提交
      editVisible: false,
      editform: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      }
    }
  },
  created () {
    this.getuserlist()
  },
  methods: {
    async getuserlist () {
      const { data, meta } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.userlist = data.users
        this.total = data.total
      } else {
        this.$message.error(meta.msg)
      }
      // this.$axios
      //   .get('users', {
      //     params: {
      //       query: this.query,
      //       pagenum: this.pagenum,
      //       pagesize: this.pagesize
      //     }
      //   })
      //   .then(res => {
      //     console.log(res)
      //     const { data, meta } = res
      //     if (meta.status === 200) {
      //       this.userlist = data.users
      //       console.log(this.userlist)
      //     } else {
      //       this.$message.error(meta.msg)
      //     }
      //   })
    },
    // 删除功能
    async deluser (id) {
      try {
        await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userlist.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getuserlist()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log('sssssssss')
      }
    },
    // 添加用户功能
    showaddDialog () {
      this.dialogVisible = true
    },
    async addUser () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('users', this.form)

        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.dialogVisible = false
          this.total++
          this.pagenum = Math.ceil(this.total / this.pagesize)
          this.getuserlist()
        } else {
          this.$message(meta.msg)
        }
      } catch (e) {
        console.log('xxxxxxxxxxx')
      }
    },
    // 清空表单
    closeDialog () {
      // console.log('对话框关闭了')
      this.$refs.form.resetFields()
    },
    // 分页器
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getuserlist()
    },
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      // 更新当前页
      this.pagenum = val
      // 重新渲染
      this.getuserlist()
    },
    // 搜索功能
    searchUser () {
      this.pagenum = 1
      this.getuserlist()
    },
    // 修改状态
    async changeUser (row) {
      const { meta } = await this.$axios.put(
        `users/${row.id}/state/${row.mg_state}`
      )
      console.log(meta)
      if (meta.status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 修改用户资料
    edituser (row) {
      this.editVisible = true
      this.editform.id = row.id
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
    },
    async ttuser () {
      try {
        await this.$refs.editform.validate()
        const { id, email, mobile } = this.editform
        const { meta } = await this.$axios.put(`users/${id}`, {
          email,
          mobile
        })
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.editVisible = false
          this.getuserlist()
        } else {
          this.$message.errot(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang='scss' spoced>
.users {
  .input-with-select {
    width: 300px;
  }
  .addbtn {
    margin-left: 20px;
  }
}
</style>
