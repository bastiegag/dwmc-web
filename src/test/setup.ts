import '@testing-library/jest-dom'
import 'vitest-axe/extend-expect'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, afterAll, expect, vi } from 'vitest'
import * as axeMatchers from 'vitest-axe/matchers'
import { server } from './mocks/server'

expect.extend(axeMatchers)

beforeAll(() => {
    const originalGetComputedStyle = window.getComputedStyle

    vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElement) => {
        if (pseudoElement) return originalGetComputedStyle(element)
        return originalGetComputedStyle(element, pseudoElement)
    })

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function (
        this: HTMLCanvasElement,
        contextId: string,
    ) {
        if (contextId !== '2d') return null

        return {
            canvas: this,
            measureText: () => ({ width: 10 }),
            fillText: vi.fn(),
            clearRect: vi.fn(),
            getImageData: (_x: number, _y: number, width: number, height: number) => ({
                data: new Uint8ClampedArray(Math.ceil(width) * Math.ceil(height) * 4).fill(255),
            }),
        } as unknown as CanvasRenderingContext2D
    })
    server.listen({ onUnhandledRequest: 'error' })
})
afterEach(() => {
    cleanup()
    server.resetHandlers()
})
afterAll(() => {
    vi.restoreAllMocks()
    server.close()
})
