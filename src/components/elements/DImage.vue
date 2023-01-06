<template>
    <div class="d-element d-image" :style="elementStyle">
        <img class="canvas-img" :src="item.value" :onerror="defaultImg"/>
    </div>
</template>

<script>

export default {
    name: "DImage",
    props: {
        value: Object,
        active: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        defaultImg() {
            return 'this.src="' + require('@/assets/logo.png') + '"';
        },
        elementStyle: {
            get() {
                const style = {
                    width: this.item.width+'px',
                    height: this.item.height+'px',
                };
                return style;
            }
        },
    },
    data() {
        return {
            item: this.value,
        };
    },
}
</script>