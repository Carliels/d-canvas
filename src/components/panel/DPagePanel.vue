<template>
    <DToolBoxPanel icon="icofont-settings" title="画布设置">
        <div slot="content">
            <div class="prop-row">
                <div class="prop-item">
                    <span class="prop-title">宽度</span>
                    <input type="number" v-model="pageWidth"
                        :min="0"
                        :max="99999"
                        controls-position="right"
                        size="mini"/>
                </div>
                <div class="prop-item">
                    <span class="prop-title">高度</span>
                    <input type="number" v-model="pageHeight"
                        :min="0"
                        :max="99999"
                        controls-position="right"
                        size="mini"/>
                </div>
                <div class="prop-item">
                    <span class="prop-title">缩放</span>
                    <input type="number" v-model="pageScale"
                        :min="10"
                        :max="100"
                        controls-position="right"
                        size="mini"/>
                </div>
                <div class="prop-item">
                    <span class="prop-title">背景</span>
                    <input type="color" v-model="pageBgColor" autocomplete />
                </div>
            </div>
            
        </div>
    </DToolBoxPanel>
</template>
<script>
import DToolBoxPanel from './DToolBoxPanel.vue'
export default {
    name: 'DPagePanel',
    components: {DToolBoxPanel},
    props:{
        value: {
            type: Object,
            default: () => {}
        },
        scale: {
            type: Number,
            default: 1
        },
    },
    data() {
        return {
            page: this.value,
            pageScale: this.scale*100,
            pageWidth: this.value.width,
            pageHeight: this.value.height,
            pageBgColor: this.value.bgColor,
        };
    },
    watch: {
        pageBgColor: {
            handler(newVal, oldVal) {
                if (newVal != oldVal) {
                    this.page = {
                        ...this.page,
                        bgColor: newVal
                    }
                }
            }
        },
        pageWidth: {
            handler(newVal, oldVal) {
                if (newVal != oldVal) {
                     this.updatePage('width', newVal);
                }
            }
        },
        pageHeight: {
            handler(newVal, oldVal) {
                if (newVal != oldVal) {
                     this.updatePage('height', newVal);
                }
            }
        },
        pageScale: {
            handler(newVal, oldVal) {
                if (newVal != oldVal) {
                     this.$emit('change', 'scale', newVal/100)
                }
            }
        },
        page: {
            handler(newVal, oldVal) {
                if (newVal != oldVal) {
                    this.$emit('change', 'page', newVal);
                }
            },
            deep: true
        }
    },
    methods: {
        updatePage(k, v) {
            let val = Number(v);
            val = val > 99999 ? 99999 : val;
            val = val < 0 ? 0 : val;
            this.page = {
                ...this.page
            };
            this.page[k] = val;
        },

        updatePageScale(e) {
            let scale = e.target.value ? Number(e.target.value) : 1;
            scale = scale > 1 ? 1 : scale;
            scale = scale < 0.1 ? 0.1 : scale;
            this.$emit('change', 'scale', scale)
        }
    }
}
</script>
