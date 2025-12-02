import os
import google.generativeai as genai
from dotenv import load_dotenv

def get_gemini_response(prompt: str):
    # Load env from current directory or parent
    load_dotenv()
    # Also try specific path if standard load fails or for explicit safety
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), '.env')
    load_dotenv(env_path)
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "Error: Gemini API key not configured."

    genai.configure(api_key=api_key)
    
    # Set up the model
    generation_config = {
        "temperature": 0.9,
        "top_p": 1,
        "top_k": 1,
        "max_output_tokens": 2048,
    }

    safety_settings = [
        {
            "category": "HARM_CATEGORY_HARASSMENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_HATE_SPEECH",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
            "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
            "threshold": "BLOCK_MEDIUM_AND_ABOVE"
        },
    ]

    model = genai.GenerativeModel(model_name="gemini-2.0-flash-lite",
                                  generation_config=generation_config,
                                  safety_settings=safety_settings)

    system_prompt = """
    You are the AI Command Hub Assistant for the Urban Climate Shield Network (UCSN).
    Your role is to assist city administrators in managing climate resilience.
    
    You have access to the following system context (simulated):
    - Current City: Mumbai
    - Active Alerts: None
    - Cooling System Status: Operational (85% efficiency)
    - Coastal Shield Status: Standby
    - Energy Grid: 100% Renewable Mix
    
    When answering:
    1. Be concise, professional, and futuristic in tone.
    2. If asked about system status, use the simulated context above.
    3. If asked for recommendations, suggest interventions like "Activate Misting Nodes in Sector 4" or "Raise Coastal Barriers".
    4. You are an expert in urban planning, climate science, and disaster management.
    
    User Query: 
    """
    
    try:
        convo = model.start_chat(history=[])
        response = convo.send_message(system_prompt + prompt)
        return response.text
    except Exception as e:
        return f"Error communicating with AI Core: {str(e)}"
