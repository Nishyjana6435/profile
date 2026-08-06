import { getProfile } from "@/lib/contentful";
import { OG_IMAGE_SIZE, renderProfileOgImage } from "@/lib/og-image";

export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function Image() {
  const profile = await getProfile();
  return renderProfileOgImage({
    name: profile?.fields.name ?? "Nishanthan Janarthanarajah",
    tagline: profile?.fields.heroTagline,
    title: profile?.fields.title,
  });
}
