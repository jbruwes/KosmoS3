import "core-js/stable";
import "regenerator-runtime/runtime";
import jsel from "jsel";
import S3 from "../s3";
import html from "./html";

/**
 * Рендеринг сайта
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
  const [[lJson], lHtml] = await Promise.all([
    JSON.parse(await io.getObject("index.json")),
    (
      await (await fetch("index.htm")).text()
    ).replace(/{{ pusher }}/g, await io.getObject("index.htm")),
  ]);
  const lMap = jsel(lJson).selectAll("//*[@id]");
  const lMapLength = lMap.length;
  let i = 0;
  setTimeout(async function run() {
    const lNode = lMap[i];
    lNode.path = jsel(lJson)
      .selectAll(`//*[@id="${lNode.id}"]/ancestor-or-self::*[@id]`)
      .map((e) =>
        decodeURI(e.value.trim().replace(/^\//, "")).replace(/ /g, "_")
      );
    lNode.path.shift();
    lNode.path = lNode.path.join("/");
    lNode.yandex = lJson.yandex;
    lNode.google = lJson.google;
    lNode.metrika = lJson.metrika;
    lNode.analytics = lJson.analytics;
    await html(lHtml, io, lNode);
    i += 1;
    if (i < lMapLength) setTimeout(run);
    else
      io.putObject(
        "sitemap.xml",
        "application/xml",
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${lMap
          .map((e) => {
            let lUrl = e.url
              ? decodeURI(e.url.trim().replace(/^\/+|\/+$/g, "")).replace(
                  / /g,
                  "_"
                )
              : "";
            lUrl = lUrl || e.path;
            lUrl = lUrl ? `${lUrl}/` : "";
            return `<url><loc>https://${pBucketName}${
              lUrl ? `/${encodeURI(lUrl)}` : ""
            }</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}${
              e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ""
            }${e.priority ? `<priority>${e.priority}</priority>` : ""}</url>`;
          })
          .join("")}</urlset>`
      );
  });
};
