from routes import soundFile


def createTestFile(theFile):
  with open('testfile2.wav', mode='bx') as f:
    f.write(theFile)


createTestFile(soundFile)
