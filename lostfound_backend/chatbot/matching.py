import logging
from sentence_transformers import SentenceTransformer, util
from api.models import Item
from chatbot.nlp_utils import extract_keywords, is_location_similar

logger = logging.getLogger(__name__)

# Load the pre-trained model
try:
    model = SentenceTransformer('all-MiniLM-L6-v2')
    logger.info("Sentence Transformer model 'all-MiniLM-L6-v2' loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load Sentence Transformer model: {e}")
    model = None

def mask_text(text: str, keep: int = 1) -> str:
    if not text or not text.strip():
        return "***"
    words = text.split()
    if len(words) <= keep:
        return words[0] + " ***"
    return " ".join(words[:keep]) + " ***"

def match_items(item: Item) -> list:
    """
    Matches a single item (lost or found) against all available items of the opposite status
    using a semantic search model, excluding the current item.

    Args:
        item (Item): The item object to match (can be 'lost' or 'found').

    Returns:
        list: A ranked list of the best matching items of the opposite status.
    """
    if not model:
        logger.error("Sentence Transformer model is not available. Cannot perform matching.")
        return []

    logger.info(f"Initiating semantic match for item ID: {item.id} ('{item.title}', Status: {item.status})")
    
    # Determine the opposite status to match against
    match_status = 'found' if item.status == 'lost' else 'lost'
    item_text = f"{item.title} {item.description}"

    # Find all potential matches, excluding the current item and ensuring opposite status
    all_items = Item.objects.exclude(id=item.id).filter(status=match_status, is_claimed=False)
    if not all_items.exists():
        logger.info(f"No '{match_status}' items in the database to match against for item ID {item.id}.")
        return []

    # Semantic search logic
    try:
        # Create text corpus for matching items
        match_item_texts = [f"{i.title} {i.description}" for i in all_items]
        corpus_embeddings = model.encode(match_item_texts, convert_to_tensor=True)
        query_embedding = model.encode(item_text, convert_to_tensor=True)

        # Compute cosine similarities
        semantic_scores = util.pytorch_cos_sim(query_embedding, corpus_embeddings)[0]

    except Exception as e:
        logger.error(f"Error during semantic embedding/scoring for item {item.id}: {e}")
        return []
    
    # Combined scoring and ranking
    matches = []
    for i, match_item in enumerate(all_items):
        semantic_score = semantic_scores[i].item()
        
        # Add bonus for location similarity
        location_score = 0.15 if is_location_similar(item.location, match_item.location) else 0.0
        
        # Calculate final weighted score
        final_score = (semantic_score * 0.85) + location_score
        
        # Consider matches with a reasonable confidence level
        if final_score >= 0.60:  # Threshold set to 60% as per request
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

    # Sort matches by score in descending order and take the top 5
    ranked_matches = sorted(matches, key=lambda x: x['score'], reverse=True)[:5]

    logger.info(f"Found {len(ranked_matches)} potential semantic matches for item ID: {item.id}")
    return ranked_matches