<template>
  <div class="data-cleaning">
    <!-- 添加数据验证提示 -->
    <el-alert
      v-if="!trajectoryData || trajectoryData.length === 0"
      title="请先上传轨迹数据"
      type="warning"
      show-icon
      :closable="false"
    />

    <el-form v-else :model="cleaningParams" label-width="120px">
      <el-form-item label="速度阈值">
        <el-input-number v-model="cleaningParams.speedThreshold" :min="0" :step="1" />
        <span class="unit">km/h</span>
      </el-form-item>

      <el-form-item label="GPS信号强度">
        <el-input-number v-model="cleaningParams.gpsSignalThreshold" :min="0" :max="10" :step="1" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="startCleaning"> 开始清洗 </el-button>
      </el-form-item>
    </el-form>

    <!-- 清洗结果展示 -->
    <div v-if="cleaningResults" class="results">
      <h3>清洗结果统计</h3>
      <el-descriptions border>
        <el-descriptions-item label="原始数据点数">
          {{ cleaningResults.originalCount }}
        </el-descriptions-item>
        <el-descriptions-item label="异常点数">
          {{ cleaningResults.anomalyCount }}
        </el-descriptions-item>
        <el-descriptions-item label="清洗后点数">
          {{ cleaningResults.cleanedCount }}
        </el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataCleaning',

  props: {
    trajectoryData: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      cleaningParams: {
        speedThreshold: 120,
        gpsSignalThreshold: 4,
      },
      cleaningResults: null,
    }
  },

  methods: {
    startCleaning() {
      if (!this.trajectoryData || this.trajectoryData.length === 0) {
        this.$message.warning('没有可用的轨迹数据')
        return
      }

      try {
        // 数据清洗逻辑
        const cleanedData = this.trajectoryData.filter((point) => {
          return (
            point.speed <= this.cleaningParams.speedThreshold &&
            point.gpsSignal >= this.cleaningParams.gpsSignalThreshold
          )
        })

        // 更新清洗结果
        this.cleaningResults = {
          originalCount: this.trajectoryData.length,
          anomalyCount: this.trajectoryData.length - cleanedData.length,
          cleanedCount: cleanedData.length,
        }

        // 发送清洗完成事件
        this.$emit('cleaning-completed', cleanedData)
        this.$message.success('数据清洗完成')
      } catch (error) {
        console.error('数据清洗出错:', error)
        this.$message.error('数据清洗失败')
      }
    },
  },
  mounted() {
    console.log('接收到的轨迹数据:', this.trajectoryData)
  },
  watch: {
    trajectoryData: {
      handler(newData) {
        console.log('轨迹数据更新:', newData)
      },
      immediate: true,
    },
  },
}
</script>
<style scoped>
.data-cleaning {
  padding: 20px;
}

.unit {
  margin-left: 10px;
  color: #666;
}

.results {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
</style>
