import "core-js/stable";
import "regenerator-runtime/runtime";
import S3 from "../s3";

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
  Object.values(
    await (await fetch("assets-manifest.json", { cache: "no-store" })).json()
  ).forEach((element, index) => {
    if (element !== "index.htm")
      setTimeout(async () => {
        try {
          await io.headObject(`${element}`);
        } catch (err) {
          const body = await (
            await fetch(`${element}`, { cache: "no-store" })
          ).blob();
          await io.putObject(`${element}`, body.type, body);
        }
      }, (index + 1) * 1000);
  });
};
