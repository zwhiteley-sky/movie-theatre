"use client";

import { Showing, book_showing, get_showing } from "@/lib/api";
import { useUserInfo } from "@/providers/auth_provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: number }}) {
    let ignore = false;
    const router = useRouter();
    const [showing, set_showing] = useState(undefined as Showing | null | undefined);
    const [user_info, , logout] = useUserInfo();
    const [selected_seats, set_selected_seats] = useState({} as any);

    useEffect(() => {
        get_showing(params.id)
            .then((showing) => {
                if (!ignore) set_showing(showing);
            });

        return () => { ignore = true; };
    }, []);

    async function book() {
        let seat_ids = [];

        for (const seat_id in selected_seats) {
            if (selected_seats[seat_id]) 
                seat_ids.push(Number(seat_id));
        }
    
        const result = await book_showing(user_info!.token, params.id, seat_ids);

        if (result === "invalid-token") logout();
        router.refresh();
    }

    if (showing === undefined) return <h1>Loading...</h1>;
    else if (showing === null) return <h1>Showing Not Found!</h1>;
    if (!user_info || showing.available_seats.length === 0) return (
        <>
            <h1>Movie: {showing.movie.name}</h1>
            <h1>Starts: {showing.start_at.toString()}</h1>
            <h1>Ends: {showing.end_at.toString()}</h1>
            <h1>Screen: {showing.screen_id.toString()}</h1>
        </>
    );

    return (
        <>
            <h1>Movie: {showing.movie.name}</h1>
            <h1>Starts: {showing.start_at.toString()}</h1>
            <h1>Ends: {showing.end_at.toString()}</h1>
            <h1>Screen: {showing.screen_id.toString()}</h1>
            {
                showing.available_seats.map((seat) => (
                    <button key={seat.id} style={{
                        color: selected_seats[seat.id.toString()] ? "green": "black"
                    }} onClick={() => {
                        const previous = (selected_seats[seat.id.toString()] ?? false) != false;

                        set_selected_seats({
                            ...selected_seats,
                            [seat.id.toString()]: !previous
                        });
                    }}>{seat.name}</button>
                ))
            }
            <button onClick={book}>Book!</button>
        </>
    );
}