import type React from "react"

export const Button = ({ onClick , children}: {onClick : () => void, children: React.ReactNode }) => {
    return <button onClick = {onClick} className={`bg-green-600 text-white px-6 py-3 text-lg rounded hover:bg-green-800`}>
        {children}
    </button>
}