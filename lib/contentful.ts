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

export type ProfileEntry = Entry<{ contentTypeId: "profile"; fields: ProfileFields }>;
export type ProjectEntry = Entry<{ contentTypeId: "project"; fields: ProjectFields }>;
export type PostEntry = Entry<{ contentTypeId: "post"; fields: PostFields }>;
export type SiteSettingsEntry = Entry<{
  contentTypeId: "siteSettings";
  fields: SiteSettingsFields;
}>;

export async function getProfile(): Promise<ProfileEntry | null> {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "profile";
    fields: ProfileFields;
  }>({
    content_type: "profile",
    limit: 1,
  });
  return res.items[0] ?? null;
}

export async function getSiteSettings(): Promise<SiteSettingsEntry | null> {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "siteSettings";
    fields: SiteSettingsFields;
  }>({
    content_type: "siteSettings",
    limit: 1,
  });
  return res.items[0] ?? null;
}

export async function getProjects(): Promise<ProjectEntry[]> {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "project";
    fields: ProjectFields;
  }>({
    content_type: "project",
    order: ["fields.order", "-fields.publishDate"],
  });
  return res.items;
}

export async function getFeaturedProjects(): Promise<ProjectEntry[]> {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "project";
    fields: ProjectFields;
  }>({
    content_type: "project",
    "fields.featured": true,
    order: ["fields.order", "-fields.publishDate"],
  });
  return res.items;
}

export async function getProjectBySlug(slug: string): Promise<ProjectEntry | null> {
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

export async function getPosts(): Promise<PostEntry[]> {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "post";
    fields: PostFields;
  }>({
    content_type: "post",
    order: ["-fields.publishDate"],
  });
  return res.items;
}

export async function getPostBySlug(slug: string): Promise<PostEntry | null> {
  const res = await contentfulClient.getEntries<{
    contentTypeId: "post";
    fields: PostFields;
  }>({
    content_type: "post",
    "fields.slug": slug,
    limit: 1,
  });
  return res.items[0] ?? null;
}
