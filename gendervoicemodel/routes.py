from flask import Flask, redirect, url_for, request
app = Flask(__name__)
port = 4000
import os
from flask_cors import CORS
import base64
CORS(app)
from test import testFunc

@app.route("/")
def hello():
	return "Hello World"



@app.route("/api/sound", methods= ["POST", "GET"])
def sound():
    if request.method == "POST" :
      # The information from the request is on request.data
      # decode the base 64 data and save it to a file.
      decodedData = base64.b64decode(request.data)
      #with open('myfile.wav', mode='bx') as f:
        #f.write(decodedData)
      nuFile = open('myfile.wav', mode='ba')
      result = testFunc("TEST STRING") #
      print("=====[IN PY ROUTE]======")

      return "hello"
    else:
      return "no sound file send"


if __name__ == "__main__":
  app.run( port = port)

