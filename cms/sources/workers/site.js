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
 * @param root0.data.pEndpoint
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
  const [lJson] = JSON.parse(await io.getObject("index.json"));
  const lHtml = (await (await fetch("index.htm")).text()).replace(
    /#pusher#/g,
    await io.getObject("index.htm")
  );
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
    await html(lNode.path, lHtml, io, lNode);
    i += 1;
    if (i < lMapLength) setTimeout(run);
    else
      io.putObject(
        "sitemap.xml",
        "application/xml",
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${lMap
          .map((e) => {
            const lUrl = e.url
              ? decodeURI(e.url.trim().replace(/^\/+|\/+$/g, "")).replace(
                  / /g,
                  "_"
                )
              : e.path;
            return `<url><loc>https://${pBucketName}/${
              lUrl ? `${lUrl}/` : ""
            }</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}${
              e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ""
            }${e.priority ? `<priority>${e.priority}</priority>` : ""}</url>`;
          })
          .join("")}</urlset>`
      );
  });
};
