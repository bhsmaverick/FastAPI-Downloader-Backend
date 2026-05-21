import json
import os
import logging
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request

logger = logging.getLogger(__name__)

SUPPORTED_LANGUAGES = ["en", "es", "pt", "de", "fr", "ua", "pl", "ja", "ar", "tr", "hi", "it", "ko", "id"]
DEFAULT_LANGUAGE = "en"
LOCALES_DIR = os.path.join(os.path.dirname(__file__), "locales")

class I18nMiddleware(BaseHTTPMiddleware):
    def __init__(self, app):
        super().__init__(app)
        self.translations = {}
        self._load_locales()

    def _load_locales(self):
        if not os.path.exists(LOCALES_DIR):
            logger.warning(f"Locales directory not found: {LOCALES_DIR}")
            return

        for lang in SUPPORTED_LANGUAGES:
            file_path = os.path.join(LOCALES_DIR, f"{lang}.json")
            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    self.translations[lang] = json.load(f)
            else:
                logger.warning(f"Locale file for {lang} not found.")
                self.translations[lang] = {}

    async def dispatch(self, request: Request, call_next):
        lang_param = request.query_params.get("lang")
        accept_lang = request.headers.get("Accept-Language", "")

        selected_lang = DEFAULT_LANGUAGE

        # Priority 1: Query parameter override
        if lang_param and lang_param in SUPPORTED_LANGUAGES:
            selected_lang = lang_param
        # Priority 2: Extract from Accept-Language Header
        elif accept_lang:
            for al in accept_lang.split(","):
                al_code = al.split(";")[0].strip().split("-")[0].lower()
                if al_code in SUPPORTED_LANGUAGES:
                    selected_lang = al_code
                    break

        # Dynamically inject the isolated translation closure safely into the request context
        def translate(key: str) -> str:
            return self.translations.get(selected_lang, {}).get(key) or self.translations.get(DEFAULT_LANGUAGE, {}).get(key, key)

        request.state.t = translate
        request.state.lang = selected_lang

        response = await call_next(request)
        response.headers["Content-Language"] = selected_lang
        return response
