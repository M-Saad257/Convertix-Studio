export interface Project {
  id: string;
  name: string;
  description: string;
  image_url: string;
  project_url?: string;
  github_url?: string;
  category: string;
  created_at: string;
}

 export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  image_url?: string;
  author_name: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
