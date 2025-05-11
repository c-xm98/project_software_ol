<template>
  <div class="file-input">
    <el-upload
      class="upload-demo"
      drag
      action=""
      :auto-upload="false"
      :on-change="handleFileChange"
      accept=".csv,.json,.txt"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">支持上传 CSV, JSON, TXT 格式的轨迹数据文件</div>
      </template>
    </el-upload>

    <div v-if="fileContent" class="preview-area">
      <h3>数据预览：</h3>
      <el-table :data="previewData" height="300" border style="width: 100%">
        <el-table-column
          v-for="(col, index) in tableColumns"
          :key="index"
          :prop="col"
          :label="col"
        />
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileInput',
  data() {
    return {
      fileContent: null,
      previewData: [],
      tableColumns: [],
    }
  },

  methods: {
    handleFileChange(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.fileContent = e.target.result
        this.parseFile(file)
      }
      reader.readAsText(file.raw)
    },

    parseFile(file) {
      // 根据文件类型解析数据
      const fileName = file.name.toLowerCase()
      if (fileName.endsWith('.csv')) {
        this.parseCSV()
      } else if (fileName.endsWith('.json')) {
        this.parseJSON()
      } else {
        this.parseTXT()
      }
    },

    parseCSV() {
      const rows = this.fileContent.split('\n')
      this.tableColumns = rows[0].split(',')
      this.previewData = rows.slice(1, 6).map((row) => {
        const values = row.split(',')
        const rowData = {}
        this.tableColumns.forEach((col, index) => {
          rowData[col] = values[index]
        })
        return rowData
      })
      // 确保触发事件并传递数据
      this.$emit('file-uploaded', this.previewData)
    },
  },
}
</script>
