import BlogDetailPage from './BlogDetailClient'

export async function generateStaticParams() {
  return [
    { slug: 'strategic-thinking' },
    { slug: 'scaling-operations' },
    { slug: 'mental-clarity' }
  ]
}

export default function Page() {
  return <BlogDetailPage />
}
