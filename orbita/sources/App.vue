<script>
import { nextTick, computed, ref, watch, onMounted } from "vue";
import { useScriptTag, useBrowserLocation, set, get } from "@vueuse/core";
import { useHead } from "@vueuse/head";
import { storeToRefs } from "pinia";
import VRuntimeTemplate from "vue3-runtime-template";
import page from "page";
import GLightbox from "glightbox";

import sputnik from "./sputnik";

import VSingleHeaderK3 from "./modules/VSingleHeaderK3.vue";
import VSingleButtonK3 from "./modules/VSingleButtonK3.vue";
import VParentButtonK3 from "./modules/VParentButtonK3.vue";
import VSingleItemK3 from "./modules/VSingleItemK3.vue";
import VListItemK3 from "./modules/VListItemK3.vue";
import VCarouselBannerK3 from "./modules/VCarouselBannerK3.vue";
import VSingleBannerK3 from "./modules/VSingleBannerK3.vue";
import VSingleCardK3 from "./modules/VSingleCardK3.vue";
import VSlideCardK3 from "./modules/VSlideCardK3.vue";
import VGridCardK3 from "./modules/VGridCardK3.vue";
import VSingleIconK3 from "./modules/VSingleIconK3.vue";
import VSlideIconK3 from "./modules/VSlideIconK3.vue";
import VGridIconK3 from "./modules/VGridIconK3.vue";
import VMenuK3 from "./modules/VMenuK3.vue";
import VPaginationK3 from "./modules/VPaginationK3.vue";
import VBreadcrumbsK3 from "./modules/VBreadcrumbsK3.vue";
import VNavigationDrawerK3 from "./modules/VNavigationDrawerK3.vue";

import VVantaBirdsK3 from "./modules/VVantaBirdsK3.vue";
import VSingleBannerBirdsK3 from "./modules/VSingleBannerBirdsK3.vue";
import VVantaCellsK3 from "./modules/VVantaCellsK3.vue";
import VSingleBannerCellsK3 from "./modules/VSingleBannerCellsK3.vue";
import VVantaCloudsK3 from "./modules/VVantaCloudsK3.vue";
import VSingleBannerCloudsK3 from "./modules/VSingleBannerCloudsK3.vue";
import VVantaClouds2K3 from "./modules/VVantaClouds2K3.vue";
import VSingleBannerClouds2K3 from "./modules/VSingleBannerClouds2K3.vue";
import VVantaDotsK3 from "./modules/VVantaDotsK3.vue";
import VSingleBannerDotsK3 from "./modules/VSingleBannerDotsK3.vue";
import VVantaFogK3 from "./modules/VVantaFogK3.vue";
import VSingleBannerFogK3 from "./modules/VSingleBannerFogK3.vue";
import VVantaGlobeK3 from "./modules/VVantaGlobeK3.vue";
import VSingleBannerGlobeK3 from "./modules/VSingleBannerGlobeK3.vue";
import VVantaHaloK3 from "./modules/VVantaHaloK3.vue";
import VSingleBannerHaloK3 from "./modules/VSingleBannerHaloK3.vue";
import VVantaNetK3 from "./modules/VVantaNetK3.vue";
import VSingleBannerNetK3 from "./modules/VSingleBannerNetK3.vue";
import VVantaRingsK3 from "./modules/VVantaRingsK3.vue";
import VSingleBannerRingsK3 from "./modules/VSingleBannerRingsK3.vue";
import VVantaRippleK3 from "./modules/VVantaRippleK3.vue";
import VSingleBannerRippleK3 from "./modules/VSingleBannerRippleK3.vue";
import VVantaTopologyK3 from "./modules/VVantaTopologyK3.vue";
import VSingleBannerTopologyK3 from "./modules/VSingleBannerTopologyK3.vue";
import VVantaTrunkK3 from "./modules/VVantaTrunkK3.vue";
import VSingleBannerTrunkK3 from "./modules/VSingleBannerTrunkK3.vue";
import VVantaWavesK3 from "./modules/VVantaWavesK3.vue";
import VSingleBannerWavesK3 from "./modules/VSingleBannerWavesK3.vue";

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
  /**
   * @returns {object} Параметры спутника
   */
  setup() {
    const drawer = ref(false);
    const store = sputnik();
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
              }`
          ),
        },
        { name: "description", content: description },
        { property: "og:description", content: description },
        { name: "keywords", content: keywords },
        {
          property: "og:image",
          content: computed(() =>
            get(image) ? `${get(location).origin}/${get(image)}` : ""
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
            'a[href^="https://vimeo.com/"]'
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
      if (typeof init === "function") init.call({ ...get(tree) });
      window.scrollTo(0, 0);
    });
    watch(tree, () => {
      if (!window.frameElement) {
        /**
         *
         * @param {object} context Контекст роутера
         */
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
            useScriptTag(script.url, undefined, { manual: true }).load()
          )
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
</script>
