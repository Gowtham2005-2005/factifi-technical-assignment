# app/services/llm_service.py
import json
import re
import requests
from typing import Dict, Any, Optional

from app.core.config import settings
from app.core.exceptions import LLMRequestError


class LLMService:
    """Service for interacting with LLM models."""
    
    def __init__(self):
        """Initialize the LLM service."""
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
    
    def call_gemini_api(self, prompt: str) -> str:
        """
        Call Gemini API with a prompt.
        
        Args:
            prompt: The prompt to send to the model
            
        Returns:
            The text response from the model
            
        Raises:
            LLMRequestError: If there's an issue with the API request
        """
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:generateContent?key={self.api_key}"
        
        headers = {
            "Content-Type": "application/json"
        }
        
        data = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        }
        
        try:
            response = requests.post(url, headers=headers, json=data, timeout=30)
            
            if response.status_code != 200:
                raise LLMRequestError(f"Gemini API request failed with status code {response.status_code}: {response.text}")
            
            result = response.json()
            
            # Extract the text from the response
            if "candidates" in result and result["candidates"] and "content" in result["candidates"][0]:
                content = result["candidates"][0]["content"]
                if "parts" in content and content["parts"]:
                    return content["parts"][0]["text"]
            
            raise LLMRequestError("Unable to extract text from Gemini API response")
        except requests.RequestException as e:
            raise LLMRequestError(f"Request to Gemini API failed: {str(e)}")
    
    def clean_json_text(self, text: str) -> str:
        """
        Clean text for JSON parsing by removing markdown code blocks and trimming.
        
        Args:
            text: Raw text that may contain JSON
            
        Returns:
            Cleaned JSON string
        """
        # First, check if content is wrapped in code blocks
        code_block_pattern = r'```(?:json)?(.*?)```'
        code_block_match = re.search(code_block_pattern, text, re.DOTALL)
        if code_block_match:
            # Extract content from inside code blocks
            cleaned_text = code_block_match.group(1).strip()
        else:
            cleaned_text = text.strip()
        
        # Look for content between curly braces including the braces
        json_pattern = r'\{.+\}'
        json_match = re.search(json_pattern, cleaned_text, re.DOTALL)
        if json_match:
            cleaned_text = json_match.group(0)
        
        # Remove any leading/trailing whitespace and special characters
        return cleaned_text.strip()
    
    def parse_json_response(self, content: str) -> Dict[str, Any]:
        """
        Parse JSON from LLM response with fallback mechanisms.
        
        Args:
            content: Raw text from LLM that should contain JSON
            
        Returns:
            Parsed JSON as a dictionary
        """
        try:
            cleaned_content = self.clean_json_text(content)
            return json.loads(cleaned_content)
        except json.JSONDecodeError:
            # Use extraction methods from the original code if direct parsing fails
            return self._extract_fallback(content)
    
    def _extract_fallback(self, content: str) -> Dict[str, Any]:
        """
        Extract structured data when JSON parsing fails.
        
        Args:
            content: Raw text from LLM
            
        Returns:
            Extracted data in dictionary format
        """
        # Implement fallback extraction logic here
        # This is a simplified version - the complete implementation would include
        # methods like _extract_assessment, _extract_explanation, etc.
        result = {}
        
        # Extract assessment
        if "Supported" in content:
            result["assessment"] = "Supported"
        elif "Refuted" in content:
            result["assessment"] = "Refuted"
        else:
            result["assessment"] = "Lacks Sufficient Evidence"
        
        # Extract explanation
        explanation_pattern = r'"explanation"\s*:\s*"([^"]+)"'
        matches = re.search(explanation_pattern, content)
        if matches:
            result["explanation"] = matches.group(1)
        else:
            result["explanation"] = "Analysis shows insufficient evidence for a definitive assessment."
        
        # Extract paper analyses
        result["paper_analyses"] = []
        paper_pattern = r'"paper_number":\s*(\d+).*?"relation_to_claim":\s*"([^"]+)"'
        matches = re.finditer(paper_pattern, content, re.DOTALL)
        
        for match in matches:
            paper_num = int(match.group(1))
            relation = match.group(2)
            result["paper_analyses"].append({
                "paper_number": paper_num,
                "relation_to_claim": relation
            })
        
        return result