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
    <el-dialog :append-to-body="true" title="添加订单" :visible.sync="dialogShow" :before-close="cancelAdd" width="921px">
      <el-form ref="addForm" :rules="rules" :inline="true" :model="form" label-width="100px">
        <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="form.orderNo" autocomplete="off" maxlength="100" />
        </el-form-item>
        <el-form-item label="客户" prop="customerId" style="width: 400px">
          <customer-select :customer-id.sync="form.customerId" />
        </el-form-item>
        <el-form-item label="订单总量" prop="total">
          <el-input-number v-model="form.total" disabled controls-position="right" :min="0" style="width: 175px;" class="totalClass" />
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
                <goods-select :goods-id.sync="scope.row.goodsId" :goods-name.sync="scope.row.goodsName" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="规格" align="center" width="200px">
            <template v-slot="scope">
              <el-form-item :prop="'subOrders[' + scope.$index + '].goodsSpecId'" class="subItem">
                <goods-spec-select :spec-id.sync="scope.row.goodsSpecId" :goods-id.sync="scope.row.goodsId" :spec-name.sync="scope.row.goodsSpecName" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="订单总量" align="center" width="150px">
            <template v-slot="scope">
              <el-form-item :prop="'subOrders[' + scope.$index + '].total'" :rules="rules.total" class="subItem">
                <el-input-number v-model="scope.row.total" controls-position="right" :min="0" @change="sumTotal" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" align="center" width="200px">
            <template v-slot="scope">
              <el-form-item :prop="'subOrders[' + scope.$index + '].remark'" class="subItem">
                <el-input v-model="scope.row.remark" placeholder="请输入备注" clearable />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80px" align="center">
            <template v-slot="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteLine(scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="doAdd">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addSaleOrder } from '@/api/order/saleOrder'
import CustomerSelect from '@/components/Selectors/CustomerSelect'
import GoodsSelect from '@/components/Selectors/GoodsSelect'
import GoodsSpecSelect from '@/components/Selectors/GoodsSpecSelect'

export default {
  name: 'SaleOrderAdd',
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
      dialogShow: false,
      addLoading: false,
      selectedOptions: [],
      form: {
        orderNo: '',
        customerId: '',
        total: 0,
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
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    addNewLine() {
      const newLine = {
        goodsId: '',
        goodsName: '',
        goodsSpecName: '',
        goodsSpecId: '',
        total: 0,
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
    sumTotal() {
      this.form.total = 0
      this.form.subOrders.forEach(item => {
        this.form.total += item.total
      })
    },
    showAdd() {
      this.dialogShow = true
    },
    cancelAdd(done) {
      this.$confirm('关闭后数据将丢失，确认关闭？')
        .then(_ => {
          this.$refs.addForm.resetFields()
          this.$refs.subForm.resetFields()
          if (done instanceof Function) {
            done()
          } else {
            this.dialogShow = false
          }
        }).catch(_ => {})
    },
    doAdd() {
      this.addLoading = true
      new Promise((resolve) => {
        this.$refs.addForm.validate(valid => {
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
            title: '添加失败',
            message: '订单明细不能为空'
          })
          throw new Error()
        }
        addSaleOrder(this.form).then(() => {
          this.$refs.addForm.resetFields()
          this.dialogShow = false
          this.addLoading = false
          this.form.subOrders = []
          this.table.refresh()
          this.$notify.success({
            title: '成功',
            message: '添加成功'
          })
        }).catch(() => {
          this.addLoading = false
          throw new Error('添加失败')
        })
      }).catch(() => {
        this.addLoading = false
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
