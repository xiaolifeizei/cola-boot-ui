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
      <el-table-column v-if="columns[0].show" label="名称" prop="name" align="center" />
      <el-table-column v-if="columns[1].show" label="简称" prop="shortName" align="center" />
      <el-table-column v-if="columns[2].show" label="拼音码" prop="spellCode" align="center" width="150px" />
      <el-table-column v-if="columns[3].show" label="省" prop="province" align="center" width="150px" />
      <el-table-column v-if="columns[4].show" label="市" prop="city" align="center" width="150px" />
      <el-table-column v-if="columns[5].show" label="区" prop="area" align="center" width="150px" />
      <el-table-column v-if="columns[6].show" label="备注" prop="remark" align="center" width="200px" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <div style="display: flex;">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="query.total > 0" :total="query.total" :page.sync="query.currentPage" :limit.sync="query.pageSize" @pagination="getTransitCompanyPageData" />
  </div>
</template>

<script>
import Query from './query'
import Add from './add'
import Edit from './edit'
import Delete from './delete'
import { getTransitCompanyPage } from '@/api/basics/transitCompany'
import Pagination from '@/components/Pagination'
export default {
  name: 'TransitCompany',
  components: { Query, Delete, Edit, Add, Pagination },
  data() {
    return {
      columns: [
        { name: '名称', show: true },
        { name: '简称', show: true },
        { name: '拼音码', show: true },
        { name: '省', show: true },
        { name: '市', show: true },
        { name: '区', show: true },
        { name: '备注', show: false }
      ],
      tableLoading: false,
      list: [],
      query: {
        conditions: [
          { name: 'name', keyword: 'like' },
          { name: 'spellCode', keyword: 'like' }
        ],
        data: {
          name: '',
          spellCode: ''
        },
        total: 0,
        currentPage: 0,
        pageSize: 20
      }
    }
  },
  mounted() {
    this.$refs.queryTable.refresh = this.getTransitCompanyPageData
    this.getTransitCompanyPageData()
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.queryTable.clearSelection()
        this.$refs.queryTable.toggleRowSelection(val.pop())
      }
    },
    getTransitCompanyPageData() {
      getTransitCompanyPage(this.query).then(res => {
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
