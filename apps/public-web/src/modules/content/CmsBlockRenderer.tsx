import type { CmsBlock } from "@/modules/content/api";
import { OurStory } from "@/modules/content/OurStory";
import { TeamSection } from "@/modules/content/TeamSection";
import { CTA } from "@/modules/content/CTA";
import { FAQ } from "@/modules/content/FAQ";
import { resolveMediaUrl } from "@/lib/cms-client";
import type { FaqItem } from "@/modules/content/types";
import type { JSX } from "react";

// ---------------------------------------------------------------------------
// Fallback defaults — match the per-page hardcoded defaults they replace.
// ---------------------------------------------------------------------------

const CTA_FALLBACK = {
  heading: "Ready to find your dream home?",
  description:
    "Our property consultants are available 24/7 to guide you through our exclusive inventory and investment plans.",
  button_label: "REQUEST A CALLBACK",
  button_href: "/contact",
};

// ---------------------------------------------------------------------------
// Per-type adapters — each receives a CmsBlock and returns a React element.
// Adapters are deliberately thin: they map CMS config → existing component
// props and nothing else.
// ---------------------------------------------------------------------------

type BlockAdapter = (block: CmsBlock) => JSX.Element;

function renderTextBlock(block: CmsBlock): JSX.Element {
  const { heading, body, image_url, featured_image_url, image } =
    block.config as Record<string, string | undefined>;

  const paragraphs: string[] | undefined = body
    ?.split("\n\n")
    .map((p: string) => p.trim())
    .filter(Boolean);

  const storyImage = resolveMediaUrl(
    image_url || featured_image_url || image
  );

  return <OurStory heading={heading} paragraphs={paragraphs} image={storyImage} />;
}

function renderTeamBlock(block: CmsBlock): JSX.Element {
  const config = block.config as { heading?: string; members?: Parameters<typeof TeamSection>[0]["members"] };
  return (
    <TeamSection heading={config.heading} members={config.members} />
  );
}

function renderCtaBlock(block: CmsBlock): JSX.Element {
  const cta = { ...CTA_FALLBACK, ...(block.config as Partial<typeof CTA_FALLBACK>) };
  return (
    <CTA
      title={cta.heading}
      description={cta.description}
      primaryLabel={cta.button_label}
      primaryHref={cta.button_href}
      showPhoneLink={false}
    />
  );
}

function renderFaqBlock(block: CmsBlock): JSX.Element {
  const config = block.config as { heading?: string; items?: FaqItem[] };
  return (
    <FAQ
      heading={config.heading}
      items={config.items}
    />
  );
}

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Sparkles, CheckCircle2 } from "lucide-react";

function renderHeroBannerBlock(block: CmsBlock): JSX.Element {
  const { heading, subheading, buttonLabel, buttonHref, button_label, button_href } =
    block.config as Record<string, string | undefined>;

  const label = buttonLabel || button_label || "Explore Properties";
  const href = buttonHref || button_href || "/contact";

  return (
    <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-28 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,165,55,0.12),transparent_70%)]" />
      <Container size="narrow" className="relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-gold-400/20 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-widest">
          <Sparkles size={13} className="text-gold-400" />
          Truzon Signature Living
        </div>
        <h1 className="mb-5 font-heading text-3xl sm:text-5xl font-bold text-white leading-tight">
          {heading || "Discover Your Sanctuary"}
        </h1>
        {subheading && (
          <p className="mx-auto mb-8 max-w-2xl text-base sm:text-lg text-slate-200 leading-relaxed font-light">
            {subheading}
          </p>
        )}
        <div className="flex justify-center">
          <Button href={href} variant="gold" className="px-8 py-4 text-sm font-bold tracking-wide">
            {label}
          </Button>
        </div>
      </Container>
    </section>
  );
}

function renderFeaturesBlock(block: CmsBlock): JSX.Element {
  const config = block.config as {
    heading?: string;
    items?: Array<{ title?: string; desc?: string; description?: string }>;
  };

  const items = config.items || [];

  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/60">
      <Container size="wide">
        {config.heading && (
          <div className="text-center mb-12">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy-900">
              {config.heading}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-10 w-10 rounded-xl bg-gold-400/15 border border-gold-400/30 text-gold-600 flex items-center justify-center mb-4 font-bold">
                <CheckCircle2 size={20} />
              </div>
              <h3 className="font-heading text-lg font-bold text-navy-900 mb-2">{item.title}</h3>
              <p className="text-sm text-text-body leading-relaxed">{item.desc || item.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Registry — add new CMS block types here as they get public components.
// ---------------------------------------------------------------------------

const BLOCK_RENDERERS: Record<string, BlockAdapter> = {
  hero_banner: renderHeroBannerBlock,
  features: renderFeaturesBlock,
  text: renderTextBlock,
  team: renderTeamBlock,
  cta: renderCtaBlock,
  faq: renderFaqBlock,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface CmsBlockRendererProps {
  blocks: CmsBlock[];
  /**
   * Optional overrides keyed by block.type.  When provided the override
   * replaces the default adapter for that type entirely.  This lets page-
   * specific code customise a single block (e.g. pass extra props like
   * `phoneDisplay` to CTA on the home page) without duplicating the whole
   * renderer.
   */
  overrides?: Record<string, BlockAdapter>;
}

/**
 * Iterates through CMS page blocks **in position order** and renders the
 * matching public component for each.  Unknown block types are reported via
 * a console warning _and_ a hidden HTML comment so they surface during
 * development without breaking production.
 */
export function CmsBlockRenderer({
  blocks,
  overrides,
}: CmsBlockRendererProps) {
  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  return (
    <>
      {sorted.map((block) => {
        const adapter =
          overrides?.[block.type] ?? BLOCK_RENDERERS[block.type];

        if (!adapter) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              `[CmsBlockRenderer] No renderer registered for block type "${block.type}" (id: ${block.id}). ` +
                `Register one in BLOCK_RENDERERS or pass an override.`
            );
          }

          return (
            <div
              key={block.id}
              data-cms-block-type={block.type}
              data-cms-block-id={block.id}
              hidden
            >
              {/* CMS block type "{block.type}" has no public renderer yet */}
            </div>
          );
        }

        return (
          <div key={block.id} data-cms-block-type={block.type}>
            {adapter(block)}
          </div>
        );
      })}
    </>
  );
}
