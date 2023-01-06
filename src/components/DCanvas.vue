<template>
    <div class="d-canvas" @contextmenu.prevent>
        <div class="d-components">
            <div class="d-components-kit" component-type="text" draggable="true" @mousedown="addElement($event)">
                <i class="icofont-font"></i>
                文字
            </div>
            <div class="d-components-kit" component-type="image" draggable="true" @mousedown="addElement($event)">
                <i class="icofont-image"></i>
                图片
            </div>
        </div>
        <div class="d-drawer" @click="drawerClick">
            <div class="d-drawer-container"
                id="d-drawer-container"
                :ctrlKey="ctrlKey"
                :altKey="altKey"
                :shiftKey="shiftKey"
                :style="containerStyle">
                <d-layer 
                    v-for="(layer, index) in layers"
                    :key="`layer_${index}_${layer.id}`"
                    :value="layer"
                    :width="page.width"
                    :height="page.height" 
                    :zIndex="layers.length - index"
                    :scale="scale"
                    :ctrlKey="ctrlKey"
                    :altKey="altKey"
                    :shiftKey="shiftKey"
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
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
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

        addElement(e) {
            let elementType = e.target.getAttribute("component-type");
            for(let layer of this.layers) {
                if (layer.active) {
                    const itemId = `${layer.id}_item_${new Date().getTime()}`;
                    let newItem = {};
                    if (elementType == 'text') {
                        newItem = {
                            id: itemId,
                            top: 160,
                            left: 160,
                            width: 180,
                            height: 30,
                            type: 'text',
                            active:false,
                            fontSize:14,
                            bold: false,
                            italic:false,
                            align:'left',
                            direction:'horizontal',
                            color:'#000000',
                            rotate: 0,
                            value: '新增文字'
                        };
                    } else if (elementType == 'image') {
                        newItem = {
                            id: itemId,
                            top: 160,
                            left: 160,
                            width: 256,
                            height: 256,
                            type: 'img',
                            active:false,
                            rotate: 0,
                            value: ''
                        };
                    }
                    layer.items.push(newItem);
                    break;
                }
            }
        },

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
            const allowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Delete", "Control", "Alt", "Shift"]
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
                    this.ctrlKey = true;
                    break;
                case "Alt":
                    this.altKey = true;
                    break;
                case "Shift":
                    this.shiftKey = true;
                    break;
                default:
                    // console.log(e)
            }
        },

        keyup(e) {
            const allowKeys = ["Control", "Alt", "Shift"]
            if (allowKeys.indexOf(e.key) > -1) {
                e.preventDefault && e.preventDefault();
            }
            switch (e.key) {
                case "Control":
                    this.ctrlKey = false;
                    break;
                case "Alt":
                    this.altKey = false;
                    break;
                case "Shift":
                    this.shiftKey = false;
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

