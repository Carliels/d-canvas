<template>
    <div class="prop-section">
        <div class="prop-row">
            <div class="prop-item">
                <span class="prop-title">宽度</span>
                <input type="number" v-model="item.width" :min="5" :max="maxWidth" @input="numberLimit($event, 5, maxWidth, 'width')" />
            </div>
            <div class="prop-item">
                <span class="prop-title">高度</span>
                <input type="number" v-model="item.height" :min="2" :max="maxHeight" @input="numberLimit($event, 2, maxHeight, 'height')"/>
            </div>
        </div>
        <div class="prop-row">
            <div class="prop-item">
                <span class="prop-title">旋转</span>
                <input type="number" v-model="item.rotate" :step="45" :min="0" :max="360" @input="numberLimit($event, 0, 360, 'rotate')"/>
            </div>
            <div class="prop-item">
                <div class="prop-switch" title="旋转0度" @click="updateProp('rotate', 0)">
                    <i class="icofont-angle"/>0
                </div>
                <div class="prop-switch" title="旋转45度" @click="updateProp('rotate', 45)">
                    <i class="icofont-angle-45"/>
                </div>
                <div class="prop-switch" title="旋转90度" @click="updateProp('rotate', 90)">
                    <i class="icofont-angle-90"/>
                </div>
                <!-- <div class="prop-switch" title="旋转135度" @click="updateProp('rotate', 135)">
                    <i class="icofont-angle"/>135
                </div> -->
                <div class="prop-switch" title="旋转180度" @click="updateProp('rotate', 180)">
                    <i class="icofont-angle-180"/>
                </div>
                <!-- <div class="prop-switch" title="旋转225度" @click="updateProp('rotate', 225)">
                    <i class="icofont-angle"/>225
                </div> -->
                <!-- <div class="prop-switch" title="旋转270度" @click="updateProp('rotate', 270)">
                    <i class="icofont-angle"/>270
                </div> -->
                <!-- <div class="prop-switch" title="旋转315度" @click="updateProp('rotate', 315)">
                    <i class="icofont-angle"/>315
                </div> -->
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "BasePropConfig",
    props: {
        value: { 
            type: Object
        },
        maxWidth: {
            type: Number,
        },
        maxHeight: {
            type: Number,
        }
    },
    data() {
        return {};
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
    methods: {
        numberLimit(e, minVal, maxVal, key) {
            let val = parseInt(e.target.value);
            val = val < minVal ? minVal : (val > maxVal ? maxVal : val);
            this.item[key] = val;
        },
        toggle(key) {
            this.item[key] = !this.item[key];
        },
        updateProp(key, val) {
            this.item[key] = val;
        },
    }
}
</script>