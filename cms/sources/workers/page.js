import "core-js/stable";
import "regenerator-runtime/runtime";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import jsel from "jsel";
import html from "./html";

/**
 * @param root0
 * @param root0.data
 * @param root0.data.pAccessKeyId
 * @param root0.data.pSecretAccessKey
 * @param root0.data.pBucketName
 * @param root0.data.pRegion
 * @param root0.data.pId
 */
onmessage = async ({
  data: { pAccessKeyId, pSecretAccessKey, pBucketName, pRegion, pId },
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
  const lNode = jsel(lJson).select(`//*[@id="${pId}"]`);
  if (lNode) {
    const lPath = jsel(lJson)
      .selectAll(`//*[@id="${pId}"]/ancestor-or-self::*[@id]`)
      .map((e) =>
        decodeURI(e.value.trim().replace(/^\//, "")).replace(/ /g, "_")
      );
    lPath.shift();
    html(
      lPath.join("/"),
      (await (await fetch("index.htm", { cache: "no-store" })).text()).replace(
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
      ),
      s3Client,
      pBucketName,
      lNode
    );
  }
};
