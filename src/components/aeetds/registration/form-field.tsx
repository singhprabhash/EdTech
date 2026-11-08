"use client";
import type {
  RegistrationErrors,
  RegistrationValues,
} from "../../../domain/registration";
export type RegistrationTextKey = Exclude<keyof RegistrationValues, "policy">;
export type RegistrationFieldProps = {
  values: RegistrationValues;
  errors: RegistrationErrors;
  update: (name: RegistrationTextKey, value: string) => void;
};
export default function RegistrationField({
  name,
  label,
  options,
  type = "text",
  required = false,
  help,
  autoComplete,
  ...props
}: {
  name: RegistrationTextKey;
  label: string;
  options?: readonly string[];
  type?: string;
  required?: boolean;
  help?: string;
  autoComplete?: string;
} & RegistrationFieldProps) {
  const id = `registration-${name}`;
  const error = props.errors[name];
  const common = {
    id,
    name,
    required,
    value: props.values[name],
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby":
      [help ? `${id}-help` : "", error ? `${id}-error` : ""]
        .filter(Boolean)
        .join(" ") || undefined,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => props.update(name, event.target.value),
  };
  return (
    <div className="registration-field">
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {options ? (
        <select {...common}>
          <option value="">
            {required ? "Select an option" : "Not specified"}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={type}
          maxLength={250}
          inputMode={name === "amountPaid" ? "decimal" : undefined}
        />
      )}{" "}
      {help && (
        <p
          id={`${id}-help`}
          className="mt-2 text-body-sm text-on-surface-variant"
        >
          {help}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="registration-error">
          {error}
        </p>
      )}
    </div>
  );
}
