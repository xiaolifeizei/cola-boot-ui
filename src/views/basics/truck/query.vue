<template>
  <div class="query-content">
    <el-form ref="queryForm" :model="query.data" :inline="true">
      <el-form-item prop="truckNo">
        <el-input v-model="query.data.truckNo" :clearable="true" placeholder="请输入车号" />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="doQuery"> 查 询 </el-button>
      <el-button type="success" icon="el-icon-refresh-right" @click="doReset"> 重 置 </el-button>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'TruckQuery',
  props: {
    query: {
      require: true,
      type: Object,
      default() {
        return {
          data: {
            truckNo: ''
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
