<template>
    <div class="d-panel" :fix="fix">
        <div class="panel-title">
            <i :class="icon"></i> {{title}}
            <span class="right" v-if="toggle">
                <slot name="button"></slot>
                <i class="icofont-rounded-down icofont-1x clickable" title="收起" v-if="expand" @click="toggleExpand"></i>
                <i class="icofont-rounded-up icofont-1x clickable" title="展开" v-else @click="toggleExpand"></i>
            </span>
        </div>
        <div class="panel-content" :active="expand">
            <slot name="content"></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DToolBoxPanel',
    props:{
        title: {
            type: String,
            default: null
        },
        icon: {
            type: String,
            default: 'el-icon-s-help'
        },
        toggle: {
            type: Boolean,
            default: true
        },
        fix: {
            type: Boolean,
            default: false
        },
        height: {
            type: Number,
            default: 0.2
        },
    },
    data() {
        return {
            expand: true,
        };
    },
    methods: {
        /**
         * 展开/收缩
         */
        toggleExpand() {
            this.expand = !this.expand;
        }
    }
}
</script>
