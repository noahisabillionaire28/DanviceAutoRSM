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
 * The mark is an inline SVG data URI rather than JSX <svg>: Satori (what
 * ImageResponse renders with) supports <img> with a data URI reliably, and its
 * direct SVG support is partial.
 */
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${SITE.name} — used cars in ${SITE.address.city}`;

const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 96">
  <path d="M20 12 H58 C 86 12 105 30 105 47 C 105 64 86 82 58 82 H20 Z M41 31 V63 H57 C 70 63 79 56 79 47 C 79 38 70 31 57 31 Z" fill-rule="evenodd" fill="#FFFFFF"/>
  <path d="M4 74 C 34 89 78 85 115 61" fill="none" stroke="#F07D22" stroke-width="9.5" stroke-linecap="round"/>
</svg>`;

export default function OpengraphImage() {
  const mark = `data:image/svg+xml;base64,${Buffer.from(MARK).toString('base64')}`;

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mark} width={132} height={106} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 46, fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
              Danvice Auto
            </div>
            <div
              style={{
                fontSize: 21,
                fontWeight: 500,
                color: '#93B6E0',
                letterSpacing: '0.18em',
                marginTop: 8,
              }}
            >
              OF RSM
            </div>
          </div>
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
            Honest cars for real budgets.
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
