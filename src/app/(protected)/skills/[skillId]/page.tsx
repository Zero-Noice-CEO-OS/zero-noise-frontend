import SkillDetail from './SkillDetailClient'

export async function generateStaticParams() {
  return [
    { skillId: 'demo' }
  ]
}

export default function Page() {
  return <SkillDetail />
}
