export interface Profile {
  id: number;
  name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  resume_url: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  email: string;
  phone: string;
  location: string;
  available_for_work: boolean;
  years_experience: number;
  completed_projects: number;
  satisfied_clients: number;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  image_url: string;
  demo_url: string;
  github_url: string;
  tech_stack: string;
  featured: boolean;
  order_index: number;
  created_at?: string;
}

export interface Skill {
  id: number;
  name: string;
  category: "Backend" | "Frontend" | "DevOps & Cloud" | "Database & Tools" | string;
  proficiency: number; // 1 - 100
  icon_name: string;
  order_index: number;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  company_url: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  bullet_points: string;
  order_index: number;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  reading_time: string;
  published_at: string;
  is_published: boolean;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  error?: string;
}

