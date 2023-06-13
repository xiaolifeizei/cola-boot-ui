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
      <el-table-column v-if="columns[0].show" label="id" prop="id" align="center" width="80px" />
      <el-table-column v-if="columns[1].show" label="物资" prop="goodsName" align="center" />
      <el-table-column v-if="columns[2].show" label="化验指标" prop="name" align="center" />
      <el-table-column v-if="columns[3].show" label="是否禁用" prop="noUse" align="center" width="150px">
        <template v-slot="scope">
          {{ $dict('whether', scope.row.noUse) }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns[4].show" label="备注" prop="remark" align="center" width="150px" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <div style="display: flex;">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="query.total > 0" :total="query.total" :page.sync="query.currentPage" :limit.sync="query.pageSize" @pagination="getPageData" />
  </div>
</template>

<script>
import Query from './query'
import Add from './add'
import Edit from './edit'
import Delete from './delete'
import { getAssayIndexWrapperPage } from '@/api/basics/assay/assayIndex'
import Pagination from '@/components/Pagination'

export default {
  name: 'AssayIndex',
  components: { Query, Delete, Edit, Add, Pagination },
  data() {
    return {
      columns: [
        { name: 'id', show: true },
        { name: '物资', show: true },
        { name: '化验指标', show: true },
        { name: '是否禁用', show: true },
        { name: '备注', show: false }
      ],
      tableLoading: false,
      list: [],
      query: {
        conditions: [
          { name: 'name', keyword: 'like' },
          { name: 'code', keyword: 'like' }
        ],
        data: {
          goodsId: '',
          name: ''
        },
        total: 0,
        currentPage: 0,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.$refs.queryTable.refresh = this.getPageData
    this.getPageData()
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.queryTable.clearSelection()
        this.$refs.queryTable.toggleRowSelection(val.pop())
      }
    },
    getPageData() {
      getAssayIndexWrapperPage(this.query).then(res => {
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
