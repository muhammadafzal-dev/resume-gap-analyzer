import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

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
  themeColor: '#0f172a',
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
