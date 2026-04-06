import React from 'react'
import type { Page } from '@/payload-types'

export const DefaultView: React.FC<{ page: Page }> = ({ page }) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">{page.title}</h1>
      <div className="prose max-w-none text-foreground/80">
        <p>
          This is the standard text block for the default page design. To customize this layout,
          edit the <code>src/views/Pages/DefaultView.tsx</code> file or assign a new template in the
          CMS.
        </p>
      </div>
    </div>
  )
}
