<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-input
          v-model="groupFilterText"
          prefix-icon="el-icon-search"
          placeholder="输入机构名称搜索"
          :clearable="true"
        />
        <el-tree
          ref="groupTree"
          class="groupTree"
          :data="groupData"
          :props="groupProps"
          :expand-on-click-node="false"
          :filter-node-method="filterGroup"
          :highlight-current="true"
          @node-click="handleGroupTreeClick"
        />
      </el-col>
      <el-col :span="19">
        <table-query>
          <query :query.sync="query" />
        </table-query>
        <table-header :columns="columns">
          <template>
            <add v-permission="['admin']" :group-id.sync="selectGroupId" />
            <edit ref="btnEdit" v-permission="['admin']" />
            <delete ref="btnDel" v-permission="['admin']" />
          </template>
        </table-header>
        <el-table
          ref="queryTable"
          v-loading="tableLoading"
          :data="list"
          row-key="id"
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          fit
          border
          highlight-current-row
          style="width: 100%"
          class="queryTable"
          size="mini"
          @selection-change="handleSelectionChange"
        >
          <el-table-column align="center" type="selection" width="60" />
          <el-table-column v-if="columns[0].show" label="仓库名称" prop="name" />
          <el-table-column v-if="columns[1].show" label="仓库编码" prop="code" width="100" />
          <el-table-column v-if="columns[2].show" label="所属机构" prop="groupName" width="200" />
          <el-table-column v-if="columns[3].show" label="创建人" prop="creatorName" width="100" />
          <el-table-column v-if="columns[4].show" label="创建时间" prop="createTime" width="140" />
          <el-table-column v-if="columns[5].show" label="备注" prop="remark" />
          <el-table-column label="操作" width="120px" align="center">
            <template v-slot="scope">
              <div style="display: flex;">
                <el-button v-permission="['admin']" type="primary" icon="el-icon-edit" size="mini" @click="toEdit(scope.row)" />
                <el-button v-permission="['admin']" type="danger" icon="el-icon-delete" size="mini" @click="toDelete(scope.row)" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getStorehouseTree } from '@/api/basics/storehouse'
import { getGroupTreeByCurrentUser } from '@/api/system/group/group'
import Add from './add'
import Edit from './edit'
import Query from './query'
import Delete from './delete'

export default {
  name: 'Storehouse',
  components: { Add, Edit, Query, Delete },
  data() {
    return {
      groupFilterText: '',
      groupData: [{ id: null, name: '全部机构' }],
      groupProps: { children: 'children', label: 'name' },
      tableLoading: false,
      list: [],
      selectGroupId: '',
      columns: [
        { name: '仓库名称', show: true },
        { name: '仓库编码', show: true },
        { name: '所属机构', show: true },
        { name: '创建人', show: true },
        { name: '创建时间', show: true },
        { name: '备注', show: false }
      ],
      query: {
        conditions: [
          { name: 'name', keyword: 'like' },
          { name: 'code', keyword: 'like' }
        ],
        data: {
          name: '',
          loginName: '',
          groupId: ''
        },
        total: 0,
        currentPage: 0,
        pageSize: 20
      }
    }
  },
  watch: {
    groupFilterText(val) {
      this.$refs.groupTree.filter(val)
    }
  },
  mounted() {
    this.$refs.queryTable.refresh = this.getStorehouseData
    this.getStorehouseData()
    this.getGroupTreeData()
  },
  methods: {
    filterGroup(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleGroupTreeClick(data) {
      this.selectGroupId = data.id ? data.id.toString() : null
      this.query.data.groupId = data.id ? data.id.toString() : null
      this.getStorehouseData()
    },
    getGroupTreeData() {
      getGroupTreeByCurrentUser().then(res => {
        if (res.data.list) {
          res.data.list.forEach(item => {
            this.groupData.push({ id: item.id, name: item.name, children: item.children })
          })
        }
      })
    },
    handleSelectionChange(val) {
      if (val.length > 1) {
        this.$refs.queryTable.clearSelection()
        this.$refs.queryTable.toggleRowSelection(val.pop())
      }
    },
    getStorehouseData() {
      this.tableLoading = true
      getStorehouseTree(this.query).then(response => {
        if (response.data.list) {
          this.list = response.data.list
        } else {
          this.list = []
        }
        this.tableLoading = false
      }).catch(() => {
        this.tableLoading = false
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
.groupTree /deep/ .el-tree-node__label {
  font-size: 13px;
}
</style>
