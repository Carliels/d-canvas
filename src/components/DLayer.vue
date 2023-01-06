<template>
    <div class="d-drawer-container-layer" :data-id="layer.id" data-etype="layer"
        :style="{width: width+'px', height: height + 'px', zIndex: zIndex}"
        :active="layer.active"
        v-if="layer.visible">
        <template  v-for="(e, index) in layer.items">
            <d-element
                :data-key="`layer_element_${layer.id}_${index}_${e.id}_${e.active}`"
                :key="`layer_element_${layer.id}_${index}_${e.id}_${e.active}`" 
                :scale="scale"
                :maxWidth="width"
                :maxHeight="height" 
                :ctrlKey="ctrlKey"
                :altKey="altKey"
                :shiftKey="shiftKey"
                :value="e"
                @select="activeElement"
            />
        </template>
        
    </div>
</template>

<script>
import DElement from './DElement.vue'
export default {
    name: 'DLayer',
    components: {
        DElement
    },
    props: {
        value: {
            type: Object,
            default: () => {}
        },
        width: {
            type: Number,
            default: 100,
        },
        height: {
            type: Number,
            default: 100,
        },
        zIndex: {
            type: Number,
            default: 1
        },
        scale: {
            type: Number,
            default: 1,
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
    computed: {
        layer: {
            get() {
                return this.value;
            },
            set(val) {
                this.$emit('input', val);
            }
            
        },
    },
    data() {
        return {
            lastX: 0,
            lastY: 0,
        };
    },
    mounted() {
    },
    methods: {
        /**
         * 激活元素
         */
        activeElement(elementId) {
            this.$emit('elementSelect', elementId)
        },
    }
}
</script>

