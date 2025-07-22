import logging
import requests
import os
from api.models import Item
from chatbot.nlp_utils import is_location_similar # We still need this for location scoring
from sentence_transformers import util # We use this for fast local similarity calculation

logger = logging.getLogger(__name__)

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"

def mask_text(text: str, keep: int = 1) -> str:
    # This function is correct and needs no changes
    if not text or not text.strip():
        return "***"
    words = text.split()
    if len(words) <= keep:
        return words[0] + " ***"
    return " ".join(words[:keep]) + " ***"

def get_embeddings(texts: list) -> list:
    """
    Calls the Hugging Face API once to get embeddings for a list of texts.
    """
    if not HF_API_TOKEN:
        raise Exception("Hugging Face API token not set.")
    
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
    payload = {"inputs": texts, "options": {"wait_for_model": True}}
    
    response = requests.post(HF_API_URL, headers=headers, json=payload)
    response.raise_for_status() # This will raise an error for 4xx or 5xx status codes
    return response.json()

def match_items(lost_item_report: Item) -> list:
    """
    Matches a single lost item report against found items using the
    Hugging Face Inference API in a single, efficient call.
    """
    logger.info(f"Initiating semantic match for lost item ID: {lost_item_report.id}")
    
    found_items = Item.objects.filter(status='found', is_claimed=False)
    if not found_items.exists():
        logger.info("No 'found' items in the database to match against.")
        return []

    try:
        # 1. Prepare all the text we need to analyze.
        lost_item_text = f"{lost_item_report.title} {lost_item_report.description}"
        found_item_texts = [f"{item.title} {item.description}" for item in found_items]
        
        # 2. Make ONE single API call to get all embeddings.
        all_embeddings = get_embeddings([lost_item_text] + found_item_texts)
        
        # 3. Separate the query embedding from the corpus embeddings.
        query_embedding = all_embeddings[0]
        corpus_embeddings = all_embeddings[1:]
        
        # 4. Compute cosine-similarities locally. This is extremely fast.
        semantic_scores = util.cos_sim(query_embedding, corpus_embeddings)[0]

    except Exception as e:
        logger.error(f"Error during Hugging Face API call or scoring for item {lost_item_report.id}: {e}")
        return []
    
    # --- The rest of your scoring and ranking logic is excellent and preserved ---
    matches = []
    for i, item in enumerate(found_items):
        semantic_score = semantic_scores[i].item()
        location_score = 0.15 if is_location_similar(lost_item_report.location, item.location) else 0.0
        final_score = (semantic_score * 0.85) + location_score
        
        if final_score >= 0.60:
            matches.append({
                "match_item_id": item.id,
                "score": round(final_score, 2),
                "details": {
                    "title_hint": mask_text(item.title),
                    "location_hint": mask_text(item.location),
                    "description_hint": "A potential match was found. Chat to verify.",
                    "image": item.image.url if item.image else None,
                    "owner_id": item.user.id
                }
            })

    ranked_matches = sorted(matches, key=lambda x: x['score'], reverse=True)[:5]
    logger.info(f"Found {len(ranked_matches)} potential semantic matches for item ID: {lost_item_report.id}")
    return ranked_matches