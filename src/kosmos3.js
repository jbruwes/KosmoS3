import { ref, computed, watch } from "vue";
import { get, set } from "@vueuse/core";
import { defineStore } from "pinia";
import {
  HeadObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

export default defineStore("kosmos3", () => {
  /**
   * текст сообщения об ошибке
   *
   * @type {string}
   */
  const error = ref("");
  /**
   * переключатель видимости сообщения об ошибке
   *
   * @type {boolean}
   */
  const snackbar = ref(false);
  /**
   * переключатель видимости правой панели
   *
   * @type {boolean}
   */
  const panel = ref(null);
  /**
   * корзина в сервисе s3
   *
   * @type {string}
   */
  const bucket = ref("");
  /**
   * путь к сайту через сервис s3
   *
   * @type {string}
   */
  const wendpoint = ref("");
  /**
   * клиент к сервису s3
   *
   * @type {object}
   */
  const s3 = ref(null);
  /**
   * контент выбранной страницы сайта
   *
   * @type {string}
   */
  const content = ref("");
  /**
   * семантическое ядро сайта
   *
   * @type {array}
   */
  const semantic = ref([]);
  /**
   * дизайн-шаблон сайта
   *
   * @type {string}
   */
  const template = ref("");
  const style = ref("");
  const css = ref("");
  const javascript = ref("");
  const js = ref("");
  const base = computed(() =>
    get(wendpoint)
      ? `${get(wendpoint)}/${get(bucket)}/`
      : `https://${get(bucket)}/`
  );
  /**
   * Считывание заголовка объекта
   *
   * @param {string} Key Имя файла
   */
  const headObject = async (Key) => {
    const Bucket = get(bucket);
    await get(s3).send(new HeadObjectCommand({ Bucket, Key }));
  };
  /**
   * Запись объекта
   *
   * @param {string} Key Имя файла
   * @param {string} ContentType Тип mime
   * @param {string | Uint8Array | Buffer} body Тело файла
   */
  const putObject = async (Key, ContentType, body) => {
    const Bucket = get(bucket);
    const Body =
      typeof body === "string" ? new TextEncoder().encode(body) : body;
    await get(s3).send(
      new PutObjectCommand({ Bucket, Key, ContentType, Body })
    );
  };
  /**
   * Считывание объекта
   *
   * @param {string} Key Имя файла
   * @returns {string} Тело файла
   */
  const getObject = async (Key) => {
    const Bucket = get(bucket);
    const ResponseCacheControl = "no-store";
    const { Body } = await get(s3).send(
      new GetObjectCommand({ ResponseCacheControl, Bucket, Key })
    );
    const ret = await new Promise((resolve) => {
      const reader = Body.getReader();
      const textDecoder = new TextDecoder();
      (async function read(chunks) {
        const { done, value } = await reader.read();
        if (done) resolve(chunks.join(""));
        else {
          chunks.push(textDecoder.decode(value));
          read(chunks);
        }
      })([]);
    });
    return ret;
  };

  watch(s3, async (newS3) => {
    if (newS3)
      try {
        const head = await Promise.allSettled([
          headObject("index.json"),
          headObject("index.cdn.json"),
          headObject("index.js"),
          headObject("index.css"),
          headObject("index.cdn.css"),
          headObject("index.htm"),
        ]);
        const object = [];
        if (head[0].status === "rejected") {
          const id = new Date().valueOf();
          object.push(
            putObject(
              "index.json",
              "application/json",
              `{"visible":true,"value":"${get(bucket)}","id":${id}}`
            )
          );
          object.push(putObject(`${id}.htm`, "text/html", ""));
        }
        if (head[1].status === "rejected")
          object.push(putObject("index.cdn.json", "application/json", "[]"));
        if (head[2].status === "rejected")
          object.push(
            putObject(
              "index.js",
              "application/javascript",
              "function init(){try{}catch(e){}}"
            )
          );
        if (head[3].status === "rejected")
          object.push(putObject("index.css", "text/css", ""));
        if (head[4].status === "rejected")
          object.push(putObject("index.cdn.css", "text/css", ""));
        if (head[5].status === "rejected")
          object.push(
            putObject(
              "index.htm",
              "text/html",
              '<div class="v-container py-0 position-static" style="z-index:1"><div id="content" style="margin:0px;flex:1 1 auto"><article v-if="!template"></article><article v-else><v-runtime-template :parent="this" :template="template"></v-runtime-template></article></div></div>'
            )
          );
        await Promise.all(object);
        object.length = 0;
        object.push(getObject("index.json"));
        const file = await Promise.all(object);
        set(semantic, JSON.parse(file[0]));
      } catch (err) {
        // console.log(err.message);
      }
    else {
      set(semantic, []);
    }
  });
  return {
    s3,
    bucket,
    wendpoint,
    base,
    panel,
    content,
    semantic,
    template,
    js,
    javascript,
    css,
    style,
    snackbar,
    error,
  };
});
