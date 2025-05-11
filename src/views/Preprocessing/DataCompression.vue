<template>
  <div class="data-compression">
    <el-form :model="compressionParams" label-width="120px">
      <el-form-item label="压缩算法">
        <el-select v-model="compressionParams.algorithm">
          <el-option label="道格拉斯-普克算法" value="douglas_peucker" />
        </el-select>
      </el-form-item>

      <el-form-item label="阈值距离">
        <el-input-number v-model="compressionParams.threshold" :min="0" :step="1" />
        <span class="unit">米</span>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="startCompression"> 开始压缩 </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'DataCompression',

  props: {
    filteredData: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      compressionParams: {
        algorithm: 'douglas_peucker',
        threshold: 10,
      },
    }
  },

  methods: {
    startCompression() {
      // 实现压缩逻辑
    },
  },
}
</script>
