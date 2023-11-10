import { MovieSummary } from ".";
import { get_endpoint } from "./utils";

export type ShowingSummary = {
    id: number,
    screen_id: number,
    movie: MovieSummary,
    start_at: Date,
    end_at: Date,
};

export type Showing = {
    id: number,
    screen_id: number,
    movie: MovieSummary,
    start_at: Date,
    end_at: Date,
    available_seats: Seat[]
};

export type Seat = {
    id: number,
    name: string
};

export async function get_showings(): Promise<ShowingSummary[]> {
    const response = await fetch(get_endpoint("/showings"));

    if (response.status !== 200) throw new Error("could not get showings");

    const body = await response.json();
    return body.map((summary: any) => {
        return {
            ...summary,
            start_at: new Date(summary.start_at),
            end_at: new Date(summary.end_at)
        };
    });
}

export async function get_showing(id: number): Promise<Showing | null> {
    const response = await fetch(get_endpoint(`/showings/${id}`));

    if (response.status !== 200) return null;

    const body = await response.json();
    return {
        ...body,
        start_at: new Date(body.start_at),
        end_at: new Date(body.end_at)
    };
}

export type BookResult = "success" | 
    "invalid-token" |
    "not-found" | 
    "already-booked" |
    "showing-shown";

export async function book_showing(token: string, id: number, seat_ids: number[]): Promise<BookResult> {
    const response = await fetch(get_endpoint(`/showings/${id}/book`), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            seats: seat_ids
        })
    });

    if (response.status === 401) return "invalid-token";
    if (response.status === 404) return "not-found";

    if (response.status === 403) {
        const body = await response.json();

        if (body.error_code === 2) return "showing-shown";
        if (body.error_code === 3) return "already-booked";

        throw new Error("unknown book showing error");
    }

    if (response.status !== 204)
        throw new Error("unknown book showing error");

    return "success";
}