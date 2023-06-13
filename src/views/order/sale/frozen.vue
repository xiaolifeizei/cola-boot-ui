<template>
  <div>
    <el-button
      class="filter-item"
      size="mini"
      type="warning"
      icon="el-icon-circle-close"
      :disabled="frozenDisabled"
      @click="doFrozen(table.selection[0])"
    >
      冻结
    </el-button>
  </div>
</template>

<script>
import { frozenOrder } from '@/api/order/saleOrder'

export default {
  name: 'SaleOrderFrozen',
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
        this.$alert('您未选择记录', '冻结失败', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('此操作将冻结该订单及该订单下所有的订单明细, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        frozenOrder(row).then(response => {
          this.$notify.success({
            title: '成功',
            message: '冻结订单成功'
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
