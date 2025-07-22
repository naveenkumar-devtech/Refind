import requests

# ✅ This must be the founder's token (i.e., the user who reported the item with ID=6)
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxMDI0MTc4LCJpYXQiOjE3NTEwMjM4NzgsImp0aSI6ImI3NWIxZGUxYjhhNTRiYzhiMGUzMTA5YzRiMmMxNjRiIiwidXNlcl9pZCI6Nn0.mwCeNoL76uYZmSR1clPznRmsZbbDaQszwlyXg34D0ho"  # Replace with the correct access token for the item's owner

url = "http://127.0.0.1:8000/api/send-message/"

data = {
    "item": 6,          # Item that was found (and claimed)
    "receiver": 5,      # ID of the user who submitted the verified claim
    "message": "Hello! I saw your claim. Let's coordinate."
}

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

res = requests.post(url, json=data, headers=headers)

print("🔁 Status Code:", res.status_code)

try:
    print("✅ Response:", res.json())
except Exception:
    print("❌ Response not in JSON format.")
    print("📄 Raw Response Text:", res.text)
