// Reusable Button component
function Button({
    children,
    onClick,
    variant = "primary",
    type = "button",
    disabled = false,
    className = "",
    ...props
}) {
    const baseStyles = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0.5rem 1rem",
        fontSize: "0.875rem",
        fontWeight: "500",
        borderRadius: "0.375rem",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        border: "none",
        outline: "none",
    };

    const variants = {
        primary: {
            backgroundColor: "#2563eb",
            color: "white",
        },
        secondary: {
            backgroundColor: "transparent",
            color: "#374151",
            border: "1px solid #d1d5db",
        },
    };

    const disabledStyles = {
        opacity: "0.5",
        cursor: "not-allowed",
    };

    const variantStyles = variants[variant] || variants.primary;
    const finalStyles = {
        ...baseStyles,
        ...variantStyles,
        ...(disabled ? disabledStyles : {}),
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={finalStyles}
            className={className}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
