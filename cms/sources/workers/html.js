/**
 * @param {string} pHtml Шаблон сайта
 * @param {object} pIo Клиент S3
 * @param {object} pNode Текущий узел
 * @see https://github.com/joshbuchea/HEAD
 */
export default async function html(pHtml, pIo, pNode) {
  let lHtml = pHtml;
  lHtml = lHtml.replace(/{{ base }}/g, "/");
  lHtml = lHtml.replace(
    /{{ title }}/g,
    (pNode.title ? pNode.title : pNode.value).replace(/"/g, "&quot;")
  );
  lHtml = lHtml.replace(
    /{{ description }}/g,
    pNode.description ? pNode.description.replace(/"/g, "&quot;") : ""
  );
  lHtml = lHtml.replace(
    /{{ keywords }}/g,
    pNode.keywords ? pNode.keywords.replace(/"/g, "&quot;") : ""
  );
  lHtml = lHtml.replace(
    /{{ yandex }}/g,
    pNode.yandex ? pNode.yandex.replace(/"/g, "&quot;") : ""
  );
  lHtml = lHtml.replace(
    /{{ google }}/g,
    pNode.google ? pNode.google.replace(/"/g, "&quot;") : ""
  );
  const lImage = pNode.image;
  lHtml = lHtml.replace(
    /{{ image }}/g,
    lImage ? `https://${pIo.getBucket()}/${encodeURI(lImage)}` : ""
  );
  if (pNode.metrika) lHtml = lHtml.replace(/{{ metrika }}/g, pNode.metrika);
  else
    lHtml = lHtml.replace(
      /<script id="yandex"[^>]*>([\s\S]*?)<\/script>/gi,
      ""
    );
  if (pNode.analytics)
    lHtml = lHtml.replace(/{{ analytics }}/g, pNode.analytics);
  else
    lHtml = lHtml.replace(
      /<script id="google"[^>]*>([\s\S]*?)<\/script>/gi,
      ""
    );
  let lHtm = "";
  try {
    lHtm = await pIo.getObject(`${pNode.id}.htm`);
  } finally {
    lHtml = lHtml.replace(
      /<main><\/main>/g,
      `<main v-if="!content">${lHtm}</main><main v-else v-html="content"></main>`
    );
    let lUrl = "";
    if (pNode.url) {
      lUrl = decodeURI(pNode.url.trim().replace(/^\/+|\/+$/g, "")).replace(
        / /g,
        "_"
      );
      if (lUrl) {
        lUrl = `${lUrl}/`;
        await pIo.putObject(
          `${lUrl}index.html`,
          "text/html",
          lHtml.replace(
            /{{ url }}/g,
            `https://${pIo.getBucket()}/${encodeURI(lUrl)}`
          )
        );
      }
    }
    const lPath = pNode.path ? `${pNode.path}/` : "";
    lUrl = lUrl || lPath;
    await pIo.putObject(
      `${lPath}index.html`,
      "text/html",
      lHtml.replace(
        /{{ url }}/g,
        `https://${pIo.getBucket()}${lUrl ? `/${encodeURI(lUrl)}` : ""}`
      )
    );
  }
}
