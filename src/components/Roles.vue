<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button @click="addroles" type="success" plain>添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="rolesList" style="width: 100%">
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
          <el-row class="roww" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4">
              <el-tag @close="delroles(row,l1.id)" closable>{{l1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row class="row1" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4">
                  <el-tag
                    @close="delroles(row,l2.id)"
                    class="l2"
                    closable
                    type="success"
                  >{{ l2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="delroles(row,l3.id)"
                    class="l3"
                    type="warning"
                    closable
                    v-for="l3 in l2.children"
                    :key="l3.id"
                  >{{l3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>

      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{row}">
          <el-button
            @click="primaryshow(row)"
            type="primary"
            icon="el-icon-edit"
            plain
            size="small"
          ></el-button>
          <el-button
            @click="delroles1(row.id)"
            type="danger"
            icon="el-icon-delete"
            plain
            size="small"
          ></el-button>
          <el-button @click="show(row)" type="success" icon="el-icon-check" plain size="small">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限框 -->
    <el-dialog title="分配权限" :visible.sync="assignVisible" width="40%">
      <el-tree
        :data="data"
        show-checkbox
        default-expand-all
        node-key="id"
        ref="tree"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button @click="sRole" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加和修改共用 -->
    <el-dialog @close="closeDialog" :title="dialogtitle" :visible.sync="ggVisible" width="40%">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ggVisible = false">取 消</el-button>
        <el-button @click="sure1" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleId: '',
      dialogtitle: '',
      ggVisible: false,
      rolesList: [],
      data: [],
      assignVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      addVisible: false,
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: ['blur', 'change']
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created () {
    this.getrolesList()
  },
  methods: {
    async getrolesList () {
      const { data, meta } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.rolesList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    //
    async delroles (row, rightId) {
      const { data, meta } = await this.$axios.delete(
        `roles/${row.id}/rights/${rightId}`
      )
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 显示权限模态框
    async show (row) {
      this.assignVisible = true
      this.roleId = row.id
      const { data, meta } = await this.$axios.get('rights/tree')
      console.log(data, meta)
      if (meta.status === 200) {
        this.data = data
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 分配权限
    async sRole () {
      const ids = this.$refs.tree.getCheckedKeys()
      const half = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...half].join(',')
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, {
        rids
      })
      console.log(meta)
      if (meta.status === 200) {
        this.$message.success('修改成功')
        this.assignVisible = false
        this.getrolesList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    // 添加和修改
    addroles () {
      this.dialogtitle = '添加用户'
      this.ggVisible = true
    },
    // 回显
    primaryshow (row) {
      this.dialogtitle = '修改用户'
      this.ggVisible = true
      this.$nextTick(() => {
        this.form.id = row.id
        this.form.roleName = row.roleName
        this.form.roleDesc = row.roleDesc
      })
    },
    // 清空内容
    closeDialog () {
      this.$refs.form.resetFields()
      this.form.id = ''
    },
    async sure1 () {
      try {
        await this.$refs.form.validate()
        const iADD = this.dialogtitle === '添加用户'
        const url = iADD ? 'roles' : `roles/${this.form.id}`
        const method = iADD ? 'post' : 'put'
        const { meta } = await this.$axios[method](url, this.form)
        if (meta.status === 200 || meta.status === 201) {
          this.$message.success('恭喜，操作成功')
          this.ggVisible = false
          this.getrolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    // 删除功能
    async delroles1 (id) {
      try {
        await this.$confirm('亲, 你确认要删除么?', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getrolesList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scopred>
.roles {
  .roww {
    margin-bottom: 10px;
    border-bottom: 1px solid #ccc;
  }
  .row1 {
    margin-bottom: 10px;
  }
  .l2 {
    margin-right: 5px;
  }
  .l3 {
    margin-right: 5px;
  }
}
</style>
