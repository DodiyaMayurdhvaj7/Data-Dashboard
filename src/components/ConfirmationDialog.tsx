import { Icon } from "@iconify/react/dist/iconify.js";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import { SlideTransition } from "./dialog.utils";

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemType: string;
  itemName?: string;
  operation:
    | "delete"
    | "block/unblock"
    | "restore"
    | "emptyTrash"
    | "disableTwoFactorAuth";
  accountStatus?: "active" | "suspended";
  title?: string;
  description?: string;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  itemType,
  itemName,
  operation,
  accountStatus,
  title,
  description,
  loading = false,
}: ConfirmationDialogProps) => {
  let defaultTitle = "";
  let defaultQuestion = "";
  let defaultCaution = "";
  let confirmButtonText = "";
  let icon = "ri-alert-line";
  let confirmColor:
    | "primary"
    | "error"
    | "secondary"
    | "inherit"
    | "success"
    | "info"
    | "warning" = "primary";

  if (operation === "delete") {
    defaultTitle = title || "Confirm Delete";
    defaultQuestion =
      description ||
      `Are you sure you want to delete ${itemName || `this ${itemType}`}?`;
    defaultCaution = `This action cannot be undone and will permanently delete ${
      itemName ? itemName : `this ${itemType}`
    } from the system.`;
    confirmButtonText = loading ? "Deleting..." : "Delete";
    icon = "mdi:delete";
    confirmColor = "error";
  } else if (operation === "block/unblock") {
    const computedAction =
      accountStatus?.toLowerCase() === "active" ? "Block" : "Unblock";
    defaultTitle = title || `Confirm ${computedAction}`;
    defaultQuestion =
      description ||
      `Are you sure you want to ${computedAction.toLowerCase()} ${
        itemName || `this ${itemType}`
      }?`;
    confirmButtonText = loading
      ? accountStatus?.toLowerCase() === "active"
        ? "Blocking..."
        : "Unblocking..."
      : computedAction;
    icon = accountStatus === "active" ? "mdi:lock-open" : "mdi:lock";
    confirmColor = accountStatus === "active" ? "primary" : "error";
  } else if (operation === "restore") {
    defaultTitle = title || "Restore Item";
    defaultQuestion =
      description ||
      `Are you sure you want to restore ${itemName || `this ${itemType}`}?`;
    defaultCaution = `This action will bring back ${
      itemName ? itemName : `this ${itemType}`
    } to its previous state.`;
    confirmButtonText = loading ? "Restoring..." : "Restore";
    icon =
      itemType === "file"
        ? "mdi:file-restore"
        : itemType === "folder"
          ? "mdi:folder-restore"
          : "mdi:restore";
    confirmColor = "primary";
  } else if (operation === "emptyTrash") {
    defaultTitle = title || "Empty Trash";
    defaultQuestion =
      description ||
      `Are you sure you want to empty the trash? This action will permanently delete all items in the trash?`;
    defaultCaution = `This action cannot be undone.`;
    confirmButtonText = loading ? "Emptying..." : "Empty Trash";
    icon = "mdi:delete-forever";
    confirmColor = "error";
  } else if (operation === "disableTwoFactorAuth") {
    defaultTitle = title || "Disable Two-Factor Authenticatio n";
    defaultQuestion =
      description ||
      "Are you sure you want to disable two-factor authentication?";
    confirmButtonText = loading ? "Disabling..." : "Disable";
    icon = "mdi:lock-open";
    confirmColor = "error";
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      PaperProps={{ className: "min-w-[350px]" }}
      TransitionComponent={SlideTransition}
    >
      <DialogTitle id="confirmation-dialog-title">
        <div className="flex items-center gap-2">
          <Icon icon={icon} fontSize={32} />
          <Typography variant="h5">{defaultTitle}</Typography>
        </div>
      </DialogTitle>
      <DialogContent className="px-6 py-4" dividers>
        <DialogContentText color="text.primary">
          {defaultQuestion}
        </DialogContentText>
        {defaultCaution && (
          <DialogContentText mt={1} color="red">
            {defaultCaution}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions className="px-6 py-4">
        {!loading && (
          <Button
            onClick={onClose}
            variant="outlined"
            className="min-w-[100px] font-medium"
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={() => {
            onConfirm();
            /*  onClose(); */
          }}
          variant="contained"
          color={confirmColor}
          disabled={loading}
          autoFocus
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <i className="ri-loader-4-line animate-spin" />
              <span>{confirmButtonText}</span>
            </div>
          ) : (
            confirmButtonText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
