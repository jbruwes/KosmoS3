import "core-js/stable";
import "regenerator-runtime/runtime";
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

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
  Object.values(
    await (await fetch("assets-manifest.json", { cache: "no-store" })).json()
  ).forEach((element, index) => {
    if (element !== "index.htm")
      setTimeout(async () => {
        try {
          await s3Client.send(
            new HeadObjectCommand({
              Bucket: pBucketName,
              Key: `${element}`,
            })
          );
        } catch (err) {
          const body = await (
            await fetch(`${element}`, { cache: "no-store" })
          ).blob();
          await s3Client.send(
            new PutObjectCommand({
              Bucket: pBucketName,
              Key: `${element}`,
              ContentType: body.type,
              Body: body,
            })
          );
        }
      }, (index + 1) * 1000);
  });
};
