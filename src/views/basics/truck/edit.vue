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
    <el-dialog :append-to-body="true" title="修改车辆" :visible.sync="dialogShow" width="600px" @close="cancelEdit">
      <el-form ref="editForm" :rules="rules" :inline="true" :model="form" label-width="80px">
        <el-form-item label="车号" prop="truckNo">
          <truck-no-select prefix="鲁" :truck-no.sync="form.truckNo" />
        </el-form-item>
        <el-form-item label="行驶证号" prop="license">
          <el-input v-model="form.license" autocomplete="off" maxlength="100" style="width: 445px" />
        </el-form-item>
        <el-form-item label="车辆类型" prop="truckType">
          <el-select v-model="form.truckType" style="width: 150px">
            <el-option v-for="item in this.$data.$dictValues['truckType']" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="车轴数" prop="axleCount">
          <el-select v-model="form.axleCount" style="width: 150px">
            <el-option v-for="item in this.$data.$dictValues['axleCount']" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="RFID" prop="rfidNo">
          <el-input v-model="form.rfidNo" autocomplete="off" maxlength="100" style="width: 445px" />
        </el-form-item>
        <el-form-item label="IC卡号" prop="icNo">
          <el-input v-model="form.icNo" autocomplete="off" maxlength="100" style="width: 445px" />
        </el-form-item>
        <el-form-item label="皮重" prop="tare">
          <el-input-number v-model="form.tare" controls-position="right" :min="0" style="width: 150px" />
        </el-form-item>
        <el-form-item label="核载重量" prop="netWeight">
          <el-input-number v-model="form.netWeight" controls-position="right" :min="0" style="width: 150px" />
        </el-form-item>
        <el-form-item label="联系人" prop="contacts">
          <el-input v-model="form.contacts" autocomplete="off" maxlength="100" style="width: 445px" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="form.phone" autocomplete="off" maxlength="100" style="width: 445px" />
        </el-form-item>
        <el-form-item label="是否禁用" prop="noUse">
          <el-select v-model="form.noUse" style="width: 175px">
            <el-option v-for="item in this.$data.$dictValues['whether']" :key="item.value" :value="item.value" :label="item.name" />
          </el-select>
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
import { updateTruck } from '@/api/basics/truck'
import TruckNoSelect from '@/components/Selectors/TruckNoSelect'

export default {
  name: 'TruckEdit',
  components: { TruckNoSelect },
  data() {
    return {
      table: {},
      editDisabled: true,
      dialogShow: false,
      editLoading: false,
      selectedOptions: [],
      form: {
        truckNo: '',
        truckType: '',
        axleCount: '',
        rfidNo: '',
        icNo: '',
        netWeight: 0,
        tare: 0,
        contacts: '',
        phone: '',
        license: '',
        noUse: 0,
        remark: ''
      },
      rules: {
        truckNo: [{ required: true, message: '请输入车号', trigger: 'blur' }],
        truckType: [{ required: true, message: '请选择车辆类型', trigger: 'blur' }],
        axleCount: [{ required: true, message: '请选择车辆轴数', trigger: 'blur' }]
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
          updateTruck(this.form).then(() => {
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
