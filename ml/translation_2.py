#libretranslate [args]

from libretranslatepy import LibreTranslateAPI

lt = LibreTranslateAPI("https://translate.argosopentech.com/")

print(lt.translate("LibreTranslate is awesome!", "en", "es"))
# LibreTranslate es impresionante!

print(lt.detect("Hello World"))
# [{"confidence": 0.6, "language": "en"}]

print(lt.languages())
# [{"code":"en", "name":"English"}