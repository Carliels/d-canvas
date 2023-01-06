<template>
    <div class="prop-section prop-img">
        <div class="prop-row">
            <div class="prop-item">
                <span class="prop-title">链接</span>
                <input type="text" v-model="item.value" />
            </div>
        </div>
    </div>
</template>
<script>
// import ImageUpload from '../../tools/ImageUpload.vue'
import BasePropConfig from './BasePropConfig.vue'
export default {
    extends: BasePropConfig,
    name: "ImagePropConfig",
    components: {
        // ImageUpload
    },
    data() {
        return {};
    },
    methods: {
    }
}
</script>