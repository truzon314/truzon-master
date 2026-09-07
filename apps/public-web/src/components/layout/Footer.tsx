import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import logoFooter from "@/public/images/extracted/logo-footer.png";
import { Container } from "@/components/ui/Container";
import { toTelHref } from "@/modules/content/mappers";
import { CONTACT_INFO, FOOTER_COLUMNS } from "@/lib/constants/navigation";
import type { CmsSettings } from "@/modules/content/api";
import type { FooterLinkColumn } from "@/types";

export function Footer({
  footerColumns,
  settings,
}: {
  footerColumns: FooterLinkColumn[];
  settings: CmsSettings;
}) {
  const address = settings?.contact_address || CONTACT_INFO.address;
  const phoneDisplay = settings?.contact_phone || CONTACT_INFO.phoneDisplay;
  const telHref = toTelHref(phoneDisplay) || CONTACT_INFO.callbackPhoneHref;

  const columns =
    footerColumns && footerColumns.length > 0 && footerColumns.some((c) => c.links.length > 0)
      ? footerColumns.filter((c) => c.links.length > 0)
      : FOOTER_COLUMNS;

  return (
    <footer className="bg-[linear-gradient(315deg,#080d1a_0%,#1f3a5f_100%)] px-6 pt-16 sm:px-10 lg:px-[60px] lg:pt-[70px]">
      <Container padded={false}>
        <div className="flex flex-col gap-12 border-b border-[#1d2740] pb-12 lg:flex-row lg:gap-16 lg:pb-[50px]">
          <div className="lg:w-[280px] lg:shrink-0">
            <div className="mb-[18px] flex items-center">
              <Image
                src={settings?.logo_url || logoFooter}
                alt="Truzon Homes"
                {...(settings?.logo_url ? { width: 400, height: 130 } : {})}
                className="h-[143px] w-auto"
              />
            </div>

            <div className="mb-6 space-y-2.5 text-[13px] leading-[1.7] text-[#c3cbde]">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-gold-400 shrink-0 mt-1" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2 font-medium text-gold-400">
                <Phone size={15} className="text-gold-400 shrink-0" />
                <a href={telHref} className="hover:underline tracking-wide">
                  {phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={settings?.social_facebook_url ?? "#"}
                aria-label="Facebook"
                className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-85 lg:h-8 lg:w-8"
              >
                <Image src="/icons/Facebook.svg" alt="" fill sizes="48px" className="object-cover" />
              </a>
              <a
                href={settings?.social_instagram_url ?? "#"}
                aria-label="Instagram"
                className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-85 lg:h-8 lg:w-8"
              >
                <Image src="/icons/instagram(2).png" alt="" fill sizes="48px" className="object-cover" />
              </a>
              <a
                href={settings?.social_youtube_url ?? "#"}
                aria-label="YouTube"
                className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-85 lg:h-8 lg:w-8"
              >
                <Image src="/icons/youtube.svg" alt="" fill sizes="48px" className="object-cover" />
              </a>
              {settings?.contact_email ? (
                <a
                  href={`mailto:${settings.contact_email}`}
                  aria-label="Email us"
                  className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#3d5a8a] transition-opacity hover:opacity-85 lg:h-8 lg:w-8"
                >
                  <Image src="/icons/mail(1).png" alt="" fill sizes="48px" className="object-contain p-2.5 lg:p-1.5" />
                </a>
              ) : null}
              {telHref ? (
                <a
                  href={telHref}
                  aria-label="Call us"
                  className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-85 lg:h-8 lg:w-8"
                >
                  <Image src="/icons/phone-call(1).png" alt="" fill sizes="48px" className="object-cover" />
                </a>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:flex-1 lg:grid-cols-4 lg:gap-8">
            {columns.map((column) => (
              <div key={column.title}>
                <div className="mb-5 inline-block border-b-2 border-gold-400 pb-2.5 text-xs font-bold tracking-[0.8px] text-white">
                  {column.title.toUpperCase()}
                </div>
                <div className="flex flex-col gap-3.5">
                  {column.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-[13.5px] text-[#c3cbde] transition-colors hover:text-gold-300"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5 py-6 text-xs text-[#d7dcec]">
          <div>© 2026 Truzon Homes. </div>
          <div className="flex gap-[22px]">
            <Link href="/privacy-policy" className="text-xs text-[#d7dcec] hover:text-gold-300">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-xs text-[#d7dcec] hover:text-gold-300">
              Terms of Service
            </Link>
            <a href="#" className="text-xs text-[#d7dcec] hover:text-gold-300">
              RERA Documentation
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
