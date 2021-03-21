from flask import Flask, redirect, url_for, request
app = Flask(__name__)
port = 4000
import os
from flask_cors import CORS
CORS(app)


@app.route("/")
def hello():
	return "Hello World"


app.config["SOUND_FILES"] = "/home/anclaudys/Documents/sr-2101-fsa/firstdeployed/gender-performance/gendervoicemodel/newfile"


soundFile = 1


@app.route("/api/sound", methods= ["POST", "GET"])
def sound():
    if request.method == "POST" :
      # The information from the request is on request.data
      print( "=============[REQUEST DATA FROM PYROUTE]==========",len(request.data))
      if request.files:
        print('request.files here',request.files)
      #       sound = request.files["audio"]
      #       sound.save(os.path.join(app.config["SOUND_FILES"], sound.filename))
      #       print(sound)
      # for item in request:
      #   print(item.keys())
      return request.data
    else:
      return "no sound file send"

if __name__ == "__main__":
  app.run( port = port)

