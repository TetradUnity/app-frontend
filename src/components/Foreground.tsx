'use client';

export default function Foreground({children, className} : {children: React.ReactNode, className?: string}) {
    return (
        <div
        className={className}
        style={{
            margin: "auto",
            marginBottom: "var(--gap)",
            padding: "12px 16px",
            background: 'var(--foreground)',
            borderRadius: 10,
            boxShadow: "10px 10px 78px -19px rgba(20,20,20,0.9)",
            display: "block",
        }}>{children}
        </div>);
}