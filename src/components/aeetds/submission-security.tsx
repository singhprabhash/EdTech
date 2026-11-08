"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { SubmissionSecurity } from "../../services/submission-transport";
type Widget = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Widget;
  }
}
export function useSubmissionSecurity(upload = false) {
  const [config, setConfig] = useState({
    enabled: false,
    siteKey: null as string | null,
  });
  const [token, setToken] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [requestId, setRequestId] = useState("");
  const [generation, setGeneration] = useState(0);
  useEffect(() => {
    let cancelled = false;
    const id = crypto.randomUUID();
    fetch("/api/submissions/config", { cache: "no-store" })
      .then((response) => response.json())
      .then((value) => {
        if (!cancelled) setRequestId(id);
        if (
          !cancelled &&
          value.enabled === true &&
          (!upload || value.uploadsEnabled === true) &&
          typeof value.siteKey === "string"
        )
          setConfig({ enabled: true, siteKey: value.siteKey });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [upload]);
  const security: SubmissionSecurity = {
    enabled: config.enabled,
    token,
    honeypot,
    requestId,
  };
  return {
    security,
    siteKey: config.siteKey,
    setToken,
    setHoneypot,
    generation,
    reset: () => {
      setToken("");
      setGeneration((value) => value + 1);
    },
  };
}
export function SubmissionSecurityFields({
  state,
}: {
  state: ReturnType<typeof useSubmissionSecurity>;
}) {
  const [ready, setReady] = useState(false);
  const widget = useRef<HTMLDivElement>(null);
  const { setToken, setHoneypot, siteKey, security, generation } = state;
  useEffect(() => {
    if (!ready || !widget.current || !window.turnstile || !siteKey) return;
    const api = window.turnstile;
    const id = api.render(widget.current, {
      sitekey: siteKey,
      action: "aeetds_submit",
      cData: security.requestId,
      callback: (token: string) => setToken(token),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
    return () => api.remove(id);
  }, [ready, siteKey, security.requestId, setToken, generation]);
  return (
    <>
      <div className="submission-honeypot" aria-hidden="true">
        <label htmlFor={`website-${security.requestId}`}>
          Leave this field blank
        </label>
        <input
          id={`website-${security.requestId}`}
          name="website"
          autoComplete="off"
          tabIndex={-1}
          value={security.honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>
      {security.enabled && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
            strategy="afterInteractive"
            onReady={() => setReady(true)}
          />
          <div ref={widget} />
          <p className="text-body-sm text-on-surface-variant">
            Protected by a spam check. If it cannot complete, your entries
            remain available for retry.
          </p>
        </>
      )}
    </>
  );
}

export function SubmissionAvailability({
  available,
  unavailable,
  upload = false,
}: {
  available: string;
  unavailable: string;
  upload?: boolean;
}) {
  const state = useSubmissionSecurity(upload);
  return <>{state.security.enabled ? available : unavailable}</>;
}
