'use client'

import ReactMarkdown from 'react-markdown'
import { memo } from 'react'

interface MarkdownProps {
  content: string
  className?: string
}

function MarkdownBase({ content, className = '' }: MarkdownProps) {
  return (
    <div className={`prose-chat ${className}`}>
      <ReactMarkdown
        components={{
          pre: ({ children }) => (
            <pre className="bg-[#0d1117] text-[#e6edf3] rounded-lg p-4 overflow-x-auto my-3 text-sm">
              {children}
            </pre>
          ),
          code: ({ children, className: cls, ...props }) => {
            const isInline = !cls
            if (isInline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-[0.85em] font-mono text-primary" {...props}>
                  {children}
                </code>
              )
            }
            return <code className={cls} {...props}>{children}</code>
          },
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export const Markdown = memo(MarkdownBase)
