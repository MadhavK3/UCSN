import os
import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv


# Load root .env
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')))


def send_sms_alert(phone: str, message: str):
    """Attempt to send an alert via SMTP as an SMS gateway (if SMTP and gateway settings exist),
    otherwise log the message to console. This avoids requiring Twilio while keeping alerting.
    """
    # Optional: an SMTP-to-SMS gateway address pattern can be provided in .env
    smtp_server = os.getenv("ALERT_SMTP_SERVER")
    smtp_port = int(os.getenv("ALERT_SMTP_PORT", "587"))
    smtp_user = os.getenv("ALERT_SMTP_USER")
    smtp_pass = os.getenv("ALERT_SMTP_PASS")
    sms_gateway_domain = os.getenv("ALERT_SMS_GATEWAY_DOMAIN")

    if smtp_server and sms_gateway_domain:
        # Construct an email to SMS address (e.g., 1234567890@txt.att.net)
        to_addr = f"{phone}@{sms_gateway_domain}"
        msg = EmailMessage()
        msg.set_content(message)
        msg["Subject"] = "Alert"
        msg["From"] = smtp_user or "noreply@example.com"
        msg["To"] = to_addr

        try:
            with smtplib.SMTP(smtp_server, smtp_port, timeout=10) as s:
                s.starttls()
                if smtp_user and smtp_pass:
                    s.login(smtp_user, smtp_pass)
                s.send_message(msg)
            print(f"Alert sent to {phone} via SMTP gateway {sms_gateway_domain}")
            return
        except Exception as e:
            print(f"SMTP gateway send failed: {e}")

    # Final fallback: print to console (safe for local/demo runs)
    print(f"[ALERT] To: {phone} — Message: {message}")
