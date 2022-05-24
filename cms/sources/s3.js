import {
  S3Client,
  HeadObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  HeadBucketCommand,
} from "@aws-sdk/client-s3";

/**
 * Сервисный класс для S3
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
   * Конструктор
   *
   * @param {string} accessKeyId Идентификатор доступа
   * @param {string} secretAccessKey Ключ доступа
   * @param {string} bucket Корзина
   * @param {string} region Регион
   * @param {string} endpoint Урл для api
   * @param {string} wendpoint Урл для доступа к сайту
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
   * Геттер для идентификатора доступа
   *
   * @returns {string} Идентификатор доступа
   */
  getAccessKeyId = () => this.#accessKeyId;

  /**
   * Геттер для ключа доступа
   *
   * @returns {string} Ключ доступа
   */
  getSecretAccessKey = () => this.#secretAccessKey;

  /**
   * Геттер для корзины
   *
   * @returns {string} Корзина
   */
  getBucket = () => this.#bucket;

  /**
   * Геттер для региона
   *
   * @returns {string} Регион
   */
  getRegion = () => this.#region;

  /**
   * Геттер урла для api
   *
   * @returns {string} Урл для api
   */
  getEndpoint = () => this.#endpoint;

  /**
   * Геттер урла для сайта
   *
   * @returns {string} Урл для сайта
   */
  getWendpoint = () => this.#wendpoint;

  /**
   * Считываение заголовка корзины
   *
   * @returns {object} Заголовок корзины
   */
  async headBucket() {
    const body = await this.#s3Client.send(
      new HeadBucketCommand({
        Bucket: this.#bucket,
      })
    );
    return body;
  }

  /**
   * Считывание заголовка объекта
   *
   * @param {string} key Имя файла
   * @returns {object} Заголовок файла
   */
  async headObject(key) {
    const body = await this.#s3Client.send(
      new HeadObjectCommand({
        Bucket: this.#bucket,
        Key: key,
      })
    );
    return body;
  }

  /**
   * Запись объекта
   *
   * @param {string} key Имя файла
   * @param {string} contentType Тип mime
   * @param {string | Uint8Array | Buffer} body Тело файла
   */
  async putObject(key, contentType, body) {
    await this.#s3Client.send(
      new PutObjectCommand({
        Bucket: this.#bucket,
        Key: key,
        ContentType: contentType,
        Body: typeof body === "string" ? new TextEncoder().encode(body) : body,
      })
    );
  }

  /**
   * Считывание объекта
   *
   * @param {string} key Имя файла
   * @returns {string} Тело файла
   */
  async getObject(key) {
    /**
     * Импорт строки из потока
     *
     * @param {object} stream Поток
     * @returns {string} Строка из потока
     */
    const streamToString = (stream) =>
      new Promise((resolve) => {
        const chunks = [];
        const reader = stream.getReader();
        const decoder = new TextDecoder();
        /**
         * Обработчик по готовности считывания из потока
         *
         * @param {object} root0 Объект параметров функции
         * @param {boolean} root0.done Флаг окончания считывания из потока
         * @param {string} root0.value Считанное значение
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
    const bodyContents = await streamToString(
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
    return bodyContents;
  }
}
