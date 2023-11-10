"use client";

import { Movie, get_movie } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: number }}) {
    let ignore = false;
    const [movie, set_movie] = useState(undefined as Movie | null | undefined);

    useEffect(() => {
        get_movie(params.id)
            .then((movie) => {
                if (!ignore) set_movie(movie);
            });

        return () => { ignore = true; };
    }, []);

    if (movie === undefined) return <h1>Loading...</h1>;
    else if (movie === null) return <h1>Movie Not Found!</h1>;
    return (
        <>
            <h1>Name: {movie.name}</h1>
            <h1>Release Date: {movie.release.toDateString()}</h1>
        </>
    );
}