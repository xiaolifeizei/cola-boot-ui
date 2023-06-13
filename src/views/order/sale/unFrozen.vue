<template>
  <div>
    <el-button
      class="filter-item"
      size="mini"
      type="success"
      icon="el-icon-circle-check"
      :disabled="frozenDisabled"
      @click="doFrozen(table.selection[0])"
    >
      解冻
    </el-button>
  </div>
</template>

<script>
import { unFrozenOrder } from '@/api/order/saleOrder'

export default {
  name: 'SaleOrderUnFrozen',
  data() {
    return {
      table: {},
      frozenDisabled: true
    }
  },
  watch: {
    'table.selection'() {
      this.frozenDisabled = this.table.selection.length <= 0
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    doFrozen(row) {
      if (!row) {
        this.$alert('您未选择记录', '解冻失败', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('此操作将解除该订单及该订单下所有的订单明细的冻结状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unFrozenOrder(row).then(response => {
          this.$notify.success({
            title: '成功',
            message: '解除订单冻结成功'
          })
          this.table.refresh()
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
