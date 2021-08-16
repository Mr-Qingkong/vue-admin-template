<template>
  <div class="container">
    <div class="search">
      姓名
      <el-input v-model="searchName" label="姓名" />
      <el-button class="searchBtn" type="primary">查询</el-button>
    </div>
    <hr>
    <el-button class="addBtn" type="primary" @click="dialogFormVisible = true">增加</el-button>
    <mydialog :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-select v-model="form.sex" placeholder="请选择性别">
            <el-option label="男" value="male" />
            <el-option label="女" value="female" />
          </el-select>
        </el-form-item>
        <el-form-item label="生日" :label-width="formLabelWidth">
          <el-input v-model="form.birthday" suffix-icon="el-icon-date" autocomplete="off" />
        </el-form-item>
      </el-form>
    </mydialog>
    <el-button class="deleteBtn" type="danger" disabled>删除</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">{{ scope.row.username }}</template>
      </el-table-column>
      <el-table-column label="类型" width="110" align="center">
        <template slot-scope="scope"><span>{{ scope.row.type }}</span></template>
      </el-table-column>
      <el-table-column label="Date" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MyDialog from '@/components/MyDialog/index.vue'
import { fetchList, createStudent, updateStudent } from '@/api/student'

const userTypeOptions = [
  { key: 'normal', display_name: '普通会员' },
  { key: 'vip', display_name: 'VIP' },
  { key: 'admin', display_name: '管理员' }
]

export default {
  components: {
    'mydialog': MyDialog
  },
  data() {
    return {
      searchName: '',
      dialogFormVisible: false,
      form: {
        name: '',
        sex: '',
        birthday: ''
      },
      formLabelWidth: '120px',
      list: null,
      listLoading: true,
      total: 0,
      listQuery: { page: 1, limit: 20, username: undefined, type: undefined, sort: '+id'
      },
      userTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }
      ],
      temp: { id: undefined, remark: '', timestamp: new Date(), username: '', password: '', type: '' },
      dialogStatus: '',
      textMap: { update: '编辑', create: '新建' },
      // 编辑用户信息-表单验证
      rules: {
        username: [{
          required: true, message: 'username is required', trigger: 'blur' }],
        password: [{ required: true, message: 'password is required', trigger: 'blur' }],
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // get memebers list
    fetchData() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => { this.listLoading = false }, 500)
      })
    },
    handleFilter() {
      console.log('search', this.listQuery.username)
      this.fetchData()
    },

    // open the dialog
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    // add a memeber
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createStudent(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000 })
          })
        }
      })
    },

    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },

    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateStudent(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    }
  }
}
</script>

<style>
.el-input{
  width: 300px;}
.search{
  margin: 20px;}
.deleteBtn{
  margin-left: 10px;}
</style>
