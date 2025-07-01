// Definicija stilova za sve Markdown elemente na jednom mjestu
export const markdownComponents = {
  h2: ({ node, ...props }) => (
    <h2 className="text-2xl font-bold mt-8 mb-4 pb-2" {...props} />
  ),

  h3: ({ node, ...props }) => (
    <h3 className="text-xl font-semibold mt-6 mb-3 pb-1" {...props} />
  ),

  p: ({ node, ...props }) => (
    <p className="my-4 text-lg leading-relaxed" {...props} />
  ),

  code: ({ node, ...props }) => (
    <code
      className="inline bg-gray-700 text-sky-300 rounded-md px-2 font-mono"
      {...props}
    />
  ),

  ul: ({ node, ...props }) => (
    <ul
      className="list-disc list-outside pl-6 my-4 space-y-2 mb-8"
      {...props}
    />
  ),

  li: ({ node, ...props }) => <li className="text-lg" {...props}></li>,
};
