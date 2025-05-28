import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  // Check if content contains artifact blocks and remove them for markdown rendering
  const processedContent = content.replace(/```artifact\n[\s\S]*?\n```/g,
    '\n*[HTML Artifact Generated - View in the panel on the right]*\n'
  )

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className="text-xl font-bold text-white mb-2">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-semibold text-white mb-2">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-medium text-white mb-1">{children}</h3>
        ),
        // Paragraphs
        p: ({ children }) => (
          <p className="text-gray-100 mb-2 leading-relaxed">{children}</p>
        ),
        // Code blocks
        code: ({ inline, className, children, ...props }: any) => {
          if (inline) {
            return (
              <code
                className="bg-gray-700 text-purple-300 px-1 py-0.5 rounded text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            )
          }
          return (
            <code
              className="block bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-sm overflow-x-auto whitespace-pre"
              {...props}
            >
              {children}
            </code>
          )
        },
        // Preformatted blocks
        pre: ({ children }) => (
          <pre className="bg-gray-900 p-3 rounded-lg overflow-x-auto mb-3">
            {children}
          </pre>
        ),
        // Lists
        ul: ({ children }) => (
          <ul className="list-disc list-inside text-gray-100 mb-2 space-y-1">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside text-gray-100 mb-2 space-y-1">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="text-gray-100">{children}</li>
        ),
        // Links
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            {children}
          </a>
        ),
        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-purple-500 pl-4 italic text-gray-300 mb-2">
            {children}
          </blockquote>
        ),
        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto mb-3">
            <table className="min-w-full border-collapse border border-gray-600">
              {children}
            </table>
          </div>
        ),
        th: ({ children }) => (
          <th className="border border-gray-600 px-3 py-2 bg-gray-800 text-left text-white font-semibold">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="border border-gray-600 px-3 py-2 text-gray-100">
            {children}
          </td>
        ),
        // Horizontal rule
        hr: () => <hr className="border-gray-600 my-4" />,
        // Strong/bold
        strong: ({ children }) => (
          <strong className="font-bold text-white">{children}</strong>
        ),
        // Emphasis/italic
        em: ({ children }) => (
          <em className="italic text-gray-200">{children}</em>
        ),
      }}
    >
      {processedContent}
    </ReactMarkdown>
  )
} 
