<template>
<div class="container">
  <el-form ref="form" :rules="rules" :model="form" label-width="80px" status-icon>
    <div class="logo">
      <img src="../assets/user.jpg" alt="">
    </div>
  <el-form-item label="用户名" prop="username">
    <el-input v-model="form.username"></el-input>
  </el-form-item>
  <el-form-item label="密码" prop="password">
    <el-input v-model="form.password" type="password" @click.native="login"></el-input>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="login" >立即创建</el-button>
    <el-button @click="reset" >重置</el-button>
  </el-form-item>
</el-form>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '密码长度在6到12个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    login() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          let res = await axios({
            url: 'http://localhost:8888/api/private/v1/login',
            method: 'post',
            data: this.form
          })
          if (res.meta.status === 200) {
            this.$message.success('登陆成功')
            localStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          } else {
            this.$message.error('用户名或密码错误')
          }
        } else {
          return false
        }
      })
    },
    reset() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #2d434c;
  .el-form {
    width: 400px;
    padding: 70px 30px 15px 10px;
    background-color: #fff;
    border-radius: 20px;
    margin: 200px auto;
    position: relative;

    .logo {
      img {
        width: 100px;
        height: 100px;
        position: absolute;
        top: -60px;
        left: 50%;
        transform: translateX(-50%);
        border: 10px solid #fff;
        border-radius: 50%;
      }
    }
    button:nth-child(2) {
      margin-left: 70px;
    }
  }
}
</style>
