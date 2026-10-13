import React, { useEffect } from "react";
import { X } from "lucide-react";
import { IconButton } from "./Button";

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "520px",
  className = "",
  footer,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
        padding: "var(--dm-space-4)",
        backgroundColor: "rgba(15, 18, 16, 0.55)",
        backdropFilter: "blur(6px)",
        animation: "dmFadeIn 150ms ease forwards",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "100%",
          maxWidth: maxWidth,
          backgroundColor: "var(--dm-surface)",
          borderRadius: "var(--dm-radius-lg)",
          border: "1px solid var(--dm-border)",
          boxShadow: "var(--dm-shadow-lg)",
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          animation: "dmScaleUp 180ms ease forwards",
        }}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "var(--dm-space-5)",
            borderBottom: "1px solid var(--dm-border)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "var(--dm-space-3)",
          }}
        >
          <div>
            {title && (
              <h3 style={{ fontSize: "var(--dm-text-md)", fontWeight: "var(--dm-weight-semibold)" }}>
                {title}
              </h3>
            )}
            {subtitle && (
              <p style={{ fontSize: "var(--dm-text-xs)", color: "var(--dm-text-muted)", marginTop: "2px" }}>
                {subtitle}
              </p>
            )}
          </div>
          <IconButton icon={X} size="sm" onClick={onClose} title="Close modal" />
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: "var(--dm-space-5)",
          }}
        >
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div
            style={{
              padding: "var(--dm-space-4) var(--dm-space-5)",
              borderTop: "1px solid var(--dm-border)",
              backgroundColor: "var(--dm-surface-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "var(--dm-space-3)",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
