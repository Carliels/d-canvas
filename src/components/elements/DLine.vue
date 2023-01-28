<template>
    <div class="d-element d-line" :style="elementStyle">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
            <line x1="0" y1="0" :x2="item.width" :y2="0" style="stroke:rgb(255,0,0);stroke-width:2"/>
        </svg>
    </div>
</template>

<script>

export default {
    name: "DLine",
    props: {
        value: Object,
        active: {
            type: Boolean,
            default: false
        }
    },
    computed: {
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