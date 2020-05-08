import requests
r = requests.post("http://127.0.0.1:8002/stream", json = {"username" : "lr002", "sessid" : "00050ab05fdd2f6488bf1ecacb2b233f"})
print(r.text)
print("DONE")
