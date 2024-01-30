<template lang="pug">
v-head(v-if="selectedObject")
  title(v-if="selectedObject.name") {{ selectedObject.name }}
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
  meta(
    v-if="selectedObject.description",
    name="description",
    :content="selectedObject.description"
  )
  meta(
    v-if="selectedObject.name",
    property="og:title",
    :content="selectedObject.name"
  )
  meta(
    v-if="selectedObject.type",
    property="og:type",
    :content="selectedObject.type"
  )
  meta(
    v-if="selectedObject.image",
    property="og:image",
    :content="selectedObject.image"
  )
  meta(v-if="canonical", property="og:url", :content="canonical")
  link(v-if="canonical", rel="canonical", :href="canonical")
  link(
    :key="favicon",
    rel="icon",
    :href="`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${mdi[selectedObject.favicon ?? 'mdiWeb']}'/></svg>`",
    type="image/svg+xml"
  )
  component(
    :is="tagScript",
    v-for="currentJs in visibleJs",
    :key="currentJs.id",
    crossorigin,
    deffer,
    :src="currentJs.url"
  )
  link(
    v-for="currentCss in visibleCss",
    :key="currentCss.id",
    crossorigin,
    rel="stylesheet",
    :href="currentCss.url"
  )
  component(:is="tagStyle", v-if="style") {{ style }}
  component(:is="tagScript", v-if="script") {{ `try{${script}\n}catch(e){console.error(e.message)}` }}
.drawer(ref="twind", :data-theme="settings?.theme")
  input#drawer.drawer-toggle(v-model="drawer", type="checkbox")
  .drawer-content.carousel-vertical(class="h-[100dvh]", @scroll.passive="start")
    .navbar.bg-base-100.rounded-box.absolute.left-6.right-6.top-6.z-40.opacity-0.shadow-xl.transition-opacity.duration-1000.ease-out(
      class="!w-auto hover:opacity-100",
      :class="{ 'opacity-100': !ready }"
    )
      .flex-none
        label.btn.btn-square.btn-ghost(for="drawer")
          svg.h-6.w-6
            path(:d="mdi.mdiMenu")
      .mx-2.flex-1.px-2 {{ selectedObject?.name }}
    router-view
  .drawer-side.z-50
    .hero.min-h-full(
      :style="the.image && the.background ? { backgroundImage: `url(${the.image})` } : {}",
      :data-theme="the.theme"
    )
      .hero-overlay(v-if="the.overlay")
      .flex.h-full.w-full.flex-col
        label.btn.btn-square.btn-ghost.sticky.top-0.self-end(for="drawer")
          svg.h-6.w-6
            path(:d="mdi.mdiClose")
        .hero.flex-1.self-center(
          :class="the?.responsive ? 'container' : 'w-full'"
        )
          .prose.w-full.max-w-none
            component(:is="theTemplate", :the="the", :mdi="mdi")
</template>
<script setup>
import "daisyui/dist/full.css";

import * as mdi from "@mdi/js";
import { setup } from "@twind/core";
import {
  get,
  set,
  useArrayFilter,
  useArrayFind,
  useBrowserLocation,
  useTimeout,
} from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import config from "../twind.config";
import app from "./stores/app";
import data from "./stores/data";

const { getTemplate } = app();
const location = useBrowserLocation();
const { ready, start } = useTimeout(1000, { controls: true });
const router = useRouter();
const route = useRoute();
const { flatTree, css, js, uri, script, style, settings } = storeToRefs(data());
const the = computed(() => get(flatTree, 0) ?? {});
const theTemplate = computed(() => getTemplate(get(the)));
const selectedObject = useArrayFind(flatTree, ({ id }) => id === route.name);
const tagStyle = ref("style");
const tagScript = ref("script");
const drawer = ref(false);
const twind = ref();
const canonical = computed(
  () =>
    `${get(location, "origin")}/${get(selectedObject, "loc") ? get(selectedObject, "loc") : get(selectedObject, "path")}`,
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
onMounted(() => {
  setup(config, undefined, get(twind));
});
</script>
