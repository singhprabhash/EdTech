"use client";
import {
  disciplines,
  qualifications,
  paymentNote,
} from "../../../content/aeetds-membership";
import {
  publicCategories,
  type DocumentKind,
  type MembershipDocuments,
} from "../../../domain/membership";
import { Field, UploadField, type FieldProps } from "./form-fields";
export function MembershipDetailsStep(props: FieldProps) {
  return (
    <div className="membership-fields-grid">
      <Field
        {...props}
        name="category"
        label="Membership category"
        options={publicCategories}
      />
      <Field
        {...props}
        name="designation"
        label="Designation"
        autoComplete="organization-title"
      />
      <Field
        {...props}
        name="institution"
        label="Institution / organisation"
        autoComplete="organization"
      />
      <Field
        {...props}
        name="qualification"
        label="Highest qualification"
        options={qualifications}
      />
      {props.values.qualification === "Other" && (
        <Field
          {...props}
          name="otherQualification"
          label="Other qualification"
        />
      )}
      <Field
        {...props}
        name="discipline"
        label="Discipline / specialisation"
        options={disciplines}
      />
      {props.values.discipline === "Other" && (
        <Field
          {...props}
          name="otherDiscipline"
          label="Other discipline / specialisation"
        />
      )}
    </div>
  );
}
export function ApplicantDetailsStep(props: FieldProps) {
  return (
    <div className="membership-fields-grid">
      <Field
        {...props}
        name="title"
        label="Title"
        options={["Dr.", "Prof.", "Mr.", "Ms."]}
        autoComplete="honorific-prefix"
      />
      <Field {...props} name="fullName" label="Full name" autoComplete="name" />
      <Field
        {...props}
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
      />
      <Field
        {...props}
        name="mobile"
        label="Mobile (WhatsApp)"
        type="tel"
        autoComplete="tel"
      />
      <Field
        {...props}
        name="dateOfBirth"
        label="Date of birth"
        type="date"
        autoComplete="bday"
      />
      <Field
        {...props}
        name="nationality"
        label="Nationality"
        options={["India", "Other"]}
      />
      {props.values.nationality === "Other" && (
        <Field {...props} name="otherNationality" label="Nationality details" />
      )}
      <div className="md:col-span-2">
        <Field
          {...props}
          name="address"
          label="Postal address"
          multiline
          autoComplete="street-address"
        />
      </div>
      <Field
        {...props}
        name="postalCode"
        label="PIN / postal code"
        autoComplete="postal-code"
      />
    </div>
  );
}
export type UploadProps = {
  documents: MembershipDocuments;
  selectFile: (kind: DocumentKind, file: File) => void;
  removeFile: (kind: DocumentKind) => void;
};
export function MembershipDocumentsStep({
  values,
  errors,
  documents,
  selectFile,
  removeFile,
}: FieldProps & UploadProps) {
  return (
    <div className="space-y-5">
      <UploadField
        kind="photo"
        file={documents.photo}
        error={errors.photo}
        onSelect={selectFile}
        onRemove={removeFile}
      />
      {values.category === "Student" && (
        <UploadField
          kind="studentProof"
          file={documents.studentProof}
          error={errors.studentProof}
          onSelect={selectFile}
          onRemove={removeFile}
        />
      )}
      <p className="text-body-sm text-on-surface-variant">
        Files are selected for this form only. They are not uploaded while
        submission integration is pending.
      </p>
    </div>
  );
}
export function MembershipPaymentStep(props: FieldProps & UploadProps) {
  return (
    <div className="space-y-5">
      <div className="membership-note">
        <p>{paymentNote}</p>
        <p className="mt-2">
          Fee amounts, bank details and the Registration page are not yet
          available. Contact the Secretary for official payment guidance. This
          form does not process or verify payments.
        </p>
      </div>
      <div className="membership-fields-grid">
        <Field {...props} name="utr" label="Payment transaction (UTR) number" />
        <Field {...props} name="paymentDate" label="Payment date" type="date" />
      </div>
      <UploadField
        kind="receipt"
        file={props.documents.receipt}
        error={props.errors.receipt}
        onSelect={props.selectFile}
        onRemove={props.removeFile}
      />
    </div>
  );
}
