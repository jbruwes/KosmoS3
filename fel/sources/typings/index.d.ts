declare module "jsel";
declare module "glightbox";
declare module "jarallax";
declare function init(): void;

declare interface Branch {
  yandex: string;
  google: string;
  metrika: string;
  analytics: string;

  value: string;
  id: number | string;
  visible: boolean;
  date: string;
  image: string;
  $count: number;
  $parent: number | string;
  $level: number;
  open: boolean;
  lastmod: string;
  changefreq: string;
  priority: number;
  description: string;
  keywords: string;
  url: string;
  title: string;
  icon: string;
  path: string;
  data: IBranch[];
}

declare interface Url {
  url: string;
  id: numberl;
}

declare interface Data {
  index: Branch;
  urls: Url[];
  content: string;
  context: import("page").Context;
}
