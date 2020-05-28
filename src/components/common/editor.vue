<template>
  <div>
    <quill-editor ref="myQuillEditor" v-model="content" :options="editorOption" style="height:500px" />
    <input type="file" id="getFile" @change="handleFileChange" style="visibility: hidden;" />
  </div>
</template>
<script>
import { uploadOSS } from "@/api";
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "./imagePaste.js";
import ImageResize from "quill-image-resize-module";
window.Quill.register("modules/imageResize", ImageResize);

const uuid4 = require("uuid/v4");

export default {
  name: "editor",
  components: { quillEditor },
  props: {
    initContent: {
      type: String,
      default() {
        return "";
      }
    },
  },
  model: {
    prop: 'initContent',
    event: 'change'
  },
  data() {
    return {
      content: null,
      addRange: null,
      uploadType: null,
      editorOption: {
        placeholder: "请输入...",
        modules: {
          toolbar: {
            container: [
              ["bold", "italic", "underline", "strike"], // toggled buttons
              ["blockquote", "code-block"],

              [{ header: 1 }, { header: 2 }], // custom button values
              [{ list: "ordered" }, { list: "bullet" }],
              [{ script: "sub" }, { script: "super" }], // superscript/subscript
              [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
              [{ direction: "rtl" }], // text direction

              [{ size: ["small", false, "large", "huge"] }], // custom dropdown
              [{ header: [1, 2, 3, 4, 5, 6, false] }],

              [{ color: [] }, { background: [] }], // dropdown with defaults from theme
              [{ font: [] }],
              [{ align: [] }],

              ["clean"], // remove formatting button
              ["image"]
            ],
            handlers: {
              image: this.imgHandler
            }
          },
          imagePaste: {
            addImageBlob: async (blob, callback) => {
              let imageUrl = await this.uploadImage(blob);
              // your upload function, get the uploaded image url, add then
              callback(imageUrl);
            }
          },
          imageResize: true
        }
      },
    };
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  watch: {
    initContent(val) {
      this.content = val
    },
    content() {
      this.$emit("change", this.content);
    }
  },
  created() {
    this.content = this.initContent
  },
  methods: {
    imgHandler(state) {
      this.addRange = this.editor.getSelection();
      if (state) {
        let fileInput = document.getElementById("getFile");
        fileInput.click(); // 加一个触发事件
      }
      this.uploadType = "image";
    },
    async handleFileChange(e) {
      let folkImg = e.target.files[0];
      let url = await this.uploadImage(folkImg);
      this.upScuccess(url);
    },
    upScuccess(url) {
      if (url != null && url.length > 0) {
        let value = url;
        // API: https://segmentfault.com/q/1010000008951906
        // 加一句废话，测试jira hook
        // this.$refs.myTextEditor.quillEditor.getSelection();
        // 获取光标位置对象，里面有两个属性，一个是index 还有 一个length，这里要用range.index，即当前光标之前的内容长度，然后再利用 insertEmbed(length, 'image', imageUrl)，插入图片即可。
        this.addRange = this.editor.getSelection();
        value = value.indexOf("http") !== -1 ? value : "http:" + value;
        this.editor.insertEmbed(
          this.addRange !== null ? this.addRange.index : 0,
          this.uploadType,
          value
        );
      } else {
        this.$message.error(`${this.uploadType}插入失败`);
      }
    },
    async uploadImage(img) {
      let result = await uploadOSS("activity/" + uuid4(), img);
      this.$message({
        showClose: true,
        message: "上传成功",
        type: "success"
      });
      return result;
    }
  }
};
</script>
<style lang="scss" scoped>
</style>