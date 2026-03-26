import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = "ResumeGap — Know exactly what's missing"
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f172a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: '#1e293b',
              borderRadius: 14,
              border: '2px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 32,
            }}
          >
            📄
          </div>
          <span style={{ color: '#f8fafc', fontSize: 48, fontWeight: 700 }}>ResumeGap</span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: '#f8fafc',
            fontSize: 56,
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.2,
            maxWidth: 900,
            marginBottom: 24,
          }}
        >
          Know exactly what&apos;s missing
          <br />
          <span style={{ color: '#3b82f6' }}>between you and the job</span>
        </div>

        {/* Sub */}
        <div style={{ color: '#94a3b8', fontSize: 28, textAlign: 'center', maxWidth: 700 }}>
          AI-powered gap analysis · Free forever · Your own Gemini key
        </div>

        {/* Score chips */}
        <div style={{ display: 'flex', gap: 16, marginTop: 48 }}>
          {[
            { label: 'Missing Skills', color: '#ef4444' },
            { label: 'Priority Actions', color: '#f59e0b' },
            { label: 'Resume Edits', color: '#22c55e' },
          ].map(({ label, color }) => (
            <div
              key={label}
              style={{
                background: '#1e293b',
                border: `1px solid ${color}40`,
                borderRadius: 999,
                padding: '10px 24px',
                color,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
