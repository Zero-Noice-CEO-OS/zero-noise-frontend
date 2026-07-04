import GoalDetail from './GoalDetailClient'

export async function generateStaticParams() {
  return [
    { id: 'demo' }
  ]
}

export default function Page() {
  return <GoalDetail />
}
