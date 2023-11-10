"use client";

import { ShowingSummary, get_showings } from "@/lib/api";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Page() {
    let ignore = false;
    const [showings, set_showings] = useState(null as ShowingSummary[] | null);

    useEffect(() => {
        get_showings()
            .then((showings) => {
                if (!ignore) set_showings(showings);
            });

        return () => { ignore = true; };
    }, []);

    if (showings === null) return <h1>Loading...</h1>;
    
    return (
        <>
            {
                showings.map((summary) => (
                    <Link key={summary.id} href={`/showings/${summary.id}`}>
                        <h1>Movie: {summary.movie.name}</h1>
                        <h1>Starts: {summary.start_at.toString()}</h1>
                        <h1>Ends: {summary.end_at.toString()}</h1>
                        <h1>Screen: {summary.screen_id.toString()}</h1>
                        <hr />
                    </Link>
                ))
            }
        </>
    );
}