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
  const [[lJson], lObjects] = await Promise.all([
    JSON.parse(await io.getObject("index.json")),
    Object.values(
      await (await fetch("assets-manifest.json", { cache: "no-store" })).json()
    ),
  ]);
  const lOobjectsLength = lObjects.length;
  let i = 0;
  setTimeout(async function run() {
    try {
      if (lObjects[i] !== "index.htm") {
        const lHead = await io.headObject(`${lObjects[i]}`);
        let type;
        switch (lObjects[i]) {
          case "robots.txt":
            type = "text/plain";
            break;
          case "site.webmanifest":
            type = "application/manifest+json";
            break;
          case "error.html":
            type = "text/html";
            break;
          case "browserconfig.xml":
            type = "application/xml";
            break;
          default:
            type = null;
        }
        if (type) {
          const body = (
            await (await fetch(`${lObjects[i]}`, { cache: "no-store" })).text()
          )
            .replace(
              /{{ name }}/g,
              (lJson.title ? lJson.title : lJson.value).replace(/"/g, "&quot;")
            )
            .replace(/{{ short_name }}/g, lJson.value.replace(/"/g, "&quot;"))
            .replace(/{{ domain }}/g, pBucketName);
          if (lHead.ContentLength !== new TextEncoder().encode(body).length)
            await io.putObject(`${lObjects[i]}`, type, body);
          else if (body !== (await io.getObject(`${lObjects[i]}`)))
            await io.putObject(`${lObjects[i]}`, type, body);
        }
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
