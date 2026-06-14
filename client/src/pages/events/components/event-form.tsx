import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { cn, DATETIME_LOCAL_INPUT_FORMAT } from "@/lib/utils"
import type { CreateEventRequest } from "@/shared/api/types"
import { formatISO, isValid, parse } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { useState, type SubmitEvent } from "react"
import { Link, useNavigate } from "react-router-dom"

type EventFormValues = CreateEventRequest


type Props = {
    title: string
    subtitle: string
    backTo: string
    backLabel: string
    cancelTo: string
    submitLabel: string
    submittingLabel: string
    onSubmit: (values: EventFormValues) => Promise<void>
    inputValues?: EventFormValues
    error?: string
    loading?: boolean
    className?: string
}

export function EventForm({
    title,
    subtitle,
    backTo,
    backLabel,
    cancelTo,
    submitLabel,
    submittingLabel,
    inputValues,
    error,
    loading,
    className,
    onSubmit
}: Props) {
    const navigate = useNavigate();
    const [capacity, setCapacity] = useState(inputValues?.capacity ?? 50);
    const [clientError, setClientError] = useState<string | null>(null);

    const topError = clientError ?? error

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setClientError(null)
        const form = event.currentTarget;
        const formData = new FormData(form);
        const title = String(formData.get('title') ?? '').trim();
        const description = String(formData.get('description') ?? '').trim();
        const address = String(formData.get('address') ?? '').trim();
        const startedAtRaw = String(formData.get('startedAt') ?? '').trim();
        const startedAtParsed = parse(
            startedAtRaw,
            DATETIME_LOCAL_INPUT_FORMAT,
            new Date()
        )
        const startedAt = isValid(startedAtParsed) ?
            formatISO(startedAtParsed) :
            null
        if (!startedAt) {
            setClientError('Укажите корректную дату')
            return
        }
        await onSubmit({
            title,
            description,
            capacity,
            address,
            startedAt
        })
    }

    return (
        <div className={cn('mx-auto w-full max-w-2xl space-y-6', className)}>
            <div className="space-y-1">
                <Button variant={'ghost'} size="sm" asChild>
                    <Link to={backTo}>
                        <ArrowLeft className="size-4" />
                        {backLabel}
                    </Link>
                </Button>
                <h1 className="font-heading text-2xl font-semibold">{title}</h1>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6 pt-6">
                        {
                            topError && (
                                <p className="text-sm text-destructive">
                                    {topError}
                                </p>
                            )
                        }
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="title">Name</FieldLabel>
                                <Input
                                    id="title"
                                    name="title"
                                    defaultValue={inputValues?.title}
                                    placeholder="До 200 символов"
                                    maxLength={200}
                                    required
                                    disabled={loading} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <Textarea
                                    id="description"
                                    name="description"
                                    defaultValue={inputValues?.description}
                                    placeholder="Не пустое значение"
                                    rows={5}
                                    required
                                    disabled={loading} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="description">Date and started at</FieldLabel>
                                <Input
                                    id="startedAt"
                                    name="startedAt"
                                    type="datetime-local"
                                    defaultValue={inputValues?.startedAt}
                                    placeholder="Не пустое значение"
                                    required
                                    disabled={loading} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="address">Address</FieldLabel>
                                <Input
                                    id="address"
                                    name="address"
                                    defaultValue={inputValues?.address}
                                    placeholder="До 255 символов"
                                    maxLength={255}
                                    required
                                    disabled={loading} />
                            </Field>
                            <Field>
                                <div className="flex items-center justify-between gap-4">
                                    <FieldLabel htmlFor="capacity-slider"
                                        className="inline-flex items-center gap-2">
                                        Вместимость
                                    </FieldLabel>
                                    <span className="text-sm text-muted-foreground tabular-nums">
                                        {capacity}
                                    </span>
                                </div>
                                <Slider
                                    id="capacity-slider"
                                    className="mb-4"
                                    min={1}
                                    max={300}
                                    step={1}
                                    value={[capacity]}
                                    onValueChange={v => setCapacity(v[0] ?? 1)}
                                    disabled={loading} />
                            </Field>
                        </FieldGroup>
                    </CardContent>
                    <CardFooter className="justify-end gap-2 border-t">
                        <Button
                            variant="ghost"
                            type="button"
                            disabled={loading}
                            onClick={() => navigate(cancelTo)}>
                            Отмена
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? submittingLabel : submitLabel}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}