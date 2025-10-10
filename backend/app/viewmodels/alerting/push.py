import os
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), '.env')))

def send_push_notification(user_id, message):
    # Stub for Firebase integration
    print(f"Sending push notification to {user_id}: {message}")
