import { type Circuit } from "@/types/f1"
import CircuitContainer from "@/components/schedule/circuit-container"

type ScheduleProps = {
    circuits: Circuit[]
}

const Schedule = ({ circuits }: ScheduleProps) => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='flex flex-col items-center justify-center gap-y-4 p-4'>
                <h2 className='text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-200 font-f1-wide'>
                    F1 2026 Calendar
                </h2>
                <p className='text-center text-md lg:text-lg max-w-3xl font-bold text-neutral-300 font-f1-regular'>
                    Know all the F1 races of the 2026 Grand Prix calendar
                    where you will find results, reports and complete details
                    of the F1 calendar.
                </p>
            </div>

            <div className='h-[2px] w-full bg-gradient-to-r from-transparent via-[#f41d00]/60 to-transparent mb-8'>
            </div>

            <CircuitContainer circuits={circuits} />
        </div>
    )
}

export default Schedule 