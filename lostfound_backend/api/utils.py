from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from difflib import SequenceMatcher

def cosine_text_similarity(a, b):
    vectorizer = TfidfVectorizer().fit([a, b])
    vectors = vectorizer.transform([a, b])
    return cosine_similarity(vectors[0], vectors[1])[0][0]

def string_similarity(a, b):
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()

def date_similarity(date1, date2):
    # Full score if within 2 days, else 0
    return 1.0 if abs((date1 - date2).days) <= 2 else 0.0

def verify_claim(claim_note, private_note, claimed_item, lost_item):
    try:
        score_note = cosine_text_similarity(claim_note, private_note)
        score_title = string_similarity(claimed_item.title, lost_item.title)
        score_location = string_similarity(claimed_item.location, lost_item.location)
        score_description = string_similarity(claimed_item.description, lost_item.description)
        score_date = date_similarity(claimed_item.date, lost_item.date)
    except Exception as e:
        print("Similarity error:", e)
        return False, 0.0

    total_score = (score_note + score_title + score_location + score_description + score_date) / 5
    return total_score >= 0.75, round(total_score, 2)
