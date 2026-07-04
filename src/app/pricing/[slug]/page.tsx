import PricingDetailPage from './PricingDetailClient'

export async function generateStaticParams() {
  return [
    { slug: 'free' },
    { slug: 'starter' },
    { slug: 'founder-pro' },
    { slug: 'founder-elite' },
    { slug: 'lifetime-founder' }
  ]
}

export default function Page() {
  return <PricingDetailPage />
}
