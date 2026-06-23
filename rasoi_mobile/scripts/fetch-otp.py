#!/usr/bin/env python3
"""Fetch latest Rasoi OTP from Gmail inbox (standalone IMAP, no MCP dependency)."""
from __future__ import annotations

import email
import imaplib
import os
import re
import sys
from email.header import decode_header
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ENV_CANDIDATES = [
    ROOT / ".cursor" / "mcp-servers" / "gmail-dvesp" / ".env",
    ROOT / ".cursor" / "mcp-servers" / "gmail-imap" / ".env",
]

for ENV_FILE in ENV_CANDIDATES:
    if not ENV_FILE.exists():
        continue
    for line in ENV_FILE.read_text().splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, _, val = line.partition("=")
            os.environ.setdefault(key.strip(), val.strip().strip('"').strip("'"))
    break


def decode_header_value(value: str | None) -> str:
    if not value:
        return ""
    parts: list[str] = []
    for chunk, encoding in decode_header(value):
        if isinstance(chunk, bytes):
            parts.append(chunk.decode(encoding or "utf-8", errors="replace"))
        else:
            parts.append(str(chunk))
    return "".join(parts)


def extract_body(msg: email.message.Message) -> str:
    if msg.is_multipart():
        chunks: list[str] = []
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                payload = part.get_payload(decode=True)
                if payload:
                    chunks.append(payload.decode(part.get_content_charset() or "utf-8", errors="replace"))
        return "\n".join(chunks)
    payload = msg.get_payload(decode=True)
    if not payload:
        return ""
    return payload.decode(msg.get_content_charset() or "utf-8", errors="replace")


def main() -> int:
    user = os.environ.get("GMAIL_USER", "").strip()
    password = os.environ.get("GMAIL_APP_PASSWORD", "").strip()
    subject_contains = os.environ.get("OTP_SUBJECT", "Rasoi sign-in code")
    known_old = os.environ.get("QA_OTP_KNOWN_OLD", "").strip()
    max_age_min = int(os.environ.get("OTP_MAX_AGE_MIN", "10"))

    if not user or not password:
        print("Missing GMAIL_USER or GMAIL_APP_PASSWORD", file=sys.stderr)
        return 1

    mail = imaplib.IMAP4_SSL("imap.gmail.com")
    try:
        mail.login(user, password)
        mail.select("INBOX", readonly=True)
        _, data = mail.search(None, f'(SUBJECT "{subject_contains}")')
        ids = data[0].split() if data and data[0] else []
        if not ids:
            print(f"No email with subject containing: {subject_contains}", file=sys.stderr)
            return 1

        from datetime import datetime, timezone, timedelta
        cutoff = datetime.now(timezone.utc) - timedelta(minutes=max_age_min)

        for msg_id in reversed(ids[-8:]):
            _, msg_data = mail.fetch(msg_id, "(RFC822)")
            raw = msg_data[0][1]
            msg = email.message_from_bytes(raw)
            date_hdr = msg.get("Date")
            if date_hdr:
                try:
                    msg_dt = parsedate_to_datetime(date_hdr)
                    if msg_dt.tzinfo is None:
                        msg_dt = msg_dt.replace(tzinfo=timezone.utc)
                    if msg_dt < cutoff:
                        continue
                except (TypeError, ValueError):
                    pass
            body = extract_body(msg)
            compact = re.sub(r"\s+", "", body)
            match = re.search(r"\b(\d{8})\b", compact) or re.search(r"\b(\d{6,8})\b", compact)
            if not match:
                continue
            otp = match.group(1)
            if known_old and otp == known_old:
                continue
            print(otp)
            return 0

        print("No fresh OTP in recent emails", file=sys.stderr)
        return 1
    finally:
        try:
            mail.logout()
        except Exception:
            pass


if __name__ == "__main__":
    raise SystemExit(main())
