# app/services/search_service.py
import requests
from typing import List, Dict, Any
from urllib.parse import quote

from app.core.config import settings
from app.core.exceptions import SearchRequestError


class SearchService:
    """Service for searching academic papers."""
    
    def __init__(self):
        """Initialize the search service."""
        self.api_key = settings.SERP_API_KEY
    
    def search_papers(self, keywords: List[str], limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search for academic papers using SERP API.
        
        Args:
            keywords: List of keywords to search for
            limit: Maximum number of papers to return
            
        Returns:
            List of papers as dictionaries
            
        Raises:
            SearchRequestError: If there's an issue with the search API request
        """
        # Create different search queries for better coverage
        queries = []
        
        # Basic keyword query
        queries.append(" ".join(keywords) + " research paper academic")
        
        # Add specific scholarly query formats
        if len(keywords) >= 2:
            queries.append(f"\"{keywords[0]} {keywords[1]}\" scientific study")
        
        # Create alternative query format
        alt_query = " ".join(["effect of" if "cause" in kw else kw for kw in keywords]) + " meta-analysis"
        queries.append(alt_query)
        
        # Use the first query or pick the best one if we implement a ranking system
        query = queries[0]
        encoded_query = quote(query)
        
        url = f"https://serpapi.com/search.json?engine=google_scholar&q={encoded_query}&api_key={self.api_key}&num={limit}"
        
        try:
            response = requests.get(url, timeout=30)
            if response.status_code != 200:
                raise SearchRequestError(f"SERP API request failed with status code {response.status_code}: {response.text}")
            
            data = response.json()
            
            # Process the results
            papers = []
            if "organic_results" in data:
                for result in data["organic_results"][:limit]:
                    paper = {
                        "title": result.get("title", ""),
                        "snippet": result.get("snippet", ""),
                        "url": result.get("link", ""),
                        "authors": [],
                        "year": "",
                        "publication": "",
                        "citation_count": result.get("cited_by", {}).get("value", 0)
                    }
                    
                    # Extract publication info if available
                    pub_info = result.get("publication_info", {})
                    if pub_info:
                        # Handle authors
                        authors = pub_info.get("authors", [])
                        if isinstance(authors, list):
                            # Ensure each author is a string
                            author_list = []
                            for author in authors:
                                if isinstance(author, dict):
                                    # If author is a dictionary, try to get name
                                    if 'name' in author:
                                        author_list.append(author['name'])
                                    else:
                                        # Use the first value in the dict or stringify the dict
                                        author_list.append(str(next(iter(author.values()))) if author else "Unknown")
                                else:
                                    # If author is already a string or other type, just convert to string
                                    author_list.append(str(author))
                            paper["authors"] = author_list
                        elif isinstance(authors, str):
                            paper["authors"] = [authors]
                        else:
                            # Fallback for any other type
                            paper["authors"] = [str(authors)]
                            
                        # Handle year and publication
                        paper["year"] = pub_info.get("year", "")
                        paper["publication"] = pub_info.get("summary", "")
                    
                    papers.append(paper)
                    
                    # If snippet is very short, try to fetch abstract from paper URL
                    if len(paper["snippet"]) < 100 and paper["url"]:
                        try:
                            paper_details = self.fetch_paper_details(paper["url"])
                            if paper_details and "abstract" in paper_details:
                                paper["snippet"] = paper_details["abstract"]
                        except Exception:
                            pass
            
            return papers
        except requests.RequestException as e:
            raise SearchRequestError(f"Request to SERP API failed: {str(e)}")
    
    def fetch_paper_details(self, url: str) -> Dict[str, Any]:
        """
        Attempt to fetch additional details about a paper from its URL.
        
        Args:
            url: Paper URL
            
        Returns:
            Dictionary with additional details like abstract
        """
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            response = requests.get(url, headers=headers, timeout=5)
            
            if response.status_code == 200:
                text = response.text
                
                # Try to find abstract
                abstract = ""
                abstract_markers = ["abstract", "summary", "overview"]
                for marker in abstract_markers:
                    if marker in text.lower():
                        start_idx = text.lower().find(marker)
                        # Extract ~500 chars after the marker as a simple heuristic
                        potential_abstract = text[start_idx:start_idx+500]
                        if len(potential_abstract) > 100:  # Only use if substantial
                            abstract = potential_abstract
                            break
                
                return {"abstract": abstract} if abstract else {}
            
            return {}
        except Exception:
            return {}