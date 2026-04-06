import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Disconnected Test Page',
  description: 'A page completely disconnected from the CMS.',
}

export default function DisconnectedTestPage() {
  return (
    <article className="pt-16 pb-24">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto space-y-8 bg-muted/50 p-12 rounded-xl border border-border">
          <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
            Hardcoded Route
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            I am completely disconnected from Payload CMS.
          </h1>

          <div className="prose dark:prose-invert">
            <p className="text-xl text-muted-foreground leading-relaxed">
              This page lives at <code>src/app/(frontend)/disconnected-test/page.tsx</code>. It
              bypasses the catch-all router entirely.
            </p>

            <ul className="space-y-2 mt-8 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>
                  It does <strong>not</strong> need a database record
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>
                  It does <strong>not</strong> use the template switch statement
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-500">✓</span>
                <span>It still gets the global Header and Footer</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 border-t border-border flex gap-4">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin">Go to CMS Admin</Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
