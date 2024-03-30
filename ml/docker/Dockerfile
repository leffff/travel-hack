FROM libretranslate/libretranslate:latest
RUN if [ ! -z "$models" ]; then \
  ./venv/bin/python scripts/install_models.py --load_only_lang_codes "$models";   \
  else \
  ./venv/bin/python scripts/install_models.py;  \
  fi