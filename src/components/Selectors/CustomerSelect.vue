<template>
  <el-select
    v-model="value"
    remote
    filterable
    reserve-keyword
    placeholder="请输入客户名称或客户拼音码"
    :remote-method="remoteMethod"
    :loading="loading"
    loading-text="暂无数据"
    :clearable="true"
    :style="selectStyle"
    :disabled="disabled"
    @change="change"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script>

import { getCategoryCustomerPage } from '@/api/basics/customer/customer'

export default {
  name: 'CustomerSelect',
  props: {
    customerId: {
      require: true,
      type: String,
      default: ''
    },
    customerName: {
      require: false,
      type: String,
      default: ''
    },
    categoryCode: {
      require: false,
      type: String,
      default: null
    },
    selectStyle: {
      type: String,
      default: 'width: 100%;'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: '',
      loading: false,
      options: []
    }
  },
  watch: {
    customerId: {
      handler(val) {
        if (!val) {
          this.value = ''
          this.options = []
        }
      },
      immediate: true
    },
    customerName: {
      handler(val) {
        if (val && this.customerId && val !== '') {
          this.value = this.customerId
          this.options = []
          this.options.push({ label: this.customerName, value: this.customerId })
        }
      },
      immediate: true
    }
  },
  methods: {
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true
        const data = {
          conditions: [
            { name: 'spellCode', keyword: 'like', value: query, exp: 'or' },
            { name: 'c.name', keyword: 'like', value: query }
          ],
          pageSize: 10
        }
        if (this.categoryCode && this.categoryCode.split(',').length > 0) {
          const condition = { keyword: 'and', conditions: [], value: '', name: '' }
          this.categoryCode.split(',').forEach(code => {
            if (code && code.length > 0) {
              condition.conditions.push({ name: 'cc.code', keyword: 'eq', value: code, exp: 'or' })
            }
          })
          data.conditions.push(condition)
        }
        setTimeout(() => {
          getCategoryCustomerPage(data).then(res => {
            if (res.data.page) {
              this.options = []
              this.loading = false
              res.data.page.records.forEach(item => {
                this.options.push({ label: item.name, value: item.id.toString() })
              })
            }
          })
        }, 500)
      } else {
        this.options = []
      }
    },
    change(value) {
      if (value) {
        this.$emit('update:customerId', value)
        this.options.forEach(item => {
          if (item.value === value) {
            this.$emit('update:customerName', item.label)
          }
        })
      } else {
        this.$emit('update:customerId', null)
        this.$emit('update:customerName', null)
      }
    }
  }
}
</script>

<style scoped>

</style>
