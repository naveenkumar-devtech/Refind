import requests

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxMDI4NTc4LCJpYXQiOjE3NTEwMjgyNzgsImp0aSI6ImNkOGVjNDI5MzZhNzRkMWY4ZDRmNWYzNjU3OTk1ODM5IiwidXNlcl9pZCI6NX0.S2x2BwV5r6Xa2YfXx6TE-FivOcTz-6D6RQaW1XL811s"
item_id = 9  # Update this

url = f"http://127.0.0.1:8000/api/items/{item_id}/claim/"

data = {
    "claim_note": "Has initials Krish engraved on the inside"
}

headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

res = requests.post(url, json=data, headers=headers)
print("🔁 Status Code:", res.status_code)
try:
    print("✅ Response JSON:", res.json())
except Exception:
    print("❌ Raw Response:", res.text)
