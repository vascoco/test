<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to='/user'>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
     <el-input placeholder="请输入关键字" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success"  plain>添加用户</el-button>
    <!-- 这里需要绑定data里的数据 -->
    <!-- 每一项prop都对应数据里的名字 -->
    <el-table
      :data="userlist"
      style="width: 100%">
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机"
        width="180">
      </el-table-column>
      <el-table-column
        label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" plain @click="del(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" size="small" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <!-- 需要给分页插件注册两个时间-文档 -->
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[2,4,6,8]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
      @current-change="handleCP"
      @size-change="handleSC" >
    </el-pagination>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      // 关键字
      query: '',
      // 每页几条
      pageSize: 2,
      // 当前页数
      currentPage: 1,
      total: 0,
      userlist: []
    }
  },
  methods: {
    // 封装渲染
    render() {
      axios({
        method: 'get',
        url: 'http://localhost:8888/api/private/v1/users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      }).then(res => {
        if (res.data.meta.status === 200) {
          console.log(res.data)
          this.userlist = res.data.data.users
          this.total = res.data.data.total
        }
      })
    },
    // 页码查询
    handleCP(val) {
      this.currentPage = val
      this.render()
    },
    // 条数查询
    handleSC(val) {
      this.pageSize = val
      this.render()
    },
    // 删除用户
    del(id) {
      this.$confirm('是否继续删除操作?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        axios({
          url: `http://localhost:8888/api/private/v1/users/${id}`,
          method: 'delete',
          headers: {
            Authorization: localStorage.getItem('token')
          }
        }).then(res => {
          if (res.data.meta.status === 200) {
            console.log(res.data)
            // 如果返回的数据数组长度等于1 并且 当前页大于1  就让当前页减1
            if (this.userlist.length === 1 && this.currentPage > 1) {
              this.currentPage--
            }
            this.render()
          }
        })
      })
    },
    // 搜索用户
    // axios 里也需要传入一个query
    search() {
      this.currentPage = 1
      this.render()
    }
  },
  // 钩子函数页面生成就直接渲染
  created() {
    this.render()
  }
}
</script>

<style>
.el-breadcrumb {
  height: 40px;
  line-height: 40px;
}
.el-input {
  width: 280px;
  margin-bottom: 10px;
}
</style>
