<template lang="pug">
v-head(v-if="the")
  title(v-if="the.name") {{ the.name }}
  link(
    v-for="currentCss in visibleCss",
    :key="currentCss.id",
    crossorigin,
    rel="stylesheet",
    :href="currentCss.url"
  )
  component(
    :is="tagScript",
    v-for="currentJs in visibleJs",
    :key="currentJs.id",
    crossorigin,
    deffer,
    :src="currentJs.url"
  )
  meta(v-if="the.description", name="description", :content="the.description")
  meta(v-if="the.name", property="og:title", :content="the.name")
  meta(v-if="the.type", property="og:type", :content="the.type")
  meta(v-if="canonical", property="og:url", :content="canonical")
  meta(v-if="the.image", property="og:image", :content="the.image")
  meta(v-if="the.alt", property="og:image:alt", :content="the.alt")
  link(
    :key="favicon",
    rel="icon",
    :href="`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${mdi[the.favicon ?? 'mdiWeb']}'/></svg>`",
    type="image/svg+xml"
  )
  link(v-if="canonical", rel="canonical", :href="canonical")
  component(:is="tagStyle", v-if="style") {{ style }}
  component(:is="tagScript", v-if="script") {{ `try{${script}\n}catch(e){console.error(e.message)}` }}
  meta(
    v-if="settings.yandex",
    name="yandex-verification",
    :content="settings.yandex"
  )
  meta(
    v-if="settings.google",
    name="google-site-verification",
    :content="settings.google"
  )
.drawer.h-dvh
  input#drawer.drawer-toggle(
    v-model="drawer",
    type="checkbox",
    aria-labelledby="#drawer"
  )
  .drawer-content.snap-y.snap-mandatory.overflow-y-auto.scroll-smooth(
    un-cloak,
    @scroll.passive="start"
  )
    .navbar(
      v-if="settings",
      :class="[{ 'opacity-100': !ready }, ...navbar?.classes]",
      :data-theme="navbar?.theme"
    )
      component(:is="theNavbar", :the="the", :mdi="mdi")
    router-view
  .drawer-side.z-50
    label.drawer-overlay(for="drawer")
    .grid.max-w-full.self-stretch.overflow-x-auto.scroll-smooth(
      v-if="flatTree.length",
      :class="{ 'justify-self-stretch': flatTree[0].full }"
    )
      .col-start-1.row-start-1.flex
        .prose.max-w-none.flex-auto.text-sm(
          class="md:text-base lg:text-lg xl:text-xl 2xl:text-2xl",
          :data-theme="flatTree[0].theme"
        )
          component(:is="theTemplate", :the="flatTree[0]", :mdi="mdi")
      label.btn.btn-circle.btn-ghost.sticky.right-1.top-1.col-start-1.row-start-1.justify-self-end(
        for="drawer"
      )
        svg.h-6.w-6
          path(:d="mdi.mdiClose")
</template>
<script setup>
import "daisyui/dist/full.css";

import * as mdi from "@mdi/js";
import {
  get,
  set,
  useArrayFilter,
  useArrayFind,
  useBrowserLocation,
  useTimeout,
} from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, defineAsyncComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import app from "./stores/app";
import data from "./stores/data";

const { getTemplate } = app();
const location = useBrowserLocation();
const { ready, start } = useTimeout(1000, { controls: true });
const router = useRouter();
const route = useRoute();
const { flatTree, css, js, uri, script, style, settings, navbar } =
  storeToRefs(data());
const theTemplate = computed(() =>
  defineAsyncComponent(() => getTemplate(get(flatTree, 0))),
);
const theNavbar = computed(() =>
  defineAsyncComponent(() =>
    getTemplate({
      id: "navbar",
      template: get(navbar)?.template,
      script: get(navbar)?.script,
      style: get(navbar)?.style,
    }),
  ),
);
const the = useArrayFind(flatTree, ({ id }) => id === route.name);
const tagStyle = ref("style");
const tagScript = ref("script");
const drawer = ref(false);
const canonical = computed(
  () => `${get(location, "origin")}/${get(the, "urn")}`,
);
/**
 * @constant {object} favicon - Ref
 * @type {string} favicon.value - Уникальный ключ для favicon. Иначе иконка
 *   динамически не обновляется в chrome при смене страницы
 */
const favicon = ref(crypto.randomUUID());
const visibleJs = useArrayFilter(js, ({ visible, url }) => visible && url);
const visibleCss = useArrayFilter(css, ({ visible, url }) => visible && url);
set(uri, "");
router.beforeEach(() => {
  set(drawer, false);
});
</script>
