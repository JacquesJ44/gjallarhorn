import os
import time
import threading
import requests
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from pprint import pprint

# Load environment variables
load_dotenv()

ROUTERS = [r.strip() for r in os.getenv("DEVICES", "").split(",") if r.strip()]
URL = os.getenv("URL")
USERNAME = os.getenv("USER")
PASSHASH = os.getenv("PASS")

app = Flask(__name__)
CORS(app)

# Shared data dictionary for all routers
ping_data = {}

# Emoji status map
STATUS_MAP = {
    3: "✅ Up",
    5: "❌ Down",
    7: "⏸️ Paused",
    12: "⏸️ Paused (paused by parent)",
    0: "❓ Unknown"
}

# Track if threads have already started (prevents duplicates)
threads_started = False

def get_ping_sensor(device_name):
    """Fetch only Ping sensors for a specific device."""
    try:
        params = {
            "content": "sensors",
            "output": "json",
            "columns": "group,device,sensor,status_raw,message,lastvalue",
            "filter_name": "Ping",
            "filter_device": device_name,
            "username": USERNAME,
            "passhash": PASSHASH
        }

        response = requests.get(URL, params=params, timeout=15)
        # pprint(response.json())
        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching Ping sensor for {device_name}: {e}")
        return None


def update_ping_status(device_name):
    """Fetch ping info and update shared dict."""
    sensors = get_ping_sensor(device_name)
    if not sensors or "sensors" not in sensors:
        ping_data[device_name] = {"status": "❓ Unknown", "message": "No Ping sensor found", "lastvalue": ""}
        return

    sensor = sensors["sensors"][0]
    status = sensor.get("status_raw", 0)
    message = sensor.get("message", "")
    lastvalue = sensor.get("lastvalue", "")
    label = STATUS_MAP.get(status, "❓ Unknown")

    ping_data[device_name] = {
        "status": label,
        "lastvalue": lastvalue,
        "message": message,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
    }

    print(f"[{device_name}] {label} — {lastvalue} — {message}")


def monitor_router(device_name):
    """Continuously monitor one router every 2 minutes."""
    while True:
        update_ping_status(device_name)
        time.sleep(120)  # every 2 minutes

def start_monitoring_threads():
    """Start one monitoring thread per router."""
    if not URL or not USERNAME or not PASSHASH or not ROUTERS:
        print("❌ Missing required .env values. Please set URL, USER, PASS, and DEVICES.")
        exit(1)

    print("🚀 Starting PRTG Ping Monitor API...")

    for router in ROUTERS:
        t = threading.Thread(target=monitor_router, args=(router,), daemon=True)
        t.start()
        print(f"Started monitoring thread for {router}")


@app.route("/api/status", methods=["GET"])
def get_status():
    """Expose current status for all routers."""
    return jsonify(ping_data)

# Start monitoring threads once, when app is imported
if not getattr(app, "_monitoring_started", False):
    start_monitoring_threads()
    app._monitoring_started = True

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
