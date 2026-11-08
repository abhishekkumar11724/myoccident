/**
 * SINGLE SOURCE OF TRUTH for all portfolio content.
 * Every theme renders exactly this data - edit here and all 19 sites update.
 *
 * Rules:
 *  - Professional facts come ONLY from the resume / LinkedIn (public). Do not invent numbers.
 *  - Email + phone are stored base64-encoded and decoded in the browser (see components/Protected.astro)
 *    so simple scrapers do not harvest them. Never write them in plain text in templates.
 */

const b64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');

export const profile = {
  name: 'Abhishek Kumar',
  firstName: 'Abhishek',
  handle: 'abhishekkumar11724',
  role: 'Software Development Engineer',
  focus: 'GenAI agent platforms & distributed backends',
  location: 'Gurugram, India',
  /** Short, factual one-liner (identical in every theme). */
  tagline: 'I build GenAI agent platforms and the distributed backends under them.',
  /** ~2 sentences, straight from the resume summary. */
  summary:
    "Software Development Engineer with 2.5+ years building GenAI agent platforms and distributed backends. Sole developer of the NL-to-workflow compiler and backend owner of the workflow engine on Delhivery's agent platform, which serves ~5M workflow and ~2M agent requests per day.",
  /** The personal half of the portfolio. Light, first-person. Edit freely. */
  aboutPersonal: [
    "Away from the keyboard I'm usually on a motorbike, up a hillside chasing a waterfall, or somewhere with a book and a cup of chai.",
    "I like the same things in code and in trips: a clear route, a few good tools, and leaving things better than I found them.",
  ],
  /** Little facts used for "personal touch" chips / marquee strips. Keep short. */
  interests: ['Motorbike rides', 'Hill trips & waterfalls', 'Reading', 'Street food', 'Photography', 'Dogs & cats'],
  stats: [
    { value: '~5M', label: 'workflow requests / day' },
    { value: '~2M', label: 'agent requests / day' },
    { value: '1000+', label: 'tools on the platform' },
    { value: '150+', label: 'agents shipped' },
    { value: '~68%', label: 'p99 latency cut' },
    { value: '~90%', label: 'LLM cost cut per query' },
  ],

  contact: {
    emailB64: b64('abhishek.k.11724@gmail.com'),
    phoneB64: b64('+917973373716'),
    phoneDisplayB64: b64('+91-7973373716'),
    linkedin: 'https://www.linkedin.com/in/abhishek-kumar-ld',
    github: 'https://github.com/abhishekkumar11724',
  },
  /** Resume PDF (copied to /public by `npm run images`). */
  resume: { href: 'resume/Abhishek-Kumar-Resume.pdf', label: 'Download resume (PDF)', updated: 'Nov 2026' },

  experience: [
    {
      id: 'delhivery',
      company: 'Delhivery',
      title: 'Software Development Engineer',
      place: 'Gurugram, IN',
      start: 'Mar 2025',
      end: 'Present',
      blurb: "GenAI agent platform: workflow engine, NL-to-workflow compiler, MCP/agent tooling.",
      bullets: [
        { head: 'NL-to-Workflow Compiler', text: 'Sole developer of a compile-once engine turning natural-language SOPs into validated workflow graphs with no LLM in the control loop, cutting per-query LLM cost ~90% and latency to sub-second.' },
        { head: 'Workflow Engine at Scale', text: 'Built and own the workflow-builder backend: canvas graphs compiled to LangGraph (10 node types, parallel branches, pause/resume), serving ~5M workflow and ~2M agent requests/day.' },
        { head: 'MCP & Agent Platform', text: 'Developed the platform that turns OpenAPI specs alone into MCP servers, tools, and agents (FastAPI, LangGraph, Redis), now 1000+ tools and 150+ agents across Tech, Finance, and Ops.' },
        { head: 'Agents & Retrieval', text: 'Engineered multi-agent systems that cut Operations MTTR ~40% by automating cross-dashboard retrieval, and a hybrid search engine (dense + sparse) with reranking that lifted relevance ~35%.' },
        { head: 'Production Workflows & Tools', text: 'Shipped non-delivery, shipment-summary, and warehouse workflows (saving ~Rs. 80 lac; running cost now ~Rs. 60K/month), and OCR, auth-token, memory, and RAG tools, often within a day.' },
        { head: 'Production Reliability', text: 'Moved catalog and gateway from a single Uvicorn process to 2-worker Gunicorn with request recycling and hung-worker recovery, and fixed a gateway thread lock, cutting p99 latency ~68% (1.8s to 550ms).' },
        { head: 'Trace Observability', text: "Debugged workflow runs whose ~1,400-span traces were missing from Langfuse: 1.38 MB iteration spans were overflowing the SDK's 64 MiB batch limit; cut spans to ~1 KB so traces render in full." },
        { head: 'LLM-as-a-Judge Evaluation', text: 'Built live evaluations where LLM judges score production traces asynchronously after each run (Langfuse evaluators), now running 15+ scores across 100+ agents.' },
        { head: 'Agent Memory', text: 'Benchmarked 6 memory frameworks and built a long-term memory engine (Kafka, Graphiti, Neo4j), now in an A/B release on 10K requests (80% agents, 20% workflows).' },
      ],
    },
    {
      id: 'spyne',
      company: 'Spyne AI',
      title: 'Software Development Engineer',
      place: 'Gurugram, IN',
      start: 'Jul 2024',
      end: 'Feb 2025',
      blurb: 'Event-driven pipelines and serverless services for an AI image platform.',
      bullets: [
        { head: 'Event-Driven Webhooks', text: 'Re-architected a cron-based webhook system into an event-driven pipeline (Debezium, Kafka, Redis Bull Queue), achieving 100% SLA on client deliveries.' },
        { head: 'Webmine Microservice', text: 'Led Webmine, a serverless AWS Lambda service that auto-scrapes vehicle display pages, improving CSM efficiency 30-40%, with automated live-visibility checks and multi-level fallbacks.' },
        { head: 'Partner Integration & Deployment', text: 'Scaled a CSV-based image-processing system with event-driven architecture and rule-based configs; deployed Node.js + Kafka microservices on AWS ECS.' },
      ],
    },
    {
      id: 'spyne-intern',
      company: 'Spyne AI',
      title: 'Software Development Engineer Intern',
      place: 'Gurugram, IN',
      start: 'Jan 2024',
      end: 'Jun 2024',
      blurb: 'Performance work, a full-stack AI feature, and internal tooling.',
      bullets: [
        { head: 'Performance & Features', text: 'Cut download processing time 80% (600s to 120s) and launched an end-to-end wall-replace feature (front-end, back-end, AI) serving 8-9K weekly requests.' },
        { head: 'Internal Tooling', text: 'Built tools that cut ad-hoc client requests 25-30%, image-classification plugins with real-time reprocessing, and role-based access control for the image console.' },
      ],
    },
  ],

  education: [
    {
      school: 'Dr B R Ambedkar National Institute of Technology, Jalandhar',
      short: 'NIT Jalandhar',
      degree: 'B.Tech in Information Technology',
      start: 'Dec 2020',
      end: 'Jun 2024',
    },
  ],

  skills: [
    { group: 'Languages', items: ['Python', 'JavaScript', 'TypeScript', 'C/C++'], familiar: ['Go (Golang)', 'GraphQL'] },
    { group: 'GenAI & LLMs', items: ['RAG Pipelines', 'AI Agents', 'MCP Servers', 'LangChain', 'LangGraph', 'OpenAI / Gemini APIs', 'Vector Search'] },
    { group: 'Backend & Distributed Systems', items: ['Microservices', 'Event-driven Architecture', 'REST API Design', 'FastAPI', 'Node.js', 'Express.js', 'Kafka', 'Redis (Bull)', 'AWS SQS', 'Multithreaded & Async Programming'] },
    { group: 'Databases', items: ['MongoDB', 'PostgreSQL', 'MySQL', 'Elasticsearch (Vector)', 'Qdrant', 'Redis'] },
    { group: 'DevOps & Tools', items: ['Docker', 'Kubernetes', 'AWS (Lambda, ECS)', 'Git', 'CI/CD', 'Linux/Unix', 'Shell Scripting'] },
    { group: 'Practices', items: ['Agile/Scrum', 'System Design', 'Design Patterns', 'OS Internals', 'Data Structures & Algorithms'] },
  ],

  /**
   * Deeper write-ups. Built ONLY from resume facts: problem/approach are the plain reading of the
   * resume bullet, numbers are the resume's numbers. Do not add figures that are not on the resume.
   */
  caseStudies: [
    {
      id: 'nl-to-workflow-compiler',
      title: 'NL-to-Workflow Compiler',
      org: 'Delhivery',
      period: '2025 - now',
      role: 'Sole developer',
      kicker: 'Compile once, no LLM in the loop',
      problem: 'Operations teams describe their processes as natural-language SOPs. Running an LLM on every query to interpret them is slow and expensive.',
      approach: 'Compile each SOP once into a validated workflow graph, then execute the graph deterministically. No LLM sits in the control loop at run time.',
      impact: ['~90% lower per-query LLM cost', 'Sub-second latency'],
      tags: ['Compilers', 'Workflow graphs', 'LLM cost'],
      featured: true,
    },
    {
      id: 'workflow-engine',
      title: 'Workflow Engine at Scale',
      org: 'Delhivery',
      period: '2025 - now',
      role: 'Backend owner',
      kicker: 'Canvas graphs, compiled to LangGraph',
      problem: 'Teams build workflows visually on a canvas; the backend has to run those graphs reliably at very high volume.',
      approach: 'Compile canvas graphs to LangGraph with 10 node types, parallel branches and pause/resume.',
      impact: ['~5M workflow requests/day', '~2M agent requests/day'],
      tags: ['LangGraph', 'Workflow engine', 'Scale'],
      featured: true,
    },
    {
      id: 'mcp-agent-platform',
      title: 'MCP & Agent Platform',
      org: 'Delhivery',
      period: '2025 - now',
      role: 'Developer',
      kicker: 'OpenAPI spec in, MCP server + tools + agents out',
      problem: 'Wiring every internal API into agents by hand does not scale across Tech, Finance and Ops.',
      approach: 'A platform that turns an OpenAPI spec alone into an MCP server, its tools, and agents (FastAPI, LangGraph, Redis).',
      impact: ['1000+ tools', '150+ agents', 'Across Tech, Finance and Ops'],
      tags: ['MCP', 'FastAPI', 'LangGraph', 'Redis'],
      featured: true,
    },
    {
      id: 'agents-retrieval',
      title: 'Multi-agent Retrieval',
      org: 'Delhivery',
      period: '2025 - now',
      role: 'Engineer',
      kicker: 'Fewer dashboards to chase, better search',
      problem: 'Debugging operations incidents meant hopping between dashboards by hand; search results needed to be more relevant.',
      approach: 'Multi-agent systems that retrieve across dashboards automatically, plus a hybrid (dense + sparse) search engine with reranking.',
      impact: ['~40% lower Operations MTTR', '~35% better relevance'],
      tags: ['Multi-agent', 'Hybrid search', 'Reranking'],
      featured: true,
    },
    {
      id: 'reliability-observability',
      title: 'Reliability & Observability',
      org: 'Delhivery',
      period: '2025 - now',
      role: 'Engineer',
      kicker: 'p99 1.8s to 550ms, and traces that finally render',
      problem: 'Gateway latency was high under load, and large workflow traces (~1,400 spans) were silently missing from Langfuse.',
      approach: 'Moved from a single Uvicorn process to 2-worker Gunicorn with request recycling and hung-worker recovery, and fixed a gateway thread lock. Found that 1.38 MB iteration spans overflowed the SDK\'s 64 MiB batch limit and cut them to ~1 KB.',
      impact: ['p99 latency down ~68% (1.8s to 550ms)', 'Full traces render in Langfuse'],
      tags: ['Gunicorn', 'Langfuse', 'Debugging'],
      featured: true,
    },
    {
      id: 'evals-memory',
      title: 'Evals & Agent Memory',
      org: 'Delhivery',
      period: '2025 - now',
      role: 'Engineer',
      kicker: 'Judging agents live, and giving them memory',
      problem: 'Agent quality needs to be measured on real production runs, and agents need to remember across sessions.',
      approach: 'LLM judges score production traces asynchronously after each run (Langfuse evaluators). Benchmarked 6 memory frameworks, then built a long-term memory engine on Kafka, Graphiti and Neo4j.',
      impact: ['15+ scores across 100+ agents', 'Memory in A/B on 10K requests (80% agents, 20% workflows)'],
      tags: ['LLM-as-a-judge', 'Langfuse', 'Graphiti', 'Neo4j', 'Kafka'],
      featured: true,
    },
    {
      id: 'event-driven-webhooks',
      title: 'Event-driven Webhooks',
      org: 'Spyne AI',
      period: '2024 - 2025',
      role: 'Engineer',
      kicker: 'From cron jobs to events',
      problem: 'A cron-based webhook system could not guarantee timely client deliveries.',
      approach: 'Re-architected it into an event-driven pipeline with Debezium, Kafka and a Redis Bull queue.',
      impact: ['100% SLA on client deliveries'],
      tags: ['Debezium', 'Kafka', 'Redis'],
      featured: false,
    },
    {
      id: 'webmine',
      title: 'Webmine',
      org: 'Spyne AI',
      period: '2024 - 2025',
      role: 'Lead',
      kicker: 'A serverless scraper that saved CSM time',
      problem: 'Customer-success managers spent time checking vehicle display pages by hand.',
      approach: 'A serverless AWS Lambda service that scrapes display pages automatically, with live-visibility checks and multi-level fallbacks.',
      impact: ['30-40% better CSM efficiency'],
      tags: ['AWS Lambda', 'Serverless', 'Scraping'],
      featured: false,
    },
  ],

  /** Public GitHub repos worth showing. Refresh with `node scripts/sync-github.mjs` if you want. */
  projects: [
    {
      name: 'consumer-cart',
      title: 'Consumer Cart',
      blurb: 'Full-stack MERN e-commerce app with auth, product management, order processing, Stripe payments and an admin dashboard.',
      stack: ['React', 'Redux', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'Cloudinary'],
      repo: 'https://github.com/abhishekkumar11724/consumer-cart',
      live: 'https://consumer-cart.onrender.com/',
      year: '2023',
    },
    {
      name: 'crowd-funding-minor',
      title: 'Decentralized Crowd Funding',
      blurb: 'A dapp where anyone can start a fundraiser and contribute through MetaMask. My third-year minor project at NIT Jalandhar.',
      stack: ['JavaScript', 'Ethereum', 'MetaMask'],
      repo: 'https://github.com/abhishekkumar11724/crowd-funding-minor',
      live: 'https://crowd-funding-minor.netlify.app',
      year: '2023',
    },
    {
      name: 'rapidfort_api',
      title: 'File Detail Fetcher API',
      blurb: 'Small API shipped end to end: Dockerfile, Kubernetes deployment + service, and a GitHub Actions pipeline, deployed on Render.',
      stack: ['Node.js', 'Docker', 'Kubernetes', 'GitHub Actions'],
      repo: 'https://github.com/abhishekkumar11724/rapidfort_api',
      live: 'https://rapidfortapi.onrender.com/',
      year: '2023',
    },
    {
      name: 'STL_simplified',
      title: 'STL, Simplified',
      blurb: 'My own take on the C++ Standard Template Library, written in the simplest way I could to learn how containers really work.',
      stack: ['C++'],
      repo: 'https://github.com/abhishekkumar11724/STL_simplified',
      live: null,
      year: '2022',
    },
    {
      name: 'gstar-network',
      title: 'Terminal Chat (client + server)',
      blurb: 'A C++ chat client and server for the terminal, built on ncurses, pthreads and ENet.',
      stack: ['C++', 'ncurses', 'pthreads', 'ENet'],
      repo: 'https://github.com/abhishekkumar11724/gstar-network',
      live: null,
      year: '2025',
    },
    {
      name: 'gpt3-template-site',
      title: 'GPT-3 Landing Page',
      blurb: 'A React landing page modelled on the GPT-3 marketing site, deployed on Vercel.',
      stack: ['React', 'CSS'],
      repo: 'https://github.com/abhishekkumar11724/gpt3-template-site',
      live: 'https://gpt3-template-site.vercel.app',
      year: '2023',
    },
  ],

  /** Writing stub: no posts yet. Ideas are drawn from real work, listed as "planned". */
  writing: {
    status: 'No posts yet. First few are on the way.',
    planned: [
      'Why we kept the LLM out of the control loop',
      'The 64 MiB trace limit and the 1.38 MB span',
      'Turning an OpenAPI spec into an MCP server',
      'LLM-as-a-judge on live production traces',
    ],
    posts: [] as { title: string; date: string; href: string; summary: string }[],
  },
} as const;

export type Profile = typeof profile;
export type CaseStudy = (typeof profile.caseStudies)[number];
export type Experience = (typeof profile.experience)[number];
export type Project = (typeof profile.projects)[number];
