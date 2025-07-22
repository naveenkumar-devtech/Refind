import requests

url = "http://127.0.0.1:8000/chat/support/"
headers = {
    "Content-Type": "application/json"
}

# List of test queries
queries = [
    "what is your app",
    "how to report a lost item",
    "how does it work",
    "what are the features",
    "how to find a found item",
    "how to use the app",
    "what should I do if I lost my keys",
    "complex query about quantum physics",
    "hey",
    "where can i find report found and report lost section"
    ""  # Empty query
]

for query in queries:
    print(f"\nTesting query: {query}")
    data = {"query": query}
    res = requests.post(url, json=data, headers=headers)
    print("🔁 Status Code:", res.status_code)
    try:
        print("✅ Response JSON:", res.json())
    except Exception:
        print("❌ Raw Text Response:\n", res.text[:500])