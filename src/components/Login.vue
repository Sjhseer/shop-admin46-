<template>
  <div class="login">
    <el-form ref="form" status-icon :model="form" :rules="rules" label-width="80px">
      <img src="../assets/dbc.png" alt />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="fn" id="login-mr" type="primary">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入正确的用户名',
            trigger: ['blur', 'change']
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入正确的密码',
            trigger: ['blur', 'change']
          },
          {
            min: 6,
            max: 10,
            message: '长度在 6到 10个字符',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    // fn () {
    //   this.$refs.form.validate(isvalid => {})
    // axios({
    //   method: 'post',
    //   url: 'http://localhost:8888/api/private/v1/login',
    //   data: this.form
    // }).then(res => {
    //   const { meta } = res.data
    //   if (res.data.meta.status === 200) {
    //     console.log(res.data.meta.msg)
    //     this.$message({
    //       message: meta.msg,
    //       type: 'success',
    //       duration: 1000
    //     })
    //     this.$router.push({ name: 'index' })
    //   } else {
    //     console.log(res.data)
    //     this.$message({
    //       message: meta.msg,
    //       type: 'error',
    //       duration: 1000
    //     })
    //   }
    // })
    fn () {
      this.$refs.form.validate(isValid => {
        if (!isValid) return console.log(1)
      })
      this.$axios.post('login', this.form).then(res => {
        console.log(res)
        const { meta, data } = res
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$message({
            showClose: true,
            message: meta.msg,
            duration: 1000,
            type: 'success'
          })
          this.$router.push('/index')
        } else {
          this.$message({
            message: meta.msg,
            duration: 1000,
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
}
.el-form {
  background-color: #fff;
  width: 400px;

  padding: 20px;
  padding-top: 70px;
  margin: 0 auto;
  margin-top: 200px;
  border-radius: 20px;
  position: relative;
}
img {
  position: absolute;
  left: 50%;
  transform: translate(-50%);
  top: -90px;
  border-radius: 50%;
  border: 5px solid #fff;
}
#login-mr {
  margin-right: 100px;
}
</style>
