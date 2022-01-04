import "core-js/stable";
import "regenerator-runtime/runtime";
import jsel from "jsel";
import S3 from "../s3";
import html from "./html";

/**
 * @param root0
 * @param root0.data
 * @param root0.data.pAccessKeyId
 * @param root0.data.pSecretAccessKey
 * @param root0.data.pBucketName
 * @param root0.data.pRegion
 */
onmessage = async ({
  data: { pAccessKeyId, pSecretAccessKey, pBucketName, pRegion },
}) => {
  const io = new S3(pAccessKeyId, pSecretAccessKey, pBucketName, pRegion);
  const [lJson] = JSON.parse(await io.getObject("index.json"));
  const lHtml = (
    await (await fetch("index.htm", { cache: "no-store" })).text()
  ).replace(/#pusher#/g, await io.getObject("index.htm"));
  const lMap = jsel(lJson).selectAll("//*[@id]");
  lMap.forEach((item, index) => {
    const lNode = item;
    lNode.path = jsel(lJson)
      .selectAll(`//*[@id="${lNode.id}"]/ancestor-or-self::*[@id]`)
      .map((e) =>
        decodeURI(e.value.trim().replace(/^\//, "")).replace(/ /g, "_")
      );
    lNode.path.shift();
    lNode.path = lNode.path.join("/");
    setTimeout(html, index * 100, lNode.path, lHtml, io, lNode);
  });
  await io.putObject(
    "sitemap.xml",
    "application/xml",
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${lMap
      .map((e) => {
        const lUrl = e.url
          ? decodeURI(e.url.trim().replace(/^\/+|\/+$/g, "")).replace(/ /g, "_")
          : e.path;
        return `<url><loc>https://${pBucketName}/${
          lUrl ? `${lUrl}/` : ""
        }</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}${
          e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ""
        }${e.priority ? `<priority>${e.priority}</priority>` : ""}</url>`;
      })
      .join("")}</urlset>`
  );
};
