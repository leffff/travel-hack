from libretranslatepy import LibreTranslateAPI


class Translator:
    def __init__(self, link: str = "https://01b3-109-252-98-213.ngrok-free.app"):
        self.translator = LibreTranslateAPI(link)
    
    def detect_lang(self, text):
        return (self.translator.detect(text))[0]['language']
    
    def translate(self, input_text, input_lang_id, output_lang_id):
        return self.translator.translate(input_text, input_lang_id, output_lang_id)
    
    def __call__(self, input_text, input_lang_id, output_lang_id):
        return self.translate(input_text, input_lang_id, output_lang_id)