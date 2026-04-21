import RelocateComponent from "./RelocateComponent";
import { useSiteContent } from "../context/SiteContentContext";

export default function IntroCompany() {
  const { about, contentBlocks } = useSiteContent();

  const bioParagraphs = (about?.body ?? "").split("\n\n").filter(Boolean);
  const blocks = contentBlocks?.blocks ?? [];

  return (
    <>
      <main>
        <RelocateComponent />

        {/* About / Bio */}
        <section>
          <div className="row main">
            <h4 className="turquois">{about?.heading}</h4>
            {bioParagraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>

        {/* Dynamic content blocks (The Treatment, Company Background, Mission Statement, etc.) */}
        {blocks.map(block => (
          <section key={block.id}>
            <div className="row main">
              <h4 className="turquois">{block.heading}</h4>
              {(block.body ?? "").split("\n\n").filter(Boolean).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
