<template>
  <div>
    <el-button
      class="filter-item"
      size="mini"
      type="primary"
      icon="el-icon-plus"
      @click="showAdd"
    >
      新增
    </el-button>
    <el-dialog :append-to-body="true" title="添加运输公司" :visible.sync="dialogShow" width="600px" @close="cancelAdd">
      <el-form ref="addForm" :rules="rules" :model="form" label-width="80px">
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
        <el-button type="primary" :loading="addLoading" @click="doAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addTransitCompany } from '@/api/basics/transitCompany'
import { regionData, CodeToText } from 'element-china-area-data'

export default {
  name: 'TransitCompanyAdd',
  data() {
    return {
      table: {},
      dialogShow: false,
      addLoading: false,
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
    showAdd() {
      this.dialogShow = true
    },
    cancelAdd() {
      this.$refs.addForm.resetFields()
    },
    doAdd() {
      this.addLoading = true
      this.$refs.addForm.validate(valid => {
        if (valid) {
          addTransitCompany(this.form).then(response => {
            this.$refs.addForm.resetFields()
            this.dialogShow = false
            this.addLoading = false
            this.table.refresh()
            this.$notify.success({
              title: '成功',
              message: '添加成功'
            })
          }).catch(() => {
            this.addLoading = false
          })
        }
        this.addLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
