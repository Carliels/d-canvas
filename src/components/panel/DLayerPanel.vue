<template>
    <DToolBoxPanel icon="icofont-layers" title="图层">
        <i class="icofont-plus clickable" title="新建图层" slot="button" @click="addNewLayer" ></i>
        <ul class="layer-panel-ul" slot="content">
            <li class="layer-item"
                v-for="(layer, index) in layers" 
                :key="`layer_panel_${index}_${layer.id}`" 
                :active="layer.active">
                <div class="layer-panel-content" @dblclick="activeLayer(layer.id)" title="双击激活图层">
                    <i :class="`icofont-${expand(layer.id)?'minus':'plus'}`" style="margin-right: 3px;" title="展开/收起" @click="toggleLayerItemVisible(layer.id)"></i>
                    <i :class="`icofont-eye${layer.visible?'':'-blocked'}`" title="显示/隐藏图层" @click="toggleLayerVisible(layer.id)"></i>
                    <template v-if="layer.active && renameMode">
                        <input type="text" :id="`layer_name_input_${layer.id}`" :value="layer.name" style="width: 100px;"/>
                        <i class="icofont-check-alt clickable" title="重命名图层" @click="updateLayerName(layer.id)"></i>
                    </template>
                    <template v-else>
                        {{layer.name}}
                        <i class="icofont-edit clickable btn" v-if="layer.active" title="重命名图层" @click="renameLayer"></i>
                    </template>
                    <div class="right-btns">
                        <i class="icofont-thin-up clickable btn" title="上移" @click="moveLayerUp(index)" v-if="index > 0"></i>
                        <i class="icofont-thin-down clickable btn" title="下移" @click="moveLayerDown(index)" v-if="index < layers.length -1"></i>
                        <i class="icofont-trash clickable btn" title="删除" @click="deleteLayer(index)"></i>
                    </div>
                </div>
                <ul class="layer-panel-item-ul" v-show="expand(layer.id)">
                    <li class="layer-panel-item-li" 
                        v-for="(item, idx) in layer.items"
                        :key="`layer_panel_item_${idx}_${item.id}`"
                        :title="item.value"
                        :active="item.active"
                        @click="activeItem(item.id)"
                    >
                        <template v-if="item.type==='text'">
                            <i class="icofont-font"></i> {{item.value}}
                        </template>
                        <template v-if="item.type==='img'">
                            <i class="icofont-image"></i> 图片
                        </template>
                    </li>
                </ul>
            </li>
        </ul>
    </DToolBoxPanel>
</template>
<script>
import DToolBoxPanel from './DToolBoxPanel.vue'
export default {
    name: 'DLayerPanel',
    components: {DToolBoxPanel},
    props:{
        value: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        expand() {
            return function(layerId) {
                return this.expandLayer.indexOf(layerId) > -1;
            }
        },
        layers: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
        }
    },
    data() {
        return {
            renameMode: false,
            expandLayer: [],
        };
    },
    methods: {
        /**
         * 展开图层元素
         */
        toggleLayerItemVisible(layerId) {
            let expandIdx =  this.expandLayer.indexOf(layerId);
            if (expandIdx > -1) {
                this.expandLayer.splice(expandIdx, 1);
            } else {
                this.expandLayer.push(layerId);
            }
        },

        /**
         * 新增图层
         */
        addNewLayer() {
            const layerId = `layer_${new Date().getTime()}`;
            this.layers.unshift({
                id: layerId,
                name: '新增图层',
                visible: true,
                items: [],
            });
            this.activeLayer(layerId);
        },
        /**
         * 激活图层
         */
        activeLayer(layerId) {
            for (let layer of this.layers) {
                if (layer.id == layerId) {
                    layer.active=true;
                } else {
                    layer.active=false;
                    if (layer.items) {
                        for (let item of layer.items) {
                            item.active = false;
                        }
                    }
                }
            }
        },
        /**
         * 显示隐藏图层
         */
        toggleLayerVisible(layerId) {
            for (let layer of this.layers) {
                if (layer.id == layerId) {
                    layer.visible = !layer.visible;
                }
            }
        },
        /**
         * 重命名图层
         */
        renameLayer() {
            this.renameMode = true;
        },

        /**
         * 更新图层名称
         */
        updateLayerName(layerId) {
            let newName = document.getElementById(`layer_name_input_${layerId}`).value;
            for (let layer of this.layers) {
                if (layer.id == layerId) {
                    layer.name=newName;
                }
            }
            this.renameMode = false;
        },
        /**
         * 上移图层
         */
        moveLayerUp(index) {
            this.swapLayerIndex(index, index-1);
        },
        /**
         * 下移图层
         */
        moveLayerDown(index) {
            this.swapLayerIndex(index, index+1);
        },

        /**
         * 交换图层位置
         */
        swapLayerIndex(index1, index2) {
            const temp = this.layers.splice(index2, 1, this.layers[index1]);
            this.layers[index1] = temp[0];
        },
        /**
         * 删除图层
         */
        deleteLayer(idx) {
            let msg = `确认删除图层[${this.layers[idx].name}]吗？`; 
            if (confirm(msg)==true){ 
                // 如果当前图层是选中状态，则需要在删除当前图层后激活第一个图层
                let needReactive = this.layers[idx].active;
                this.layers.splice(idx, 1);
                if (needReactive && this.layers.length > 0) {
                    this.layers[0].active = true;
                }
            }
            
        },

        activeItem(itemId) {
            this.$emit("elementSelect", itemId);
        }
    }
}
</script>

