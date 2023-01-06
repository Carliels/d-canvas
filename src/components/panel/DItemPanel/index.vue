<template>
    <DToolBoxPanel icon="icofont-cube" title="元素设置" :toggle="false" :fix="true">
        <div slot="content">
            <template v-if="item">
                <BasePropConfig :value="item" :maxHeight="maxHeight" :maxWidth="maxWidth" />
                <template v-if="item.type == 'text'">
                    <TextPropConfig :value="item"/>
                </template>
                <template v-if="item.type == 'img'">
                    <ImagePropConfig :value="item"/>
                </template>
            </template>
            <template v-else>
                <div class="empty-tip">请先选择元素</div>
            </template>
            
        </div>
    </DToolBoxPanel>
</template>
<script>
import DToolBoxPanel from '../DToolBoxPanel.vue'
import BasePropConfig from './BasePropConfig.vue'
import TextPropConfig from './TextPropConfig.vue'
import ImagePropConfig from './ImagePropConfig.vue'
export default {
    name: 'DItemPanel',
    components: {DToolBoxPanel, BasePropConfig, TextPropConfig, ImagePropConfig},
    props:{
        value: {
            type: Object,
            default: () => {}
        },
        maxWidth: {
            type: Number,
        },
        maxHeight: {
            type: Number,
        }
    },
    computed: {
        item: {
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
        };
    },
    methods: {
    }
}
</script>
