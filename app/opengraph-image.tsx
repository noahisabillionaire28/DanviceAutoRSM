import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';

/**
 * The image that shows when the link is pasted into a text, Slack or Facebook.
 *
 * There was no OG image at all before this, so a shared link rendered as a bare
 * title and URL — which is exactly what a dealer sending his site to a customer
 * sees. Next generates this at build time from the JSX below; the same file
 * serves Twitter via the summary_large_image card set in app/layout.tsx.
 *
 * The logo is the real lockup, read from public/brand and passed as a data
 * URI: Satori (what ImageResponse renders with) supports <img> with a data URI
 * reliably, and its direct SVG support is partial. Reading the file rather
 * than duplicating the paths means the share image cannot drift from the logo
 * the site actually renders.
 */
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${SITE.name} — used cars in ${SITE.address.city}`;

const LOGO = readFileSync(join(process.cwd(), 'public/brand/danvice-logo.svg'), 'utf8');

export default function OpengraphImage() {
  const logo = `data:image/svg+xml;base64,${Buffer.from(LOGO).toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          // blue-900, the site's dark field.
          backgroundColor: '#12253A',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={470} height={154} alt="" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
            }}
          >
            {SITE.heroHeadline}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 32 }}>
            <div style={{ width: 64, height: 5, backgroundColor: '#F07D22', borderRadius: 999 }} />
            <div style={{ display: 'flex', fontSize: 27, color: '#C0D5EE' }}>
              {`${SITE.address.city}, CA · ${SITE.phone.display}`}
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
