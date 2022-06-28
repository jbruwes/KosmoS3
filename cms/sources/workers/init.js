import "core-js/stable";
import "regenerator-runtime/runtime";
import S3 from "../s3";

/**
 * Создание обязательных файлов
 *
 * @param {object} root0 Сообщение
 * @param {object} root0.data Данные сообщения
 * @param {string} root0.data.pAccessKeyId Идентификатор
 * @param {string} root0.data.pSecretAccessKey Ключ доступа
 * @param {string} root0.data.pBucketName Название корзины
 * @param {string} root0.data.pRegion Регион
 * @param {string} root0.data.pEndpoint Точка входа
 */
onmessage = async ({
  data: { pAccessKeyId, pSecretAccessKey, pBucketName, pRegion, pEndpoint },
}) => {
  const io = new S3(
    pAccessKeyId,
    pSecretAccessKey,
    pBucketName,
    pRegion,
    pEndpoint
  );
  const head = await Promise.allSettled([
    io.headObject("index.json"),
    io.headObject("index.cdn.json"),
    io.headObject("index.js"),
    io.headObject("index.css"),
    io.headObject("index.cdn.css"),
    io.headObject("index.htm"),
  ]);
  const put = [];
  if (head[0].status === "rejected") {
    const id = new Date().valueOf();
    put.push(
      io.putObject(
        "index.json",
        "application/json",
        `{"visible":true,"value":"${pBucketName}","id":${id}}`
      )
    );
    put.push(io.putObject(`${id}.htm`, "text/html", ""));
  }
  if (head[1].status === "rejected")
    put.push(io.putObject("index.cdn.json", "application/json", "[]"));
  if (head[2].status === "rejected")
    put.push(
      io.putObject(
        "index.js",
        "application/javascript",
        "function init(){try{}catch(e){}}"
      )
    );
  if (head[3].status === "rejected")
    put.push(io.putObject("index.css", "text/css", ""));
  if (head[4].status === "rejected")
    put.push(io.putObject("index.cdn.css", "text/css", ""));
  if (head[5].status === "rejected")
    put.push(
      io.putObject(
        "index.htm",
        "text/html",
        // '<div class="v-container py-0 position-static" style="z-index:1"><div id="content" style="margin:0px;flex:1 1 auto"><article v-if="!content"></article><article v-else v-html="content"></article></div></div>'
        '<div class="v-container py-0 position-static" style="z-index:1"><div id="content" style="margin:0px;flex:1 1 auto"><article v-if="!content"></article><article v-else><v-runtime-template :template="content"></v-runtime-template></article></div></div>'
      )
    );
  if (put.length)
    try {
      await Promise.all(put);
    } finally {
      postMessage(null);
    }
  else postMessage(null);
};
