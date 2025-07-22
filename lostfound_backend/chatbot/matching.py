import logging
import requests
from api.models import Item
from chatbot.nlp_utils import is_location_similar
import os

logger = logging.getLogger(__name__)

HF_API_TOKEN = os.getenv("HF_API_TOKEN")
HF_API_URL = "https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2"

def mask_text(text: str, keep: int = 1) -> str:
    if not text or not text.strip():
        return "***"
    words = text.split()
    if len(words) <= keep:
        return words[0] + " ***"
    return " ".join(words[:keep]) + " ***"

def match_items(item: Item) -> list:
    if not HF_API_TOKEN:
        logger.error("Hugging Face API token not set.")
        return []

    logger.info(f"Initiating semantic match for item ID: {item.id} ('{item.title}', Status: {item.status})")
    
    match_status = 'found' if item.status == 'lost' else 'lost'
    item_text = f"{item.title} {item.description}"
    all_items = Item.objects.exclude(id=item.id).filter(status=match_status, is_claimed=False)
    
    if not all_items.exists():
        logger.info(f"No '{match_status}' items in the database to match against for item ID {item.id}.")
        return []

    try:
        match_item_texts = [f"{i.title} {i.description}" for i in all_items]
        headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}
        
        # Encode query
        response = requests.post(HF_API_URL, headers=headers, json={"inputs": item_text})
        response.raise_for_status()
        query_embedding = response.json()
        
        # Encode corpus
        corpus_embeddings = []
        for text in match_item_texts:
            response = requests.post(HF_API_URL, headers=headers, json={"inputs": text})
            response.raise_for_status()
            corpus_embeddings.append(response.json())

        # Compute cosine similarities
        semantic_scores = []
        for emb in corpus_embeddings:
            dot_product = sum(a * b for a, b in zip(query_embedding, emb))
            norm_query = sum(x * x for x in query_embedding) ** 0.5
            norm_emb = sum(x * x for x in emb) ** 0.5
            score = dot_product / (norm_query * norm_emb) if norm_query * norm_emb != 0 else 0
            semantic_scores.append(score)

    except Exception as e:
        logger.error(f"Error during semantic embedding/scoring for item {item.id}: {e}")
        return []
    
    matches = []
    for i, match_item in enumerate(all_items):
        semantic_score = semantic_scores[i]
        location_score = 0.15 if is_location_similar(item.location, match_item.location) else 0.0
        final_score = (semantic_score * 0.85) + location_score
        
        if final_score >= 0.60:
            matches.append({
                "item_id": match_item.id,
                "score": round(final_score, 2),
                "details": {
                    "title_hint": mask_text(match_item.title),
                    "location_hint": mask_text(match_item.location),
                    "description_hint": "A potential match was found. Chat with the user to verify details.",
                    "image": match_item.image.url if match_item.image else None,
                    "owner_id": match_item.user.id
                }
            })

    ranked_matches = sorted(matches, key=lambda x: x['score'], reverse=True)[:5]
    logger.info(f"Found {len(ranked_matches)} potential semantic matches for item ID: {item.id}")
    return ranked_matches