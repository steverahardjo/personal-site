import React, { useEffect, useState } from "react";
import { ExternalLink, Code } from "lucide-react";

type Props = {
  title: string;
  description: string;
  link: string;
  children: React.ReactNode;
};

export default function PopupModal({
  title,
  description,
  link,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Trigger */}
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
      >
        {children}
      </div>

      {/* Modal */}
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Header bar (IDE style) */}
            <div className="modal-header-bar" />

            {/* Body */}
            <div className="modal-body">
              <h2 className="modal-title">{title}</h2>

              <p className="modal-description">{description}</p>
            </div>

            {/* Footer */}
            <div className="modal-footer-bar">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-button"
              >
                <Code size={18} />
                <span>Read my blog</span>
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
