import jsel from "jsel";
import S3 from "@/s3";
import html from "./html";

/**
 * Рендеринг страницы
 *
 * @param {object} root0 Сообщение
 * @param {object} root0.data Данные сообщения
 * @param {string} root0.data.pAccessKeyId Идентификатор
 * @param {string} root0.data.pSecretAccessKey Ключ доступа
 * @param {string} root0.data.pBucketName Название корзины
 * @param {string} root0.data.pRegion Регион
 * @param {string} root0.data.pEndpoint Точка входа
 * @param {string} root0.data.pId Идентификатор страницы
 */
onmessage = async ({
  data: {
    pAccessKeyId,
    pSecretAccessKey,
    pBucketName,
    pRegion,
    pEndpoint,
    pId,
  },
}) => {
  const io = new S3(
    pAccessKeyId,
    pSecretAccessKey,
    pBucketName,
    pRegion,
    pEndpoint
  );
  const [lJson] = JSON.parse(await io.getObject("index.json"));
  const lNode = jsel(lJson).select(`//*[@id="${pId}"]`);
  if (lNode) {
    lNode.path = jsel(lJson)
      .selectAll(`//*[@id="${pId}"]/ancestor-or-self::*[@id]`)
      .map((e) =>
        decodeURI(e.value.trim().replace(/^\//, "")).replace(/ /g, "_")
      );
    lNode.path.shift();
    lNode.path = lNode.path.join("/");
    lNode.yandex = lJson.yandex;
    lNode.google = lJson.google;
    lNode.metrika = lJson.metrika;
    lNode.analytics = lJson.analytics;
    await html(
      (
        await (await fetch("index.htm")).text()
      ).replace(/{{ kosmos3 }}/g, await io.getObject("index.htm")),
      io,
      lNode
    );
  }
};
