import type React from "react"

export const Button = ({ onClick , children, className}: {onClick : () => void, children: React.ReactNode , className?: string}) => {
    return <button onClick = {onClick} className={`bg-green-600 text-white px-6 py-3 text-lg rounded hover:bg-green-800 ${className}`}>
        {children}
    </button>
}