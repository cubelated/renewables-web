import { resourceDiscoveryCopy } from "../../content/resources/discovery";
import type { ResourceLanguage } from "../../content/resources/types";

export default function EditorialPolicy({ language }: { language: ResourceLanguage }) {
  const t = resourceDiscoveryCopy[language];
  return <section className="resource-editorial-policy" id="editorial-policy" aria-labelledby="resource-editorial-title">
    <h2 id="resource-editorial-title">{t.editorialTitle}</h2>
    {t.editorialParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
  </section>;
}
