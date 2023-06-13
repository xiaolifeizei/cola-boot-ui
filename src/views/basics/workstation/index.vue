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
      <el-table-column v-if="columns[0].show" label="id" prop="id" align="center" />
      <el-table-column v-if="columns[1].show" label="名称" prop="name" align="center" />
      <el-table-column v-if="columns[2].show" label="编码" prop="code" align="center" width="150px" />
      <el-table-column v-if="columns[3].show" label="工作站类型" prop="stationType" align="center" width="150px">
        <template v-slot="scope">
          {{ $dict('stationType', scope.row.stationType) }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns[4].show" label="是否禁用" prop="noUse" align="center" width="150px">
        <template v-slot="scope">
          {{ $dict('whether', scope.row.noUse) }}
        </template>
      </el-table-column>
      <el-table-column v-if="columns[5].show" label="所属机构" prop="groupName" align="center" width="150px" />
      <el-table-column v-if="columns[6].show" label="备注" prop="remark" align="center" width="150px" />
      <el-table-column label="操作" width="120px" align="center">
        <template v-slot="scope">
          <div style="display: flex;">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Query from './query'
import Add from './add'
import Edit from './edit'
import Delete from './delete'
import { getWorkstationWrapperList } from '@/api/basics/workstation'

export default {
  name: 'Workstation',
  components: { Query, Delete, Edit, Add },
  data() {
    return {
      columns: [
        { name: 'id', show: true },
        { name: '名称', show: true },
        { name: '编码', show: true },
        { name: '工作站类型', show: true },
        { name: '是否禁用', show: true },
        { name: '所属机构', show: true },
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
          name: '',
          code: ''
        }
      }
    }
  },
  mounted() {
    this.$refs.queryTable.refresh = this.getWorkstationPageData
    this.getWorkstationPageData()
  },
  methods: {
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.queryTable.clearSelection()
        this.$refs.queryTable.toggleRowSelection(val.pop())
      }
    },
    getWorkstationPageData() {
      getWorkstationWrapperList(this.query).then(res => {
        if (res.data.list) {
          this.list = res.data.list
        } else {
          this.list = []
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
