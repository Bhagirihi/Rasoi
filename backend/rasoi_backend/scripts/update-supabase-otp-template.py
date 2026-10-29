#!/usr/bin/env python3
import json
import pathlib
import subprocess

template = pathlib.Path(__file__).with_name("supabase-otp-email-template.html").read_text()

payload = {
    "mailer_autoconfirm": True,
    "mailer_subjects_confirmation": "Your Rasoi sign-in code",
    "mailer_subjects_magic_link": "Your Rasoi sign-in code",
    "mailer_subjects_reauthentication": "Your Rasoi sign-in code",
    "mailer_templates_confirmation_content": template,
    "mailer_templates_magic_link_content": template,
    "mailer_templates_reauthentication_content": template,
    "mailer_subjects_custom_contents": {
        "MAILER_SUBJECTS_CONFIRMATION": True,
        "MAILER_SUBJECTS_MAGIC_LINK": True,
        "MAILER_SUBJECTS_REAUTHENTICATION": True,
    },
    "mailer_templates_custom_contents": {
        "MAILER_TEMPLATES_CONFIRMATION_CONTENT": True,
        "MAILER_TEMPLATES_MAGIC_LINK_CONTENT": True,
        "MAILER_TEMPLATES_REAUTHENTICATION_CONTENT": True,
    },
}

patch_path = "/tmp/supabase-auth-patch.json"
patch_path_obj = pathlib.Path(patch_path)
patch_path_obj.write_text(json.dumps(payload))

token = subprocess.check_output(
    "supabase projects list --debug 2>&1 | grep -o 'Bearer sbp_[a-f0-9]*' | head -1 | sed 's/Bearer //'",
    shell=True,
    text=True,
).strip()

out = subprocess.check_output(
    [
        "curl",
        "-s",
        "-w",
        "\nHTTP:%{http_code}",
        "-X",
        "PATCH",
        "https://api.supabase.com/v1/projects/ehrwhepgdrgbvjknyaeb/config/auth",
        "-H",
        f"Authorization: Bearer {token}",
        "-H",
        "Content-Type: application/json",
        "--data-binary",
        f"@{patch_path}",
    ],
    text=True,
)

body, _, code = out.rpartition("HTTP:")
if code.strip() != "200":
    raise SystemExit(f"PATCH failed ({code.strip()}): {body[:300]}")

data = json.loads(body)
print("confirmation subject:", data.get("mailer_subjects_confirmation"))
print("has Token:", "{{ .Token }}" in (data.get("mailer_templates_confirmation_content") or ""))
print("template length:", len(data.get("mailer_templates_confirmation_content") or ""))
