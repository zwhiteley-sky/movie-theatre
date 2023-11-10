import { get_endpoint } from "./utils";

export type MovieSummary = {
    id: number,
    name: string
};

export type Movie = {
    id: number,
    name: string,
    release: Date
};

export async function get_movies(): Promise<MovieSummary[]> {
    const response = await fetch(get_endpoint("/movies"));

    if (response.status !== 200) throw new Error("get movies failed");

    return await response.json() as MovieSummary[];
}

export async function get_movie(id: number): Promise<Movie | null> {
    const response = await fetch(get_endpoint(`/movies/${id}`));

    if (response.status === 404) {
        return null;
    }

    if (response.status !== 200) throw new Error("get movie failed");

    const body = await response.json();
    console.log(body);
    return {
        ...body,
        release: new Date(body.release)
    };
}