import os
import logging
import requests
import time
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from groq import Groq
from rest_framework.permissions import AllowAny
from .matching import match_items

logger = logging.getLogger(__name__)

def mask_api_key(api_key):
    """Masks the API key in logs for security."""
    if not api_key or len(api_key) < 8:
        return "Invalid_Key"
    return f"{api_key[:4]}...{api_key[-4:]}"

class MatchAssistantView(APIView):
    # This view is correct and does not need changes.
    permission_classes = [AllowAny]
    def post(self, request):
        query = request.data.get("query", "").strip()
        if not query:
            return Response({"error": "Query cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            # Assuming match_items is updated to handle a simple query string
            # for a manual search feature.
            matches = match_items(query) 
            return Response({"matches": matches}, status=status.HTTP_200_OK)
        except Exception as e:
            logger.error(f"Error processing query '{query}': {str(e)}")
            return Response({"error": "Failed to process query"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ChatBotSupportView(APIView):
    """
    Handles support queries for the Refind app using the Groq API.
    The AI's knowledge and persona are strictly defined in the system prompt.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        query = request.data.get('query', '').strip()
        if not query:
            return Response({"message": "Please provide a question."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            response_data = self.call_groq_api(query)
            if "message" in response_data:
                logger.info(f"Groq response for '{query}': {response_data['message']}")
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                logger.error(f"Groq API call failed with error: {response_data.get('error')}")
                return Response({
                    "message": "Sorry, our AI assistant is currently experiencing issues. Please try again later."
                }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            logger.error(f"An unexpected error occurred in the Groq API call for query '{query}': {e}")
            return Response({
                "message": "An unexpected error occurred. Please contact support."
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def call_groq_api(self, user_query):
        """
        Calls the Groq API with a highly specific, restrictive, and project-focused prompt.
        """
        try:
            api_key = os.getenv('GROQ_API_KEY')
            if not api_key:
                logger.error("GROQ_API_KEY is not configured.")
                return {"error": "API key not configured."}

            client = Groq(api_key=api_key)
            
            # --- THIS IS THE NEW, WORLD-CLASS SYSTEM PROMPT ---
            system_prompt = (
                "You are 'Refind AI', the official support assistant for the Refind web application. "
                "Your knowledge is STRICTLY limited to the features of the Refind app. Do NOT invent features like 'help desks', 'tickets', or 'premium plans'. "
                "Your tone is helpful, professional, and very concise.\n\n"
                "Here is the complete feature set of the Refind application:\n"
                "1. Users can sign up and log in.\n"
                "2. From their Dashboard, users can report a 'Lost Item' or a 'Found Item'.\n"
                "3. The Dashboard shows statistics and a list of recently reported items.\n"
                "4. The 'AI Matches' page allows users to manually search for items that match a description.\n"
                "5. When a user reports a 'Lost Item', the system automatically searches for matches and sends an email if a high-confidence match is found.\n"
                "6. Users can view the masked details of an item and initiate a private 'Chat' with the item's reporter to verify ownership.\n"
                "7. For all other support, users must contact the team directly via email at refindaiapp@gmail.com. This is the ONLY contact method.\n\n"
                "Based ONLY on this information, answer the user's query."
            )

            completion = client.chat.completions.create(
                model="llama3-8b-8192",
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt
                    },
                    {
                        "role": "user",
                        "content": user_query
                    }
                ],
                temperature=0.5, # Slightly lower temperature for more factual answers
                max_tokens=256,  # Reduced max tokens for conciseness
                top_p=1,
                stream=False,
            )

            response_text = completion.choices[0].message.content
            return {"message": response_text}

        except Exception as e:
            logger.error(f"Groq API request failed: {str(e)}")
            return {"error": str(e)}