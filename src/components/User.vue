<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to='/home'>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
     <el-input placeholder="请输入关键字" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
    </el-input>
    <el-button type="success"  plain @click="addUserDialog">添加用户</el-button>

    <!-- 弹出添加用户的模态框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="addForm" label-width="80px" ref="addForm" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑的模态框 -->
    <el-dialog
      title="提示"
      :visible.sync="editorVisible"
      width="40%">
      <el-form :model="editForm" label-width="80px" ref="editForm" :rules="rules">
        <el-form-item label="用户名" >
           <el-tag>{{ editForm.username }}</el-tag>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
           <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
           <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editorVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

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
            inactive-color="#ff4949"
            @change="editState(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="small" plain @click="editUserDialog(scope.row)"></el-button>
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
      // 渲染需要的数据
      userlist: [],
      // 添加用户的模态框显示
      dialogVisible: false,
      // 添加用户的模态框需要的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editorVisible: false,
      editForm: {
        id: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 5, max: 9, message: '长度在 5 到 9 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度在6到12个字符', trigger: 'blur' }
        ],
        email: [{ type: 'email', message: '请输入邮箱', tigger: 'blur' }],
        mobile: [
          { Pattern: /^1\d{10}$/, message: '请输入手机号', tigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 封装渲染
    async render() {
      let res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pageSize
        }
      })
      let {
        meta: { status },
        data: { users, total }
      } = res
      if (status === 200) {
        this.userlist = users
        this.total = total
      }
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
    async del(id) {
      await this.$confirm('是否继续删除操作?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      let res = await this.axios({
        url: `users/${id}`,
        method: 'delete'
      })
      if (res.meta.status === 200) {
        // 如果返回的数据数组长度等于1 并且 当前页大于1  就让当前页减1
        if (this.userlist.length === 1 && this.currentPage > 1) {
          this.currentPage--
        }
        this.render()
      }
    },
    // 搜索用户
    // axios 里也需要传入一个query
    search() {
      this.currentPage = 1
      this.render()
    },
    // 弹出添加模态框
    addUserDialog() {
      this.dialogVisible = true
    },
    // 添加用户
    addUser() {
      this.$refs.addForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios({
          url: 'users',
          method: 'post',
          data: this.addForm
        })
        console.log(res)
        let {
          meta: { status }
        } = res
        if (status === 201) {
          // 因为后台接口没有倒序.所以需要前端手动设置,重新定义currentpage的值倒最后一页
          // total ++ 是模拟数据增加,bug:增加的时候不会翻页
          this.total++
          this.currentPage = Math.ceil(this.total / this.pageSize)
          // 重新渲染
          this.render()
          // 关闭模态框
          this.dialogVisible = false
          // 清空列表的数据
          this.$refs.addForm.resetFields()
        }
      })
    },
    // switch 提供的一个方法用来检测switch的变化
    async editState({ id, mg_state: mgState }) {
      let res = await this.axios({
        url: `users/${id}/state/${mgState}`,
        method: 'put'
      })
      if (res.meta.status === 200) {
        this.$message.success('状态设置成功')
      } else {
        this.$message.error('状态设置失败')
      }
    },
    // 弹出编辑用户模态框
    editUserDialog(user) {
      // console.log(user)
      this.editorVisible = true
      this.editForm.id = user.id
      this.editForm.username = user.username
      this.editForm.email = user.email
      this.editForm.mobile = user.mobile
    },
    // 编辑用户
    editUser() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return false
        let res = await this.axios({
          url: `users/${this.editForm.id}`,
          method: 'put',
          data: this.editForm
        })
        let {
          meta: { status }
        } = res
        if (status === 200) {
          this.render()
          // 清楚表单的验证状态
          this.$refs.editForm.resetFields()
          // 关闭模态框
          this.editorVisible = false
          // 提示信息
          this.$message.success('更新信息成功')
        } else {
          this.$message.error('更新用户失败')
        }
      })
    }
  },
  // 钩子函数页面生成就直接渲染
  created() {
    this.render()
  }
}
</script>

<style>

.el-input {
  width: 280px;
  margin-bottom: 10px;
}
</style>
