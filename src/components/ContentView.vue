<template>
  <v-navigation-drawer permanent location="right"> </v-navigation-drawer>
  <editor
    :init="{
      plugins:
        'preview searchreplace autolink autosave directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount charmap quickbars emoticons',
      menubar: 'file edit view insert format tools table',
      toolbar:
        'undo redo | rlink | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview print | insertfile image media template link anchor codesample | ltr rtl',
      content_css_cors: true,
      skin: false,
      content_css: false,
      content_style: `${contentUiSkinCss.toString()}\n${contentCss.toString()}`,
      file_picker_types: 'image media file',
      quickbars_insert_toolbar: 'template',
      toolbar_mode: 'sliding',
      body_class: 'pa-2 ma-0',
      valid_elements: '*[*]',
      protect: [/<v-.+(<\/v-.+?>)/g],
      branding: false,
      browser_spellcheck: true,
      convert_urls: false,
      image_advtab: true,
      image_caption: true,
      image_title: true,
      images_reuse_filename: true,
      relative_urls: false,
      remove_script_host: false,
      statusbar: false,
      resize: false,
      promotion: false,
      templates: [
        {
          title: 'breadcrumbs',
          description: 'v-breadcrumbs-k3',
          content: '<v-breadcrumbs-k3></v-breadcrumbs-k3>',
        },
        {
          title: 'carousel banner',
          description: 'v-carousel-banner-k3',
          content: '<v-carousel-banner-k3></v-carousel-banner-k3>',
        },
        {
          title: 'grid card',
          description: 'v-grid-card-k3',
          content: '<v-grid-card-k3></v-grid-card-k3>',
        },
        {
          title: 'grid icon',
          description: 'v-grid-icon-k3',
          content: '<v-grid-icon-k3></v-grid-icon-k3>',
        },
        {
          title: 'list item',
          description: 'v-list-item-k3',
          content: '<v-list-item-k3></v-list-item-k3>',
        },
        {
          title: 'pagination',
          description: 'v-pagination-k3',
          content: '<v-pagination-k3></v-pagination-k3>',
        },
        {
          title: 'parent button',
          description: 'v-parent-button-k3',
          content: '<v-parent-button-k3></v-parent-button-k3>',
        },
        {
          title: 'single banner',
          description: 'v-single-banner-k3',
          content: '<v-single-banner-k3></v-single-banner-k3>',
        },
        {
          title: 'single banner birds',
          description: 'v-single-banner-birds-k3',
          content: '<v-single-banner-birds-k3></v-single-banner-birds-k3>',
        },
        {
          title: 'single banner cells',
          description: 'v-single-banner-cells-k3',
          content: '<v-single-banner-cells-k3></v-single-banner-cells-k3>',
        },
        {
          title: 'single banner clouds',
          description: 'v-single-banner-clouds-k3',
          content: '<v-single-banner-clouds-k3></v-single-banner-clouds-k3>',
        },
        {
          title: 'single banner clouds2',
          description: 'v-single-banner-clouds2-k3',
          content: '<v-single-banner-clouds2-k3></v-single-banner-clouds2-k3>',
        },
        {
          title: 'single banner dots',
          description: 'v-single-banner-dots-k3',
          content: '<v-single-banner-dots-k3></v-single-banner-dots-k3>',
        },
        {
          title: 'single banner fog',
          description: 'v-single-banner-fog-k3',
          content: '<v-single-banner-fog-k3></v-single-banner-fog-k3>',
        },
        {
          title: 'single banner globe',
          description: 'v-single-banner-globe-k3',
          content: '<v-single-banner-globe-k3></v-single-banner-globe-k3>',
        },
        {
          title: 'single banner halo',
          description: 'v-single-banner-halo-k3',
          content: '<v-single-banner-halo-k3></v-single-banner-halo-k3>',
        },
        {
          title: 'single banner net',
          description: 'v-single-banner-net-k3',
          content: '<v-single-banner-net-k3></v-single-banner-net-k3>',
        },
        {
          title: 'single banner rings',
          description: 'v-single-banner-rings-k3',
          content: '<v-single-banner-rings-k3></v-single-banner-rings-k3>',
        },
        {
          title: 'single banner ripple',
          description: 'v-single-banner-ripple-k3',
          content: '<v-single-banner-ripple-k3></v-single-banner-ripple-k3>',
        },
        {
          title: 'single banner topology',
          description: 'v-single-banner-topology-k3',
          content:
            '<v-single-banner-topology-k3></v-single-banner-topology-k3>',
        },
        {
          title: 'single banner trunk',
          description: 'v-single-banner-trunk-k3',
          content: '<v-single-banner-trunk-k3></v-single-banner-trunk-k3>',
        },
        {
          title: 'single banner waves',
          description: 'v-single-banner-waves-k3',
          content: '<v-single-banner-waves-k3></v-single-banner-waves-k3>',
        },
        {
          title: 'single button',
          description: 'v-single-button-k3',
          content: '<v-single-button-k3></v-single-button-k3>',
        },
        {
          title: 'single card',
          description: 'v-single-card-k3',
          content: '<v-single-card-k3></v-single-card-k3>',
        },
        {
          title: 'single header',
          description: 'v-single-header-k3',
          content: '<v-single-header-k3></v-single-header-k3>',
        },
        {
          title: 'single icon',
          description: 'v-single-icon-k3',
          content: '<v-single-icon-k3></v-single-icon-k3>',
        },
        {
          title: 'single item',
          description: 'v-single-item-k3',
          content: '<v-single-item-k3></v-single-item-k3>',
        },
        {
          title: 'slide card',
          description: 'v-slide-card-k3',
          content: '<v-slide-card-k3></v-slide-card-k3>',
        },
        {
          title: 'slide icon',
          description: 'v-slide-icon-k3',
          content: '<v-slide-icon-k3></v-slide-icon-k3>',
        },
      ],
      link_class_list: [
        {
          title: 'None',
          value: '',
        },
        {
          title: 'v-btn',
          value: 'v-btn',
        },
      ],
      image_class_list: [
        {
          title: 'None',
          value: '',
        },
        {
          title: 'v-img',
          value: 'v-img',
        },
      ],
      table_class_list: [
        {
          title: 'None',
          value: '',
        },
        {
          title: 'v-table',
          value: 'v-table',
        },
      ],
      table_cell_class_list: [],
      table_row_class_list: [],
    }"
  ></editor>
  <v-bottom-navigation v-model="value" density="compact">
    <v-btn value="recent">
      <span>Recent</span>
      <v-icon>mdi-history</v-icon>
    </v-btn>

    <v-btn value="favorites">
      <span>Favorites</span>
      <v-icon>mdi-heart</v-icon>
    </v-btn>

    <v-btn value="nearby">
      <span>Nearby</span>
      <v-icon>mdi-map-marker</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import Editor from "@tinymce/tinymce-vue";
/* Import TinyMCE */
import "tinymce";

/* Default icons are required for TinyMCE 5.3 or above */
import "tinymce/icons/default";

/* A theme is also required */
import "tinymce/themes/silver";
import "tinymce/models/dom";

/* Import the skin */
import "tinymce/skins/ui/oxide/skin.css";

/* Import plugins */
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

import { ref } from "vue";

/* content UI CSS is required */
import contentUiSkinCss from "tinymce/skins/ui/oxide/content.min.css?raw"; // eslint-disable-line import/no-unresolved

/* The default content CSS can be changed or replaced with appropriate CSS for the editor content. */
import contentCss from "tinymce/skins/content/default/content.min.css?raw"; // eslint-disable-line import/no-unresolved

const value = ref("recent");
</script>
