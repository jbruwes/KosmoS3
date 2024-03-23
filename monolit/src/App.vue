<template lang="pug">
v-head
  title {{ cmpThe?.name || " " }}
  link(
    v-for="currentCss in cmpVisibleCss",
    :key="currentCss?.id",
    crossorigin,
    rel="stylesheet",
    :href="currentCss?.url"
  )
  component(
    :is="'script'",
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
  component(:is="'style'", v-if="style") {{ style }}
  component(:is="'script'", v-if="script") {{ `try{${script}\n}catch(e){console.error(\`\${e.name}: \${e.message}\`)}` }}
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
      v-if="pages?.[0]?.visible",
      :class="[...(ready ? [] : navbar?.scrollClasses ?? []), ...(navbar?.classes ?? [])]",
      :data-theme="navbar?.theme"
    )
      .navbar
        component(:is="cmpNavbar", :the="cmpThe", :mdi="mdi")
    router-view
  .drawer-side.z-50(v-if="pages?.[0]?.visible")
    label.drawer-overlay(for="drawer")
    .grid.max-w-full.self-stretch.overflow-x-auto.scroll-smooth(
      :class="{ 'justify-self-stretch': pages?.[0]?.full }"
    )
      .col-start-1.row-start-1.flex
        .prose.w-full.max-w-none.flex-auto.text-sm(
          class="md:text-base lg:text-lg xl:text-xl 2xl:text-2xl",
          :data-theme="pages?.[0]?.theme"
        )
          component(:is="cmpRootTemplate", :the="pages?.[0]", :mdi="mdi")
      label.btn.btn-circle.btn-ghost.sticky.right-1.top-1.col-start-1.row-start-1.justify-self-end(
        for="drawer"
      )
        svg.h-6.w-6
          path(:d="mdi?.mdiClose")
</template>
<script setup>
/**
 * Реактивный setTimeout
 *
 * @typedef {object} useTimeout
 * @property {computed} ready - Флаг готовности
 * @property {Function} start - Ф-ция запуска
 * @see {@link https://vueuse.org/shared/useTimeout/}
 */
import { useTimeout } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

/**
 * Хранилище приложения монолит
 *
 * @typedef {object} strApp
 * @property {Function} fncTemplate - Функция, возвращающая сконструированный
 *   шаблон
 */
import app from "@/stores/app";
/**
 * Хранилище данных приложения монолит
 *
 * @typedef {object} strData
 * @property {computed} pages - Общий массив всех объектов страниц сайта
 * @property {computed} css - Массив ссылок на стили
 * @property {computed} js - Массив ссылок на скрипты
 * @property {ref} uri - Путь до data.json
 * @property {computed} script - Глобальный скрипт
 * @property {computed} style - Глобальные стили
 * @property {computed} settings - Настройки
 * @property {computed} navbar - Навбар
 */
import data from "@/stores/data";

/** @type {strApp} */
const { fncTemplate } = app();

/** @type {strData} */
const { navbar } = storeToRefs(data());

/**
 * Вычисление навбара
 *
 * @type {computed}
 */
const cmpNavbar = computed(() => {
  /**
   * Id навбара
   *
   * @type {string}
   */
  const id = crypto.randomUUID();

  /**
   * Шаблон навбара
   *
   * @type {string}
   */
  const template = navbar?.value?.template;

  /**
   * Срипты навбара
   *
   * @type {string}
   */
  const script = navbar?.value?.script;

  /**
   * Стили навбара
   *
   * @type {string}
   */
  const style = navbar?.value?.style;

  /**
   * Тип скриптов навбара
   *
   * @type {boolean}
   */
  const setup = navbar?.value?.setup;

  /**
   * Тип стилей навбара
   *
   * @type {boolean}
   */
  const scoped = navbar?.value?.scoped;

  /**
   * Путь готового шаблона навбара
   *
   * @type {string}
   */
  const path = "/";

  return fncTemplate({ id, template, script, style, setup, scoped, path });
});

/** @type {strData} */
const { pages, css, js, uri, script, style, settings } = storeToRefs(data());

/**
 * Expose more controls
 *
 * @type {boolean}
 */
const controls = true;

/** @type {useTimeout} */
const { ready, start } = useTimeout(1000, { controls });

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
 * Вычисление шаблона корневой страницы
 *
 * @type {computed}
 */
const cmpRootTemplate = computed(() => fncTemplate(pages?.value?.[0]));

/**
 * Поиск текущего объекта страницы
 *
 * @type {computed}
 */
const cmpThe = computed(() =>
  pages?.value?.find(({ id = crypto.randomUUID() } = {}) => id === route?.name),
);

/**
 * Ссылка на переключатель панели
 *
 * @type {ref}
 */
const refDrawer = ref(false);

/**
 * Вычисление канонического пути
 *
 * @type {computed}
 */
const cmpCanonical = computed(() =>
  cmpThe?.value?.urn !== null
    ? `${window?.location?.origin}/${cmpThe?.value?.urn}`
    : "",
);

/**
 * Уникальный ключ для favicon. Иначе иконка динамически не обновляется в chrome
 * при смене страницы
 *
 * @type {ref}
 */
const refFavicon = ref(crypto.randomUUID());

/**
 * Фильтр глобальных скриптов по видимости
 *
 * @type {computed}
 */
const cmpVisibleJs = computed(() =>
  js?.value?.filter(({ visible = true, url = "" } = {}) => visible && url),
);

/**
 * Фильтр глобальных стилей по видимости
 *
 * @type {computed}
 */
const cmpVisibleCss = computed(() =>
  css?.value?.filter(({ visible = true, url = "" } = {}) => visible && url),
);

router.beforeEach(() => {
  refDrawer.value = false;
});
uri.value = "";
</script>
