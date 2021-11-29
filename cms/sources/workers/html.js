import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
/**
 * @param {string} pPath Путь
 * @param {string} pHtml Объект для чтения шаблона сайта
 * @param {object} pS3Client Клиент S3
 * @param {string} pBucketName Имя корзинки
 * @param {object} pNode Текущий узел
 */
export default async function html(
  pPath,
  pHtml,
  pS3Client,
  pBucketName,
  pNode
) {
  let lHtml = pHtml;
  lHtml = lHtml.replace(/#base#/g, "/");
  lHtml = lHtml.replace(
    /#title#/g,
    (pNode.title ? pNode.title : pNode.value).replace(/"/g, "&quot;")
  );
  lHtml = lHtml.replace(
    /#description#/g,
    pNode.description ? pNode.description.replace(/"/g, "&quot;") : ""
  );
  const lImage = pNode.image;
  lHtml = lHtml.replace(
    /#image#/g,
    lImage ? `https://${pBucketName}/${encodeURI(lImage)}` : ""
  );
  if (pNode.metrika) lHtml = lHtml.replace(/#metrika#/g, pNode.metrika);
  else
    lHtml = lHtml.replace(
      /<script id="yandex"[^>]*>([\s\S]*?)<\/script>/gi,
      ""
    );
  if (pNode.analytics) lHtml = lHtml.replace(/#analytics#/g, pNode.analytics);
  else
    lHtml = lHtml
      .replace(/<script id="google"[^>]*>([\s\S]*?)<\/script>/gi, "")
      .replace(/<script id="analytics"[^>]*>([\s\S]*?)<\/script>/gi, "");
  let lHtm = "";
  try {
    lHtm = new TextDecoder().decode(
      (
        await (
          await (
            await pS3Client.send(
              new GetObjectCommand({
                Bucket: pBucketName,
                ResponseCacheControl: "no-store",
                Key: `${pNode.id}.htm`,
              })
            )
          ).Body.getReader()
        ).read()
      ).value
    );
  } finally {
    lHtml = lHtml.replace(/<main><\/main>/g, `<main>${lHtm}</main>`);
    if (pNode.url) {
      let lUrl = decodeURI(pNode.url.trim().replace(/^\/+|\/+$/g, "")).replace(
        / /g,
        "_"
      );
      lUrl = lUrl ? `${lUrl}/` : "";
      await pS3Client.send(
        new PutObjectCommand({
          Bucket: pBucketName,
          Key: `${lUrl}index.html`,
          ContentType: "text/html",
          Body: lHtml.replace(
            /#url#/g,
            `https://${pBucketName}/${encodeURI(lUrl)}`
          ),
        })
      );
    }
    const lPath = pPath ? `${pPath}/` : "";
    await pS3Client.send(
      new PutObjectCommand({
        Bucket: pBucketName,
        Key: `${lPath}index.html`,
        ContentType: "text/html",
        Body: lHtml.replace(
          /#url#/g,
          `https://${pBucketName}/${encodeURI(lPath)}`
        ),
      })
    );
  }
}
