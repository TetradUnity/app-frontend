'use client'

import { AuthService } from "@/services/auth.service"

export default function StudentHomePage() {
    return (
        <div>
            <h1>Головна сторінка для студента</h1>
            <p>Вміст.</p>
            <button onClick={() => {
                AuthService.login("sdjfn@gmail.com", "password")
            }}>make request.</button>
        </div>
    )
}