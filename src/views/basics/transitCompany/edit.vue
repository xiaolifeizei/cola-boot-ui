<template>
  <div>
    <el-button
      class="filter-item"
      size="mini"
      type="success"
      icon="el-icon-edit"
      :disabled="editDisabled"
      @click="showEdit(table.selection[0])"
    >
      修改
    </el-button>
    <el-dialog :append-to-body="true" title="修改运输公司" :visible.sync="dialogShow" width="600px" @close="cancelEdit">
      <el-form ref="editForm" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" maxlength="100" style="width: 445px" />
        </el-form-item>
        <el-form-item label="简称" prop="shortName">
          <el-input v-model="form.shortName" autocomplete="off" maxlength="100" style="width: 445px" />
        </el-form-item>
        <el-form-item label="省/市/区" style="width: 100%">
          <el-cascader
            v-model="selectedOptions"
            :options="options"
            style="width: 445px"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" autocomplete="off" maxlength="100" style="width: 445px" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :row="3" autocomplete="off" maxlength="100" style="width: 445px" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="primary" :loading="editLoading" @click="doEdit">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateTransitCompany } from '@/api/basics/transitCompany'
import { CodeToText, regionData, TextToCode } from 'element-china-area-data'

export default {
  name: 'TransitCompanyEdit',
  data() {
    return {
      table: {},
      editDisabled: true,
      dialogShow: false,
      editLoading: false,
      options: regionData,
      selectedOptions: [],
      form: {
        name: '',
        shortName: '',
        province: '',
        city: '',
        area: '',
        address: '',
        remark: ''
      },
      rules: {
        name: [{ required: true, message: '请输入运输公司名称', trigger: 'blur' }],
        shortName: [{ required: true, message: '请输入运输公司简称', trigger: 'blur' }]
      }
    }
  },
  watch: {
    'table.selection'() {
      this.editDisabled = this.table.selection.length !== 1
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    handleChange(value) {
      if (value instanceof Array && value.length === 3) {
        this.form.province = CodeToText[value[0]]
        this.form.city = CodeToText[value[1]]
        this.form.area = CodeToText[value[2]]
      }
    },
    cancelEdit() {
      this.dialogShow = false
      this.$refs.editForm.resetFields()
    },
    showEdit(row) {
      this.form = { ...row }
      this.dialogShow = true
      if (TextToCode[this.form.province] && TextToCode[this.form.province][this.form.city] && TextToCode[this.form.province][this.form.city][this.form.area]) {
        this.selectedOptions.push(TextToCode[this.form.province].code)
        this.selectedOptions.push(TextToCode[this.form.province][this.form.city].code)
        this.selectedOptions.push(TextToCode[this.form.province][this.form.city][this.form.area].code)
      }
    },
    doEdit() {
      this.editLoading = true
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateTransitCompany(this.form).then(() => {
            this.$refs.editForm.resetFields()
            this.editLoading = false
            this.dialogShow = false
            this.table.refresh()
            this.$notify.success({
              title: '成功',
              message: '修改成功'
            })
          }).catch(() => {
            this.editLoading = false
          })
        } else {
          this.editLoading = false
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
