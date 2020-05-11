import requests
r = requests.post("http://127.0.0.1:800/forceClose")
print(r.text)
print("DONE")
