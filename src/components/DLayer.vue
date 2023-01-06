<template>
    <div class="d-drawer-container-layer" :data-id="layer.id" data-etype="layer"
        :style="{width: width+'px', height: height + 'px', zIndex: zIndex}"
        :active="layer.active"
        v-if="layer.visible">
        <template  v-for="(e, index) in layer.items">
            <d-element
                :data-key="`layer_element_${layer.id}_${index}_${e.id}_${e.active}`"
                :key="`layer_element_${layer.id}_${index}_${e.id}_${e.active}`" 
                :scale="scale" :maxWidth="width" :maxHeight="height" 
                :value="e" @select="activeElement"
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
        value: {
            type: Object,
            default: () => {}
        },
    },
    computed: {
        layer() {
            return this.value;
        },
    },
    watch: {
        layer: {
            handler(newVal, oldVal) {
                if (newVal != oldVal) {
                    this.$emit('input', newVal);
                }
            },
            deep: true
        }
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

