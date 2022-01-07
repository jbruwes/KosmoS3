/**
 * @param {string} pPath Путь
 * @param {string} pHtml Объект для чтения шаблона сайта
 * @param {object} pIo Клиент S3
 * @param {object} pNode Текущий узел
 * @see https://github.com/joshbuchea/HEAD
 */
export default async function html(pPath, pHtml, pIo, pNode) {
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
  lHtml = lHtml.replace(
    /#yandex#/g,
    pNode.yandex ? pNode.yandex.replace(/"/g, "&quot;") : ""
  );
  lHtml = lHtml.replace(
    /#google#/g,
    pNode.google ? pNode.google.replace(/"/g, "&quot;") : ""
  );
  const lImage = pNode.image;
  lHtml = lHtml.replace(
    /#image#/g,
    lImage ? `https://${pIo.getBucket()}/${encodeURI(lImage)}` : ""
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
    lHtm = await pIo.getObject(`${pNode.id}.htm`);
  } finally {
    lHtml = lHtml.replace(/<main><\/main>/g, `<main>${lHtm}</main>`);
    if (pNode.url) {
      let lUrl = decodeURI(pNode.url.trim().replace(/^\/+|\/+$/g, "")).replace(
        / /g,
        "_"
      );
      lUrl = lUrl ? `${lUrl}/` : "";
      await pIo.putObject(
        `${lUrl}index.html`,
        "text/html",
        lHtml.replace(/#url#/g, `https://${pIo.getBucket()}/${encodeURI(lUrl)}`)
      );
    }
    const lPath = pPath ? `${pPath}/` : "";
    await pIo.putObject(
      `${lPath}index.html`,
      "text/html",
      lHtml.replace(/#url#/g, `https://${pIo.getBucket()}/${encodeURI(lPath)}`)
    );
  }
}
