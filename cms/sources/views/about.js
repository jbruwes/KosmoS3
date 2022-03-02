import { JetView } from "webix-jet";

/**
 *
 */
export default class JsView extends JetView {
  #config;

  /**
   * It destroys the config object.
   */
  destroy() {
    this.#config = null;
  }

  /**
   * @param app
   */
  constructor(app) {
    super(app);
    this.#config = {
      padding: 10,
      css: { background: "white" },
      rows: [
        {
          view: "timeline",
          height: 180,
          type: {
            templateDate: "#name#",
          },
          data: [
            {
              id: 1,
              name: "Homepage",
              value:
                '<a href="https://kosmos3.com" target="_blank">kosmos3.com</a>',
            },
            {
              id: 2,
              name: "Repository",
              value:
                '<a href="https://github.com/jbruwes/kosmos3" target="_blank">github.com/jbruwes/kosmos3</a>',
            },
          ],
        },
        { view: "template", template: "MIT License", type: "section" },
        {
          gravity: 1,
          type: "clean",
          scroll: "auto",
          template: `Copyright (c) 2022 Jerry Bruwes<br>
          <br>
          Permission is hereby granted, free of charge, to any person obtaining a copy<br>
          of this software and associated documentation files (the "Software"), to deal<br>
          in the Software without restriction, including without limitation the rights<br>
          to use, copy, modify, merge, publish, distribute, sublicense, and/or sell<br>
          copies of the Software, and to permit persons to whom the Software is<br>
          furnished to do so, subject to the following conditions:<br>
          <br>
          The above copyright notice and this permission notice shall be included in all<br>
          copies or substantial portions of the Software.<br>
          <br>
          THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR<br>
          IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,<br>
          FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE<br>
          AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER<br>
          LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,<br>
          OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE<br>
          SOFTWARE.`,
        },
      ],
    };
  }

  /**
   *
   */
  config = () => this.#config;
}
