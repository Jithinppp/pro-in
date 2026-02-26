// Button component
function Button({ children, onClick, variant = "primary", ...props }) {
    const baseStyle = {
        padding: "8px 16px",
        borderRadius: "4px",
        cursor: "pointer",
        border: "none",
        fontSize: "14px",
    };

    const variants = {
        primary: { backgroundColor: "#007bff", color: "white" },
        secondary: { backgroundColor: "#6c757d", color: "white" },
        outline: { backgroundColor: "transparent", border: "1px solid #007bff", color: "#007bff" },
    };

    return (
        <button
            onClick={onClick}
            style={{ ...baseStyle, ...variants[variant] }}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
