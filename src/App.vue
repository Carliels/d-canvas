<template>
  <div id="app">
    <DCanvas v-model="page"/>
  </div>
</template>

<script>
import DCanvas from './components/DCanvas.vue'

export default {
  name: 'App',
  components: {
    DCanvas
  },
  data() {
    return {
      page: {
        bgColor: '#ffffff',
        width: 600,
        height: 600,
        layers:  [
          {id:'layer_1', name:"图层1", active:false, visible: true, items: [
            {id: 'item_1_1', top: 0, left: 0, width: 180, height: 30, type: 'text', active:false, fontSize:14, bold: false, italic:false, align:'left', direction:'horizontal', color:'#000000', value: 'Hello Elements!No:1'},
            {id: 'item_1_2', top: 20, left: 120, width: 180, height: 30, type: 'text', active:false, fontSize:14, color:'#000000', bold: false, italic:false, align:'left',direction:'vertical', value: 'Hello Elements!No:2'}
          ]},
          {id:'layer_2', name:"图层2", active:false, visible: true, items: [
            {id: 'item_2_1', top: 120, left: 120, width: 120, height: 40, type: 'img', active:false, value: 'http://211.91.254.192:9099/httl/images/logo/minio.svg'}
          ]},
          {id:'layer_3', name:"图层3", active:false, visible: true, items: [
            {id: 'item_3_1', top: 160, left: 0, width: 180, height: 30, type: 'text', active:false, fontSize:14, bold: false, italic:false, align:'left', direction:'horizontal', color:'#000000', value: 'Hello Elements!No:3'},
          ]},
        ],
        version: 0
      }
    };
  },
}
</script>

<style>
body {
    margin: 0;
}
</style>
