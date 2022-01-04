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
  try {
    io.headObject("index.json");
  } catch (err) {
    const id = new Date().valueOf();
    io.putObject(
      "index.json",
      "application/json",
      `{"link":"","text":"","date":"","image":"","visible":true,"value":"${pBucketName}","id":${id}}`
    );
    io.putObject(`${id}.htm`, "text/html", "");
  }
  try {
    io.headObject("index.cdn.json");
  } catch (err) {
    io.putObject("index.cdn.json", "application/json", "[]");
  }
  try {
    io.headObject("index.js");
  } catch (err) {
    io.putObject(
      "index.js",
      "application/javascript",
      "function init(){try{}catch(e){}}"
    );
  }
  try {
    io.headObject("index.css");
  } catch (err) {
    io.putObject("index.css", "text/css", "");
  }
  try {
    io.headObject("index.cdn.css");
  } catch (err) {
    io.putObject("index.cdn.css", "text/css", "");
  }
  try {
    io.headObject("index.htm");
  } catch (err) {
    io.putObject(
      "index.htm",
      "text/html",
      (await (await fetch("index.htm", { cache: "no-store" })).text()).replace(
        "{pusher}",
        '<div data-static="" class="ui container" style="z-index:1"><div id="content" style="margin:0px;flex:1 1 auto"><main></main></div></div>'
      )
    );
  }
};
