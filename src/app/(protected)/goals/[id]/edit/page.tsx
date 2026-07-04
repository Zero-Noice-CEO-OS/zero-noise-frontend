import GoalEdit from './GoalEditClient'

export async function generateStaticParams() {
  return [
    { id: 'demo' }
  ]
}

export default function Page() {
  return <GoalEdit />
}
