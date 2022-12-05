<template lang="pug">
v-card.h-100(:image="require('@/assets/bg.jpg')")
  v-row.h-100(align="center", justify="center")
    v-card.pa-8.ma-8(:width="640", color="#ffffffee")
      v-form(ref="form", v-model="valid", lazy-validation)
        v-row
          v-col(cols="12", md="6")
            .text-subtitle-1.text-medium-emphasis.mb-1 WEBSITE
            v-select(
              v-model="cred",
              label="select saved credential",
              prepend-inner-icon="mdi-content-save",
              return-object,
              :items="creds",
              clearable
            )
            v-text-field(
              v-model.trim="bucket",
              label="domain",
              placeholder="example.com",
              prepend-inner-icon="mdi-web",
              :rules="[(v) => !!v || 'Item is required']"
            )
            v-text-field(
              v-model.trim="accessKeyId",
              label="access key id",
              prepend-inner-icon="mdi-key",
              :rules="[(v) => !!v || 'Item is required']"
            )
            v-text-field(
              v-model.trim="secretAccessKey",
              :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'",
              :type="visible ? 'text' : 'password'",
              label="secret access key",
              prepend-inner-icon="mdi-lock",
              :rules="[(v) => !!v || 'Item is required']",
              @click:append-inner="visible = !visible"
            )
          v-col(cols="12", md="6")
            .text-subtitle-1.text-medium-emphasis.mb-1 CLOUD
            v-select(
              v-model="provider",
              label="cloud provider",
              prepend-inner-icon="mdi-cloud",
              return-object,
              :items="providers",
              clearable
            )
            v-combobox(
              v-model.trim="region",
              :items="regions",
              label="region",
              prepend-inner-icon="mdi-flag",
              :disabled="provider && provider.title === 'yandex'",
              :hide-no-data="true",
              :rules="[(v) => !!v || 'Item is required']"
            )
            v-text-field(
              v-model.trim="endpoint",
              label="endpoint url",
              prepend-inner-icon="mdi-database",
              :disabled="!!provider"
            )
            v-text-field(
              v-model.trim="wendpoint",
              label="website endpoint url",
              prepend-inner-icon="mdi-server-network",
              :disabled="!!provider"
            )
        v-row
          v-col(cols="12", md="6")
            v-switch(
              v-model="remember",
              label="remember credentials",
              color="info"
            )
        v-row
          v-col(cols="12")
            v-btn(
              block,
              plain,
              size="large",
              variant="outlined",
              @click="login"
            ) LogIn
</template>
<script setup>
import { ref, watch, computed } from "vue";
import { get, set, useStorage } from "@vueuse/core";
import { storeToRefs } from "pinia";
import { S3Client, HeadBucketCommand } from "@aws-sdk/client-s3";
import kosmos3 from "@/stores/kosmos3";

const store = kosmos3();
const { s3, bucket, wendpoint, panel, snackbar, message } = storeToRefs(store);
set(s3, null);
set(bucket, "");
set(wendpoint, "");
set(panel, null);
const accessKeyId = ref("");
const secretAccessKey = ref("");
const region = ref("");
const endpoint = ref("");
const visible = ref(false);
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
watch(provider, (value) => {
  if (value) {
    set(regions, value.regions);
    set(region, value.region);
    set(endpoint, value.endpoint);
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
watch(cred, (value) => {
  if (value) {
    set(bucket, value.title);
    set(accessKeyId, value.accessKeyId);
    set(secretAccessKey, value.secretAccessKey);
    set(
      provider,
      get(providers).find(({ title }) => title === value.provider)
    );
    set(region, value.region);
    set(endpoint, value.endpoint);
    set(wendpoint, value.wendpoint);
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
let s3Client = null;
/**
 *
 */
const login = async () => {
  get(form).validate();
  if (!s3Client && get(valid))
    try {
      s3Client = new S3Client({
        region: get(region),
        endpoint: get(endpoint),
        credentials: {
          accessKeyId: get(accessKeyId),
          secretAccessKey: get(secretAccessKey),
        },
      });
      const lCreds = get(creds).filter(({ title }) => title !== get(bucket));
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
      await s3Client.send(
        new HeadBucketCommand({
          Bucket: get(bucket),
        })
      );
      set(s3, s3Client);
    } catch (err) {
      s3Client = null;
      set(message, err.message);
      set(snackbar, true);
    }
};
</script>
