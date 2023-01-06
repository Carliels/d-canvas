<template>
    <div class="d-element d-text" title="双击编辑" :style="elementStyle" @dblclick="enableEdit">
        <template v-if="!editMode">
            {{item.value}}
        </template>
        <textarea v-else type="text" v-model="item.value" :style="textareaStyle" v-autofocus/>
    </div>
</template>

<script>

export default {
    name: "DText",
    props: {
        value: Object,
        active: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        textareaStyle() {
            return {
                resize: 'none',
                width: (this.item.width-6)+'px',
                height: (this.item.height-6)+'px'
            };
        },
        elementStyle: {
            get() {
                const style = {
                    width: this.item.width+'px',
                    height: this.item.height+'px',
                };
                style.color=this.item.color;
                style.fontSize=this.item.fontSize+'px';
                style.fontWeight=this.item.bold?'bold':'';
                style.fontStyle=this.item.italic?'italic':'unset';
                style.textAlign=this.item.align;

                if (this.item.direction == 'vertical') {
                    style.writingMode='vertical-lr';
                }
                return style;
            }
        },
    },
    watch: {
        active: {
            handler(val) {
                if (!val) {
                    this.editMode = false;
                }
            },
            deep: true
        }
    },
    data() {
        return {
            item: this.value,
            editMode: false
        };
    },
    methods: {
        enableEdit() {
            this.editMode = true;
        }
    }
}
</script>