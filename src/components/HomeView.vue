<template>
  <v-snackbar v-model="snackbar" location="top right">{{ error }}</v-snackbar>
  <v-card :image="require('../assets/bg.jpg')" class="fill-height"
    ><v-row class="fill-height" align="center" justify="center"
      ><v-card class="pa-8 ma-8" :width="640" color="#ffffffee"
        ><v-form ref="form" v-model="valid" lazy-validation>
          <v-row
            ><v-col cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis mb-1">
                WEBSITE
              </div>
              <v-select
                v-model="cred"
                label="select saved credential"
                prepend-inner-icon="mdi-content-save"
                variant="underlined"
                return-object
                :items="creds"
                :clearable="true"
              ></v-select>
              <v-text-field
                v-model.trim="bucket"
                label="domain"
                placeholder="example.com"
                prepend-inner-icon="mdi-web"
                variant="underlined"
                :rules="[(v) => !!v || 'Item is required']"
              ></v-text-field>
              <v-text-field
                v-model.trim="accessKeyId"
                label="access key id"
                prepend-inner-icon="mdi-key"
                variant="underlined"
                :rules="[(v) => !!v || 'Item is required']"
              ></v-text-field>
              <v-text-field
                v-model.trim="secretAccessKey"
                :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="visible ? 'text' : 'password'"
                label="secret access key"
                prepend-inner-icon="mdi-lock"
                variant="underlined"
                :rules="[(v) => !!v || 'Item is required']"
                @click:append-inner="visible = !visible"
              ></v-text-field> </v-col
            ><v-col cols="12" md="6">
              <div class="text-subtitle-1 text-medium-emphasis mb-1">CLOUD</div>
              <v-select
                v-model="provider"
                label="cloud provider"
                prepend-inner-icon="mdi-cloud"
                variant="underlined"
                return-object
                :items="providers"
                :clearable="true"
              ></v-select
              ><v-combobox
                v-model.trim="region"
                :items="regions"
                label="region"
                prepend-inner-icon="mdi-flag"
                variant="underlined"
                :disabled="provider && provider.title === 'yandex'"
                :hide-no-data="true"
                :rules="[(v) => !!v || 'Item is required']"
              ></v-combobox
              ><v-text-field
                v-model.trim="endpoint"
                label="endpoint url"
                prepend-inner-icon="mdi-database"
                variant="underlined"
                :disabled="!!provider"
              ></v-text-field
              ><v-text-field
                v-model.trim="wendpoint"
                label="website endpoint url"
                prepend-inner-icon="mdi-server-network"
                variant="underlined"
                :disabled="!!provider"
              ></v-text-field> </v-col
          ></v-row>
          <v-row
            ><v-col cols="12" md="6"
              ><v-switch
                v-model="remember"
                label="remember credentials"
                color="info"
              ></v-switch></v-col
          ></v-row>
          <v-row
            ><v-col cols="12"
              ><v-btn
                block
                plain
                size="large"
                variant="outlined"
                @click="login"
              >
                LogIn
              </v-btn></v-col
            ></v-row
          ></v-form
        >
      </v-card></v-row
    ></v-card
  >
</template>
<script setup>
import { ref, watch, computed } from "vue";
import { get, set, useStorage } from "@vueuse/core";
import { storeToRefs } from "pinia";
import kosmos3 from "@/kosmos3";

const store = kosmos3();
const {
  s3,
  auth,
  bucket,
  accessKeyId,
  secretAccessKey,
  endpoint,
  wendpoint,
  region,
  panel,
} = storeToRefs(store);
set(auth, false);
set(bucket, "");
set(accessKeyId, "");
set(secretAccessKey, "");
set(region, "");
set(endpoint, "");
set(wendpoint, "");
set(panel, null);
const error = ref("");
const visible = ref(false);
const snackbar = ref(false);
const remember = ref(true);
const providers = ref([
  {
    title: "aws",
    regions: [
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
    ],
    region: "us-east-1",
    endpoint: "",
    wendpoint: computed(() => `https://s3.${get(region)}.amazonaws.com`),
  },
  {
    title: "yandex",
    regions: ["ru-central1"],
    region: "ru-central1",
    endpoint: "https://storage.yandexcloud.net",
    wendpoint: "https://website.yandexcloud.net",
  },
]);
const provider = ref(null);
const regions = ref([]);
const valid = ref(true);
const form = ref(null);
const creds = useStorage("kosmos3", []);
const cred = ref(null);
set(cred, null);
watch(provider, (newProvider) => {
  if (newProvider) {
    set(regions, newProvider.regions);
    set(region, newProvider.region);
    set(endpoint, newProvider.endpoint);
  } else {
    set(regions, []);
    set(region, "");
    set(endpoint, "");
  }
});
watch(region, () => {
  if (get(provider)) set(wendpoint, get(provider).wendpoint);
  else set(wendpoint, "");
});
watch(cred, (newCred) => {
  if (newCred) {
    set(bucket, newCred.title);
    set(accessKeyId, newCred.accessKeyId);
    set(secretAccessKey, newCred.secretAccessKey);
    set(
      provider,
      get(providers).find((pProvider) => pProvider.title === newCred.provider)
    );
    set(region, newCred.region);
    set(endpoint, newCred.endpoint);
    set(wendpoint, newCred.wendpoint);
  } else {
    set(bucket, "");
    set(accessKeyId, "");
    set(secretAccessKey, "");
    set(provider, null);
    set(region, "");
    set(endpoint, "");
    set(wendpoint, "");
  }
});
let isLogining = false;
/**
 *
 */
const login = async () => {
  get(form).validate();
  if (!isLogining && get(valid) && !get(auth))
    try {
      isLogining = true;
      const lCreds = get(creds).filter((pCred) => pCred.title !== get(bucket));
      if (get(remember))
        lCreds.push({
          title: get(bucket),
          accessKeyId: get(accessKeyId),
          secretAccessKey: get(secretAccessKey),
          region: get(region),
          endpoint: get(endpoint),
          wendpoint: get(wendpoint),
          provider: get(provider).title,
        });
      set(creds, lCreds);
      await get(s3).headBucket();
      try {
        const head = await Promise.allSettled([
          get(s3).headObject("index.json"),
          get(s3).headObject("index.cdn.json"),
          get(s3).headObject("index.js"),
          get(s3).headObject("index.css"),
          get(s3).headObject("index.cdn.css"),
          get(s3).headObject("index.htm"),
        ]);
        const put = [];
        if (head[0].status === "rejected") {
          const id = new Date().valueOf();
          put.push(
            get(s3).putObject(
              "index.json",
              "application/json",
              `{"visible":true,"value":"${get(bucket)}","id":${id}}`
            )
          );
          put.push(get(s3).putObject(`${id}.htm`, "text/html", ""));
        }
        if (head[1].status === "rejected")
          put.push(
            get(s3).putObject("index.cdn.json", "application/json", "[]")
          );
        if (head[2].status === "rejected")
          put.push(
            get(s3).putObject(
              "index.js",
              "application/javascript",
              "function init(){try{}catch(e){}}"
            )
          );
        if (head[3].status === "rejected")
          put.push(get(s3).putObject("index.css", "text/css", ""));
        if (head[4].status === "rejected")
          put.push(get(s3).putObject("index.cdn.css", "text/css", ""));
        if (head[5].status === "rejected")
          put.push(
            get(s3).putObject(
              "index.htm",
              "text/html",
              '<div class="v-container py-0 position-static" style="z-index:1"><div id="content" style="margin:0px;flex:1 1 auto"><article v-if="!template"></article><article v-else><v-runtime-template :parent="this" :template="template"></v-runtime-template></article></div></div>'
            )
          );
        await Promise.all(put);
      } finally {
        set(auth, true);
      }
    } catch (err) {
      set(error, err.message);
      set(snackbar, true);
    } finally {
      isLogining = false;
    }
};
</script>
