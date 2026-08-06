import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, type Document } from "@contentful/rich-text-types";
import Image from "next/image";

export function RichText({ document }: { document?: Document }) {
  if (!document) return null;

  return (
    <div className="prose prose-invert prose-neutral max-w-none">
      {documentToReactComponents(document, {
        renderNode: {
          [BLOCKS.EMBEDDED_ASSET]: (node) => {
            const file = node.data?.target?.fields?.file;
            if (!file?.url) return null;
            return (
              <Image
                src={`https:${file.url}`}
                alt={node.data.target.fields.title || ""}
                width={file.details?.image?.width || 1200}
                height={file.details?.image?.height || 675}
                className="rounded-lg"
              />
            );
          },
        },
      })}
    </div>
  );
}
