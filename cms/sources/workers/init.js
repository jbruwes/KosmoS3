import "core-js/stable";
import "regenerator-runtime/runtime";
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

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
  const s3Client = new S3Client({
    region: pRegion,
    credentials: {
      accessKeyId: pAccessKeyId,
      secretAccessKey: pSecretAccessKey,
    },
  });
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: pBucketName,
        Key: `index.json`,
      })
    );
  } catch (err) {
    const id = new Date().valueOf();
    await s3Client.send(
      new PutObjectCommand({
        Bucket: pBucketName,
        Key: `index.json`,
        ContentType: "application/json",
        Body: `{"link":"","text":"","date":"","image":"","visible":true,"value":"${pBucketName}","id":${id}}`,
      })
    );
    await s3Client.send(
      new PutObjectCommand({
        Bucket: pBucketName,
        Key: `${id}.htm`,
        ContentType: "text/html",
        Body: "",
      })
    );
  }
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: pBucketName,
        Key: `index.cdn.json`,
      })
    );
  } catch (err) {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: pBucketName,
        Key: `index.cdn.json`,
        ContentType: "application/json",
        Body: "[]",
      })
    );
  }
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: pBucketName,
        Key: `index.js`,
      })
    );
  } catch (err) {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: pBucketName,
        Key: `index.js`,
        ContentType: "application/javascript",
        Body: "function init(){try{}catch(e){}}",
      })
    );
  }
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: pBucketName,
        Key: `index.css`,
      })
    );
  } catch (err) {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: pBucketName,
        Key: `index.css`,
        ContentType: "text/css",
        Body: "",
      })
    );
  }
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: pBucketName,
        Key: `index.cdn.css`,
      })
    );
  } catch (err) {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: pBucketName,
        Key: `index.cdn.css`,
        ContentType: "text/css",
        Body: "",
      })
    );
  }
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: pBucketName,
        Key: `index.htm`,
      })
    );
  } catch (err) {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: pBucketName,
        Key: `index.htm`,
        ContentType: "text/html",
        Body: (
          await (await fetch("index.htm", { cache: "no-store" })).text()
        ).replace(
          "{pusher}",
          '<div data-static="" class="ui container" style="z-index:1"><div id="content" style="margin:0px;flex:1 1 auto"><main></main></div></div>'
        ),
      })
    );
  }
};
