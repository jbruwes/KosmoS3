<template lang="pug">
.h-100
  editor(
    :model-value="modelValue",
    :init="init",
    @update:model-value="$emit('update:modelValue', $event)"
  )
</template>

<script setup>
import Editor from "@tinymce/tinymce-vue";
import "tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/models/dom";
import "tinymce/plugins/preview";
import "tinymce/plugins/importcss";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autosave";
import "tinymce/plugins/save";
import "tinymce/plugins/directionality";
import "tinymce/plugins/code";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/media";
import "tinymce/plugins/template";
import "tinymce/plugins/codesample";
import "tinymce/plugins/table";
import "tinymce/plugins/charmap";
import "tinymce/plugins/pagebreak";
import "tinymce/plugins/nonbreaking";
import "tinymce/plugins/anchor";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/advlist";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/quickbars";
import "tinymce/plugins/emoticons";
import "tinymce/plugins/emoticons/js/emojis";
import "tinymce/skins/ui/oxide/skin.css";
import { watch, ref } from "vue";
import { useFileDialog, set, get } from "@vueuse/core";
import { storeToRefs } from "pinia";
import kosmos3 from "@/kosmos3";
import contentUiSkinCss from "!!raw-loader!tinymce/skins/ui/oxide/content.min.css"; // eslint-disable-line
import contentCss from "!!raw-loader!tinymce/skins/content/default/content.min.css"; // eslint-disable-line

defineProps({
  modelValue: { default: "", type: String },
});
defineEmits(["update:modelValue"]);
const store = kosmos3();
const { base, message, snackbar } = storeToRefs(store);
const { putFile } = store;
const filePicker = ref(undefined);
const { files, open } = useFileDialog({
  multiple: false,
  accept: "image/*,video/*",
});
watch(filePicker, () => {
  open();
});
watch(files, async (newFiles) => {
  if (newFiles.length)
    try {
      const [file] = newFiles;
      const filePath = `${crypto.randomUUID()}.${file.name.split(".").pop()}`;
      await putFile(filePath, file.type, file);
      get(filePicker)(filePath, { alt: file.name });
    } catch (err) {
      set(message, err.message);
      set(snackbar, true);
    }
});
const init = ref({
  plugins:
    "preview searchreplace autolink autosave directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount charmap quickbars emoticons",
  toolbar:
    "undo redo | rlink | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview print | insertfile image media template link anchor codesample | ltr rtl",
  content_css: "index.cdn.css,index.css",
  content_style: `${contentUiSkinCss.toString()}\n${contentCss.toString()}`,
  document_base_url: base,
  quickbars_insert_toolbar: "template",
  body_class: "pa-2 ma-0",
  valid_elements: "*[*]",
  protect: [/<v-.+(<\/v-.+?>)/g],
  image_advtab: true,
  image_caption: true,
  image_title: true,
  browser_spellchec: true,
  convert_urls: false,
  branding: false,
  skin: false,
  resize: false,
  promotion: false,
  templates: [
    {
      title: "breadcrumbs",
      description: "v-breadcrumbs-k3",
      content: "<v-breadcrumbs-k3></v-breadcrumbs-k3>",
    },
    {
      title: "carousel banner",
      description: "v-carousel-banner-k3",
      content: "<v-carousel-banner-k3></v-carousel-banner-k3>",
    },
    {
      title: "grid card",
      description: "v-grid-card-k3",
      content: "<v-grid-card-k3></v-grid-card-k3>",
    },
    {
      title: "grid icon",
      description: "v-grid-icon-k3",
      content: "<v-grid-icon-k3></v-grid-icon-k3>",
    },
    {
      title: "list item",
      description: "v-list-item-k3",
      content: "<v-list-item-k3></v-list-item-k3>",
    },
    {
      title: "pagination",
      description: "v-pagination-k3",
      content: "<v-pagination-k3></v-pagination-k3>",
    },
    {
      title: "parent button",
      description: "v-parent-button-k3",
      content: "<v-parent-button-k3></v-parent-button-k3>",
    },
    {
      title: "single banner",
      description: "v-single-banner-k3",
      content: "<v-single-banner-k3></v-single-banner-k3>",
    },
    {
      title: "single banner birds",
      description: "v-single-banner-birds-k3",
      content: "<v-single-banner-birds-k3></v-single-banner-birds-k3>",
    },
    {
      title: "single banner cells",
      description: "v-single-banner-cells-k3",
      content: "<v-single-banner-cells-k3></v-single-banner-cells-k3>",
    },
    {
      title: "single banner clouds",
      description: "v-single-banner-clouds-k3",
      content: "<v-single-banner-clouds-k3></v-single-banner-clouds-k3>",
    },
    {
      title: "single banner clouds2",
      description: "v-single-banner-clouds2-k3",
      content: "<v-single-banner-clouds2-k3></v-single-banner-clouds2-k3>",
    },
    {
      title: "single banner dots",
      description: "v-single-banner-dots-k3",
      content: "<v-single-banner-dots-k3></v-single-banner-dots-k3>",
    },
    {
      title: "single banner fog",
      description: "v-single-banner-fog-k3",
      content: "<v-single-banner-fog-k3></v-single-banner-fog-k3>",
    },
    {
      title: "single banner globe",
      description: "v-single-banner-globe-k3",
      content: "<v-single-banner-globe-k3></v-single-banner-globe-k3>",
    },
    {
      title: "single banner halo",
      description: "v-single-banner-halo-k3",
      content: "<v-single-banner-halo-k3></v-single-banner-halo-k3>",
    },
    {
      title: "single banner net",
      description: "v-single-banner-net-k3",
      content: "<v-single-banner-net-k3></v-single-banner-net-k3>",
    },
    {
      title: "single banner rings",
      description: "v-single-banner-rings-k3",
      content: "<v-single-banner-rings-k3></v-single-banner-rings-k3>",
    },
    {
      title: "single banner ripple",
      description: "v-single-banner-ripple-k3",
      content: "<v-single-banner-ripple-k3></v-single-banner-ripple-k3>",
    },
    {
      title: "single banner topology",
      description: "v-single-banner-topology-k3",
      content: "<v-single-banner-topology-k3></v-single-banner-topology-k3>",
    },
    {
      title: "single banner trunk",
      description: "v-single-banner-trunk-k3",
      content: "<v-single-banner-trunk-k3></v-single-banner-trunk-k3>",
    },
    {
      title: "single banner waves",
      description: "v-single-banner-waves-k3",
      content: "<v-single-banner-waves-k3></v-single-banner-waves-k3>",
    },
    {
      title: "single button",
      description: "v-single-button-k3",
      content: "<v-single-button-k3></v-single-button-k3>",
    },
    {
      title: "single card",
      description: "v-single-card-k3",
      content: "<v-single-card-k3></v-single-card-k3>",
    },
    {
      title: "single header",
      description: "v-single-header-k3",
      content: "<v-single-header-k3></v-single-header-k3>",
    },
    {
      title: "single icon",
      description: "v-single-icon-k3",
      content: "<v-single-icon-k3></v-single-icon-k3>",
    },
    {
      title: "single item",
      description: "v-single-item-k3",
      content: "<v-single-item-k3></v-single-item-k3>",
    },
    {
      title: "slide card",
      description: "v-slide-card-k3",
      content: "<v-slide-card-k3></v-slide-card-k3>",
    },
    {
      title: "slide icon",
      description: "v-slide-icon-k3",
      content: "<v-slide-icon-k3></v-slide-icon-k3>",
    },
  ],
  link_class_list: [
    {
      title: "None",
      value: "",
    },
    {
      title: "v-btn",
      value: "v-btn",
    },
  ],
  image_class_list: [
    {
      title: "None",
      value: "",
    },
    {
      title: "v-img",
      value: "v-img",
    },
  ],
  table_class_list: [
    {
      title: "None",
      value: "",
    },
    {
      title: "v-table",
      value: "v-table",
    },
  ],
  table_cell_class_list: [],
  table_row_class_list: [],
  /**
   *
   * @param {Function} cb колбэк ф-ция
   */
  file_picker_callback: (cb) => {
    filePicker.value = cb;
  },
});
</script>
<style scoped>
:deep(.tox.tox-tinymce) {
  height: 100% !important;
  border: 0px !important;
}
</style>
