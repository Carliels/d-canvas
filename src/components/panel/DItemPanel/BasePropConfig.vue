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