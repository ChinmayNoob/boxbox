interface InfoDriverProps {
    title: string
    content: string | number
}

export default function InfoDriver({ title, content }: InfoDriverProps) {
    return (
        <div className='flex flex-row items-center justify-between cursor-default gap-x-4 w-full px-1 py-1 rounded-xl backdrop-blur-sm border-0'>
            <h2 className='font-normal text-lg text-neutral-200'>{title}</h2>
            <h3 className='font-semibold text-lg text-start'>{content}</h3>
        </div>
    )
} 