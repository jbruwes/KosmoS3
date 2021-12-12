import { JetView } from "webix-jet";
import * as webix from "webix";
import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";
import { IAMClient, GetUserCommand } from "@aws-sdk/client-iam";

/**
 *
 */
export default class SignInView extends JetView {
  /**
   *
   */
  config() {
    const result = {
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
      result.cols[1].rows.unshift({
        // id: "header_template",
        view: "template",
        template: "<h1 class='mainHeader'>KosmoS3 CMS</h1>",
        // minHeight: 150,
        type: "clean",
      });
    }
    result.cols[1].rows.unshift({
      gravity: this.app.config.size === "wide" ? 2 : 1,
    });
    return result;
  }

  /**
   *
   */
  clickLogin = async () => {
    const felWorker = new Worker(new URL("../workers/fel.js", import.meta.url));
    const initWorker = new Worker(
      new URL("../workers/init.js", import.meta.url)
    );
    if (
      !this.app.authenticationData ||
      !(
        this.app.authenticationData.username === $$("username").getValue() &&
        this.app.authenticationData.password === $$("password").getValue()
      )
    ) {
      this.app.authenticationData = {
        username: $$("username").getValue(),
        password: $$("password").getValue(),
      };
      this.app.region = $$("region").getValue();
      const iamClient = new IAMClient({
        region: this.app.region,
        credentials: {
          accessKeyId: this.app.authenticationData.username,
          secretAccessKey: this.app.authenticationData.password,
        },
      });
      try {
        const resIamClient = await iamClient.send(new GetUserCommand({}));
        this.app.s3Client = new S3Client({
          region: this.app.region,
          credentials: {
            accessKeyId: this.app.authenticationData.username,
            secretAccessKey: this.app.authenticationData.password,
          },
        });
        await this.app.s3Client.send(
          new HeadBucketCommand({ Bucket: resIamClient.User.UserName })
        );
        webix.UIManager.removeHotKey("enter", this.clickLogin);
        this.app.bucket = resIamClient.User.UserName;
        const message = {
          pAccessKeyId: this.app.authenticationData.username,
          pSecretAccessKey: this.app.authenticationData.password,
          pBucketName: this.app.bucket,
          pRegion: this.app.region,
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
        $$("sidebar").clearAll();
        const openUrl = `http://${this.app.bucket}.s3-website.${this.app.region}.amazonaws.com/`;
        $$("toolbar").addView({
          id: "play",
          view: "icon",
          icon: "mdi mdi-play-circle",
          /**
           *
           */
          click: () => window.open(openUrl, "_tab"),
        });
        await this.show("content");
        await $$("tinymce").getEditor(true);
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
        felWorker.postMessage(message);
      } catch (err) {
        this.app.authenticationData = null;
        webix.message({
          text: err.message,
          type: "error",
        });
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
    $$("stored").attachEvent("onChange", onChangeSored);
    webix.UIManager.addHotKey("enter", this.clickLogin, $$("username"));
    webix.UIManager.addHotKey("enter", this.clickLogin, $$("password"));
    webix.UIManager.addHotKey("enter", this.clickLogin, $$("login"));
  };
}
