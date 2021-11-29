import * as webix from "webix";
import { fabric } from "fabric";

webix.protoUI(
  {
    name: "fabric",
    $init() {
      this.getIframe().style.position = "absolute";
      this.waitCanvas = webix.promise.defer();
      this.$ready.push(this.render);
    },
    render() {
      const elm = document.createElement("canvas");
      elm.id = this.config.canvas;
      this.canvas = this.$view.appendChild(elm);
      this.canvas = new fabric.Canvas(this.canvas, {
        renderOnAddRemove: false,
        selection: false,
        preserveObjectStacking: true,
      });
      this.waitCanvas.resolve(this.canvas);
      if (this.config.ready) this.config.ready.call(this, this.canvas);
    },
    $setSize(x, y) {
      webix.ui.view.prototype.$setSize.call(this, x, y);
      this.waitCanvas.then(() => {
        const de = this.getWindow().document.documentElement;
        this.canvas.setWidth(de.clientWidth);
        this.canvas.setHeight(de.clientHeight);
      });
    },
    getCanvas(waitCanvas) {
      return waitCanvas ? this.waitCanvas : this.canvas;
    },
  },
  webix.ui.iframe
);
