import type { ReactNode } from "react"

type Props = {
    title: string
    children?: ReactNode
}


export function PageSHell({ title, children }: Props) {
    return (
        <section className="w-full min-w 0">
            <h1 className="mb-2 font-heading text-2x1 font-semibold tracking-tight">
                {title}
            </h1>
            {children}
        </section>
    )
}