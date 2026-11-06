import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Pagination } from './Pagination'

const meta = {
    title: 'Design System/Components/Navigation/Pagination',
    component: Pagination,
    args: { page: 1, totalPages: 1, onPageChange: () => {} },
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'Page navigation controlled by `page` and `onPageChange`. Set `showPageNumbers` to render numbered buttons, and `label` to name the navigation landmark. The current page is announced through a polite live region rather than `aria-current` on the status text.',
            },
        },
    },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

const PaginationExample = (props: { showPageNumbers?: boolean }) => {
    const [page, setPage] = useState(2)
    return (
        <Pagination
            page={page}
            totalPages={5}
            onPageChange={setPage}
            showPageNumbers={props.showPageNumbers}
            label="Transactions pagination"
        />
    )
}

export const Default: Story = {
    render: () => <PaginationExample />,
}

export const WithPageNumbers: Story = {
    render: () => <PaginationExample showPageNumbers />,
}

export const SinglePage: Story = {
    args: { page: 1, totalPages: 1, onPageChange: () => {} },
}
