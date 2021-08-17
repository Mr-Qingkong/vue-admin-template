<template>
  <div class="container">
    <div class="search">
      姓名
      <el-input v-model="listQuery.name" label="姓名" />
      <el-button class="searchBtn" type="primary" @click="handleFilter">查询</el-button>
    </div>
    <hr>

    <el-button class="addBtn" type="primary" @click="handleCreate">增加</el-button>
    <mydialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
      >
        <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
          <el-input v-model="temp.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" prop="sex" :label-width="formLabelWidth">
          <el-select v-model="temp.sex" placeholder="请选择性别">
            <el-option
              v-for="item in studentSex"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生日" prop="birthday" :label-width="formLabelWidth">
          <el-input v-model="temp.birthday" />
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">保存</el-button>
      </template>
    </mydialog>
    <el-button class="deleteBtn" type="danger" @click="handleDeleteAll(row,$index)">删除</el-button>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="性别" align="center">
        <template slot-scope="scope"><span>{{ scope.row.sex }}</span></template>
      </el-table-column>
      <el-table-column label="生日" align="center">
        <template slot-scope="scope"><span>{{ scope.row.birthday }}</span></template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row,$index)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import MyDialog from '@/components/MyDialog/index.vue'
import { fetchList, createStudent, updateStudent, deleteStudent } from '@/api/student'

const studentSex = [
  { key: 'male', display_name: '男' },
  { key: 'female', display_name: '女' }
]

export default {
  components: {
    'mydialog': MyDialog
  },
  filters: {
    statusFilter(status) {
      const statusMap = { published: 'success', draft: 'gray', deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: '120px',
      list: null,
      listLoading: true,
      total: 0,
      listQuery: { page: 1, limit: 20, name: undefined, sex: undefined, birthday: undefined, sort: '+id'
      },
      studentSex,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }
      ],
      temp: { name: '', sex: '', birthday: '' },
      dialogStatus: '',
      textMap: { update: '编辑', create: '增加' },
      // 编辑用户信息-表单验证
      rules: {
        name: [{ required: true, message: 'name is required', trigger: 'blur' }],
        sex: [{ required: true, message: 'sex is required', trigger: 'change' }],
        birthday: [{ required: true, message: 'birthday is required', trigger: 'change' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取学生列表
    fetchData() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total
        setTimeout(() => { this.listLoading = false }, 500)
      })
    },
    handleFilter() {
      console.log('search', this.listQuery.name)
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

    // add a student
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          createStudent(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              sex: 'success',
              duration: 2000 })
          })
        }
      })
    },

    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
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
          updateStudent(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              sex: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      // 先提示 ，在删除
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStudent(row)
          .then(response => {
            this.list.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchList()
          })
      })
    },
    handleDeleteAll(row, index) {
      // 先提示 ，在删除
      this.$confirm('此操作将删除下列所有数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteStudent(row)
          .then(response => {
            this.list.splice(index)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchList()
          })
      })
    },
    resetTemp() {
      this.temp = { name: '', sex: '', birthday: ''
      }
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
