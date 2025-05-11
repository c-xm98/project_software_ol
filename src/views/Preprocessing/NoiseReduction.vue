<template>
  <div class="noise-reduction">
    <el-form :model="filterParams" label-width="120px">
      <el-form-item label="滤波算法">
        <el-select v-model="filterParams.algorithm">
          <el-option label="卡尔曼滤波" value="kalman" />
          <el-option label="移动平均" value="moving_average" />
        </el-select>
      </el-form-item>

      <el-form-item label="窗口大小" v-if="filterParams.algorithm === 'moving_average'">
        <el-input-number v-model="filterParams.windowSize" :min="3" :step="2" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="startFiltering"> 开始滤波 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'NoiseReduction',

  props: {
    cleanedData: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      filterParams: {
        algorithm: 'moving_average',
        windowSize: 5,
      },
    }
  },

  methods: {
    startFiltering() {
      // 实现滤波逻辑
    },
  },
}
</script>
