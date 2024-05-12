'use client'

export default function Foreground({children} : {children: React.ReactNode}) {
    return (
        <div style={{
            margin: "auto",
            padding: "12px 16px",
            background: 'var(--foreground)',
            borderRadius: 10,
            boxShadow: "10px 10px 78px -19px rgba(20,20,20,0.9)",
            display: "block",
        }}>{children}
        </div>);
}