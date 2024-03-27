<template lang="pug">
v-head
  title {{ the?.name || " " }}
  link(
    v-for="a in theCSS",
    :key="a?.id",
    crossorigin,
    rel="stylesheet",
    :href="a?.url"
  )
  component(
    :is="'script'",
    v-for="a in theJS",
    :key="a?.id",
    crossorigin,
    deffer,
    :src="a?.url"
  )
  meta(
    v-if="the?.description",
    name="description",
    :content="the?.description"
  )
  meta(v-if="the?.name", property="og:title", :content="the?.name")
  meta(v-if="the?.type", property="og:type", :content="the?.type")
  meta(v-if="canonical", property="og:url", :content="canonical")
  meta(v-if="the?.image", property="og:image", :content="the?.image")
  meta(v-if="the?.alt", property="og:image:alt", :content="the?.alt")
  link(
    :key="favicon",
    rel="icon",
    :href="`data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${mdi?.[the?.favicon ?? 'mdiWeb']}'/></svg>`",
    type="image/svg+xml"
  )
  link(v-if="canonical", rel="canonical", :href="canonical")
  component(:is="'style'", v-if="$?.style") {{ $?.style }}
  component(:is="'script'", v-if="$?.script") {{ $?.script }}
  meta(
    v-if="$?.settings?.yandex",
    name="yandex-verification",
    :content="$?.settings?.yandex"
  )
  meta(
    v-if="$?.settings?.google",
    name="google-site-verification",
    :content="$?.settings?.google"
  )
.drawer.h-dvh
  input#drawer.drawer-toggle(
    v-model="drawer",
    type="checkbox",
    aria-labelledby="#drawer"
  )
  .drawer-content.snap-y.snap-mandatory.overflow-y-auto.scroll-smooth(
    @scroll.passive="start"
  )
    .z-40(
      v-if="pages?.[0]?.visible",
      :class="[...(ready ? [] : $?.navbar?.scrollClasses ?? []), ...($?.navbar?.classes ?? [])]",
      :data-theme="$?.navbar?.theme"
    )
      .navbar
        component(:is="navigator", :the="the")
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
          component(:is="root", :the="pages?.[0]")
      label.btn.btn-circle.btn-ghost.sticky.right-1.top-1.col-start-1.row-start-1.justify-self-end(
        for="drawer"
      )
        svg.h-6.w-6
          path(:d="mdi?.mdiClose")
</template>
<script setup>
import { useTimeout } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import app from "@/stores/app";
import data from "@/stores/data";

/** @type {{ fncTemplate: Function }} */
const { fncTemplate } = app();

/** @type {{ $: {} }} */
const { $ } = data();

/**
 * Вычисление навбара
 *
 * @type {computed}
 */
const navigator = computed(() => {
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
  const template = $?.navbar?.template;

  /**
   * Срипты навбара
   *
   * @type {string}
   */
  const script = $?.navbar?.script;

  /**
   * Стили навбара
   *
   * @type {string}
   */
  const style = $?.navbar?.style;

  /**
   * Тип скриптов навбара
   *
   * @type {boolean}
   */
  const setup = $?.navbar?.setup;

  /**
   * Тип стилей навбара
   *
   * @type {boolean}
   */
  const scoped = $?.navbar?.scoped;

  /**
   * Путь готового шаблона навбара
   *
   * @type {string}
   */
  const path = "/";

  return fncTemplate({ id, template, script, style, setup, scoped, path });
});

/** @type {{ pages: computed }} */
const { pages } = storeToRefs(data());

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
const root = computed(() => fncTemplate(pages?.value?.[0]));

/**
 * Поиск текущего объекта страницы
 *
 * @type {computed}
 */
const the = computed(() =>
  pages?.value?.find(({ id = "" } = {}) => id === route?.name),
);

/**
 * Ссылка на переключатель панели
 *
 * @type {ref}
 */
const drawer = ref(false);

/**
 * Вычисление канонического пути
 *
 * @type {computed}
 */
const canonical = computed(
  () =>
    the?.value?.urn?.constructor === String &&
    `${window.location.origin}/${the?.value?.urn}`,
);

/**
 * Уникальный ключ для favicon. Иначе иконка динамически не обновляется в chrome
 * при смене страницы
 *
 * @type {ref}
 */
const favicon = crypto.randomUUID();

/**
 * Ф-ция проверки ресурса
 *
 * @param {object} resource - Объект ресурса
 * @param {boolean} resource.visible - Признак использования
 * @param {string} resource.url - Ссылка на ресурс
 * @returns {boolean} - Флаг проверки ресурса
 */
const alive = ({ visible = true, url = "" } = {}) => visible && url;

/**
 * Фильтр глобальных скриптов по видимости
 *
 * @type {computed}
 */
const theJS = computed(() => $?.js?.filter(alive));

/**
 * Фильтр глобальных стилей по видимости
 *
 * @type {computed}
 */
const theCSS = computed(() => $?.css?.filter(alive));

router.beforeEach(() => {
  drawer.value = false;
});
</script>
