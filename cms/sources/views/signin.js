import { JetView } from "webix-jet";
import * as webix from "webix/webix.min";
import { IAMClient, GetUserCommand } from "@aws-sdk/client-iam";
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
    this.#config = {
      css: "signInView",
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
                  cols: [
                    {
                      view: "richselect",
                      width: 272,
                      clear: true,
                      id: "stored",
                      placeholder: "Select saved credential",
                      options: [],
                    },
                    {},
                  ],
                },
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
                              template: "Required",
                              type: "section",
                              css: "webix_section",
                            },
                            {
                              width: 272,
                              view: "text",
                              required: true,
                              placeholder: "Access key ID",
                              name: "username",
                              id: "username",
                            },
                            {
                              width: 272,
                              view: "text",
                              required: true,
                              type: "password",
                              placeholder: "Secret access key",
                              name: "password",
                              id: "password",
                            },
                          ],
                        },
                        {
                          width: 272,
                          rows: [
                            {
                              template: "Optional",
                              type: "section",
                              css: "webix_section",
                            },
                            {
                              view: "text",
                              placeholder: "Region",
                              value: "us-east-1",
                              readonly: true,
                              disabled: true,
                              name: "region",
                              id: "region",
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
                /* {
                  id: 'www',
                  view: 'button',
                  css: 'webix_transparent',
                  type: 'icon',
                  width: 268,
                  label: '𝔚𝔢𝔫𝔦𝔤 𝔚𝔢𝔟 𝔚𝔬𝔯𝔨𝔰𝔥𝔬𝔭',
                  icon: 'mdi mdi-cursor-default-click-outline',
                  click: () => {
                    window.open('https://w--w--w.com', '_blank');
                  },
                }, */
              ],
            },
          ],
        },
      ],
    };
    if (this.app.config.size === "wide") {
      this.#config.cols[1].rows.unshift({
        view: "template",
        template: "<h1 class='mainHeader'>KosmoS3 CMS</h1>",
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
      this.app.io === undefined ||
      !this.app.io ||
      (this.app.io !== true &&
        !(
          this.app.io.getAccessKeyId() === $$("username").getValue() &&
          this.app.io.getSecretAccessKey() === $$("password").getValue()
        ))
    ) {
      this.app.io = true;
      const felWorker = new Worker(
        new URL("../workers/fel.js", import.meta.url)
      );
      const initWorker = new Worker(
        new URL("../workers/init.js", import.meta.url)
      );
      const iamClient = new IAMClient({
        region: $$("region").getValue(),
        credentials: {
          accessKeyId: $$("username").getValue(),
          secretAccessKey: $$("password").getValue(),
        },
      });
      try {
        const message = {
          pAccessKeyId: $$("username").getValue(),
          pSecretAccessKey: $$("password").getValue(),
          pBucketName: (await iamClient.send(new GetUserCommand({}))).User
            .UserName,
          pRegion: $$("region").getValue(),
        };
        if (this.app) {
          const io = new S3(
            message.pAccessKeyId,
            message.pSecretAccessKey,
            message.pBucketName,
            message.pRegion
          );
          await io.headBucket();
          if (this.app) {
            webix.UIManager.removeHotKey("enter", this.clickLogin);
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
                  window.open(
                    `http://${message.pBucketName}.s3-website.${message.pRegion}.amazonaws.com/`,
                    "_tab"
                  ),
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
              let storageItem = storageLocal.find(
                (item) => item.pBucketName === message.pBucketName
              );
              if (storageItem === undefined) storageLocal.push(message);
              else storageItem = message;
            } else {
              storageLocal = storageLocal.filter(
                (item) => item.pBucketName !== message.pBucketName
              );
            }
            webix.storage.local.put("keys", storageLocal);
          }
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
  };

  /**
   *
   */
  init = () => {
    /**
     * Обработчик выбора сохраненных кредов
     *
     * @param {number} value id в списке
     */
    function onChangeSored(value) {
      if (value) {
        const { creds } = this.getList().getItem(value);
        $$("username").setValue(creds.pAccessKeyId);
        $$("password").setValue(creds.pSecretAccessKey);
        $$("region").setValue(creds.pRegion);
      } else {
        $$("username").setValue("");
        $$("password").setValue("");
        $$("region").setValue("us-east-1");
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
      id: $$("stored").attachEvent("onChange", onChangeSored),
    });
    webix.UIManager.addHotKey("enter", this.clickLogin, $$("username"));
    webix.UIManager.addHotKey("enter", this.clickLogin, $$("password"));
    webix.UIManager.addHotKey("enter", this.clickLogin, $$("login"));
  };
}
