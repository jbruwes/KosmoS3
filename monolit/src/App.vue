<template lang="pug">
v-head
  title {{ cmpThe?.name ?? " " }}
  link(
    v-for="currentCss in cmpVisibleCss",
    :key="currentCss?.id",
    crossorigin,
    rel="stylesheet",
    :href="currentCss?.url"
  )
  component(
    :is="tagScript",
    v-for="currentJs in cmpVisibleJs",
    :key="currentJs?.id",
    crossorigin,
    deffer,
    :src="currentJs?.url"
  )
  meta(
    v-if="cmpThe?.description",
    name="description",
    :content="cmpThe?.description"
  )
  meta(v-if="cmpThe?.name", property="og:title", :content="cmpThe?.name")
  meta(v-if="cmpThe?.type", property="og:type", :content="cmpThe?.type")
  meta(v-if="cmpCanonical", property="og:url", :content="cmpCanonical")
  meta(v-if="cmpThe?.image", property="og:image", :content="cmpThe?.image")
  meta(v-if="cmpThe?.alt", property="og:image:alt", :content="cmpThe?.alt")
  link(
    :key="refFavicon",
    rel="icon",
    :href="`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${mdi?.[cmpThe?.favicon ?? 'mdiWeb']}'/></svg>`",
    type="image/svg+xml"
  )
  link(v-if="cmpCanonical", rel="canonical", :href="cmpCanonical")
  component(:is="refStyle", v-if="style") {{ style }}
  component(:is="refScript", v-if="script") {{ `try{${script}\n}catch(e){console.error(\`\${e.name}: \${e.message}\`)}` }}
  meta(
    v-if="settings?.yandex",
    name="yandex-verification",
    :content="settings?.yandex"
  )
  meta(
    v-if="settings?.google",
    name="google-site-verification",
    :content="settings?.google"
  )
.drawer.h-dvh
  input#drawer.drawer-toggle(
    v-model="refDrawer",
    type="checkbox",
    aria-labelledby="#drawer"
  )
  .drawer-content.snap-y.snap-mandatory.overflow-y-auto.scroll-smooth(
    @scroll.passive="start"
  )
    .z-40(
      v-if="cmpPages?.[0]?.visible",
      :class="[...(ready ? [] : navbar?.scroll?.classes ?? []), ...(navbar?.classes ?? [])]",
      :data-theme="navbar?.theme"
    )
      .navbar
        component(:is="cmpNavbar", :the="cmpThe", :mdi="mdi")
    router-view
  .drawer-side.z-50(v-if="cmpPages?.[0]?.visible")
    label.drawer-overlay(for="drawer")
    .grid.max-w-full.self-stretch.overflow-x-auto.scroll-smooth(
      :class="{ 'justify-self-stretch': cmpPages?.[0]?.full }"
    )
      .col-start-1.row-start-1.flex
        .prose.w-full.max-w-none.flex-auto.text-sm(
          class="md:text-base lg:text-lg xl:text-xl 2xl:text-2xl",
          :data-theme="cmpPages?.[0]?.theme"
        )
          component(:is="cmpRootTemplate", :the="cmpPages?.[0]", :mdi="mdi")
      label.btn.btn-circle.btn-ghost.sticky.right-1.top-1.col-start-1.row-start-1.justify-self-end(
        for="drawer"
      )
        svg.h-6.w-6
          path(:d="mdi?.mdiClose")
</template>
<script setup>
import {
  get,
  isDefined,
  set,
  useArrayFilter,
  useArrayFind,
  useBrowserLocation,
  useTimeout,
} from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

/**
 * Хранилище приложения монолит
 *
 * @typedef {object} strApp
 * @property {Function} fncTemplate - Функция, возвращающая Promise на
 *   сконструированный шаблон
 */
import app from "@/stores/app";
/**
 * Хранилище данных приложения монолит
 *
 * @typedef {object} strData
 * @property {computed} cmpPages - Общий массив всех объектов страниц сайта
 */
import data from "@/stores/data";

/** @type {strApp} */
const strApp = app();

/** @type {strApp} */
const { fncTemplate } = strApp;

/** @type {strData} */
const strData = data();

/** @type {strData} */
const { cmpPages, css, js, uri, script, style, settings, navbar } =
  storeToRefs(strData);

/** RefLocation */
const refLocation = useBrowserLocation();

/** { ready, start } */
const { ready, start } = useTimeout(1000, { controls: true });

/**
 * Текущий роут сайта
 *
 * @type {route}
 */
const route = useRoute();

/**
 * Роутер сайта
 *
 * @type {router}
 */
const router = useRouter();

/**
 * FncRootTemplate
 *
 * @returns {object} - Готовый шаблон корневой страницы
 */
const fncRootTemplate = () => fncTemplate(get(cmpPages, 0));

/** CmpRootTemplate */
const cmpRootTemplate = computed(fncRootTemplate);

/**
 * FncNavbar
 *
 * @returns {object} - Готовый шаблон навбара
 */
const fncNavbar = () =>
  fncTemplate({
    id: "navbar",
    template: get(navbar, "template"),
    script: get(navbar, "script"),
    style: get(navbar, "style"),
    path: "/",
  });

/** CmpNavbar */
const cmpNavbar = computed(fncNavbar);

/**
 * @param root0
 * @param root0.id
 */
const fncThe = ({ id = crypto.randomUUID() } = {}) => id === route?.name;

/** CmpThe */
const cmpThe = useArrayFind(cmpPages, fncThe);

/** RefStyle */
const refStyle = ref("style");

/** RefScript */
const refScript = ref("script");

/** RefDrawer */
const refDrawer = ref(false);

/** FncCanonical */
const fncCanonical = () =>
  isDefined(cmpThe)
    ? `${get(refLocation, "origin")}/${get(cmpThe, "urn")}`
    : "";

/** CmpCanonical */
const cmpCanonical = computed(fncCanonical);

/**
 * @constant {object} favicon - Ref
 * @type {string} favicon.value - Уникальный ключ для favicon. Иначе иконка
 *   динамически не обновляется в chrome при смене страницы
 */
const refFavicon = ref(crypto.randomUUID());

/**
 * @param root0
 * @param root0.visible
 * @param root0.url
 */
const fncVisible = ({ visible = true, url = "" } = {}) => visible && url;

/** CmpVisibleJs */
const cmpVisibleJs = useArrayFilter(js, fncVisible);

/** CmpVisibleCss */
const cmpVisibleCss = useArrayFilter(css, fncVisible);

/** FncRouterBeforeEach */
const fncRouterBeforeEach = () => {
  set(refDrawer, false);
};

router.beforeEach(fncRouterBeforeEach);

set(uri, "");
</script>
