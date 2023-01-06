<template>
    <div class="prop-section prop-text">
        <div class="prop-row">
            <div class="prop-item">
                <span class="prop-title">颜色</span>
                <input type="color" v-model="item.color" autocomplete />
            </div>
            <div class="prop-item">
                <span class="prop-title">大小</span>
                <input type="number" v-model="item.fontSize" :min="3" :max="100" @input="numberLimit($event, 3, 100, 'fontSize')"/>
            </div>
        </div>
        <div class="prop-row setting-bar">
            <div class="prop-item">
                <div class="prop-switch" title="加粗" :active="item.bold" @click="toggle('bold')">
                    <i class="icofont-bold" />
                </div>
                <div class="prop-switch" title="斜体" :active="item.italic" @click="toggle('italic')">
                    <i :class="`icofont-italic${item.italic?'-alt':''}`" />
                </div>
                <div class="prop-switch-group">
                    <div class="prop-switch" title="水平排列" :active="item.direction=='horizontal'" @click="updateProp('direction', 'horizontal')">
                        <i class="icofont-justify-left" />
                    </div>
                    <div class="prop-switch" title="垂直排列" :active="item.direction=='vertical'" @click="updateProp('direction', 'vertical')">
                        <i class="icofont-justify-left icofont-rotate-90" />
                    </div>
                </div>
                <div class="prop-switch-group">
                    <div class="prop-switch" :title="`${item.direction=='vertical'?'顶部':'左'}对齐`" :active="item.align=='left'" @click="updateProp('align', 'left')">
                        <i class="icofont-align-right icofont-rotate-270" v-if="item.direction=='vertical'"/>
                        <i class="icofont-align-left" v-else/>
                    </div>
                    <div class="prop-switch" :title="`${item.direction=='vertical'?'垂直':'水平'}居中`" :active="item.align=='center'" @click="updateProp('align', 'center')">
                        <i class="icofont-align-center icofont-rotate-270" v-if="item.direction=='vertical'"/>
                        <i class="icofont-align-center" v-else/>
                    </div>
                    <div class="prop-switch" :title="`${item.direction=='vertical'?'底部':'右'}对齐`" :active="item.align=='right'" @click="updateProp('align', 'right')">
                        <i class="icofont-align-left icofont-rotate-270" v-if="item.direction=='vertical'"/>
                        <i class="icofont-align-right" v-else/>
                    </div>
                </div>
            </div>
        </div>
        <div class="prop-row">
            <div class="prop-item">
                <span class="prop-title">内容</span>
                <textarea v-model="item.value" type="textarea" :rows="5" placeholder="请输入内容" />
            </div>
        </div>
    </div>
</template>
<script>
import BasePropConfig from './BasePropConfig.vue'
export default {
    extends: BasePropConfig,
    name: "TextPropConfig",
    data() {
        return {};
    },
    methods: {
    }
}
</script>