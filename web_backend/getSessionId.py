import shlex
import subprocess
import json

def get_session(username, password):
    curl = "curl -s -d '{\"username\":\"" + username + "\",\"password\":\"" + password + "\"}' https://eventretrieval.one/api/v1/login"
    args = shlex.split(curl)
    process = subprocess.Popen(args, shell=False, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    infos = json.loads(stdout.decode('utf-8'))
    return infos["sessionId"]

if __name__ == '__main__':
    sessionId = get_session("haidikichi", "Cheecea0")
    print(sessionId)