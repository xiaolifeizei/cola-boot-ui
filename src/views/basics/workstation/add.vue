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
    <el-dialog :append-to-body="true" title="添加工作站" :visible.sync="dialogShow" width="600px" @close="cancelAdd">
      <el-form ref="addForm" :rules="rules" :inline="true" :model="form" label-width="100px">
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
        <el-button type="primary" :loading="addLoading" @click="doAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addWorkstation } from '@/api/basics/workstation'
import GroupSelect from '@/components/Selectors/GroupSelect'

export default {
  name: 'WorkstationAdd',
  components: { GroupSelect },
  data() {
    return {
      table: {},
      dialogShow: false,
      addLoading: false,
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
          addWorkstation(this.form).then(response => {
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
