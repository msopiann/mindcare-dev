export interface BaseResources {
  id: number;
  image: string;
  alt: string;
  link: string;
}

export interface ResourcesData extends BaseResources {
  highlighted: boolean;
  title: string;
  publisher: string;
}

export type BannerResources = BaseResources;

export type ResourceVariant = "articles" | "videos";
export type CardVariant = "primary" | "secondary";
