import spacy
from fuzzywuzzy import fuzz

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Downloading spaCy model 'en_core_web_sm'...")
    from spacy.cli import download
    download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

def extract_keywords(text):
    doc = nlp(text)
    # This is still useful for other tasks, so we keep it
    return [token.lemma_ for token in doc if token.pos_ in ("NOUN", "PROPN") and not token.is_stop]

def is_location_similar(loc1, loc2):
    """
    Checks if two location strings are reasonably similar.
    e.g., "Main Library" and "Library" should be considered similar.
    """
    if not loc1 or not loc2:
        return False
    # Use a fuzzy string matching ratio
    return fuzz.token_set_ratio(loc1.lower(), loc2.lower()) > 70 # 70% similarity threshold