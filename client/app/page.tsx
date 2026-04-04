import Link from "next/link";

const PROJECTS = [
  {
    id: "blazing-fast-title-generation",
    title: "Blazing Fast Title Generation",
    description: "Instantly generate engaging titles for your text content using LLMs.",
    status: "Live",
  },
  {
    id: "seo-optimization",
    title: "SEO Optimization Assistant",
    description: "Analyze and optimize web content for search engines automatically.",
    status: "Coming Soon",
  },
  {
    id: "vllm-inference",
    title: "vLLM Inference Engine",
    description: "High-throughput and memory-efficient LLM serving and testing.",
    status: "Coming Soon",
  },
  {
    id: "document-summarizer",
    title: "Document Summarizer",
    description: "Condense long PDFs or articles into readable summaries.",
    status: "Planning",
  },
  {
    id: "code-reviewer",
    title: "AI Code Reviewer",
    description: "Automated code quality and security analysis system.",
    status: "Planning",
  },
  {
    id: "chat-with-data",
    title: "Chat with Data",
    description: "Conversational interface to query SQL/NoSQL databases.",
    status: "Coming Soon",
  },
  {
    id: "image-prompt-gen",
    title: "Image Prompt Generator",
    description: "Craft perfect prompts for Midjourney and DALL-E.",
    status: "Planning",
  },
  {
    id: "rag-experiment",
    title: "RAG Experiments",
    description: "Evaluating retrieval-augmented generation strategies.",
    status: "Draft",
  },
  {
    id: "agentic-workflows",
    title: "Agentic Workflows",
    description: "Multi-agent orchestration for complex automated tasks.",
    status: "Draft",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans text-black">
      <header className="w-full max-w-6xl mx-auto px-6 pt-20 pb-12 text-center border-b border-gray-200">
        <h1 className="text-5xl font-extrabold tracking-tight mb-6">LLM based Projects</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A showcase of production-level, scalable applications, inference experiments, and other cutting-edge LLM capabilities built by me.
        </p>
      </header>
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project) => (
            <Link 
              key={project.id} 
              href={`/${project.id}`}
              className="group block p-8 border border-gray-200 rounded-2xl hover:border-black transition-all hover:-translate-y-1 hover:shadow-xl bg-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 bg-black text-white rounded-full">
                  {project.status}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4 pr-16 group-hover:underline decoration-2 underline-offset-4">{project.title}</h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {project.description}
              </p>
              
              <div className="mt-8 flex items-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity -translate-x-4 group-hover:translate-x-0 duration-300">
                Explore Project <span className="ml-2">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-gray-200 text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} LLM Showcase. All rights reserved.</p>
        <div className="flex gap-6 font-medium">
          <span className="hover:text-black cursor-pointer transition-colors">GitHub</span>
          <span className="hover:text-black cursor-pointer transition-colors">Twitter</span>
          <span className="hover:text-black cursor-pointer transition-colors">LinkedIn</span>
        </div>
      </footer>
    </div>
  );
}
