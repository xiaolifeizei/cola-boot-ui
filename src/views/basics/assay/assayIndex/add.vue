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
    <el-dialog :append-to-body="true" title="添加化验指标" :visible.sync="dialogShow" width="600px" @close="cancelAdd">
      <el-form ref="addForm" :rules="rules" :inline="true" :model="form" label-width="120px">
        <el-form-item label="选择物资" prop="name">
          <goods-select :goods-id.sync="form.goodsId" select-style="width: 400px" />
        </el-form-item>
        <el-form-item label="化验指标名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" maxlength="100" style="width: 400px" />
        </el-form-item>
        <el-form-item label="是否禁用" prop="noUse">
          <el-select v-model="form.noUse">
            <el-option v-for="item in this.$data.$dictValues['whether']" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" :row="3" autocomplete="off" maxlength="100" style="width: 400px" />
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
import { addAssayIndex } from '@/api/basics/assay/assayIndex'
import GoodsSelect from '@/components/Selectors/GoodsSelect'

export default {
  name: 'AssayIndexAdd',
  components: { GoodsSelect },
  data() {
    return {
      table: {},
      dialogShow: false,
      addLoading: false,
      selectedOptions: [],
      form: {
        name: '',
        noUse: 0,
        remark: '',
        goodsId: ''
      },
      rules: {
        name: [{ required: true, message: '请输入化验指标名称', trigger: 'blur' }],
        goodsId: [{ required: true, message: '请选择物资', trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
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
          addAssayIndex(this.form).then(response => {
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
