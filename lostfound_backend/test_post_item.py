import requests

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxMDI4NTExLCJpYXQiOjE3NTEwMjgyMTEsImp0aSI6IjY2NWZjYzYzNDdmNTQ0N2RiYmQwMmU0YjEzNWQzODdhIiwidXNlcl9pZCI6OH0.u1RYD8E81R8h2ooVj7iL6FsTeOCLnos5kNtoGxEsy04"  # Replace with actual working token

url = "http://127.0.0.1:8000/api/items/"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

data = {
    "title": "Black Wallet",
    "description": "It contains important cards and cash.",
    "private_note": "Has initials Krish engraved on the inside",
    "status": "found",
    "location": "Near Library",
    "category": 25  # Use the correct category ID from admin panel
}

res = requests.post(url, json=data, headers=headers)

print("🔁 Status Code:", res.status_code)

try:
    print("✅ Response JSON:", res.json())
except Exception:
    print("❌ Raw Text Response:\n", res.text[:500])  # just print first 500 characters of raw HTML
