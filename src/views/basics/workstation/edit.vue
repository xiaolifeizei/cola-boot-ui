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
      <el-form ref="editForm" :rules="rules" :inline="true" :model="form" label-width="100px">
        <el-form-item label="工作站名称" prop="name">
          <el-input v-model="form.name" autocomplete="off" maxlength="100" style="width: 445px" />
        </el-form-item>
        <el-form-item label="工作站编码" prop="code">
          <el-input v-model="form.code" autocomplete="off" maxlength="100" style="width: 445px" />
        </el-form-item>
        <el-form-item label="工作站类型" prop="stationType">
          <el-select v-model="form.stationType">
            <el-option v-for="item in this.$data.$dictValues['stationType']" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否禁用" prop="noUse">
          <el-select v-model="form.noUse">
            <el-option v-for="item in this.$data.$dictValues['whether']" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属机构" prop="groupId">
          <group-select :selections.sync="form.groupId" :multiple="false" :flat="true" tree-style="width: 190px" />
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
import { updateWorkstation } from '@/api/basics/workstation'
import GroupSelect from '@/components/Selectors/GroupSelect'

export default {
  name: 'WorkstationEdit',
  components: { GroupSelect },
  data() {
    return {
      table: {},
      editDisabled: true,
      dialogShow: false,
      editLoading: false,
      selectedOptions: [],
      form: {
        name: '',
        code: '',
        stationType: '',
        noUse: 0,
        remark: '',
        groupId: ''
      },
      rules: {
        name: [{ required: true, message: '请输入工作站名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入工作站编码', trigger: 'blur' }],
        groupId: [{ required: true, message: '请选择所属机构', trigger: 'blur' }],
        stationType: [{ required: true, message: '请选择工作站类型', trigger: 'blur' }]
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
    cancelEdit() {
      this.dialogShow = false
      this.$refs.editForm.resetFields()
    },
    showEdit(row) {
      this.form = { ...row }
      this.dialogShow = true
    },
    doEdit() {
      this.editLoading = true
      this.$refs.editForm.validate(valid => {
        if (valid) {
          updateWorkstation(this.form).then(() => {
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
