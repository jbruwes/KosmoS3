import {
  S3Client,
  // HeadBucketCommand,
  GetObjectCommand,
  // PutObjectCommand,
} from "@aws-sdk/client-s3";

/**
 *
 */
export default class io {
  #s3Client;

  #bucket;

  /**
   * @param username
   * @param password
   * @param bucket
   * @param region
   */
  constructor(username, password, bucket, region) {
    this.#bucket = bucket;
    this.#s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: username,
        secretAccessKey: password,
      },
    });
  }

  /**
   * @param key
   */
  async getObject(key) {
    let bodyContents = null;
    try {
      /**
       * @param stream
       */
      const streamToString = (stream) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () =>
            resolve(Buffer.concat(chunks).toString("utf8"))
          );
        });
      const bucketParams = {
        Bucket: this.#bucket,
        Key: key,
      };
      const data = await this.#s3Client.send(
        new GetObjectCommand(bucketParams)
      );
      bodyContents = await streamToString(data.Body);
    } catch (err) {
      // console.log("Error", err);
    }
    return bodyContents;
  }
}
