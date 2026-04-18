import Link from "next/link";

const PROJECTS = [
  {
    id: "blazing-fast-title-generation",
    title: "Blazing Fast Title Generation",
    description: "Instantly generate engaging titles for your text content using LLMs.",
    status: "Live",
  },
  {
    id: "video-answer-engine",
    title: "Get Answers with Videos",
    description: "Intelligent video and podcast search engine with automated subtitles and RAG.",
    status: "Planning",
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
      <header className="w-full max-w-6xl mx-auto px-6 pt-12 pb-8 text-center border-b border-gray-200">
        <h1 className="text-3xl font-extrabold tracking-tight mb-3">LLM based Projects</h1>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
          A showcase of production-level, scalable applications, inference experiments, and other cutting-edge LLM capabilities built by me.
        </p>
      </header>
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {PROJECTS.map((project) => (
            <Link 
              key={project.id} 
              href={`/${project.id}`}
              className="group flex flex-col p-5 border border-gray-200 rounded-xl hover:border-black transition-all hover:-translate-y-1 hover:shadow-md bg-white relative overflow-hidden h-full gap-2 text-left"
            >
              <div className="absolute top-0 right-0 p-3">
                <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 bg-black text-white rounded-full">
                  {project.status}
                </span>
              </div>
              <h3 className="text-base font-bold pr-12 group-hover:underline decoration-1 underline-offset-4 leading-tight">{project.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed flex-1 pt-1">
                {project.description}
              </p>
              
              <div className="mt-3 flex items-center text-xs font-bold text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                Explore <span className="ml-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="w-full max-w-6xl mx-auto px-6 py-6 border-t border-gray-200 text-xs text-gray-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} LLM Showcase. All rights reserved.</p>
        <div className="flex gap-4 font-medium">
          <span className="hover:text-black cursor-pointer transition-colors">GitHub</span>
          <span className="hover:text-black cursor-pointer transition-colors">Twitter</span>
          <span className="hover:text-black cursor-pointer transition-colors">LinkedIn</span>
        </div>
      </footer>
    </div>
  );
}
