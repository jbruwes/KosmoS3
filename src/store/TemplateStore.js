import { ref } from "vue";
import {
  get,
  set,
  watchTriggerable,
  useArrayFind,
  useArrayFindIndex,
} from "@vueuse/core";
import { defineStore, storeToRefs } from "pinia";
import app from "./app";

export default defineStore("template3", () => {
  const store = app();
  const { template } = storeToRefs(store);
  const layerId = ref();
  const layerIndex = useArrayFindIndex(
    template,
    ({ id: pId }) => pId === get(layerId)
  );
  const layer = useArrayFind(template, ({ id: pId }) => pId === get(layerId));
  const { trigger } = watchTriggerable(
    () => !!get(template).length,
    () => {
      const { id: lId } = get(template, 0) ?? {};
      set(layerId, lId);
    }
  );
  if (get(template).length) trigger();

  return {
    ...{ layerId, layerIndex, layer },
  };
});
