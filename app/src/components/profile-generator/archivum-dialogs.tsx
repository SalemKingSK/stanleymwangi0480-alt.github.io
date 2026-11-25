import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import type { StoredSoul } from "./archivum-ui";

const contentStyle: React.CSSProperties = {
  background: "rgba(9,16,35,0.98)",
  border: "1px solid rgba(200,168,75,0.3)",
  color: "rgb(226,232,240)",
};

/** Accessible replacement for `confirm("Delete …?")`. */
export function DeleteSoulDialog({
  record,
  onCancel,
  onConfirm,
}: {
  record: StoredSoul | null;
  onCancel: () => void;
  onConfirm: (record: StoredSoul) => void;
}) {
  return (
    <AlertDialog open={record !== null} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent style={contentStyle} className="w-[92%] rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-cinzel text-primary">Delete from the Archivum?</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300">
            {record ? `${record.name} will be removed from this device. This can't be undone unless you have an export.` : ""}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent text-slate-200">Keep</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-700 text-white hover:bg-red-600"
            onClick={() => record && onConfirm(record)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/** Accessible replacement for `prompt("Rename this soul:")`. */
export function RenameSoulDialog({
  record,
  onCancel,
  onConfirm,
}: {
  record: StoredSoul | null;
  onCancel: () => void;
  onConfirm: (record: StoredSoul, name: string) => void;
}) {
  const [value, setValue] = React.useState("");
  React.useEffect(() => {
    if (record) setValue(record.name);
  }, [record]);
  const trimmed = value.trim();
  const canSave = !!record && trimmed.length > 0 && trimmed !== record.name;
  const submit = () => {
    if (record && canSave) onConfirm(record, trimmed);
  };
  return (
    <AlertDialog open={record !== null} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent style={contentStyle} className="w-[92%] rounded-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="grid gap-4"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-cinzel text-primary">Rename this soul</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-300">
              Only the display name changes. The birth date and reading stay the same.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            autoFocus
            aria-label="New name"
            value={value}
            maxLength={120}
            onChange={(e) => setValue(e.target.value)}
            className="bg-white/5 text-slate-100"
          />
          <AlertDialogFooter>
            <AlertDialogCancel type="button" className="bg-transparent text-slate-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={!canSave} onClick={(e) => { e.preventDefault(); submit(); }}>
              Save
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
