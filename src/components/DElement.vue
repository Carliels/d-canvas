<template>
    <div class="d-drawer-container-element"
        :data-id="item.id"
        @click="activeItem"
        :active="item.active"
        :style="elementStyle">
        <template v-if="item.type=='text'">
            <DText :value="item" :active="item.active" />
        </template>
        <template v-else-if="item.type=='img'">
            <DImage :value="item" />
        </template>
        <template v-else>
            <span class="canvas-text">未知组件类型:{{item.type}}</span>
        </template>

        <!-- 拖拽图标 -->
        <div class="drag-icon"
            @mousedown="activeItem"
            @mousedown.stop="dragDiv($event)"
            @mouseup.stop="clearEvent($event)">
            <i class="icofont-drag"></i>
        </div>
        <!-- 宽度改变组件 -->
        <div class="resize-handle x-handle x-handle-left"
            @mousedown="activeItem"
            @mousedown.stop="changeWidth($event, true)"
            @mouseup.stop="clearEvent" />
        <div class="resize-handle x-handle x-handle-right"
            @mousedown="activeItem"
            @mousedown.stop="changeWidth($event)"
            @mouseup.stop="clearEvent" />
        <div class="resize-handle y-handle y-handle-top"
            @mousedown="activeItem"
            @mousedown.stop="changeHeight($event, true)"
            @mouseup.stop="clearEvent" />
        <div class="resize-handle y-handle y-handle-bottom"
            @mousedown="activeItem"
            @mousedown.stop="changeHeight($event)"
            @mouseup.stop="clearEvent" />
    </div>
</template>

<script>
import {DText,DImage} from './elements';
export default {
    name: 'DElement',
    components: {
        DText,DImage
    },
    props: {
        width: {
            type: Number,
            default: 100,
        },
        height: {
            type: Number,
            default: 100,
        },
        scale: {
            type: Number,
            default: 1
        },
        maxWidth: {
            type: Number,
        },
        maxHeight: {
            type: Number,
        },
        minWidth: {
            type: Number,
            default: 5
        },
        minHeight: {
            type: Number,
            default: 2
        },
        value: {
            type: Object,
            default: () =>  { return {type: 'text', width: 120, height: 20, left: 0, top: 0, value:'Example Text.', styles: {}}}
        },
    },
    computed:{
        item: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
            
        },
        elementStyle() {
            return {
                left: this.item.left+'px',
                top: this.item.top+'px',
                width: this.item.width+'px',
                height: this.item.height+'px',
                ...this.item.styles
            };
        }
    },
    data() {
        return {
        };
    },
    mounted() {
    },
    methods: {

        activeItem() {
            this.$emit('select', this.item.id);
        },

        // 区块拖动
        dragDiv(event) {
            let startX = event.clientX;
            let startY = event.clientY;
            document.onmouseup = () => {
                document.onmousemove = null;
            }
            document.onmousemove = e => {
                // 计算移动
                let offsetX = e.clientX - startX;
                let offsetY = e.clientY - startY;
                startX = e.clientX;
                startY = e.clientY;

                // TODO 这里可以做吸附
                let newLeft = this.item.left + offsetX;
                let maxLeft = this.maxWidth - this.item.width;
                newLeft = newLeft < 0 ? 0 : (newLeft > maxLeft ? maxLeft : newLeft);
                this.item.left = newLeft;

                let newTop = this.item.top + offsetY;
                let maxTop = this.maxHeight - this.item.height;
                newTop = newTop < 0 ? 0 : (newTop > maxTop ? maxTop : newTop);
                this.item.top = newTop;
            }
        },
        // 改变drag宽度尺寸
        changeWidth(event, reverse=false) {
            document.onmouseup = () => {
                document.onmousemove = null;
            }
            let startX = event.clientX;
            document.onmousemove = e => {
                // 计算移动
                let offsetX = e.clientX - startX;
                startX = e.clientX;
                let newWidth = this.item.width;
                let availableWdith = this.item.left + this.item.width;
                let newLeft = this.item.left;
                if (reverse) {
                    newLeft += offsetX;
                    newWidth -= offsetX;
                    
                } else {
                    availableWdith = this.maxWidth - this.item.left;
                    newWidth += offsetX;
                }
                this.item.left = newLeft < 0 
                    ? 0 
                    : (newLeft > (availableWdith - this.minWidth)  ? (availableWdith - this.minWidth) : newLeft);
                this.item.width = newWidth < this.minWidth 
                    ? this.minWidth 
                    : ( newWidth > availableWdith ? availableWdith : newWidth );
            }
        },

        // 改变drag宽度尺寸
        changeHeight(event, reverse=false) {
            document.onmouseup = () => {
                document.onmousemove = null;
            }
            let startY = event.clientY;
            document.onmousemove = e => {
                // 计算移动
                let offsetY = e.clientY - startY;
                startY = e.clientY;

                let newHeight = this.item.height;
                let availableHeight = this.item.top + this.item.height;
                let newTop = this.item.top;
                if (reverse) {
                    newTop += offsetY;
                    newHeight -= offsetY;
                    
                } else {
                    availableHeight = this.maxHeight - this.item.top;
                    newHeight += offsetY;
                }
                this.item.top = newTop < 0 
                    ? 0 
                    : (newTop > (availableHeight - this.minHeight)  ? (availableHeight - this.minHeight) : newTop);
                this.item.height = newHeight < this.minHeight 
                    ? this.minHeight 
                    : ( newHeight > availableHeight ? availableHeight : newHeight );
            }
        },
        // 清除鼠标事件
        clearEvent() {
            document.onmousemove = null
            document.onmouseup = null
        }
    }
}
</script>