"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  documentRules,
  type DocumentKind,
  type MembershipErrors,
  type MembershipValues,
} from "../../../domain/membership";
import { Icon } from "../ui";
export type TextFieldName = Exclude<keyof MembershipValues, "declaration">;
export type FieldProps = {
  values: MembershipValues;
  errors: MembershipErrors;
  update: (name: TextFieldName, value: string) => void;
};
export function Field({
  name,
  label,
  values,
  errors,
  update,
  options,
  type = "text",
  multiline = false,
  autoComplete,
}: {
  name: TextFieldName;
  label: string;
  options?: readonly string[];
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
} & FieldProps) {
  const id = `membership-${name}`;
  const error = errors[name];
  const common = {
    id,
    name,
    required: true,
    value: values[name],
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
    onChange: (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => update(name, event.target.value),
    autoComplete,
  };
  return (
    <div className="membership-field">
      <label htmlFor={id}>
        {label} <span aria-hidden="true">*</span>
      </label>
      {options ? (
        <select {...common}>
          <option value="">Select {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea {...common} rows={4} maxLength={2000} />
      ) : (
        <input {...common} type={type} maxLength={250} />
      )}
      {error && (
        <p id={`${id}-error`} className="membership-error">
          {error}
        </p>
      )}
    </div>
  );
}
export function UploadField({
  kind,
  file,
  error,
  onSelect,
  onRemove,
}: {
  kind: DocumentKind;
  file: File | null;
  error?: string;
  onSelect: (kind: DocumentKind, file: File) => void;
  onRemove: (kind: DocumentKind) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ file: File; url: string } | null>(
    null,
  );
  const rule = documentRules[kind];
  const id = `membership-${kind}`;
  useEffect(() => {
    if (!file || kind !== "photo" || !URL.createObjectURL) return;
    const url = URL.createObjectURL(file);
    // This state synchronizes a browser-owned URL; cleanup revokes the resource.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview({ file, url });
    return () => URL.revokeObjectURL(url);
  }, [file, kind]);
  return (
    <div className="membership-upload">
      <div className="flex items-start gap-3">
        <span className="membership-icon shrink-0">
          <Icon name={kind === "photo" ? "add_a_photo" : "upload_file"} />
        </span>
        <div className="min-w-0">
          <label htmlFor={id} className="block font-semibold">
            {rule.label} <span aria-hidden="true">*</span>
          </label>
          <p
            id={`${id}-help`}
            className="mt-1 text-body-sm text-on-surface-variant"
          >
            {rule.formats} · Maximum {rule.megabytes} MB
          </p>
        </div>
      </div>
      <input
        ref={input}
        id={id}
        type="file"
        name={kind}
        required
        accept={rule.accept}
        aria-invalid={error ? true : undefined}
        aria-describedby={`${id}-help${error ? ` ${id}-error` : ""}`}
        className="mt-4 block w-full min-w-0"
        onChange={(event) => {
          const selected = event.target.files?.[0];
          if (selected) onSelect(kind, selected);
          event.target.value = "";
        }}
      />
      {file && (
        <div className="mt-4">
          <p className="membership-file-name">
            <Icon
              name="description"
              className="shrink-0 text-[18px] text-secondary"
            />
            <span>{file.name}</span>
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              className="membership-text-button"
              onClick={() => input.current?.click()}
            >
              Replace {rule.label.toLowerCase()}
            </button>
            <button
              type="button"
              className="membership-text-button"
              onClick={() => onRemove(kind)}
            >
              Remove {rule.label.toLowerCase()}
            </button>
          </div>
          {preview?.file === file && kind === "photo" && preview && (
            <LocalImagePreview url={preview.url} />
          )}
        </div>
      )}
      {error && (
        <p id={`${id}-error`} className="membership-error mt-3">
          {error}
        </p>
      )}
    </div>
  );
}
function LocalImagePreview({ url }: { url: string }) {
  return (
    <Image
      unoptimized
      src={url}
      width={96}
      height={112}
      alt="Selected passport photograph preview"
      className="mt-3 h-28 w-24 rounded object-cover"
    />
  );
}
