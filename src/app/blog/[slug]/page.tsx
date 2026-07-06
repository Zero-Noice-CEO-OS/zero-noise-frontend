import BlogDetailPage from './BlogDetailClient'

export async function generateStaticParams() {
  const categories = ['productivity', 'ai', 'startup', 'technology', 'business'];
  const slugsSet = new Set<string>([
    'the-90-minute-focus-rule',
    'how-to-balance-building-and-selling-the-founder-audit-framework',
    'demystifying-the-executive-capability-radar-score-index'
  ]);

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
    for (const cat of categories) {
      const res = await fetch(`${API_BASE_URL}/blog?category=${cat}`);
      if (res.ok) {
        const json = await res.json();
        const articles = json.data || json || [];
        if (Array.isArray(articles)) {
          articles.forEach((art: any) => {
            if (art?.slug) {
              slugsSet.add(art.slug);
            }
          });
        }
      }
    }
  } catch (e) {
    // Fallback safely if backend is not reachable during build
  }

  return Array.from(slugsSet).map((slug) => ({
    slug,
  }));
}

export default function Page() {
  return <BlogDetailPage />
}
