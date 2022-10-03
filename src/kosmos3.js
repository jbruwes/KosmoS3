import { ref, computed } from "vue";
import { get } from "@vueuse/core";
import { defineStore } from "pinia";
import S3 from "./s3";

export default defineStore("kosmos3", () => {
  const auth = ref(false);
  const bucket = ref("");
  const accessKeyId = ref("");
  const secretAccessKey = ref("");
  const endpoint = ref("");
  const wendpoint = ref("");
  const region = ref("");
  const s3 = computed(
    () =>
      new S3(
        get(accessKeyId),
        get(secretAccessKey),
        get(bucket),
        get(region),
        get(endpoint).replace(/\/$/, "")
      )
  );
  const base = computed(() =>
    get(wendpoint)
      ? `${get(wendpoint)}/${get(bucket)}/`
      : `https://${get(bucket)}/`
  );
  return {
    s3,
    auth,
    bucket,
    accessKeyId,
    secretAccessKey,
    endpoint,
    wendpoint,
    region,
    base,
  };
});
