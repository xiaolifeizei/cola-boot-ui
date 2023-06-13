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
    <el-dialog :append-to-body="true" title="修改订单" :visible.sync="dialogShow" width="921px" :before-close="cancelEdit">
      <el-form ref="editForm" :rules="rules" :inline="true" :model="form" label-width="100px">
        <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="form.orderNo" autocomplete="off" maxlength="100" />
        </el-form-item>
        <el-form-item label="客户" prop="customerId" style="width: 400px">
          <customer-select :customer-id.sync="form.customerId.toString()" :customer-name.sync="form.customerName" :disabled.sync="isShipment" />
        </el-form-item>
        <el-form-item label="订单总量" prop="total">
          <el-input-number v-model="form.total" disabled controls-position="right" :min="0" style="width: 175px;" class="totalClass" />
        </el-form-item>
        <el-form-item label="发运量" prop="shipment" style="width: 400px">
          <el-input-number v-model="form.shipment" disabled controls-position="right" :min="0" style="width: 193px;" />
        </el-form-item>
        <el-form-item label="剩余量" prop="residual">
          <el-input-number v-model="form.residual" disabled controls-position="right" :min="0" style="width: 175px;" />
        </el-form-item>
        <el-form-item label="备注" prop="remark" style="width: 100%">
          <el-input v-model="form.remark" type="textarea" :row="3" autocomplete="off" maxlength="100" style="width: 480px" />
        </el-form-item>
      </el-form>
      <el-divider content-position="left">订单明细</el-divider>
      <el-button type="primary" style="margin-bottom: 10px" @click="addNewLine">添加一行</el-button>
      <el-form ref="subForm" :model="form" :rules="rules">
        <el-table
          ref="subTable"
          :data="form.subOrders"
          fit
          border
          highlight-current-row
          style="width: 100%;"
          class="queryTable"
          size="mini"
        >
          <el-table-column label="物资" align="center" width="250px">
            <template v-slot="scope">
              <el-form-item :prop="'subOrders[' + scope.$index + '].goodsId'" :rules="rules.goodsId" class="subItem">
                <goods-select :goods-id.sync="scope.row.goodsId" :goods-name.sync="scope.row.goodsName" :disabled="scope.row.shipment > 0" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="规格" align="center" width="200px">
            <template v-slot="scope">
              <el-form-item :prop="'subOrders[' + scope.$index + '].goodsSpecId'" class="subItem">
                <goods-spec-select :spec-id.sync="scope.row.goodsSpecId" :goods-id.sync="scope.row.goodsId" :spec-name.sync="scope.row.goodsSpecName" :disabled="scope.row.shipment > 0" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="订单总量" align="center" width="150px">
            <template v-slot="scope">
              <el-form-item :prop="'subOrders[' + scope.$index + '].total'" :rules="rules.total" class="subItem">
                <el-input-number v-model="scope.row.total" controls-position="right" :min="0" :disabled="scope.row.shipment > 0" @change="sumTotal(scope.$index)" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="发运量" align="center" width="150px">
            <template v-slot="scope">
              <el-form-item :prop="'subOrders[' + scope.$index + '].shipment'" class="subItem">
                <el-input-number v-model="scope.row.shipment" controls-position="right" :min="0" disabled />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="剩余量" align="center" width="150px">
            <template v-slot="scope">
              <el-form-item :prop="'subOrders[' + scope.$index + '].residual'" class="subItem">
                <el-input-number v-model="scope.row.residual" controls-position="right" :min="0" disabled />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" align="center" width="200px">
            <template v-slot="scope">
              <el-form-item :prop="'subOrders[' + scope.$index + '].remark'" class="subItem">
                <el-input v-model="scope.row.remark" placeholder="请输入备注" clearable :disabled="scope.row.shipment > 0" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px" align="center">
            <template v-slot="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" :disabled="scope.row.shipment > 0" @click="deleteLine(scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" :loading="editLoading" @click="doEdit">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateSaleOrder } from '@/api/order/saleOrder'
import CustomerSelect from '@/components/Selectors/CustomerSelect'
import GoodsSelect from '@/components/Selectors/GoodsSelect'
import GoodsSpecSelect from '@/components/Selectors/GoodsSpecSelect'

export default {
  name: 'SaleOrderEdit',
  components: { GoodsSpecSelect, GoodsSelect, CustomerSelect },
  data() {
    const checkTotal = function(rule, value, callback) {
      if (value <= 0) {
        return callback(new Error('订单总量必须大于0'))
      } else {
        callback()
      }
    }
    return {
      table: {},
      editDisabled: true,
      dialogShow: false,
      editLoading: false,
      selectedOptions: [],
      isShipment: false,
      form: {
        orderNo: '',
        customerId: '',
        customerName: '',
        total: 0,
        shipment: 0,
        frozen: 0,
        remark: '',
        subOrders: []
      },
      rules: {
        orderNo: [{ required: true, message: '请输入订单编号', trigger: 'blur' }],
        customerId: [{ required: true, message: '请选择客户', trigger: 'blur' }],
        goodsId: [{ required: true, message: '请输入物资', trigger: 'blur' }],
        total: [{ required: true, validator: checkTotal, trigger: 'blur' }]
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
    addNewLine() {
      const newLine = {
        goodsId: '',
        goodsName: '',
        goodsSpecId: '',
        goodsSpecName: '',
        total: 0,
        shipment: 0,
        residual: 0,
        remark: ''
      }
      this.form.subOrders.push(newLine)
    },
    deleteLine(index) {
      this.form.subOrders = this.form.subOrders.filter((_, i) => {
        return index !== i
      })
      this.sumTotal()
    },
    sumTotal(index) {
      this.form.total = 0
      this.form.subOrders.forEach(item => {
        this.form.total += item.total
      })
      this.form.subOrders[index].residual = this.form.subOrders[index].total
    },
    cancelEdit(done) {
      this.$confirm('关闭后数据将丢失，确认关闭？')
        .then(_ => {
          this.dialogShow = false
          this.$refs.editForm.resetFields()
          this.$refs.subForm.resetFields()
          this.form.subOrders = []
          if (done instanceof Function) {
            done()
          } else {
            this.dialogShow = false
          }
        }).catch(_ => {})
    },
    showEdit(row) {
      this.isShipment = false
      this.form = { ...row }
      if (this.form.shipment > 0) {
        this.isShipment = true
      }
      this.form.subOrders = []
      // 关闭所有展开项
      this.$parent.$parent.list.forEach(item => {
        this.$parent.$parent.$refs.queryTable.toggleRowExpansion(item, false)
      })
      this.$parent.$parent.getSaleSubOrderWrapperPageData(row).then(subList => {
        subList.forEach(item => {
          if (item.shipment > 0) {
            this.isShipment = true
          }
          const subOrder = {
            id: item.id,
            goodsId: item.goodsId.toString(),
            goodsName: item.goodsName,
            goodsSpecId: item.goodsSpecId ? item.goodsSpecId.toString() : '',
            goodsSpecName: item.goodsSpecName,
            total: item.total,
            shipment: item.shipment,
            residual: item.residual,
            remark: item.remark
          }
          this.form.subOrders.push(subOrder)
        })
        this.dialogShow = true
      })
    },
    doEdit() {
      this.editLoading = true
      new Promise((resolve) => {
        this.$refs.editForm.validate(valid => {
          if (!valid) {
            throw new Error()
          }
          resolve()
        })
      }).then(() => {
        this.$refs.subForm.validate((valid, row) => {
          if (!valid) {
            throw new Error()
          }
        })
      }).then(() => {
        if (this.form.subOrders.length === 0) {
          this.$notify.error({
            title: '修改失败',
            message: '订单明细不能为空'
          })
          throw new Error()
        }
        updateSaleOrder(this.form).then(() => {
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
          throw new Error('修改失败')
        })
      }).catch(() => {
        this.editLoading = false
      })
    }
  }
}
</script>

<style scoped>
.subItem {
  margin-bottom: 18px;
}
.totalClass /deep/ .el-input__inner {
  color: red;
  font-weight: bold
}
</style>
