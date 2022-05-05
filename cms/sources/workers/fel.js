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
  const lObjects = Object.values(
    await (await fetch("assets-manifest.json", { cache: "no-store" })).json()
  );
  const lOobjectsLength = lObjects.length;
  let i = 0;
  setTimeout(async function run() {
    try {
      await io.headObject(`${lObjects[i]}`);
    } catch (err) {
      const body = await (await fetch(`${lObjects[i]}`)).blob();
      await io.putObject(`${lObjects[i]}`, body.type, body);
    } finally {
      i += 1;
      if (i < lOobjectsLength) setTimeout(run);
    }
  });
};
