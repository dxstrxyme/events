import { http } from "./http";
import type { CreateEventRequest, EventDto, JoinEventResponse, UpdateEventsRequest } from "./types";

export const eventsApi = {
    async list(): Promise<EventDto[]> {
        const { data } = await http.get<EventDto[]>('/events')
        return data
    },
    async getById(id: string): Promise<EventDto> {
        const { data } = await http.get<EventDto>(`/events/${id}`)
        return data
    },
    async create(payload: CreateEventRequest): Promise<EventDto> {
        const { data } = await http.post<EventDto>(`/events`, payload);
        return data
    },
    async update(id: string, payload: UpdateEventsRequest): Promise<EventDto> {
        const { data } = await http.patch<EventDto>(`/events/${id}`, payload);
        return data
    },
    async remove(id: string): Promise<void> {
        await http.delete(`/events/${id}`)
    },
    async join(id: string): Promise<JoinEventResponse> {
        const { data } = await http.post<JoinEventResponse>(`/events/${id}/join`);
        return data
    },
    async leave(id: string): Promise<void> {
        await http.delete(`/events/${id}/join`)
    }
}