#!pip install libretranslatepy

from libretranslatepy import LibreTranslateAPI
#link = "https://01b3-109-252-98-213.ngrok-free.app"
class Translator:
  def __init__(self, link):
    self.translator = LibreTranslateAPI(link)

  def detect_lang(self, text):
    return (self.translator.detect("Hello World"))[0]['language']

  def translate(self, input_text, input_lang_id, output_lang_id):
    return (self.translator.translate(input_text, input_lang_id, output_lang_id))