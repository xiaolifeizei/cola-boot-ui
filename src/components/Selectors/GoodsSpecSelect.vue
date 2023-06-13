<template>
  <el-select v-model="value" :style="selectStyle" :clearable="clearable" :disabled="disabled" @change="change">
    <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label" />
  </el-select>
</template>

<script>

import { getSpecPage } from '@/api/basics/goods/spec'

export default {
  name: 'GoodsSpecSelect',
  props: {
    specId: {
      require: true,
      type: String,
      default: ''
    },
    goodsId: {
      require: true,
      type: String,
      default: ''
    },
    specName: {
      type: String,
      default: ''
    },
    selectStyle: {
      type: String,
      default: 'width: 100%;'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: '',
      options: []
    }
  },
  watch: {
    specId: {
      handler(val) {
        if (!val) {
          this.value = ''
          this.options = []
        }
      },
      immediate: true
    },
    goodsId: {
      handler(val) {
        if (val) {
          this.getSpecPageData(val)
        }
      },
      immediate: true
    },
    specName: {
      handler(val) {
        if (val && this.specId && val !== '') {
          this.value = this.specId.toString()
          this.options = []
          this.options.push({ label: val, value: this.specId.toString() })
        }
      },
      immediate: true
    }
  },
  methods: {
    getSpecPageData(goodsId) {
      if (!goodsId) {
        this.value = ''
        this.options = []
        return
      }
      const query = {
        data: {
          goodsId: goodsId,
          pageSize: 100
        }
      }
      getSpecPage(query).then(res => {
        if (res.data.page) {
          this.options = []
          res.data.page.records.forEach(item => {
            this.options.push({ label: item.name, value: item.id.toString() })
          })
        }
      })
    },
    change(value) {
      if (value) {
        this.$emit('update:specId', value)
        this.options.forEach(item => {
          if (item.value === value) {
            this.$emit('update:specName', item.label)
          }
        })
      } else {
        this.$emit('update:specId', null)
        this.$emit('update:specName', null)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
