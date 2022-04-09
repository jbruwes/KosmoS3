import "core-js/stable";
import "regenerator-runtime/runtime";
import S3 from "../s3";

/**
 *
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
  const lObjects = Object.values(
    await (await fetch("assets-manifest.json", { cache: "no-store" })).json()
  );
  const lOobjectsLength = lObjects.length;
  let i = 0;
  setTimeout(async function run() {
    try {
      await io.headObject(`${lObjects[i]}`);
    } catch (err) {
      const body = await (
        await fetch(`${lObjects[i]}`, { cache: "no-store" })
      ).blob();
      await io.putObject(`${lObjects[i]}`, body.type, body);
    } finally {
      i += 1;
      if (i < lOobjectsLength) setTimeout(run);
    }
  });
};
