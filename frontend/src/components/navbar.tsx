"use client";

import { useUserInfo } from "@/providers/auth_provider";
import styles from "./navbar.module.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
    const pathname = usePathname();
    const [user_info, , logout] = useUserInfo();

    return (
        <nav className={styles.navbar}>
            <h1>Movie Theatre</h1>
            <div>
                { 
                    user_info ? 
                        <a href="javascript:void" onClick={logout}>Logout</a> :
                        pathname !== "/login" ? <Link href="/login">Login</Link> : null
                }
            </div>
        </nav>
    );
}