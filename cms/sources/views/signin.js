import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import S3 from "../s3";

/**
 *
 */
export default class SignInView extends JetView {
  #config;

  #event = [];

  /**
   *
   */
  destroy() {
    if (this.#event)
      this.#event.forEach((event) => event.component.detachEvent(event.id));
    this.#event = null;
    this.#config = null;
    if (this.app.io === true) this.app.io = null;
  }

  /**
   * @param app
   */
  constructor(app) {
    super(app);
    /**
     *
     */
    function wendbpoint() {
      switch ($$("cloud").getValue()) {
        case "2":
          $$("wendpoint").setValue(
            `https://s3.${$$("region").getValue()}.amazonaws.com`
          );
          break;
        case "3":
          $$("wendpoint").setValue("https://website.yandexcloud.net");
          break;
        default:
      }
    }

    this.#config = {
      css: "signInView",
      view: "form",
      margin: 0,
      padding: 0,
      cols: [
        {
          gravity: 0.38,
        },
        {
          css: "signInViewRight",
          rows: [
            {
              css: "signInViewField",
              padding: 4,
              rows: [
                {
                  id: "responsive",
                  rows: [
                    {
                      responsive: "responsive",
                      cols: [
                        {
                          rows: [
                            {
                              width: 272,
                              template: "website",
                              type: "section",
                              css: "webix_section",
                            },
                            {
                              view: "richselect",
                              width: 272,
                              clear: true,
                              id: "stored",
                              placeholder: "Select saved credential",
                              options: [],
                            },
                            {
                              width: 272,
                              view: "text",
                              placeholder: "example.com",
                              name: "domain",
                              id: "domain",
                              required: true,
                            },
                            {
                              width: 272,
                              view: "text",
                              required: true,
                              placeholder: "access key id",
                              name: "username",
                              id: "username",
                            },
                            {
                              width: 272,
                              view: "text",
                              required: true,
                              type: "password",
                              placeholder: "secret access key",
                              name: "password",
                              id: "password",
                            },
                          ],
                        },
                        {
                          width: 272,
                          rows: [
                            {
                              template: "cloud",
                              type: "section",
                              css: "webix_section",
                            },
                            {
                              view: "richselect",
                              name: "cloud",
                              id: "cloud",
                              value: 1,
                              options: [
                                { id: 1, value: "custom..." },
                                { id: 2, value: "aws" },
                                { id: 3, value: "yandex" },
                              ],
                              on: {
                                /**
                                 * @param {*} pValue
                                 */
                                onChange: (pValue) => {
                                  switch (pValue) {
                                    case "2":
                                      $$($$("region").config.suggest)
                                        .getList()
                                        .parse([
                                          "us-east-2",
                                          "us-east-1",
                                          "us-west-1",
                                          "us-west-2",
                                          "af-south-1",
                                          "ap-east-1",
                                          "ap-southeast-3",
                                          "ap-south-1",
                                          "ap-northeast-3",
                                          "ap-northeast-2",
                                          "ap-southeast-1",
                                          "ap-southeast-2",
                                          "ap-northeast-1",
                                          "ca-central-1",
                                          "cn-north-1",
                                          "cn-northwest-1",
                                          "eu-central-1",
                                          "eu-west-1",
                                          "eu-west-2",
                                          "eu-south-1",
                                          "eu-west-3",
                                          "eu-north-1",
                                          "me-south-1",
                                          "sa-east-1",
                                        ]);
                                      $$("region").setValue("us-east-1");
                                      $$("region").enable();
                                      $$("endpoint").setValue("");
                                      $$("endpoint").disable();
                                      $$("wendpoint").disable();
                                      break;
                                    case "3":
                                      $$($$("region").config.suggest)
                                        .getList()
                                        .parse(["ru-central1"]);
                                      $$("region").setValue("ru-central1");
                                      $$("region").disable();
                                      $$("endpoint").setValue(
                                        "https://storage.yandexcloud.net"
                                      );
                                      $$("endpoint").disable();
                                      $$("wendpoint").disable();
                                      break;
                                    default:
                                      $$($$("region").config.suggest)
                                        .getList()
                                        .clearAll();
                                      $$("region").setValue("");
                                      $$("region").enable();
                                      $$("endpoint").setValue("");
                                      $$("endpoint").enable();
                                      $$("wendpoint").setValue("");
                                      $$("wendpoint").enable();
                                      break;
                                  }
                                  wendbpoint();
                                },
                              },
                            },
                            {
                              view: "text",
                              placeholder: "region",
                              name: "region",
                              id: "region",
                              required: true,
                              suggest: [],
                              on: {
                                onChange: wendbpoint,
                                onTimedKeyPress: wendbpoint,
                              },
                            },
                            {
                              view: "text",
                              placeholder: "endpoint url",
                              name: "endpoint",
                              id: "endpoint",
                              required: true,
                            },
                            {
                              view: "text",
                              placeholder: "website endpoint url",
                              name: "wendpoint",
                              id: "wendpoint",
                              required: true,
                            },
                          ],
                        },
                        {},
                      ],
                    },
                    {
                      cols: [
                        {
                          width: 272,
                          view: "checkbox",
                          id: "store",
                          labelWidth: 0,
                          labelRight: "Remember credentials",
                          value: 1,
                        },
                        {},
                      ],
                    },
                    {
                      cols: [
                        {
                          width: 272,
                          view: "button",
                          value: "Login",
                          id: "login",
                          css: "webix_primary",
                          click: this.clickLogin,
                        },
                        {},
                      ],
                    },
                  ],
                },
              ],
            },
            {},
            {
              padding: 2,
              cols: [
                {},
                {},
                {
                  id: "www",
                  view: "button",
                  css: "webix_transparent",
                  type: "icon",
                  width: 268,
                  label: "KosmoS3",
                  icon: "mdi mdi-cursor-default-click-outline",
                  /**
                   *
                   */
                  click: () => {
                    window.open("https://kosmos3.com", "_blank");
                  },
                },
              ],
            },
          ],
        },
      ],
    };
    if (this.app.config.size === "wide") {
      this.#config.cols[1].rows.unshift({
        view: "template",
        template: "<h1 class='mainHeader'>KosmoS3</h1>",
        minHeight: 90,
        type: "clean",
      });
    }
    this.#config.cols[1].rows.unshift({
      gravity: this.app.config.size === "wide" ? 2 : 1,
    });
  }

  /**
   *
   */
  config = () => this.#config;

  /**
   *
   */
  clickLogin = async () => {
    if (
      this.form.validate() &&
      (this.app.io === undefined ||
        !this.app.io ||
        (this.app.io !== true &&
          !(
            this.app.io.getAccessKeyId() === $$("username").getValue() &&
            this.app.io.getSecretAccessKey() === $$("password").getValue() &&
            this.app.io.getBucket() === $$("domain").getValue() &&
            this.app.io.getRegion === $$("region").getValue() &&
            this.app.io.getEndpoint ===
              $$("endpoint").getValue().replace(/\/$/, "") &&
            this.app.io.getWendpoint ===
              $$("wendpoint").getValue().replace(/\/$/, "")
          )))
    ) {
      this.app.io = true;
      const felWorker = new Worker(
        new URL("../workers/fel.js", import.meta.url)
      );
      const initWorker = new Worker(
        new URL("../workers/init.js", import.meta.url)
      );
      if (this.app) {
        try {
          const message = {
            pAccessKeyId: $$("username").getValue(),
            pSecretAccessKey: $$("password").getValue(),
            pBucketName: $$("domain").getValue(),
            pRegion: $$("region").getValue(),
            pEndpoint: $$("endpoint").getValue().replace(/\/$/, ""),
            pWendpoint: $$("wendpoint").getValue().replace(/\/$/, ""),
          };
          const io = new S3(
            message.pAccessKeyId,
            message.pSecretAccessKey,
            message.pBucketName,
            message.pRegion,
            message.pEndpoint,
            message.pWendpoint
          );
          await io.headBucket();
          if (this.app) {
            // webix.UIManager.removeHotKey("enter", this.clickLogin);
            /**
             *
             */
            initWorker.onmessage = () => {
              $$("sidebar").clearAll();
              $$("toolbar").addView({
                id: "play",
                view: "icon",
                icon: "mdi mdi-play-circle",
                /**
                 *
                 */
                click: () =>
                  window.open(`https://${message.pBucketName}`, "_tab"),
              });
              $$("sidebar").add(
                {
                  id: "content",
                  icon: "mdi mdi-book-open-page-variant",
                  value: "Content",
                },
                0
              );
              $$("sidebar").add(
                {
                  id: "template",
                  icon: "mdi mdi-language-html5",
                  value: "Template",
                },
                1
              );
              $$("sidebar").add(
                {
                  id: "css",
                  icon: "mdi mdi-language-css3",
                  value: "CSS",
                },
                2
              );
              $$("sidebar").add(
                {
                  id: "js",
                  icon: "mdi mdi-language-javascript",
                  value: "JavaScript",
                },
                3
              );
              $$("sidebar").add(
                {
                  id: "settings",
                  icon: "mdi mdi-cog",
                  value: "Settings",
                },
                4
              );
              $$("sidebar").add({
                id: "signout",
                icon: "mdi mdi-logout-variant",
                value: "Sign Out",
              });
              $$("sidebar").select("content");
              this.app.io = io;
              this.show("content");
              felWorker.postMessage(message);
            };
            initWorker.postMessage(message);
            let storageLocal = webix.storage.local.get("keys");
            if (!storageLocal) storageLocal = [];
            else {
              const oBucketName = $$("stored").getText();
              if (message.pBucketName !== oBucketName)
                storageLocal = storageLocal.filter(
                  (item) => item.pBucketName !== oBucketName
                );
            }
            if ($$("store").getValue()) {
              message.pCloud = $$("cloud").getValue();
              const storageItem = storageLocal.findIndex(
                (item) => item.pBucketName === message.pBucketName
              );
              if (storageItem === -1) storageLocal.push(message);
              else storageLocal[storageItem] = message;
            } else {
              storageLocal = storageLocal.filter(
                (item) => item.pBucketName !== message.pBucketName
              );
            }
            webix.storage.local.put("keys", storageLocal);
          }
        } catch (err) {
          if (this.app) {
            this.app.io = null;
            webix.message({
              text: err.message,
              type: "error",
            });
          }
        }
      }
    }
  };

  /**
   *
   * @param view
   */
  ready(view) {
    this.form = view;
    /**
     * Обработчик выбора сохраненных кредов
     *
     * @param {number} value id в списке
     */
    function onChangeStored(value) {
      if (value) {
        const { creds } = this.getList().getItem(value);
        $$("domain").setValue(creds.pBucketName);
        $$("username").setValue(creds.pAccessKeyId);
        $$("password").setValue(creds.pSecretAccessKey);
        $$("region").setValue(creds.pRegion);
        $$("endpoint").setValue(creds.pEndpoint);
        $$("wendpoint").setValue(creds.pWendpoint);
        $$("cloud").setValue(creds.pCloud);
      } else {
        $$("domain").setValue("");
        $$("username").setValue("");
        $$("password").setValue("");
        $$("region").setValue("");
        $$("endpoint").setValue("");
        $$("wendpoint").setValue("");
        $$("cloud").setValue(1);
      }
    }
    let storageLocal = webix.storage.local.get("keys");
    if (!storageLocal) storageLocal = [];
    const options = [];
    storageLocal.forEach((value, index) => {
      options.push({ id: index + 1, value: value.pBucketName, creds: value });
    });
    $$("stored").getList().parse(options);
    this.#event.push({
      component: $$("stored"),
      id: $$("stored").attachEvent("onChange", onChangeStored),
    });
    // webix.UIManager.addHotKey("enter", this.clickLogin, $$("username"));
    // webix.UIManager.addHotKey("enter", this.clickLogin, $$("password"));
    // webix.UIManager.addHotKey("enter", this.clickLogin, $$("login"));
  }
}
