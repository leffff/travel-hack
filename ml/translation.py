#!pip install git+https://github.com/0xb1b1/yandexfreetranslate.git@fix/lang-code-len-verification


from yandexfreetranslate import YandexFreeTranslate

yt = YandexFreeTranslate(api="ios")


def translate(text: str, source: str = "en", target: str = "ru") -> str:
    return yt.translate(
        source=source,
        target=target,
        text=text,
    )

translate('how old are you?')