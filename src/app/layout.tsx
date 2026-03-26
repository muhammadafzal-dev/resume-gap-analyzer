import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://resume-gap-analyzer-dev.vercel.app'

export const viewport: Viewport = {
  themeColor: '#0f172a',
}

export const metadata: Metadata = {
  title: {
    default: "ResumeGap — Know exactly what's missing",
    template: '%s | ResumeGap',
  },
  description:
    'Upload your resume and any job description to get a precise AI-powered gap analysis with priority actions. Free forever using your own Gemini API key.',
  keywords: ['resume', 'job application', 'gap analysis', 'ATS', 'career', 'Gemini AI'],
  authors: [{ name: 'ResumeGap' }],
  metadataBase: new URL(APP_URL),
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: "ResumeGap — Know exactly what's missing",
    description:
      'Get a precise AI-powered gap analysis between your resume and any job description. Free, private, instant.',
    url: APP_URL,
    siteName: 'ResumeGap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ResumeGap — Know exactly what's missing",
    description:
      'Get a precise AI-powered gap analysis between your resume and any job description.',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
