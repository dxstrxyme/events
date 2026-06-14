import { useEventsStore } from "@/stores/events-store";
import { useNavigate } from "react-router-dom"
import { EventForm } from "./event-form";

type Props = {
    className?: string
}

export function EventCreateForm({ className }: Props) {
    const navigate = useNavigate();
    const createEvent = useEventsStore(s => s.createEvent);
    const mutationLoading = useEventsStore(s => s.mutationLoading);
    const eventsError = useEventsStore(s => s.eventsError);

    return (
        <EventForm
            className={className}
            title="Create event"
            subtitle="Заполните поля события"
            backTo="/events"
            backLabel="back"
            cancelTo="/events"
            submitLabel="Create event"
            submittingLabel="Creating..."
            error={eventsError}
            loading={mutationLoading}
            onSubmit={async (values) => {
                const created = await createEvent(values);
                navigate(`/events/${created.id}`, { replace: true })
            }}
        />
    )
}