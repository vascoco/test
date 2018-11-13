<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="logout">
        欢迎光临
        <a href="javascript:;" @click="logout">退出</a>
        </div>
      <div class="title">电商后台管理系统</div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
        default-active="1"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        unique-opened
        router>
        <!-- 子菜单1 -->
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/user">
              <i class="el-icon-menu"></i>
             <span slot="title">用户列表</span>
              </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <!-- 子菜单2 -->
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>权限管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="roles">
              <i class="el-icon-menu"></i>
              角色列表
              </el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group>
            <el-menu-item index="rights">
              <i class="el-icon-menu"></i>
              权限列表
              </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
      <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    async logout() {
      try {
        await this.$confirm('是否继续退出?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      } catch (e) {
        this.$message({
          type: 'info',
          message: '取消退出'
        })
      }
    }
  }
}
</script>

<style lang="less" >
.home {
  height: 100%;

  .el-header {
    height: 60px;
    line-height: 60px;
    background-color: #b3c1cd;
    .logo {
      width: 180px;
      height: 100%;
      background-image: url('../assets/logo.png');
      background-size: contain;
      background-position: center center;
      background-repeat: no-repeat;
      float: left;
    }
    .logout {
      width: 180px;
      height: 60px;
      float: right;
      font-weight: 700;
      a {
        color: orangered;
      }
    }
    .title {
      text-align: center;
      font-weight: 700;
      font-size: 30px;
      color: #fff;
      overflow: hidden;
    }
  }

  .el-aside {
    background-color: rgb(84, 92, 100);
    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #eaeef1;
  }
}
</style>
