import requests

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzUxMDA2Nzg4LCJpYXQiOjE3NTEwMDY0ODgsImp0aSI6IjdmN2U3YTU2MTU1NzQ2YmI4OGI2NzFiY2E2MTAzMWI5IiwidXNlcl9pZCI6NH0.R6Kau-BQJSB-aVRvQLvXxjqvqU7d2c4f_Be_9qFqBWg"  # Use the token from test_login.py
item_id = 5  # Match from above

url = f"http://127.0.0.1:8000/api/items/{item_id}/claim/"
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}
data = {
    "claim_note": "Has a silver keychain and a torn edge"  # <-- must match the private_note
}

response = requests.post(url, headers=headers, json=data)
print("Claim response:", response.json())
