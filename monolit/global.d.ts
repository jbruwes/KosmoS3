interface INavbar {
  theme?: string;
  classes?: string[];
  scrollClasses?: string[];
  template?: string;
  script?: string;
  style?: string;
  setup?: boolean;
  scoped?: boolean;
}

interface IPage {
  id: string;
  changefreq?: string;
  children?: IPage[];
  description?: string;
  icon?: string;
  image?: string;
  keywords?: string[];
  label?: string;
  lastmod?: string;
  loc?: string;
  priority?: number;
  template?: string;
  script?: string;
  style?: string;
  theme?: string;
  title?: string;
  visible?: boolean;
  edit?: boolean;
  type?: string;
  alt?: string;
  full?: boolean;
  setup?: boolean;
  scoped?: boolean;
  get?: any;
  parent?: IPage;
  siblings?: IPage[];
  branch?: IPage[];
  path?: string;
  index?: number;
  prev?: IPage;
  next?: IPage;
  name?: string;
  urn?: string;
  favicon?: string;
}

interface ISettings {
  yandex?: string;
  metrika?: string;
  google?: string;
  analytics?: string;
  landing?: boolean;
}

interface IResource {
  id: string;
  url?: string;
  visible?: boolean;
}

interface Data {
  navbar: INavbar;
  content: IPage[];
  settings: ISettings;
  style: string;
  script: string;
  css: IResource[];
  js: IResource[];
}
