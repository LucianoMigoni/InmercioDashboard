// Cartel para confirmar una accion

import { type ReactNode } from "react";
import { Button } from "./ui/button";
import { Modal } from "./dashboard/Modal";

export function ConfirmDialog({
  title,
  children,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "default",
  onConfirm,
  onCancel,
}: {
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  // Color del boton de confirmar
  variant?: "default" | "destructive";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      maxWidth="max-w-sm"
      footer={
        <>
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "primary"}
            className="flex-1"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="px-5 pb-5">
        <div className="text-sm text-[#404040] leading-relaxed">{children}</div>
      </div>
    </Modal>
  );
}
