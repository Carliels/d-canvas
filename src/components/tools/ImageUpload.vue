<template>
  <div class="component-upload-image">
    
      <img
        :src="value"
        style="display: block; max-width: 100%; margin: 0 auto"
      />
  </div>
</template>

<script>

export default {
  data() {
    return {
      dialogVisible: false,
      fileList: [],
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    limit: {
      type: Number,
      default: 1,
    },
    upload: {
        type: Function,
        default: () => {return new Promise()}
    }
  },
  computed: {
    targetDir() {
      return this.dir ? { dir: this.dir } : null;
    },
  },
  methods: {
    removeImage() {
      this.$emit("input", "");
    },
    /**
     * 上传
     */
    handleFileUpload(file) {
      this.upload(file)
        .then((response) => {
          this.handleUploadSuccess(response, file);
        })
        .catch((err) => {
          this.handleUploadError(err);
        });
    },
    handleUploadSuccess(res) {
      this.$message({
        type: "success",
        message: res.msg,
      });
      this.$emit("input", res.data);
      this.loading.close();
      this.$refs.imgUpload.clearFiles(); //上传成功之后清除历史记录
    },
    handleBeforeUpload() {
      this.loading = this.$loading({
        lock: true,
        text: "上传中",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    handleUploadError() {
      this.$message({
        type: "error",
        message: "上传失败",
      });
      this.loading.close();
    },
    handleChange(file, fileList) {
      console.log(file, fileList);
    },
  },
  watch: {},
};
</script>

<style scoped lang="scss">
.image {
  position: relative;
  .mask {
    opacity: 0;
    position: absolute;
    top: 0;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.3s;
  }
  &:hover .mask {
    opacity: 1;
  }
}
</style>
