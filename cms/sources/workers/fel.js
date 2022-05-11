import "core-js/stable";
import "regenerator-runtime/runtime";
import S3 from "../s3";

/**
 * Копирование fel на сайт
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
  let lJson;
  let lObjects;
  [lJson, lObjects] = await Promise.all([
    io.getObject("index.json"),
    (await fetch("assets-manifest.json", { cache: "no-store" })).json(),
  ]);
  [lJson] = JSON.parse(lJson);
  lObjects = Object.values(lObjects);
  const lOobjectsLength = lObjects.length;
  let i = 0;
  setTimeout(async function run() {
    try {
      const lHead = await io.headObject(`${lObjects[i]}`);
      if (lObjects[i] === "robots.txt" || lObjects[i] === "site.webmanifest") {
        const body = (
          await (await fetch(`${lObjects[i]}`, { cache: "no-store" })).text()
        )
          .replace(
            /{{ name }}/g,
            (lJson.title ? lJson.title : lJson.value).replace(/"/g, "&quot;")
          )
          .replace(/{{ short_name }}/g, lJson.value.replace(/"/g, "&quot;"))
          .replace(/{{ domain }}/g, pBucketName);
        let type;
        switch (lObjects[i]) {
          case "robots.txt":
            type = "text/plain";
            break;
          case "site.webmanifest":
            type = "application/manifest+json";
            break;
          default:
        }
        if (lHead.ContentLength === new TextEncoder().encode(body).length) {
          if (body !== (await io.getObject(`${lObjects[i]}`)))
            await io.putObject(`${lObjects[i]}`, type, body);
        } else await io.putObject(`${lObjects[i]}`, type, body);
      }
    } catch (err) {
      const body = await (await fetch(`${lObjects[i]}`)).blob();
      await io.putObject(`${lObjects[i]}`, body.type, body);
    } finally {
      i += 1;
      if (i < lOobjectsLength) setTimeout(run);
    }
  });
};
