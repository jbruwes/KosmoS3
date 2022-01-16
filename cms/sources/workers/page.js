import "core-js/stable";
import "regenerator-runtime/runtime";
import jsel from "jsel";
import S3 from "../s3";
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
  const io = new S3(pAccessKeyId, pSecretAccessKey, pBucketName, pRegion);
  const [lJson] = JSON.parse(await io.getObject("index.json"));
  const lNode = jsel(lJson).select(`//*[@id="${pId}"]`);
  if (lNode) {
    const lPath = jsel(lJson)
      .selectAll(`//*[@id="${pId}"]/ancestor-or-self::*[@id]`)
      .map((e) =>
        decodeURI(e.value.trim().replace(/^\//, "")).replace(/ /g, "_")
      );
    lPath.shift();
    await html(
      lPath.join("/"),
      (
        await (await fetch("index.htm", { cache: "no-store" })).text()
      ).replace(/#pusher#/g, await io.getObject("index.htm")),
      io,
      lNode
    );
  }
};
