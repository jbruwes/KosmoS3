import {
  S3Client,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";

/**
 *
 */
export default class S3 {
  #s3Client;

  #bucket;

  #region;

  #endpoint;

  #wendpoint;

  #accessKeyId;

  #secretAccessKey;

  /**
   * @param accessKeyId
   * @param secretAccessKey
   * @param bucket
   * @param region
   * @param endpoint
   * @param wendpoint
   */
  constructor(
    accessKeyId,
    secretAccessKey,
    bucket,
    region,
    endpoint = null,
    wendpoint = null
  ) {
    this.#accessKeyId = accessKeyId;
    this.#secretAccessKey = secretAccessKey;
    this.#bucket = bucket;
    this.#region = region;
    this.#wendpoint = wendpoint;
    this.#endpoint = endpoint;
    const config = {
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    };
    if (endpoint) config.endpoint = endpoint;
    this.#s3Client = new S3Client(config);
  }

  /**
   *
   */
  getAccessKeyId() {
    return this.#accessKeyId;
  }

  /**
   *
   */
  getSecretAccessKey() {
    return this.#secretAccessKey;
  }

  /**
   *
   */
  getBucket() {
    return this.#bucket;
  }

  /**
   *
   */
  getRegion() {
    return this.#region;
  }

  /**
   *
   */
  getEndpoint() {
    return this.#endpoint;
  }

  /**
   *
   */
  getWendpoint() {
    return this.#wendpoint;
  }

  /**
   *
   */
  async headBucket() {
    await this.#s3Client.send(
      new HeadBucketCommand({
        Bucket: this.#bucket,
      })
    );
  }

  /**
   * @param key
   */
  async deleteObject(key) {
    await this.#s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.#bucket,
        Key: key,
      })
    );
  }

  /**
   * @param key
   */
  async headObject(key) {
    await this.#s3Client.send(
      new HeadObjectCommand({
        Bucket: this.#bucket,
        Key: key,
      })
    );
  }

  /**
   * @param key
   * @param contentType
   * @param body
   */
  async putObject(key, contentType, body) {
    await this.#s3Client.send(
      new PutObjectCommand({
        Bucket: this.#bucket,
        Key: key,
        ContentType: contentType,
        Body: new TextEncoder().encode(body),
      })
    );
  }

  /**
   * @param key
   */
  async getObject(key) {
    /**
     * @param stream
     */
    const streamToString = (stream) =>
      new Promise((resolve) => {
        const chunks = [];
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        /**
         * @param root0
         * @param root0.done
         * @param root0.value
         */
        const processRead = ({ done, value }) => {
          if (done) resolve(chunks.join(""));
          else {
            chunks.push(decoder.decode(value));
            reader.read().then(processRead);
          }
        };
        reader.read().then(processRead);
      });
    let bodyContents = "";
    try {
      bodyContents = await streamToString(
        (
          await this.#s3Client.send(
            new GetObjectCommand({
              ResponseCacheControl: "no-store",
              Bucket: this.#bucket,
              Key: key,
            })
          )
        ).Body
      );
    } catch (e) {
      // console.log(e);
    }
    return bodyContents;
  }
}
