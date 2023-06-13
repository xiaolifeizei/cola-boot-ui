<template>
  <div>
    <el-select v-model="truckNo_0" clearable filterable :filter-method="filterHandler" placeholder="" style="width: 60px; margin-right: 10px">
      <el-option
        v-for="item in options"
        :key="item.value"
        :value="item.value"
        :label="item.label"
      >
        <span style="float: left; margin-right: 13px">{{ item.label }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.code }}</span>
      </el-option>
    </el-select>
    <el-input v-model="truckNo_1" autocomplete="off" maxlength="100" :style="selectStyle" />
  </div>
</template>

<script>

export default {
  name: 'TruckNoSelect',
  props: {
    truckNo: {
      require: true,
      type: String,
      default: ''
    },
    prefix: {
      type: String,
      default: ''
    },
    selectStyle: {
      type: String,
      default: 'width: 375px'
    }
  },
  data() {
    return {
      truckNo_0: '',
      truckNo_1: '',
      options: [
        { label: '京', value: '京', code: 'JING' },
        { label: '沪', value: '沪', code: 'HU' },
        { label: '津', value: '津', code: 'JIN' },
        { label: '渝', value: '渝', code: 'YU' },
        { label: '吉', value: '吉', code: 'JI' },
        { label: '辽', value: '辽', code: 'LIAO' },
        { label: '晋', value: '晋', code: 'JIN' },
        { label: '冀', value: '冀', code: 'JI' },
        { label: '青', value: '青', code: 'QING' },
        { label: '鲁', value: '鲁', code: 'LU' },
        { label: '豫', value: '豫', code: 'YU' },
        { label: '苏', value: '苏', code: 'SU' },
        { label: '皖', value: '皖', code: 'WAN' },
        { label: '浙', value: '浙', code: 'ZHE' },
        { label: '闽', value: '闽', code: 'MIN' },
        { label: '赣', value: '赣', code: 'GAN' },
        { label: '湘', value: '湘', code: 'XIANG' },
        { label: '鄂', value: '鄂', code: 'E' },
        { label: '粤', value: '粤', code: 'YUE' },
        { label: '琼', value: '琼', code: 'QIONG' },
        { label: '甘', value: '甘', code: 'GAN' },
        { label: '陕', value: '陕', code: 'SHAN' },
        { label: '黔', value: '黔', code: 'QIAN' },
        { label: '滇', value: '滇', code: 'DIAN' },
        { label: '川', value: '川', code: 'CHUAN' },
        { label: '黑', value: '黑', code: 'HEI' },
        { label: '蒙', value: '蒙', code: 'MENG' },
        { label: '新', value: '新', code: 'XIN' },
        { label: '藏', value: '藏', code: 'ZANG' },
        { label: '宁', value: '宁', code: 'NING' },
        { label: '桂', value: '桂', code: 'GUI' },
        { label: '港', value: '港', code: 'GANG' },
        { label: '澳', value: '澳', code: 'AO' }
      ],
      optionsCopy: []
    }
  },
  watch: {
    truckNo: {
      handler(val) {
        if (val) {
          const p = val.substring(0, 1)
          const re = /[^\u4E00-\u9FA5]/
          if (!re.test(p)) {
            this.truckNo_0 = p
            this.truckNo_1 = val.substring(1)
          } else {
            this.truckNo_1 = val
          }
        } else {
          this.truckNo_0 = this.prefix
          this.truckNo_1 = ''
        }
      },
      immediate: true
    },
    prefix: {
      handler(val) {
        if (val) {
          this.truckNo_0 = val
        }
      },
      immediate: true
    },
    truckNo_0(val) {
      if (val) {
        this.$emit('update:truckNo', val + this.truckNo_1)
      } else {
        this.$emit('update:truckNo', '')
      }
      if (!val && this.optionsCopy.length > 0) {
        this.options = this.optionsCopy
      }
    },
    truckNo_1: {
      handler(val) {
        if (val) {
          this.$emit('update:truckNo', this.truckNo_0 + val.toUpperCase())
        } else {
          this.$emit('update:truckNo', '')
        }
      },
      immediate: true
    }
  },
  methods: {
    getTruckNo() {
      return this.prefix + this.truckNo_1.toUpperCase()
    },
    filterHandler(val) {
      if (this.optionsCopy.length === 0) {
        this.options.forEach(item => {
          this.optionsCopy.push(item)
        })
      }
      if (val) {
        this.options = this.optionsCopy.filter(item => {
          if (item.code.indexOf(val.toUpperCase()) !== -1) {
            return true
          }
        })
      } else {
        this.options = this.optionsCopy
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
