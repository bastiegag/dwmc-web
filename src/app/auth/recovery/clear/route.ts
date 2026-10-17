import { NextResponse } from 'next/server'

export async function POST() {
    const response = new NextResponse(null, { status: 204 })
    response.cookies.set('dwmc-recovery', '', {
        httpOnly: true,
        maxAge: 0,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
    })
    return response
}
