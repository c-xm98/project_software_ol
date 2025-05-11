<template>
  <div class="preprocessing-container">
    <!-- 步骤导航 -->
    <div class="steps-nav">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step title="输入文件" />
        <el-step title="数据清洗" />
        <el-step title="数据去噪" />
        <el-step title="数据压缩" />
        <el-step title="保存结果" />
      </el-steps>
    </div>

    <!-- 步骤内容区 -->
    <div class="step-content">
      <file-input v-if="activeStep === 0" @file-uploaded="handleFileUploaded" />
      <data-clearing
        v-if="activeStep === 1"
        :trajectory-data="trajectoryData"
        @cleaning-completed="handleCleaningCompleted"
      />
      <!-- <router-view v-else-if="$route.name !== 'Preprocessing'"></router-view> -->
    </div>

    <!-- 控制按钮 -->
    <div class="step-controls">
      <el-button @click="prevStep" :disabled="activeStep === 0">上一步</el-button>
      <el-button type="primary" @click="nextStep" :disabled="!canProceed">
        {{ activeStep === 4 ? '完成' : '下一步' }}
      </el-button>
    </div>
  </div>
</template>

<script>
import FileInput from '@/views/Preprocessing/FileInput.vue'
import DataCleaning from '@/views/Preprocessing/DataCleaning.vue'
export default {
  name: 'PreprocessingIndex',
  components: {
    FileInput,
    DataCleaning,
  },
  data() {
    return {
      activeStep: 0,
      canProceed: false,
      trajectoryData: null, // 添加轨迹数据属性
      cleanedData: null, // 添加清洗后的数据属性
    }
  },
  methods: {
    // 添加文件上传成功的处理方法
    handleFileUploaded(data) {
      this.trajectoryData = data
      this.canProceed = true // 文件上传成功后启用下一步按钮
      console.log('文件上传成功，数据已接收:', data)
    },
    handleCleaningCompleted(cleanedData) {
      this.cleanedData = cleanedData
      this.canProceed = true
      console.log('数据清洗完成:', cleanedData)
    },

    nextStep() {
      if (this.activeStep < 4) {
        this.activeStep++
        this.canProceed = false // 切换到下一步时重置状态
        const routes = [
          'file-input',
          'data-clearing',
          'noise-reduction',
          'data-compression',
          'save-results',
        ]
        this.$router.push(`/preprocessing/${routes[this.activeStep]}`)
      }
    },
    prevStep() {
      if (this.activeStep > 0) {
        this.activeStep--
        const routes = [
          'file-input',
          'data-clearing',
          'noise-reduction',
          'data-compression',
          'save-results',
        ]
        this.$router.push(`/preprocessing/${routes[this.activeStep]}`)
      }
    },
  },
  watch: {
    // 监听路由变化，更新当前步骤
    $route(to) {
      const routes = [
        'file-input',
        'data-clearing',
        'noise-reduction',
        'data-compression',
        'save-results',
      ]
      this.activeStep = routes.indexOf(to.name)
      this.canProceed = this.activeStep > 0 // 如果不是第一个步骤，则启用下一步按钮
    },
  },
}
</script>

<style lang="scss" scoped>
.preprocessing-container {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .steps-nav {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .step-content {
    flex: 1;
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    min-height: 400px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    overflow-y: auto; // 添加滚动条
  }

  .step-controls {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: sticky; // 保持按钮固定在底部
    bottom: 0;
    z-index: 1;
  }
}
</style>
