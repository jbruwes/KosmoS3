import "core-js/stable";
import "regenerator-runtime/runtime";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import jsel from "jsel";
import html from "./html";

onmessage = async ({
  data: { pAccessKeyId, pSecretAccessKey, pBucketName, pRegion },
}) => {
  const s3Client = new S3Client({
    region: pRegion,
    credentials: {
      accessKeyId: pAccessKeyId,
      secretAccessKey: pSecretAccessKey,
    },
  });
  const [lJson] = JSON.parse(
    new TextDecoder().decode(
      (
        await (
          await (
            await s3Client.send(
              new GetObjectCommand({
                Bucket: pBucketName,
                ResponseCacheControl: "no-store",
                Key: "index.json",
              })
            )
          ).Body.getReader()
        ).read()
      ).value
    )
  );
  const lHtml = (
    await (await fetch("index.htm", { cache: "no-store" })).text()
  ).replace(
    /#pusher#/g,
    new TextDecoder().decode(
      (
        await (
          await (
            await s3Client.send(
              new GetObjectCommand({
                Bucket: pBucketName,
                ResponseCacheControl: "no-store",
                Key: "index.htm",
              })
            )
          ).Body.getReader()
        ).read()
      ).value
    )
  );
  const lMap = jsel(lJson).selectAll("//*[@id]");
  lMap.forEach((item) => {
    const lNode = item;
    lNode.path = jsel(lJson)
      .selectAll(`//*[@id="${lNode.id}"]/ancestor-or-self::*[@id]`)
      .map((e) =>
        decodeURI(e.value.trim().replace(/^\//, "")).replace(/ /g, "_")
      );
    lNode.path.shift();
    lNode.path = lNode.path.join("/");
    html(lNode.path, lHtml, s3Client, pBucketName, lNode);
  });
  await s3Client.send(
    new PutObjectCommand({
      Bucket: pBucketName,
      Key: "sitemap.xml",
      ContentType: "application/xml",
      Body: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${lMap
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
        .join("")}</urlset>`,
    })
  );
};
