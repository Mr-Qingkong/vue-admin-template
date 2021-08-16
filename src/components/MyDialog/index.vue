<template>
  <el-dialog 
  :visible.sync="visible"
  :before-close="handleDialogClose">
    <span slot="title" class="dialog-title">
      biaoti
    </span>

    <el-form ref="formName">
      <slot />
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button id="btnCancel" @click="onBtnCancelClick">取 消</el-button>
      <el-button id="btnOK" @click="onBtnSaveClick('formName')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'MyDialog',
  model: {
    prop: 'visible',
    event: 'visibleChange'
  },
  props: {
    visible: { type: Boolean, default: true }
  },
  data() {
    return {
      queryLoading: false
    }
  },
  methods: {
    /**
     * @description: 取消的时候回调外部时间
     * @param {*}
     * @return {*}
     */
    onBtnCancelClick() {
      this.queryLoading = true
      this.$emit('CancelButtonClick', this)
      this.queryLoading = false
      this.visible = false
    },
    /**
     * @description: 如果操作较长时间则显示进度 如果校验通过则回调父组件定义的保存或者更新操作
     * @param {*} form 表单名
     * @return {*}
     */
    onBtnSaveClick(form) {
      this.$refs[form].validate(
        (valid) => {
          if (valid) {
            this.queryLoading = true
            this.$emit('OkButtonClick', this) // 回调父组件的时间具体业务逻辑由父组件实现
            this.queryLoading = false
            this.visible = false
          }
        })
    },
    handleDialogClose: function() {
      this.queryLoading = true
      this.$emit('handleDialogClose', this)
      this.queryLoading = false
      this.visible = false
    }
  }
}
</script>
