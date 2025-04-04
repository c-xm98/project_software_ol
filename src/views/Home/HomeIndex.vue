<template>
  <div class="map-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="220px">
        <div class="side_text">轨迹可视化分析系统</div>
        <!-- 轨迹预处理模块 -->
        <el-menu class="el-menu-vertical-demo" :router="true">
          <!-- 轨迹预处理模块 -->
          <el-sub-menu index="3">
            <template #title>
              <el-icon><User /></el-icon>
              <span>轨迹预处理</span>
            </template>
            <el-menu-item index="product_manage">噪声过滤</el-menu-item>
            <el-menu-item index="users_manage">轨迹压缩</el-menu-item>
            <el-menu-item index="massage_manage">轨迹聚类</el-menu-item>
            <el-menu-item index="massage_manage">轨迹分段</el-menu-item>
          </el-sub-menu>
          <!-- 轨迹可视化模块 -->
          <el-sub-menu index="4">
            <template #title>
              <el-icon><TakeawayBox /></el-icon>
              <span>轨迹可视化</span>
            </template>
            <el-menu-item index="product_manage">点线面图层</el-menu-item>
            <el-menu-item index="users_manage">热力图层</el-menu-item>
            <el-menu-item index="massage_manage">聚类图层</el-menu-item>
            <el-menu-item index="massage_manage">网格图层</el-menu-item>
          </el-sub-menu>
          <!-- 语义增强模块-->
          <el-sub-menu index="5">
            <template #title>
              <el-icon><ChatSquare /></el-icon>
              <span>语义增强模块</span>
            </template>
            <el-menu-item index="product_manage">停留点识别</el-menu-item>
            <el-menu-item index="product_manage">地图匹配</el-menu-item>
          </el-sub-menu>
          <!-- 数据存储管理模块 -->
          <!-- 语义增强模块-->
          <el-sub-menu index="6">
            <template #title>
              <el-icon><ChatSquare /></el-icon>
              <span>语义增强模块</span>
            </template>
            <el-menu-item index="product_manage">停留点识别</el-menu-item>
            <el-menu-item index="product_manage">地图匹配</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-right-conten">
            <el-button>输入数据</el-button>
            <el-button>保存数据</el-button>
            <el-button>备用按钮1</el-button>
            <el-button>备用按钮2</el-button>
          </div>
        </el-header>
        <!-- 地图容器 -->
        <div id="map" ref="mapContainer"></div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
/*
    首先，通过import语句导入了OpenLayers的CSS和一些JavaScript模块，包括Map、View、TileLayer、XYZ和fromLonLat。
    这些模块分别用于创建地图对象、视图对象、图层对象、XYZ瓦片源和将经纬度坐标转换为地图投影坐标。
 */
import 'ol/ol.css'
import { Map, View } from 'ol'
import TileLayer from 'ol/layer/Tile'
import XYZ from 'ol/source/XYZ'
import { fromLonLat } from 'ol/proj'

export default {
  name: 'JustaMap',
  //定义了一个名为map的数据属性，用于存储地图实例。
  data() {
    return {
      map: null,
    }
  },
  //组件生命周期钩子 (mounted()):当组件挂载到DOM后，调用initMap方法来初始化地图。
  mounted() {
    this.initMap()
  },

  methods: {
    /* initMap(): 初始化地图。创建一个新的Map实例，
    指定地图容器（通过target: 'map'）、视图（View）
    和初始图层（这里初始时图层为空，稍后会添加）。
    视图的中心设置为北京的经纬度（116.407428, 39.904198），缩放级别为10。 */
    initMap() {
      const map = new Map({
        target: 'map',
        layers: [],
        view: new View({
          center: fromLonLat([116.407428, 39.904198]),
          zoom: 10,
        }),
      })
      this.addGaodeLayer(map)
      this.map = map
    },
    addGaodeLayer(map) {
      //TileLayer 瓦片图层
      const gaodeLayer = new TileLayer({
        source: new XYZ({
          //url: `https://mt1.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&key=${this.googleKey}`,
          url: `http://wprd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}`,
          crossOrigin: 'anonymous',
          attributions: ['高德地图', new Date().getFullYear()],
        }),
      })
      map.addLayer(gaodeLayer)
    },
  },
}
</script>

<style lang="scss" scoped>
.map-container {
  display: flex;
  height: 100vh;
}

#map {
  flex: 1;
  height: 100%;
  background: #f0f2f5;
}

.sidebar {
  background-color: #2c3e50;

  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

/* 侧边栏样式 */
.el-aside {
  height: 105vh;
  background-color: #2b303b;
  width: 200px;
  //overflow: hidden;
  .side_text {
    background-color: #2b303b;
    padding: 20px;
    display: flex;
    justify-content: center;
    color: #fff;
  }
  .el-menu {
    background-color: #2b303b;
    width: 210px;
    height: 100px;
    border-block: 0px;
  }
  .el-menu-item {
    color: #fff;
  }
}
.el-menu-item:hover {
  background-color: #006eff;
}
:deep(.el-sub-menu__title:hover) {
  background-color: #006eff;
}
:deep(.el-sub-menu__title) {
  color: #fff;
}
:deep(.el-menu--inline) {
  background-color: #2b303b;
}
/* 头部样式 */
.el-header {
  color: #fff;
  display: flex;
  height: 55px;
  background-color: #2b303b;
  align-items: center;
  justify-content: space-between;
  .header-right-conten {
    width: 160px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
</style>
