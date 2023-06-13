<template>
  <div class="query-content">
    <el-form ref="queryForm" :model="query.data" :inline="true">
      <el-form-item prop="orderNo">
        <el-input v-model="query.data.orderNo" :clearable="true" placeholder="请输入订单编号" />
      </el-form-item>
      <el-form-item prop="customerId">
        <customer-select :customer-id.sync="query.data.customerId" />
      </el-form-item>
      <el-form-item prop="goodsId">
        <goods-select :goods-id.sync="query.data.goodsId" />
      </el-form-item>
      <el-form-item prop="frozen">
        <el-select v-model="query.data.frozen" placeholder="是否冻结">
          <el-option v-for="item in this.$data.$dictValues['whether']" :key="item.value" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="doQuery"> 查 询 </el-button>
      <el-button type="success" icon="el-icon-refresh-right" @click="doReset"> 重 置 </el-button>
    </el-form>
  </div>
</template>

<script>

import CustomerSelect from '@/components/Selectors/CustomerSelect'
import GoodsSelect from '@/components/Selectors/GoodsSelect'
export default {
  name: 'SaleOrderQuery',
  components: { GoodsSelect, CustomerSelect },
  props: {
    query: {
      require: true,
      type: Object,
      default() {
        return {
          data: {
            orderNo: '',
            customerId: '',
            goodsId: '',
            frozen: ''
          },
          currentPage: 0
        }
      }
    }
  },
  data() {
    return {
      table: {}
    }
  },
  mounted() {
    this.table = this.$parent.$parent.$children.find(vc => vc && vc.tableId)
  },
  methods: {
    doQuery() {
      this.query.currentPage = 0
      this.table.refresh()
    },
    doReset() {
      this.query.currentPage = 0
      this.$refs.queryForm.resetFields()
      this.table.refresh()
    }
  }
}
</script>

<style scoped>

</style>
