import { Profile, Project, Skill, Experience, APIResponse, ContactMessage, Article } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Fallback data matching Dimas Fiebry's authentic CV
export const fallbackProfile: Profile = {
  id: 1,
  name: "Dimas Fiebry Prayhoga Putra",
  headline: "Versatile Fullstack Developer & Performance Systems Engineer",
  bio: "Versatile Fullstack Developer with a strong track record of architecting and deploying scalable web applications, ranging from enterprise-level sports analytics platforms to comprehensive business management solutions. Combining a solid academic foundation from Universitas Brawijaya with extensive hands-on experience in API integrations, database architecture, and end-to-end project management.",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  resume_url: "https://fiebryhoga.my.id/",
  github_url: "https://github.com/fiebryhoga",
  linkedin_url: "https://linkedin.com/in/dimas-fiebry-prayhoga-putra/",
  twitter_url: "https://fiebryhoga.my.id/",
  email: "dimasfiebry@gmail.com",
  phone: "+6285730979537",
  location: "Malang, Indonesia",
  available_for_work: true,
  years_experience: 3,
  completed_projects: 15,
  satisfied_clients: 10,
};

export const fallbackProjects: Project[] = [
  {
    id: 1,
    title: "ISMS - Integrated Soccer Monitoring System (Persebaya Surabaya)",
    slug: "isms-persebaya-surabaya",
    short_description: "Elite sports analytics platform exclusively for Persebaya Surabaya monitoring ACWR models, GPS load metrics, and medical diagnostics.",
    full_description: "Developed exclusively for Persebaya Surabaya to generate comprehensive data-driven reports supporting tactical and medical decisions for the head coach, team doctors, and coaching staff. Features training periodization, microcycles, multiple ACWR models (Weekly, RA, EWMA), GPS Scores, Daily Wellness RPE, VALD Hub integration, and Player Performance Readiness Index (PPRI).",
    image_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    demo_url: "https://fiebryhoga.my.id/",
    github_url: "https://github.com/fiebryhoga",
    tech_stack: "Laravel, React.js, Inertia.js, MySQL, Tailwind CSS, REST API",
    featured: true,
    order_index: 1,
  },
  {
    id: 2,
    title: "Simadis Mitreka (SMAN 1 Malang)",
    slug: "simadis-mitreka-sman1-malang",
    short_description: "Student management platform for attendance and disciplinary tracking with automated WhatsApp notifications.",
    full_description: "Engineered for SMA Negeri 1 Malang to track student attendance and disciplinary records with real-time automated WhatsApp notifications to parents utilizing Node.js and Baileys socket integration.",
    image_url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    demo_url: "https://fiebryhoga.my.id/",
    github_url: "https://github.com/fiebryhoga",
    tech_stack: "Laravel, Node.js, Baileys (WhatsApp API), MySQL, Tailwind CSS",
    featured: true,
    order_index: 2,
  },
  {
    id: 3,
    title: "ZK Performance Sports Analytics",
    slug: "zk-performance",
    short_description: "Performance analytics and reporting platform tailored for youth sports trainers and athlete development.",
    full_description: "Engineered a performance analytics and reporting suite for youth sports trainers, featuring custom dashboards to track athlete development, strength training metrics, and athletic readiness benchmarks.",
    image_url: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80",
    demo_url: "https://fiebryhoga.my.id/",
    github_url: "https://github.com/fiebryhoga",
    tech_stack: "React.js, Next.js, Node.js, PostgreSQL, Tailwind CSS",
    featured: true,
    order_index: 3,
  },
  {
    id: 4,
    title: "UD Sumberpangan Inventory & Stock ERP",
    slug: "ud-sumberpangan-inventory",
    short_description: "Robust inventory and stock management system with real-time stock tracking and automated reporting.",
    full_description: "Developed a comprehensive inventory management system to optimize operational workflows, featuring real-time stock tracking, automated alerts, and financial reporting for product distribution.",
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    demo_url: "https://fiebryhoga.my.id/",
    github_url: "https://github.com/fiebryhoga",
    tech_stack: "Laravel Filament, MySQL, Tailwind CSS, Livewire",
    featured: true,
    order_index: 4,
  },
  {
    id: 5,
    title: "Barbershop Real-Time Booking & Queue",
    slug: "barbershop-booking-midtrans",
    short_description: "Real-time queue and appointment booking platform with Midtrans Payment Gateway integration.",
    full_description: "Created a real-time queue and reservation system using Laravel Filament, seamlessly integrated with the Midtrans Payment Gateway for automated cashless transactions and appointment management.",
    image_url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    demo_url: "https://fiebryhoga.my.id/",
    github_url: "https://github.com/fiebryhoga",
    tech_stack: "Laravel Filament, React.js, Midtrans Gateway, MySQL",
    featured: false,
    order_index: 5,
  },
  {
    id: 6,
    title: "Metro Correspondence & QR App",
    slug: "metro-correspondence-qr",
    short_description: "Automated mail administration and document tracking system with custom Python QR Code verification.",
    full_description: "Engineered an automated correspondence workflow system featuring custom QR Code scanning integration using Python to digitize, index, and securely track institutional document workflows.",
    image_url: "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80",
    demo_url: "https://fiebryhoga.my.id/",
    github_url: "https://github.com/fiebryhoga",
    tech_stack: "Python, Inertia.js, Laravel, React.js, MySQL",
    featured: false,
    order_index: 6,
  },
  {
    id: 7,
    title: "Siakad LPK Academic Information System",
    slug: "siakad-lpk",
    short_description: "Academic Information System utilizing Laravel and Filament to manage student data and schedules.",
    full_description: "Built a comprehensive Academic Information System utilizing Laravel and Filament to seamlessly manage student data, grade transcripts, academic schedules, and institutional administration.",
    image_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    demo_url: "https://fiebryhoga.my.id/",
    github_url: "https://github.com/fiebryhoga",
    tech_stack: "Laravel, Filament, MySQL, Tailwind CSS",
    featured: false,
    order_index: 7,
  },
  {
    id: 8,
    title: "E-Archive CV Tunas Abadi",
    slug: "e-archive-cv-tunas-abadi",
    short_description: "Secure digital document archiving system built with Next.js for rapid search and retrieval.",
    full_description: "Developed a secure digital archiving platform utilizing Next.js to modernize document storage, ensuring fast retrieval, categorized indexing, and efficient organizational data management.",
    image_url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    demo_url: "https://fiebryhoga.my.id/",
    github_url: "https://github.com/fiebryhoga",
    tech_stack: "Next.js, React, TypeScript, Node.js, Tailwind CSS",
    featured: false,
    order_index: 8,
  },
  {
    id: 9,
    title: "Brandly-id Vocational E-Learning",
    slug: "brandly-id-elearning",
    short_description: "Interactive e-learning platform for vocational high school students with digital modules.",
    full_description: "Built an interactive e-learning platform for vocational high school (SMK) students, providing engaging digital modules, assignment evaluations, and streamlined learning management.",
    image_url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
    demo_url: "https://fiebryhoga.my.id/",
    github_url: "https://github.com/fiebryhoga",
    tech_stack: "React.js, Next.js, Node.js, MySQL, Tailwind CSS",
    featured: false,
    order_index: 9,
  },
  {
    id: 10,
    title: "Karangwungu Citizen Portal & Mail Automation",
    slug: "karangwungu-portal",
    short_description: "SEO-optimized community portal with automated population management and digital request workflows.",
    full_description: "Built an SEO-optimized community portal using React.js and Inertia.js, featuring administrative modules for population data, resident announcements, and automated digital mail delivery.",
    image_url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    demo_url: "https://fiebryhoga.my.id/",
    github_url: "https://github.com/fiebryhoga",
    tech_stack: "React.js, Inertia.js, Laravel, Tailwind CSS, MySQL",
    featured: false,
    order_index: 10,
  },
];

export const fallbackSkills: Skill[] = [
  // Backend
  { id: 1, name: "PHP & Laravel (Filament)", category: "Backend", proficiency: 95, icon_name: "Server", order_index: 1 },
  { id: 2, name: "Golang & Gin Framework", category: "Backend", proficiency: 90, icon_name: "FileCode", order_index: 2 },
  { id: 3, name: "Node.js & Express / Baileys", category: "Backend", proficiency: 92, icon_name: "Network", order_index: 3 },
  { id: 4, name: "Python & Java", category: "Backend", proficiency: 88, icon_name: "Terminal", order_index: 4 },
  { id: 5, name: "Database Architecture (MySQL/Postgres)", category: "Backend", proficiency: 92, icon_name: "Database", order_index: 5 },
  { id: 6, name: "REST API & Microservices", category: "Backend", proficiency: 94, icon_name: "Cpu", order_index: 6 },
  // Frontend
  { id: 7, name: "React.js & Inertia.js", category: "Frontend", proficiency: 95, icon_name: "Code2", order_index: 1 },
  { id: 8, name: "Next.js & TypeScript", category: "Frontend", proficiency: 92, icon_name: "Globe", order_index: 2 },
  { id: 9, name: "Tailwind CSS", category: "Frontend", proficiency: 96, icon_name: "Palette", order_index: 3 },
  { id: 10, name: "UI/UX & Graphic Design", category: "Frontend", proficiency: 88, icon_name: "Layers", order_index: 4 },
  // DevOps & Tools
  { id: 11, name: "Git & Version Control", category: "DevOps & Cloud", proficiency: 94, icon_name: "GitBranch", order_index: 1 },
  { id: 12, name: "Docker & Server Deployment", category: "DevOps & Cloud", proficiency: 90, icon_name: "Box", order_index: 2 },
  { id: 13, name: "SEO Optimization & QA Testing", category: "DevOps & Cloud", proficiency: 88, icon_name: "ShieldCheck", order_index: 3 },
  { id: 14, name: "Midtrans Gateway & Integrations", category: "DevOps & Cloud", proficiency: 90, icon_name: "CheckCircle2", order_index: 4 },
];

export const fallbackExperiences: Experience[] = [
  {
    id: 1,
    role: "Fullstack Developer - Ass. Performance Analyst",
    company: "PT. Suyoko Fit Sejahtera - Persebaya Surabaya (ISMS)",
    company_url: "https://fiebryhoga.my.id/",
    location: "Surabaya, Indonesia",
    start_date: "Feb 2026",
    end_date: "Aug 2026",
    is_current: true,
    description: "Developed the Integrated Soccer Monitoring System (ISMS), an elite sports analytics platform exclusively for Persebaya Surabaya to support tactical and medical staff decisions.",
    bullet_points: "Developed the Integrated Soccer Monitoring System (ISMS), generating comprehensive data-driven reports to support tactical and medical decisions for the head coach, team doctors, and coaching staff.|Engineered advanced training and load analytics dashboards to monitor Training Periodization, Microcycles, and athletic metrics including multiple ACWR models (Weekly, RA, EWMA), GPS Scores, and Load Adaptation.|Implemented extensive health and medical tracking systems by seamlessly integrating Daily Wellness RPE, VALD Hub data, Functional Movement Screen (FMS) analysis, and Squad Health Profiles.|Configured dynamic Player Performance Readiness Index (PPRI) scores, Neuromuscular Readiness, and team performance benchmarking using custom formula calculation engines.",
    order_index: 1,
  },
  {
    id: 2,
    role: "Web Developer (Freelance)",
    company: "Karangwungu Village Government",
    company_url: "https://fiebryhoga.my.id/",
    location: "Lamongan, Indonesia",
    start_date: "July 2026",
    end_date: "July 2026",
    is_current: false,
    description: "Built an SEO-optimized public portal with administrative modules and automated digital mail delivery.",
    bullet_points: "Built an SEO-optimized community portal using React.js and Inertia.js, featuring administrative modules for population data and citizen requests.|Engineered an automated digital mail system to streamline internal government workflows and accelerate public service delivery.",
    order_index: 2,
  },
  {
    id: 3,
    role: "Fullstack Developer",
    company: "PT. Suyoko Fit Sejahtera - Olympus Training Surabaya",
    company_url: "https://fiebryhoga.my.id/",
    location: "Surabaya, Indonesia",
    start_date: "Jan 2026",
    end_date: "Mar 2026",
    is_current: false,
    description: "Built a dedicated health monitoring and training management platform for training clients.",
    bullet_points: "Built a dedicated health monitoring platform for training clients.|Implemented modules to seamlessly track Wellness RPE (Rating of Perceived Exertion), physical fitness testing profiles, and customized training programs.",
    order_index: 3,
  },
  {
    id: 4,
    role: "Web Developer (Freelance)",
    company: "Karanggeneng Village Government",
    company_url: "https://fiebryhoga.my.id/",
    location: "Lamongan, Indonesia",
    start_date: "August 2025",
    end_date: "August 2025",
    is_current: false,
    description: "Developed a centralized informational portal using React.js and Inertia.js.",
    bullet_points: "Developed a centralized informational portal using React.js and Inertia.js.|Designed a responsive UI for easy public access to village news, profiles, and announcements.",
    order_index: 4,
  },
  {
    id: 5,
    role: "Web Developer (Internship)",
    company: "PT Sarana Inti Perwira",
    company_url: "https://fiebryhoga.my.id/",
    location: "Bekasi, Indonesia",
    start_date: "May 2025",
    end_date: "July 2025",
    is_current: false,
    description: "Developed a web application using Inertia.js and Laravel following the Waterfall methodology.",
    bullet_points: "Developed a web application using Inertia.js and Laravel following the Waterfall methodology.|Designed database schemas and implemented core business logic for the system.|Managed end-to-end project configuration and deployment to production environments.",
    order_index: 5,
  },
];

export const fallbackArticles: Article[] = [
  {
    id: 1,
    title: "Architecting the Integrated Soccer Monitoring System (ISMS) for Persebaya Surabaya",
    slug: "architecting-isms-persebaya-surabaya",
    excerpt: "A technical breakdown of how we engineered a mission-critical athletic load monitoring platform integrating ACWR models, VALD Hub datasets, and neuromuscular readiness scoring.",
    category: "Sports Analytics",
    reading_time: "6 min read",
    published_at: "Sep 5, 2026",
    is_published: true,
    order_index: 1,
    content: `### Introduction & Problem Statement

Professional football teams demand rapid, high-precision analytics to prevent non-contact injuries and maximize athletic output across congested fixture schedules. During my tenure as Fullstack Developer and Assistant Performance Analyst at **PT. Suyoko Fit Sejahtera for Persebaya Surabaya**, we identified a key operational bottleneck: physical performance datasets from disparate hardware ecosystems (GPS trackers, force plates, subjective wellness forms) were fragmented across spreadsheets.

To resolve this, we architected the **Integrated Soccer Monitoring System (ISMS)**: a centralized sports intelligence platform built exclusively for Persebaya Surabaya.

---

### Core Architectural Pillars

1. **Daily Wellness & Subjective RPE Collection**:
   - Player self-assessment engines recording sleep quality, muscle soreness, stress, and Rating of Perceived Exertion (RPE).
   - Instant anomaly detection flagging acute dips in wellness before morning training sessions.

2. **Acute:Chronic Workload Ratio (ACWR) Calculation Engine**:
   - Multi-model workload processing implementing Rolling Average (RA), Exponentially Weighted Moving Average (EWMA), and Weekly Microcycle distributions.
   - The ratio compares immediate acute workload (7 days) against historical chronic workload (28 days) to pinpoint the "sweet spot" of high fitness with minimal injury risk.

3. **VALD Hub & Force Plate Telemetry Integration**:
   - Automated ingestion of neuromuscular symmetry scores, eccentric hamstring strength metrics, and countermovement jump (CMJ) force-time curves.
   - Algorithmic generation of the **Player Performance Readiness Index (PPRI)** to directly guide head coach and medical staff tactical selections.

---

### Key Takeaways

By converging high-volume telemetry into actionable visual dashboards, technical staff were able to tailor microcycle periodization to individual player tolerance thresholds, demonstrating the immense value of software engineering in elite sports performance.`,
  },
  {
    id: 2,
    title: "Concurrency in Go: Building High-Throughput REST APIs with Gin & Channels",
    slug: "concurrency-in-go-gin-channels",
    excerpt: "Practical patterns for leveraging lightweight goroutines, worker pools, and buffered channels to handle concurrent requests without thread starvation.",
    category: "Backend Engineering",
    reading_time: "5 min read",
    published_at: "Sep 2, 2026",
    is_published: true,
    order_index: 2,
    content: `### Why Concurrency Matters in Modern Backend Architecture

In traditional thread-per-request architectures, scaling to thousands of concurrent requests rapidly exhausts server memory. The Go runtime resolves this with **Goroutines**—cooperatively scheduled green threads requiring as little as 2KB of initial stack memory.

When pairing the high-performance **Gin Web Framework** with Go's channel primitives, you can build production microservices capable of processing high-volume workloads with single-digit millisecond latency.

---

### Pattern 1: Non-Blocking Background Tasks with Worker Pools

Instead of spawning unbounded goroutines on every HTTP request, leverage a worker pool with a buffered channel queue to limit concurrency and prevent resource exhaustion.

---

### Pattern 2: Context Cancellation & Timeout Management

Always propagate request contexts with timeouts. This ensures long-running queries or external HTTP calls abort cleanly if a client disconnects.

---

### Conclusion

Embracing Go's concurrency idioms enables clean, resilient backend architectures that scale horizontally with minimal hardware footprint.`,
  },
  {
    id: 3,
    title: "The Inertia.js Paradigm: Bridging Laravel and React for Modern Fullstack Apps",
    slug: "inertiajs-laravel-react-fullstack-paradigm",
    excerpt: "How Inertia.js eliminates the friction of building separate client-side SPAs and REST APIs while keeping the developer velocity of classic monoliths.",
    category: "Fullstack Architecture",
    reading_time: "4 min read",
    published_at: "Aug 31, 2026",
    is_published: true,
    order_index: 3,
    content: `### The Modern Monolith Alternative

Building modern web applications often forces developers to choose between two extremes:
1. **Server-Side Rendered (SSR) Blade templates**: Rapid productivity, but clunky full-page reloads and limited client-side reactivity.
2. **Decoupled SPA + REST/GraphQL API**: Smooth client interactions, but duplicate validation logic, manual JWT token handling, and complex state management overhead.

**Inertia.js** offers a third, elegant path: The modern monolith.

---

### How Inertia Works Under the Hood

Inertia is not a framework; it is an architectural adapter. It replaces server-side view engines with client-side component renderers (React, Vue, or Svelte).

- Your routes and controllers remain 100% Laravel.
- The client receives pure JSON props automatically injected into the React component.
- Zero client-side routing setup, zero API token synchronization boilerplate.

---

### Summary

For teams that prioritize rapid shipping, type safety, and seamless UX without the complexity of managing two separate codebases, Laravel + Inertia.js + React is an unrivaled fullstack stack.`,
  },
];

export async function fetchProfile(): Promise<Profile> {
  try {
    const res = await fetch(`${API_BASE_URL}/profile`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend not available");
    const json: APIResponse<Profile> = await res.json();
    return json.data || fallbackProfile;
  } catch {
    return fallbackProfile;
  }
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/projects`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend not available");
    const json: APIResponse<Project[]> = await res.json();
    return json.data && json.data.length > 0 ? json.data : fallbackProjects;
  } catch {
    return fallbackProjects;
  }
}

export async function fetchSkills(): Promise<Skill[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/skills`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend not available");
    const json: APIResponse<Skill[]> = await res.json();
    return json.data && json.data.length > 0 ? json.data : fallbackSkills;
  } catch {
    return fallbackSkills;
  }
}

export async function fetchExperiences(): Promise<Experience[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/experiences`, { cache: "no-store" });
    if (!res.ok) throw new Error("Backend not available");
    const json: APIResponse<Experience[]> = await res.json();
    return json.data && json.data.length > 0 ? json.data : fallbackExperiences;
  } catch {
    return fallbackExperiences;
  }
}

export async function sendContactMessage(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<APIResponse<ContactMessage>> {
  const res = await fetch(`${API_BASE_URL}/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || "Failed to dispatch message to Go Gin API");
  }

  return res.json();
}

export async function loginAdmin(
  identifier: string,
  password: string
): Promise<{ token: string; user: { id: number; name: string; email: string } }> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Authentication failed");
  }

  const json = await res.json();
  return json.data;
}

export async function fetchContactMessages(token: string): Promise<ContactMessage[]> {
  const res = await fetch(`${API_BASE_URL}/admin/messages`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to load messages from backend");
  }

  const json: APIResponse<ContactMessage[]> = await res.json();
  return json.data || [];
}

export async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/articles`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Backend not available");
    const json: APIResponse<Article[]> = await res.json();
    return json.data && json.data.length > 0 ? json.data : fallbackArticles;
  } catch {
    return fallbackArticles;
  }
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/articles/${slug}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Article not found");
    const json: APIResponse<Article> = await res.json();
    return json.data;
  } catch {
    return fallbackArticles.find((a) => a.slug === slug) || null;
  }
}

export async function createArticle(articleData: Partial<Article>): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(articleData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to publish article to backend API");
  }

  const json: APIResponse<Article> = await res.json();
  return json.data;
}

// Authenticated Admin CRUD APIs

export async function updateAdminProfile(
  token: string,
  data: Partial<Profile>
): Promise<Profile> {
  const res = await fetch(`${API_BASE_URL}/admin/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update profile");
  }
  const json: APIResponse<Profile> = await res.json();
  return json.data;
}

export async function createAdminProject(
  token: string,
  data: Partial<Project>
): Promise<Project> {
  const res = await fetch(`${API_BASE_URL}/admin/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create project");
  }
  const json: APIResponse<Project> = await res.json();
  return json.data;
}

export async function updateAdminProject(
  token: string,
  id: number,
  data: Partial<Project>
): Promise<Project> {
  const res = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update project");
  }
  const json: APIResponse<Project> = await res.json();
  return json.data;
}

export async function deleteAdminProject(
  token: string,
  id: number
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete project");
  }
}

export async function createAdminSkill(
  token: string,
  data: Partial<Skill>
): Promise<Skill> {
  const res = await fetch(`${API_BASE_URL}/admin/skills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create skill");
  }
  const json: APIResponse<Skill> = await res.json();
  return json.data;
}

export async function deleteAdminSkill(
  token: string,
  id: number
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/skills/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete skill");
  }
}

export async function updateAdminSkill(
  token: string,
  id: number,
  data: Partial<Skill>
): Promise<Skill> {
  const res = await fetch(`${API_BASE_URL}/admin/skills/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update skill");
  }
  const json: APIResponse<Skill> = await res.json();
  return json.data;
}

export async function createAdminExperience(
  token: string,
  data: Partial<Experience>
): Promise<Experience> {
  const res = await fetch(`${API_BASE_URL}/admin/experiences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create experience");
  }
  const json: APIResponse<Experience> = await res.json();
  return json.data;
}

export async function deleteAdminExperience(
  token: string,
  id: number
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/experiences/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete experience");
  }
}

export async function updateAdminExperience(
  token: string,
  id: number,
  data: Partial<Experience>
): Promise<Experience> {
  const res = await fetch(`${API_BASE_URL}/admin/experiences/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update experience");
  }
  const json: APIResponse<Experience> = await res.json();
  return json.data;
}

export async function deleteAdminArticle(
  token: string,
  id: number
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete article");
  }
}

export async function updateAdminArticle(
  token: string,
  id: number,
  data: Partial<Article>
): Promise<Article> {
  const res = await fetch(`${API_BASE_URL}/admin/articles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to update article");
  }
  const json: APIResponse<Article> = await res.json();
  return json.data;
}

export async function markContactMessageRead(
  token: string,
  id: number
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/messages/${id}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to mark message as read");
  }
}

export async function deleteContactMessage(
  token: string,
  id: number
): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/admin/messages/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete message");
  }
}

export async function uploadAdminFile(
  token: string,
  file: File
): Promise<{ url: string; filename: string; size: number }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/admin/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || "Failed to upload file");
  }

  const json = await res.json();
  const data = json.data || json;
  return {
    url: data.url,
    filename: data.filename || "",
    size: data.size || 0,
  };
}




