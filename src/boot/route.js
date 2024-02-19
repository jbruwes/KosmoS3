import { get } from "@vueuse/core";
import { storeToRefs } from "pinia";

import storeApp from "@/stores/app";
import storeS3 from "@/stores/s3";
/**
 * @param {object} boot - Boot object
 * @param {object} boot.router - Instance of Vue Router from src/router/index.js
 */
export default ({ router }) => {
  const { privateItems, publicItems } = storeApp();
  const { S3 } = storeToRefs(storeS3());

  const privateTo = privateItems.map((val) => val.to);
  const publicTo = publicItems.map((val) => val.to);

  router.beforeEach(({ path }, from, next) => {
    if (
      (get(S3) && !privateTo.includes(path)) ||
      (!get(S3) && !publicTo.includes(path))
    )
      next("/");
    else next();
  });
};
