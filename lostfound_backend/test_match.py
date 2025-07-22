import requests

url = "http://127.0.0.1:8000/chat/match/"
data = {
    "query": "Red Laptop"
}
response = requests.post(url, json=data)
print("Match response:", response.json())
