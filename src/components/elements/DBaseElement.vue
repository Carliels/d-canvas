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
        <template v-else-if="item.type=='line'">
            <DLine :value="item" />
        </template>
        <template v-else>
            <span class="canvas-text">未知组件类型:{{item.type}}</span>
        </template>

        <!-- 旋转图标 -->
        <div class="drag-icon"
            v-if="altKey"
            @mousedown="activeItem"
            @mousedown.stop="rotateDiv($event)"
            @mouseup.stop="clearEvent($event)">
            <i class="icofont-rotation" title="旋转"></i>
        </div>
        <!-- 拖拽图标 -->
        <div class="drag-icon"
            v-else
            @mousedown="activeItem"
            @mousedown.stop="dragDiv($event)"
            @mouseup.stop="clearEvent($event)">
            <i class="icofont-drag" title="移动"></i>
        </div>

        <!-- 元素中心点 -->
        <div class="anchor-center" :id="`element_anchor_center_${item.id}`">
            <i class="icofont-focus"></i>
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
import {DText,DImage,DLine} from './elements';
export default {
    name: 'DElement',
    components: {
        DText,DImage,DLine
    },
    props: {
        value: {
            type: Object,
            default: () =>  { return {type: 'text', width: 120, height: 20, left: 0, top: 0, value:'Example Text.', styles: {}}}
        },
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
        altKey: {
            type: Boolean,
            default: false,
        },
        ctrlKey: {
            type: Boolean,
            default: false,
        },
        shiftKey: {
            type: Boolean,
            default: false,
        }
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
                transform: 'rotate('+this.item.rotate+'deg)',
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

        /**
         * 计算角度
         * @param {Array} cen 基准点 
         * @param {Array} first 起始点
         * @param {Array} second 结束点
         */
        calcAngle(anchor, start, end) {
            //2个点之间的角度获取
            let c1 = Math.atan2(start[1] - anchor[1], start[0] - anchor[0]) * 180 / (Math.PI);
            let c2 = Math.atan2(end[1] - anchor[1], end[0] - anchor[0]) * 180 / (Math.PI);
            let angle;
            c1 = c1 <= -90 ? (360 + c1) : c1;
            c2 = c2 <= -90 ? (360 + c2) : c2;
            //夹角获取
            angle = Math.floor(c2 - c1);
            angle = angle < 0 ? angle + 360 : angle;
            return angle;
        },
        /**
         * 旋转
         */
        rotateDiv(event) {
            const {rotate: startAngle, id} = this.item;
            // 获取基准点
            let anchorEle = document.getElementById(`element_anchor_center_${id}`);
            let {left, top, width, height} = anchorEle.getBoundingClientRect();
            const anchorPoint = [left+width/2, top+height/2];
            let startX = event.clientX;
            let startY = event.clientY;
            document.onmouseup = () => {
                document.onmousemove = null;
            }
            document.onmousemove = e => {
                let angle = this.calcAngle(anchorPoint, [startX, startY], [e.clientX, e.clientY]);
                let deg;
                // 赋值的旋转角度
                let rotate;

                // 顺时针旋转
                if (e.clientX - startX > 0) {
                    deg = startAngle + angle;
                    rotate = deg > 360 ? deg - 360 : deg;
                } else {
                    // 逆时针旋转
                    angle = 360 - angle;
                    deg = startAngle - angle;
                    rotate = deg < 0 ? deg + 360 : deg;
                }
                this.item.rotate = rotate;
            }
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