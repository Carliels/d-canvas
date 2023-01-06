<template>
    <div class="d-canvas" @contextmenu.prevent>
        <div class="d-components">
        </div>
        <div class="d-drawer" @click="drawerClick">
            <div class="d-drawer-container"
                :penetrate="ctrlHold"
                :style="containerStyle">
                <d-layer 
                    v-for="(layer, index) in layers"
                    :key="`layer_${index}_${layer.id}`"
                    :value="layer"
                    :width="page.width"
                    :height="page.height" 
                    :zIndex="layers.length - index"
                    :scale="scale"
                    @elementSelect="selectElement"
                />
            </div>
        </div>
        <div class="d-panels">
            <DItemPanel 
                :value="activeItem"
                :maxWidth="itemMaxWidth"
                :maxHeight="itemMaxHeight"
                :key="`item_panel_${activeItem?activeItem.id:'none'}`"/>
            <DLayerPanel :value="layers" @elementSelect="selectElement"/>
            <DPagePanel :value="page" :scale="scale" @change="pageSetting"/>
        </div>
        
    </div>
</template>

<script>
import DLayer from './DLayer.vue'
import DItemPanel from './panel/DItemPanel'
import DLayerPanel from './panel/DLayerPanel.vue'
import DPagePanel from './panel/DPagePanel.vue'
export default {
    name: 'DCanvas',
    components: {
        DLayer,
        DItemPanel,
        DLayerPanel,
        DPagePanel
    },
    props: {
        value: {
            type: Object,
            default: () => {}
        },
    },
    computed: {
        containerStyle() {
            return {
                width: this.page.width+'px',
                height: this.page.height + 'px',
                transform: `scale(${this.scale})`,
                backgroundColor: this.page.bgColor
            };
        },
        itemMaxWidth() {
            let targetItem = {left:0};
            for (let layer of this.layers) {
                for (let item of layer.items) {
                    if (item.active) {
                        targetItem = item;
                        break;
                    }
                }
            }
            return this.page.width - targetItem.left;
        },
        itemMaxHeight() {
            let targetItem = {top:0};
            for (let layer of this.layers) {
                for (let item of layer.items) {
                    if (item.active) {
                        targetItem = item;
                        break;
                    }
                }
            }
            return this.page.height - targetItem.top;
        },
        activeItem() {
            let targetItem = null;
            for (let layer of this.layers) {
                for (let item of layer.items) {
                    if (item.active) {
                        targetItem = item;
                        break;
                    }
                }
            }
            return targetItem;
        }
    },
    data() {
        return {
            scale: 1,
            ctrlHold: false,
            page: this.value,
            layers: [],
        };
    },
    created() {
        this.layers = this.value.layers;
        for (let i in this.layers) {
            this.layers[i].active = i==0;
        }
    },
    mounted() {
        document.onkeydown = this.keydown;
        document.onkeyup = this.keyup;
    },
    watch: {
        layers: {
            handler(newVal) {
                this.page.layers = newVal;
            },
            deep: true
        },
        page: {
            handler(newVal) {
                // 重新设置吸附锚点
                this.updateAlignHelp(this.page);
                this.$emit('input', newVal);
            },
            deep: true
        }
    },
    methods: {

        drawerClick(e) {
            const excludeClasses = ["d-drawer", "d-drawer-container"];
            const elementClasses = e.target.className.split(" ");
            for (let className of excludeClasses) {
                if (elementClasses.indexOf(className) > -1) {
                    this.unselectElement();
                    break;
                }
            }
            
        },

        keydown(e) {
            const key = this.getKey(e);
            const allowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Delete", "Control"]
            if (allowKeys.indexOf(key) > -1) {
                e.preventDefault && e.preventDefault();
            }
            switch (key) {
                case "ArrowLeft":
                case "ArrowRight":
                case "ArrowUp":
                case "ArrowDown":
                    this.moveSelectedElement(key);
                    break;
                case "Delete":
                    this.deleteSelectedElement();
                    break;
                case "Control":
                    this.ctrlHold = true;
                    break;
                default:
                    // console.log(e)
            }
        },

        keyup(e) {
            const allowKeys = ["Control"]
            if (allowKeys.indexOf(e.key) > -1) {
                e.preventDefault && e.preventDefault();
            }
            switch (e.key) {
                case "Control":
                    this.ctrlHold = false;
                    break;
                default:
            }
        },

        /**
         * 获取按键
         */
        getKey(e) {
            let keyArr = [];
            if (e.ctrlKey && e.key != "Control") {
                keyArr.push("Control");
            }
            if (e.altKey && e.key != "Alt") {
                keyArr.push("Alt");
            }
            if (e.shiftKey && e.key != "Shift") {
                keyArr.push("Shift");
            }
            keyArr.push(e.key);
            return keyArr.join("+");
        },

        /**
         * 取消选择的元素
         */
        unselectElement() {
            for (let layer of this.layers) {
                for (let item of layer.items) {
                    item.active = false;
                }
            }
        },
        /**
         * 元素选择
         */
        selectElement(elementId) {
            for (let layer of this.layers) {
                layer.active = false;
                let hitItem = false;
                for (let item of layer.items) {
                    if (item.id == elementId) {
                        hitItem = true;
                        item.active = true;
                    } else {
                        item.active = false;
                    }
                }
                if (hitItem) {
                    layer.active = true;
                }
            }
        },

        /**
         * 删除选中元素
         */
        deleteSelectedElement() {
            if (this.activeItem) {
                for (let layer of this.layers) {
                    if (layer.active) {
                        let activeIdx = -1;
                        for (let idx in layer.items) {
                            if (layer.items[idx].active) {
                                activeIdx = idx;
                                break;
                            }
                        }
                        if (activeIdx > -1) {
                            layer.items.splice(activeIdx, 1);
                        }
                        break;
                    }
                }
            }
        },
        /**
         * 移动选中元素
         */
        moveSelectedElement(key) {
            const keys = ["ArrowLeft","ArrowUp","ArrowRight","ArrowDown"];
            const keyPos = keys.indexOf(key);
            let propKey = keyPos%2 > 0 ? 'top' : 'left';
            let direction = keyPos > 1 ? 1 : -1;
            if (this.activeItem) {
                this.activeItem[propKey] += 1*direction;
            }
        },

        updateLayers(newLayers) {
            this.layers = newLayers;
        },

        pageSetting(key, value) {
            this[key] = value;
        },

        updateAlignHelp() {
        },
    }
}
</script>

