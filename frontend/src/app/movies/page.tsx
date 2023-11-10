"use client";

import { MovieSummary, get_movies } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
    let ignore = false;
    const [movies, set_movies] = useState(null as MovieSummary[] | null);

    useEffect(() => {
        get_movies()
            .then((movies) => {
                if (!ignore) set_movies(movies);
            });

        return () => { ignore = true; };
    }, []);

    return (
        <>
            {
                movies ?
                    movies.map((summary) => (
                        <div key={summary.id}>
                            <Link key={summary.id} href={"/movies/" + summary.id.toString()} prefetch={false}>{summary.name}</Link>
                            <br />
                        </div>
                    )) : <h1>Loading!</h1>
            }
        </>
    );
}