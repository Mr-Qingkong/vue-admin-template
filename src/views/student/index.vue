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
  </div>
</template>

<script>
import MyDialog from '@/components/MyDialog/index.vue'

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
      formLabelWidth: '120px'
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
