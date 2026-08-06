import { cache } from "react";
import { createClient, type Entry, type EntryFieldTypes } from "contentful";

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
const environment = process.env.CONTENTFUL_ENVIRONMENT || "master";

if (!spaceId || !accessToken) {
  throw new Error(
    "Missing CONTENTFUL_SPACE_ID or CONTENTFUL_DELIVERY_TOKEN environment variables"
  );
}

export const contentfulClient = createClient({
  space: spaceId,
  accessToken,
  environment,
});

export interface SocialLink {
  platform: string;
  url: string;
  [key: string]: string;
}

export interface ProfileFields {
  name: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  bio?: EntryFieldTypes.RichText;
  avatar?: EntryFieldTypes.AssetLink;
  email?: EntryFieldTypes.Symbol;
  location?: EntryFieldTypes.Symbol;
  resumeUrl?: EntryFieldTypes.Symbol;
  skills?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  socialLinks?: EntryFieldTypes.Object<SocialLink[]>;
  heroTagline?: EntryFieldTypes.Symbol;
  heroHeadline?: EntryFieldTypes.Symbol;
  heroHighlightWord?: EntryFieldTypes.Symbol;
  heroSubheadline?: EntryFieldTypes.Symbol;
  currentCompany?: EntryFieldTypes.Symbol;
  lookingForText?: EntryFieldTypes.Text;
  lookingForHighlight?: EntryFieldTypes.Symbol;
}

export interface ExperienceItemFields {
  title: EntryFieldTypes.Symbol;
  description: EntryFieldTypes.Text;
  learnMoreUrl?: EntryFieldTypes.Symbol;
  order?: EntryFieldTypes.Integer;
}

export interface ProjectFields {
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  summary?: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  coverImage?: EntryFieldTypes.AssetLink;
  gallery?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
  tags?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  liveUrl?: EntryFieldTypes.Symbol;
  repoUrl?: EntryFieldTypes.Symbol;
  featured?: EntryFieldTypes.Boolean;
  order?: EntryFieldTypes.Integer;
  publishDate?: EntryFieldTypes.Date;
}

export interface PostFields {
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  excerpt?: EntryFieldTypes.Symbol;
  content?: EntryFieldTypes.RichText;
  coverImage?: EntryFieldTypes.AssetLink;
  tags?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  publishDate: EntryFieldTypes.Date;
}

export interface SiteSettingsFields {
  siteTitle: EntryFieldTypes.Symbol;
  siteDescription?: EntryFieldTypes.Symbol;
  contactEmail?: EntryFieldTypes.Symbol;
  socialLinks?: EntryFieldTypes.Object<SocialLink[]>;
}

export type ProfileEntry = Entry<
  { contentTypeId: "profile"; fields: ProfileFields },
  undefined
>;
export type ExperienceItemEntry = Entry<
  { contentTypeId: "experienceItem"; fields: ExperienceItemFields },
  undefined
>;
export type ProjectSkeleton = { contentTypeId: "project"; fields: ProjectFields };

export interface ProjectCarouselFields {
  title?: EntryFieldTypes.Symbol;
  projects: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<ProjectSkeleton>>;
}

export type ProjectEntry = Entry<ProjectSkeleton, undefined>;
export type ProjectCarouselEntry = Entry<
  { contentTypeId: "projectCarousel"; fields: ProjectCarouselFields },
  undefined
>;
export type PostEntry = Entry<{ contentTypeId: "post"; fields: PostFields }, undefined>;
export type SiteSettingsEntry = Entry<
  { contentTypeId: "siteSettings"; fields: SiteSettingsFields },
  undefined
>;

export const getProfile = cache(async (): Promise<ProfileEntry | null> => {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "profile";
    fields: ProfileFields;
  }>({
    content_type: "profile",
    limit: 1,
  });
  return res.items[0] ?? null;
});

export const getExperienceItems = cache(async (): Promise<ExperienceItemEntry[]> => {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "experienceItem";
    fields: ExperienceItemFields;
  }>({
    content_type: "experienceItem",
    order: ["fields.order"],
  });
  return res.items;
});

export const getSiteSettings = cache(async (): Promise<SiteSettingsEntry | null> => {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "siteSettings";
    fields: SiteSettingsFields;
  }>({
    content_type: "siteSettings",
    limit: 1,
  });
  return res.items[0] ?? null;
});

export const getProjects = cache(async (): Promise<ProjectEntry[]> => {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "project";
    fields: ProjectFields;
  }>({
    content_type: "project",
    order: ["fields.order", "-fields.publishDate"],
  });
  return res.items;
});

export const getFeaturedProjects = cache(async (): Promise<ProjectEntry[]> => {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "project";
    fields: ProjectFields;
  }>({
    content_type: "project",
    "fields.featured": true,
    order: ["fields.order", "-fields.publishDate"],
  });
  return res.items;
});

export const getProjectBySlug = cache(
  async (slug: string): Promise<ProjectEntry | null> => {
    const res = await contentfulClient.getEntries<{
      contentTypeId: "project";
      fields: ProjectFields;
    }>({
      content_type: "project",
      "fields.slug": slug,
      limit: 1,
    });
    return res.items[0] ?? null;
  }
);

export const getProjectCarousels = cache(async (): Promise<ProjectCarouselEntry[]> => {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "projectCarousel";
    fields: ProjectCarouselFields;
  }>({
    content_type: "projectCarousel",
    include: 2,
  });
  return res.items;
});

export const getPosts = cache(async (): Promise<PostEntry[]> => {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "post";
    fields: PostFields;
  }>({
    content_type: "post",
    order: ["-fields.publishDate"],
  });
  return res.items;
});

export const getPostBySlug = cache(async (slug: string): Promise<PostEntry | null> => {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "post";
    fields: PostFields;
  }>({
    content_type: "post",
    "fields.slug": slug,
    limit: 1,
  });
  return res.items[0] ?? null;
});
