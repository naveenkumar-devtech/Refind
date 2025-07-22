import requests

url = "http://127.0.0.1:8000/api/login/"
data = {
    "username": "claimant",
    "password": "12345678"
}
response = requests.post(url, json=data)
print("Status:", response.status_code)
print("Response:", response.json())
