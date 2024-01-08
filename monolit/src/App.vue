<template lang="pug">
Head(v-if="flatTree.length")
  title {{ selectedObject?.label }}
  meta(name="description", :content="selectedObject?.description")
  meta(property="og:title", :content="selectedObject?.label")
  meta(property="og:type", :content="theselectedObject?.type")
  meta(property="og:image", :content="selectedObject?.image")
  meta(
    property="og:url",
    :content="`${location.origin}/${selectedObject?.loc ? selectedObject?.loc : selectedObject?.path}`"
  )
  link(
    rel="canonical",
    :href="`${location.origin}/${selectedObject?.loc ? selectedObject?.loc : selectedObject?.path}`"
  )
  link(
    :key="favicon",
    rel="icon",
    :href="`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${mdi[selectedObject?.icon ?? 'mdiWeb']}'/></svg>`",
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
  .drawer-content.carousel-vertical.h-screen(@scroll.passive="start()")
    .navbar.bg-base-100.rounded-box.absolute.left-6.right-6.top-6.z-40.opacity-0.shadow-xl.transition-opacity.duration-1000.ease-out(
      class="!w-auto hover:opacity-100",
      :class="{ 'opacity-100': !ready }"
    )
      .flex-none
        label.btn.btn-square.btn-ghost(for="drawer")
          svg.h-6.w-6
            path(:d="mdi.mdiMenu")
      .mx-2.flex-1.px-2 {{ selectedObject?.label }}
    router-view(v-slot="{ Component }")
      transition(name="fade")
        component(:is="Component")
  .drawer-side.z-50
    .flex.min-h-full.w-full.flex-col.bg-cover.bg-center(
      :data-theme="flatTree[0]?.theme",
      :style="backgroundImage"
    )
      label.btn.btn-square.btn-ghost.sticky.top-0.self-end(for="drawer")
        svg.h-6.w-6
          path(:d="mdi.mdiClose")
      .flex.flex-auto.items-center
        .prose.mx-auto.flex-auto(:class="{ container: the?.responsive }")
          v-runtime-template(
            :template="the?.template",
            :template-props="{ mdi, the }"
          )
</template>
<script setup>
import "daisyui/dist/full.css";

import * as mdi from "@mdi/js";
import { setup } from "@twind/core";
import { Head } from "@unhead/vue/components";
import {
  get,
  set,
  useArrayFilter,
  useArrayFind,
  useBrowserLocation,
  useTimeout,
  watchOnce,
} from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import VRuntimeTemplate from "vue3-runtime-template";

import config from "../twind.config";
import data from "./stores/data";

const location = useBrowserLocation();
const { ready, start } = useTimeout(1000, { controls: true });
const router = useRouter();
const route = useRoute();
const { flatTree, css, js, uri, script, style, settings } = storeToRefs(data());
const the = computed(() => get(flatTree, 0) ?? {});
const selectedObject = useArrayFind(flatTree, ({ id }) => id === route.name);
const tagStyle = ref("style");
const tagScript = ref("script");
const drawer = ref(false);
const twind = ref();
const backgroundImage = computed(() => {
  const ret = {};
  const { image, background } = get(the);
  if (image && background) ret.backgroundImage = `url(${image})`;
  return ret;
});
/**
 * @constant {object} favicon - Ref
 * @type {string} favicon.value - Уникальный ключ для favicon. Иначе иконка
 *   динамически не обновляется в chrome при смене страницы
 */
const favicon = ref(crypto.randomUUID());
const visibleJs = useArrayFilter(js, ({ visible }) => visible);
const visibleCss = useArrayFilter(css, ({ visible }) => visible);
set(uri, "/");
/**
 * Инициализация
 *
 * @param {Array} value - Массив страниц
 */
const init = (value) => {
  value.forEach(({ path, id: name, loc: alias }) => {
    router.addRoute({
      name,
      path: `/${path}`,
      ...(alias && { alias: `/${alias}` }),
      /** @returns {object} - MainView */
      component: () => import("./views/MainView.vue"),
    });
  });
  router.addRoute({
    path: "/:catchAll(.*)*",
    /** @returns {object} - Страница ошибки */
    component: () => import("./views/NotFoundView.vue"),
  });
  router.replace(router.currentRoute.value.fullPath);
};
if (get(flatTree).length) init(get(flatTree));
else watchOnce(flatTree, init);
router.beforeEach(() => {
  set(drawer, false);
});
onMounted(() => {
  setup(config, undefined, get(twind));
});
</script>
<!--script>
import { get, set, useBrowserLocation, useScriptTag } from "@vueuse/core";
import { useHead } from "@vueuse/head";
import GLightbox from "glightbox";
import page from "page";
import { storeToRefs } from "pinia";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import VRuntimeTemplate from "vue3-runtime-template";

import app from "@/stores/app";

import VBreadcrumbsK3 from "./components/VBreadcrumbsK3.vue";
import VCarouselBannerK3 from "./components/VCarouselBannerK3.vue";
import VGridCardK3 from "./components/VGridCardK3.vue";
import VGridIconK3 from "./components/VGridIconK3.vue";
import VListItemK3 from "./components/VListItemK3.vue";
import VMenuK3 from "./components/VMenuK3.vue";
import VNavigationDrawerK3 from "./components/VNavigationDrawerK3.vue";
import VPaginationK3 from "./components/VPaginationK3.vue";
import VParentButtonK3 from "./components/VParentButtonK3.vue";
import VSingleBannerBirdsK3 from "./components/VSingleBannerBirdsK3.vue";
import VSingleBannerCellsK3 from "./components/VSingleBannerCellsK3.vue";
import VSingleBannerClouds2K3 from "./components/VSingleBannerClouds2K3.vue";
import VSingleBannerCloudsK3 from "./components/VSingleBannerCloudsK3.vue";
import VSingleBannerDotsK3 from "./components/VSingleBannerDotsK3.vue";
import VSingleBannerFogK3 from "./components/VSingleBannerFogK3.vue";
import VSingleBannerGlobeK3 from "./components/VSingleBannerGlobeK3.vue";
import VSingleBannerHaloK3 from "./components/VSingleBannerHaloK3.vue";
import VSingleBannerK3 from "./components/VSingleBannerK3.vue";
import VSingleBannerNetK3 from "./components/VSingleBannerNetK3.vue";
import VSingleBannerRingsK3 from "./components/VSingleBannerRingsK3.vue";
import VSingleBannerRippleK3 from "./components/VSingleBannerRippleK3.vue";
import VSingleBannerTopologyK3 from "./components/VSingleBannerTopologyK3.vue";
import VSingleBannerTrunkK3 from "./components/VSingleBannerTrunkK3.vue";
import VSingleBannerWavesK3 from "./components/VSingleBannerWavesK3.vue";
import VSingleButtonK3 from "./components/VSingleButtonK3.vue";
import VSingleCardK3 from "./components/VSingleCardK3.vue";
import VSingleHeaderK3 from "./components/VSingleHeaderK3.vue";
import VSingleIconK3 from "./components/VSingleIconK3.vue";
import VSingleItemK3 from "./components/VSingleItemK3.vue";
import VSlideCardK3 from "./components/VSlideCardK3.vue";
import VSlideIconK3 from "./components/VSlideIconK3.vue";
import VVantaBirdsK3 from "./components/VVantaBirdsK3.vue";
import VVantaCellsK3 from "./components/VVantaCellsK3.vue";
import VVantaClouds2K3 from "./components/VVantaClouds2K3.vue";
import VVantaCloudsK3 from "./components/VVantaCloudsK3.vue";
import VVantaDotsK3 from "./components/VVantaDotsK3.vue";
import VVantaFogK3 from "./components/VVantaFogK3.vue";
import VVantaGlobeK3 from "./components/VVantaGlobeK3.vue";
import VVantaHaloK3 from "./components/VVantaHaloK3.vue";
import VVantaNetK3 from "./components/VVantaNetK3.vue";
import VVantaRingsK3 from "./components/VVantaRingsK3.vue";
import VVantaRippleK3 from "./components/VVantaRippleK3.vue";
import VVantaTopologyK3 from "./components/VVantaTopologyK3.vue";
import VVantaTrunkK3 from "./components/VVantaTrunkK3.vue";
import VVantaWavesK3 from "./components/VVantaWavesK3.vue";

export default {
  name: "App",
  components: {
    VParentButtonK3,
    VSingleHeaderK3,
    VSingleButtonK3,
    VListItemK3,
    VSingleItemK3,
    VCarouselBannerK3,
    VSingleBannerK3,
    VSingleCardK3,
    VSingleIconK3,
    VSlideCardK3,
    VSlideIconK3,
    VGridCardK3,
    VGridIconK3,
    VMenuK3,
    VPaginationK3,
    VBreadcrumbsK3,
    VNavigationDrawerK3,
    VRuntimeTemplate,

    VVantaBirdsK3,
    VSingleBannerBirdsK3,
    VVantaCellsK3,
    VSingleBannerCellsK3,
    VVantaCloudsK3,
    VSingleBannerCloudsK3,
    VVantaClouds2K3,
    VSingleBannerClouds2K3,
    VVantaDotsK3,
    VSingleBannerDotsK3,
    VVantaFogK3,
    VSingleBannerFogK3,
    VVantaGlobeK3,
    VSingleBannerGlobeK3,
    VVantaHaloK3,
    VSingleBannerHaloK3,
    VVantaNetK3,
    VSingleBannerNetK3,
    VVantaRingsK3,
    VSingleBannerRingsK3,
    VVantaRippleK3,
    VSingleBannerRippleK3,
    VVantaTopologyK3,
    VSingleBannerTopologyK3,
    VVantaTrunkK3,
    VSingleBannerTrunkK3,

    VVantaWavesK3,
    VSingleBannerWavesK3,
  },
  /** @returns {object} Параметры спутника */
  setup() {
    const drawer = ref(false);
    const store = app();
    const {
      treeData,
      value,
      template,
      tree,
      pageLen,
      routePath,
      routeParams,
      list,
      siblings,
      children,
      treeChildren,
      parentChildren,
      vector,
      parent,
      item,
      id,
      title,
      treeTitle,
      parentTitle,
      description,
      keywords,
      treeDescription,
      parentDescription,
      icon,
      treeIcon,
      parentIcon,
      path,
      treePath,
      parentPath,
      href,
      treeHref,
      parentHref,
      image,
      treeImage,
      parentImage,
    } = storeToRefs(store);
    const { getHref, getTitle, getVector, getParent, getSiblings, getItems } =
      store;
    const location = useBrowserLocation();
    useHead({
      title,
      meta: [
        { property: "og:title", content: title },
        {
          property: "og:url",
          content: computed(
            () =>
              `${get(location).origin}${
                get(path) === "/" ? "" : encodeURI(get(path))
              }`,
          ),
        },
        { name: "description", content: description },
        { property: "og:description", content: description },
        { name: "keywords", content: keywords },
        {
          property: "og:image",
          content: computed(() =>
            get(image) ? `${get(location).origin}/${get(image)}` : "",
          ),
        },
      ],
    });

    watch(template, async () => {
      await nextTick();
      document
        .querySelectorAll(
          'a[href$=".jpeg"],' +
            'a[href$=".jpg"],' +
            'a[href$=".jpe"],' +
            'a[href$=".jfi"],' +
            'a[href$=".jif"],' +
            'a[href$=".jfif"],' +
            'a[href$=".png"],' +
            'a[href$=".gif"],' +
            'a[href$=".bmp"],' +
            'a[href$=".webp"],' +
            'a[href$=".webm"],' +
            'a[href$=".ogv"],' +
            'a[href$=".mp4"],' +
            'a[href^="https://www.youtube.com/embed/"],' +
            'a[href^="https://www.youtube.com/watch?v="],' +
            'a[href^="https://www.youtu.be/embed/"],' +
            'a[href^="https://www.youtu.be/watch?v="],' +
            'a[href^="https://www.youtube-nocookie.com/embed/"],' +
            'a[href^="https://www.youtube-nocookie.com/watch?v="],' +
            'a[href^="https://vimeo.com/"]',
        )
        .forEach((e) => {
          e.setAttribute("rel", "external");
          e.classList.add("glightbox");
        });
      GLightbox({
        touchNavigation: true,
        loop: true,
        autoplayVideos: true,
        zoomable: false,
      });
      // eslint-disable-next-line no-undef
      if (typeof init === "function") init.call({ ...get(tree) });
      window.scrollTo(0, 0);
    });
    watch(tree, () => {
      if (!window.frameElement) {
        /** @param {object} context Контекст роутера */
        const route = async (context) => {
          await nextTick();
          if (get(routePath) !== context.routePath) {
            set(pageLen, context.page.len);
            set(routePath, context.routePath);
          }
        };
        page.stop();
        get(list).forEach((node) => {
          if (node.href) page(node.href, route);
          page(node.path, route);
        });
        page.start();
      }
    });

    onMounted(async () => {
      await Promise.allSettled(
        [
          ...(
            await Promise.all([
              (await fetch("index.cdn.json", { cache: "no-store" })).json(),
            ])
          )[0],
          { url: "index.js" },
        ]
          .filter((script) => script.url)
          .map((script) =>
            useScriptTag(script.url, undefined, { manual: true }).load(),
          ),
      );
      set(template, "");
    });

    return {
      ...{ drawer },
      ...{
        treeData,
        value,
        template,
        tree,
        pageLen,
        routePath,
        routeParams,
        list,
        siblings,
        children,
        treeChildren,
        parentChildren,
        vector,
        parent,
        item,
        id,
        title,
        treeTitle,
        parentTitle,
        description,
        keywords,
        treeDescription,
        parentDescription,
        icon,
        treeIcon,
        parentIcon,
        path,
        treePath,
        parentPath,
        href,
        treeHref,
        parentHref,
        image,
        treeImage,
        parentImage,
      },
      ...{
        getHref,
        getTitle,
        getVector,
        getParent,
        getSiblings,
        getItems,
      },
    };
  },
};
</script-->
