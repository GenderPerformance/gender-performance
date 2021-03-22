from flask import Flask, redirect, url_for, request
app = Flask(__name__)
port = 4000
import os
from flask_cors import CORS
import base64
CORS(app)


@app.route("/")
def hello():
	return "Hello World"


app.config["SOUND_FILES"] = "/home/anclaudys/Documents/sr-2101-fsa/firstdeployed/gender-performance/gendervoicemodel/newfile"


soundFile = 1

# def grabFile(theFile):
#   return theFile

@app.route("/api/sound", methods= ["POST", "GET"])
def sound():
    if request.method == "POST" :
      # The information from the request is on request.data
      print( "=============[REQUEST DATA FROM PYROUTE]==========")
      # decode the base 64 data and save it to a file.
      decodedData = base64.b64decode(request.data)
      with open('myfile.wav', mode='bx') as f:
        soundFile = decodedData
        f.write(decodedData) #<-------
      if request.files['file']:
        print('request.files here')
      #       sound = request.files["audio"]
      #       sound.save(os.path.join(app.config["SOUND_FILES"], sound.filename))
      #       print(sound)
      # for item in request:
      #   print(item.keys())

      return request.data
    else:
      return "This is the python sound route"

if __name__ == "__main__":
  app.run( port = port)




