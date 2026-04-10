import Swal from "sweetalert2";

const popup = Swal.mixin({
  background: "#111827",
  color: "#f9fafb",
  confirmButtonColor: "#4f46e5",
  cancelButtonColor: "#6b7280",
  reverseButtons: true,
});

export const showSuccessPopup = (title, text = "") =>
  popup.fire({
    icon: "success",
    title,
    text,
  });

export const showErrorPopup = (title, text = "") =>
  popup.fire({
    icon: "error",
    title,
    text,
  });

export const showWarningPopup = (title, text = "") =>
  popup.fire({
    icon: "warning",
    title,
    text,
  });

export const confirmPopup = async ({
  title,
  text = "",
  confirmButtonText = "Yes",
  cancelButtonText = "Cancel",
  icon = "question",
}) => {
  const result = await popup.fire({
    icon,
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
  });

  return result.isConfirmed;
};

export const promptPopup = async ({
  title,
  text = "",
  inputValue = "",
  inputPlaceholder = "",
  confirmButtonText = "Save",
  cancelButtonText = "Cancel",
}) => {
  const result = await popup.fire({
    title,
    text,
    input: "text",
    inputValue,
    inputPlaceholder,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    inputValidator: (value) => {
      if (!value || !value.trim()) {
        return "Please enter a value.";
      }
      return undefined;
    },
  });

  if (!result.isConfirmed) return null;
  return String(result.value || "").trim();
};
