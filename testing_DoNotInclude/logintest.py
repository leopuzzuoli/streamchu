import requests
requests.post("http://127.0.0.1:8000", json = {"username" : "firstUser", "password" : "differentpassword"})
print("DONE")
