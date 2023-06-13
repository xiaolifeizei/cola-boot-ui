<template>
  <div class="app-container">
    <table-query>
      <query :query.sync="query" />
    </table-query>
    <table-header :columns="columns">
      <template>
        <add />
        <edit ref="btnEdit" />
        <delete ref="btnDel" />
        <frozen ref="frozen" />
        <un-frozen ref="unFrozen" />
      </template>
    </table-header>
    <el-table
      ref="queryTable"
      v-loading="tableLoading"
      :data="list"
      fit
      border
      highlight-current-row
      style="width: 100%"
      class="queryTable"
      size="mini"
      @expand-change="rowExpand"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="expand">
        <template v-slot="prop">
          <el-table :data="subList" border fit highlight-current-row>
            <el-table-column label="订单编号" prop="orderNo" align="center" width="150px" />
            <el-table-column label="物资" prop="goodsName" align="center" />
            <el-table-column label="规格" prop="goodsSpecName" align="center" />
            <el-table-column label="订单总量" prop="total" align="center" width="150px" />
            <el-table-column label="发运量" prop="shipment" align="center" width="150px" />
            <el-table-column label="剩余量" prop="residual" align="center" width="150px" />
            <el-table-column label="是否冻结" prop="frozen" align="center" width="150px">
              <template v-slot="scope">
                {{ $dict('whether', scope.row.frozen) }}
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" align="center" width="300px" />
            <el-table-column label="操作" width="60px" align="center">
              <template v-slot="scope">
                <div style="display: flex;">
                  <el-tooltip v-if="scope.row.frozen === 0" class="item" effect="dark" content="冻结" placement="top">
                    <el-button type="warning" icon="el-icon-circle-close" size="mini" @click="frozen(scope.row,prop.row)" />
                  </el-tooltip>
                  <el-tooltip v-else class="item" effect="dark" content="解冻" placement="top">
                    <el-button type="success" icon="el-icon-circle-check" size="mini" @click="unFrozen(scope.row,prop.row)" />
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column align="center" type="selection" width="60" />
      <el-table-column v-if="columns[0].show" label="id" prop="id" align="center" />
      <el-table-column v-if="columns[1].show" label="订单编号" prop="orderNo" align="center" />
      <el-table-column v-if="columns[2].show" label="客户" prop="customerName" align="center" width="150px" />
      <el-table-column v-if="columns[3].show" label="订单总量" prop="total" align="center" width="150px" />
      <el-table-column v-if="columns[4].show" label="发运量" prop="shipment" align="center" width="150px" />
      <el-table-column v-if="columns[5].show" label="剩余量" prop="residual" align="center" width="150px" />
      <el-table-column v-if="columns[6].show" label="是否冻结" prop="frozen" align="center" width="150px">
        <template v-slot="scope">
          {{ $dict('whether', scope.row.frozen) }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns[7].show" label="冻结人" prop="frozenByName" align="center" width="200px" />
      <el-table-column v-if="columns[8].show" label="冻结时间" prop="frozenTime" align="center" width="200px" />
      <el-table-column v-if="columns[9].show" label="创建人" prop="creatorName" align="center" width="200px" />
      <el-table-column v-if="columns[10].show" label="创建时间" prop="createTime" align="center" width="200px" />
      <el-table-column v-if="columns[11].show" label="所属机构" prop="groupName" align="center" width="200px" />
      <el-table-column v-if="columns[12].show" label="备注" prop="remark" align="center" width="200px" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <div style="display: flex;">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" :disabled="scope.row.shipment > 0" size="mini" @click="toDelete(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="query.total > 0" :total="query.total" :page.sync="query.currentPage" :limit.sync="query.pageSize" @pagination="getSaleOrderWrapperPageData" />
  </div>
</template>

<script>
import Query from './query'
import Add from './add'
import Edit from './edit'
import Delete from './delete'
import Frozen from './frozen'
import UnFrozen from './unFrozen'
import {
  frozenSubOrder,
  getSaleOrderWrapperPage,
  getSaleSubOrderWrapperPage,
  unFrozenSubOrder
} from '@/api/order/saleOrder'
import Pagination from '@/components/Pagination'

export default {
  name: 'SaleOrder',
  components: { UnFrozen, Frozen, Query, Delete, Edit, Add, Pagination },
  data() {
    return {
      columns: [
        { name: 'id', show: true },
        { name: '订单编号', show: true },
        { name: '客户', show: true },
        { name: '订单总量', show: true },
        { name: '发运量', show: true },
        { name: '剩余量', show: true },
        { name: '是否冻结', show: true },
        { name: '冻结人', show: false },
        { name: '冻结时间', show: false },
        { name: '创建人', show: true },
        { name: '创建时间', show: true },
        { name: '所属机构', show: true },
        { name: '备注', show: false }
      ],
      tableLoading: false,
      list: [],
      subList: [],
      query: {
        conditions: [
          { name: 'orderNo', keyword: 'like' }
        ],
        data: {
          orderNo: '',
          customerId: '',
          frozen: ''
        },
        total: 0,
        currentPage: 0,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.$refs.queryTable.refresh = this.getSaleOrderWrapperPageData
    this.getSaleOrderWrapperPageData()
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.queryTable.clearSelection()
        this.$refs.queryTable.toggleRowSelection(val.pop())
      }
    },
    getSaleOrderWrapperPageData() {
      getSaleOrderWrapperPage(this.query).then(res => {
        if (res.data.page) {
          this.list = res.data.page.records
          this.query.total = res.data.page.total
        } else {
          this.list = []
          this.query.total = 0
        }
      })
    },
    rowExpand(row, expandRows) {
      const result = expandRows.some(item => {
        if (item.id === row.id) {
          return true
        }
      })
      if (!result) {
        return
      }
      expandRows.forEach(item => {
        if (item.id !== row.id) {
          this.$refs.queryTable.toggleRowExpansion(item, false)
        }
      })
      this.getSaleSubOrderWrapperPageData(row)
    },
    getSaleSubOrderWrapperPageData(row) {
      return new Promise((resolve, reject) => {
        const query = {
          data: {
            orderId: row.id
          }
        }
        getSaleSubOrderWrapperPage(query).then(res => {
          if (res.data.list) {
            this.subList = res.data.list
          } else {
            this.subList = []
          }
          this.$refs.queryTable.setCurrentRow(row)
          return resolve(this.subList)
        }).catch(_ => {
          reject()
        })
      })
    },
    toEdit(row) {
      this.$refs.btnEdit.showEdit(row)
    },
    toDelete(row) {
      this.$refs.btnDel.doDelete(row)
    },
    frozen(row, order) {
      this.$confirm('此操作将冻结该订单明细, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        frozenSubOrder(row).then(response => {
          this.$notify.success({
            title: '成功',
            message: '冻结订单明细成功'
          })
          this.getSaleSubOrderWrapperPageData(order)
        })
      })
    },
    unFrozen(row, order) {
      this.$confirm('此操作将解除该订单明细的冻结状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        unFrozenSubOrder(row).then(response => {
          this.$notify.success({
            title: '成功',
            message: '解除订单明细冻结成功'
          })
          this.getSaleSubOrderWrapperPageData(order)
        })
      })
    }
  }
}
</script>

<style scoped>
.queryTable /deep/ .el-table-column--selection.is-leaf .el-checkbox {
  display: none;
}

.queryTable /deep/ .el-table__expanded-cell {
  background-color: #FAFAD2;
}
</style>
