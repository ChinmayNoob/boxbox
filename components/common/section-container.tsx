interface SectionContainerProps {
    className?: string;
    id?: string;
    children: React.ReactNode;
}

export default function SectionContainer({ className = "", id, children }: SectionContainerProps) {
    return (
        <section
            className={`w-full mx-auto container ${className}`}
            data-section={id}
            id={id}
        >
            {children}
        </section>
    );
}
