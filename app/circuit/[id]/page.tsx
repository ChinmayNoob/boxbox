import CircuitPageContent from '@/components/circuit/circuit-page-content'

interface CircuitPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function CircuitPage({ params }: CircuitPageProps) {
    const { id } = await params

    return <CircuitPageContent slug={id} />
} 