import { crafnsBrochure } from "../../../content/aeetds-events";
import { Action } from "../ui";

export default function BrochureDownload() {
  return (
    <Action
      href={crafnsBrochure.href}
      download={crafnsBrochure.filename}
      tone="light"
      icon="download"
    >
      Download Brochure
    </Action>
  );
}
