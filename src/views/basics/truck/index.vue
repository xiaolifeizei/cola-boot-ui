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
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="60" />
      <el-table-column v-if="columns[0].show" label="车号" prop="truckNo" align="center" />
      <el-table-column v-if="columns[1].show" label="车辆类型" prop="truckType" align="center">
        <template v-slot="scope">
          {{ $dict('truckType', scope.row.truckType) }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns[2].show" label="车辆轴数" prop="spellCode" align="center" width="150px">
        <template v-slot="scope">
          {{ $dict('axleCount', scope.row.axleCount) }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns[3].show" label="皮重" prop="tare" align="center" width="150px" />
      <el-table-column v-if="columns[4].show" label="联系人" prop="contacts" align="center" width="150px" />
      <el-table-column v-if="columns[5].show" label="联系电话" prop="phone" align="center" width="150px" />
      <el-table-column v-if="columns[6].show" label="是否禁用" prop="noUse" align="center" width="150px">
        <template v-slot="scope">
          {{ $dict('whether', scope.row.noUse) }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns[7].show" label="备注" prop="remark" align="center" width="200px" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <div style="display: flex;">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="query.total > 0" :total="query.total" :page.sync="query.currentPage" :limit.sync="query.pageSize" @pagination="getTruckPageData" />
  </div>
</template>

<script>
import Query from './query'
import Add from './add'
import Edit from './edit'
import Delete from './delete'
import { getTruckPage } from '@/api/basics/truck'
import Pagination from '@/components/Pagination'
export default {
  name: 'Truck',
  components: { Query, Delete, Edit, Add, Pagination },
  data() {
    return {
      columns: [
        { name: '车号', show: true },
        { name: '车辆类型', show: true },
        { name: '车辆轴数', show: true },
        { name: '皮重', show: true },
        { name: '联系人', show: true },
        { name: '联系电话', show: true },
        { name: '是否禁用', show: true },
        { name: '备注', show: false }
      ],
      tableLoading: false,
      list: [],
      query: {
        conditions: [
          { name: 'truckNo', keyword: 'like' }
        ],
        data: {
          truckNo: ''
        },
        total: 0,
        currentPage: 0,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.$refs.queryTable.refresh = this.getTruckPageData
    this.getTruckPageData()
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.queryTable.clearSelection()
        this.$refs.queryTable.toggleRowSelection(val.pop())
      }
    },
    getTruckPageData() {
      getTruckPage(this.query).then(res => {
        if (res.data.page) {
          this.list = res.data.page.records
          this.query.total = res.data.page.total
        } else {
          this.list = []
          this.query.total = 0
        }
      })
    },
    toEdit(row) {
      this.$refs.btnEdit.showEdit(row)
    },
    toDelete(row) {
      this.$refs.btnDel.doDelete(row)
    }
  }
}
</script>

<style scoped>
.queryTable /deep/ .el-table-column--selection.is-leaf .el-checkbox {
  display: none;
}
</style>
