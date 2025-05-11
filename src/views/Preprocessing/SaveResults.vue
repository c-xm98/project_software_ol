<template>
  <div class="save-results">
    <el-form :model="saveParams" label-width="120px">
      <el-form-item label="文件格式">
        <el-select v-model="saveParams.format">
          <el-option label="CSV" value="csv" />
          <el-option label="JSON" value="json" />
        </el-select>
      </el-form-item>

      <el-form-item label="文件名">
        <el-input v-model="saveParams.filename" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="saveFile"> 保存文件 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SaveResults',

  props: {
    finalData: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      saveParams: {
        format: 'csv',
        filename: 'processed_trajectory',
      },
    }
  },

  methods: {
    saveFile() {
      // 实现文件保存逻辑
      const content = this.formatData()
      const blob = new Blob([content], {
        type: this.saveParams.format === 'csv' ? 'text/csv' : 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${this.saveParams.filename}.${this.saveParams.format}`
      link.click()
      URL.revokeObjectURL(url)
    },

    formatData() {
      // 根据选择的格式转换数据
      if (this.saveParams.format === 'csv') {
        return this.toCSV()
      }
      return JSON.stringify(this.finalData, null, 2)
    },

    toCSV() {
      // 实现CSV转换逻辑
    },
  },
}
</script>
