<template>
  <div class="map-container">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="220px">
        <div class="side_text">轨迹可视化分析系统</div>
        <!-- 轨迹预处理模块 -->
        <el-menu class="el-menu-vertical-demo" :router="true">
          <!-- 轨迹预处理模块 -->
          <el-menu-item index="Preprocessing">
            <el-icon><location /></el-icon>
            <span>轨迹预处理模块</span>
          </el-menu-item>
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
              <span>数据存储管理</span>
            </template>
            <el-menu-item index="product_manage">停留点识别</el-menu-item>
            <el-menu-item index="product_manage">地图匹配</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>
      <el-container>
        <router-view v-if="$route.name !== 'Home'"></router-view>
        <el-header v-show="$route.name == 'Home'">
          <div class="header-right-conten">
            <el-button @click="zoomIn">单击缩小</el-button>
            <el-button @click="zoomOut">单击放大</el-button>
            <el-button @click="panToWuhan">平移到武汉</el-button>
            <el-button @click="reset">复位</el-button>
            <!-- 新增绘图控制按钮组 -->
            <el-dropdown @command="handleDraw">
              <el-button>
                绘制图形
                <el-icon><arrow-down /></el-icon>
              </el-button>
              <template v-slot:dropdown>
                <el-dropdown-menu>
                  <el-dropdown-menu>
                    <el-dropdown-item command="Point">绘制点</el-dropdown-item>
                    <el-dropdown-item command="LineString">绘制线</el-dropdown-item>
                    <el-dropdown-item command="Polygon">绘制面</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button @click="clearFeatures">清除绘制</el-button>
            <!-- <el-button @click="toggleBoxSelection">
              {{ isBoxSelecting ? '结束框选' : '开始框选' }}
            </el-button> -->
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
import Draw from 'ol/interaction/Draw'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
/* import DragBox from 'ol/interaction/DragBox' */
import { Style, Fill, Stroke, Circle } from 'ol/style'
export default {
  name: 'JustaMap',
  //定义了一个名为map的数据属性，用于存储地图实例。
  data() {
    return {
      map: null,
      draw: null,
      vectorSource: null,
      vectorLayer: null,
      dragBox: null,
      isBoxSelecting: false,
      selectedFeatures: [],
    }
  },
  //组件生命周期钩子 (mounted()):当组件挂载到DOM后，调用initMap方法来初始化地图。
  mounted() {
    this.initMap()
    this.initVectorLayer()
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
    //缩小
    zoomIn() {
      const view = this.map.getView()
      const zoom = view.getZoom()
      view.setZoom(zoom - 1)
    },
    //放大
    zoomOut() {
      const view = this.map.getView()
      const zoom = view.getZoom()
      view.setZoom(zoom + 1)
    },
    //平移到武汉
    panToWuhan() {
      const view = this.map.getView() //获取视图
      view.animate({
        center: fromLonLat([114.305392, 30.593098]),
        duration: 2000,
      })
    },
    //复位功能（复位到初始状态）
    reset() {
      const view = this.map.getView()
      view.setCenter(fromLonLat([116.407428, 39.904198]))
      view.setZoom(10)
    },
    initVectorLayer() {
      this.vectorSource = new VectorSource()
      this.vectorLayer = new VectorLayer({
        source: this.vectorSource,
        style: (feature) => {
          const geometryType = feature.getGeometry().getType()
          if (geometryType === 'Point') {
            return new Style({
              image: new Circle({
                radius: 6,
                fill: new Fill({
                  color: '#ff0000',
                }),
                stroke: new Stroke({
                  color: '#ffffff',
                  width: 2,
                }),
              }),
            })
          } else {
            return new Style({
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
              }),
              stroke: new Stroke({
                color: '#ffcc33',
                width: 2,
              }),
            })
          }
        },
      })
      this.map.addLayer(this.vectorLayer)
    },
    // 添加清除绘制要素的方法
    clearFeatures() {
      if (this.vectorSource) {
        this.vectorSource.clear() // 清除所有要素
      }
    },
    handleDraw(type) {
      // 如果已经存在绘图交互，先移除
      if (this.draw) {
        this.map.removeInteraction(this.draw)
      }

      // 创建新的绘图交互
      this.draw = new Draw({
        source: this.vectorSource,
        type: type,
      })

      this.map.addInteraction(this.draw)
    },

    /* toggleBoxSelection() {
      if (this.isBoxSelecting) {
        if (this.dragBox) {
          this.map.removeInteraction(this.dragBox)
          this.dragBox = null
        }
      } else {
        this.dragBox = new DragBox({
          style: new Style({
            stroke: new Stroke({
              color: '#0099ff',
              width: 2,
            }),
            fill: new Fill({
              color: 'rgba(0, 153, 255, 0.2)',
            }),
          }),
        })

        // 添加框选事件监听
        this.dragBox.on('boxend', () => {
          const extent = this.dragBox.getGeometry().getExtent()
          console.log('选择区域范围:', extent)

          // 获取选中区域内的要素
          const selectedFeatures = this.vectorSource.getFeaturesInExtent(extent)
          console.log('选中的要素数量:', selectedFeatures.length)

          // 这里可以对选中的要素进行处理
          selectedFeatures.forEach((feature) => {
            console.log('选中要素类型:', feature.getGeometry().getType())
          })
        })

        this.map.addInteraction(this.dragBox)
      }
      this.isBoxSelecting = !this.isBoxSelecting
    }, */
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
.header-right-conten {
  width: auto; // 修改宽度以适应更多按钮
  gap: 10px; // 添加按钮间距
}

.el-dropdown {
  margin-left: 10px;
}
</style>
