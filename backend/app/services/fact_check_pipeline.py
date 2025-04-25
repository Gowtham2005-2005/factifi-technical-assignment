# app/services/fact_check_pipeline.py
import json
import logging
from typing import List, Dict, Any, Tuple

from app.services.llm_service import LLMService
from app.services.search_service import SearchService
from app.core.exceptions import APIKeyNotFoundError, LLMRequestError, SearchRequestError
from app.core.config import settings


# Configure logger
logger = logging.getLogger(__name__)


class FactCheckPipeline:
    """Pipeline for fact-checking claims using academic research."""
    
    def __init__(self):
        """Initialize the fact-check pipeline."""
        try:
            self.llm_service = LLMService()
            self.search_service = SearchService()
        except Exception as e:
            logger.error(f"Error initializing fact-check pipeline: {str(e)}")
            raise APIKeyNotFoundError(f"Failed to initialize services: {str(e)}")
    
    def extract_keywords(self, claim: str) -> List[str]:
        """
        Extract key research terms from the claim using LLM.
        
        Args:
            claim: The claim to extract keywords from
            
        Returns:
            List of keywords
            
        Raises:
            LLMRequestError: If there's an issue with the LLM API request
        """
        prompt = f"""
        I need to research the following claim: "{claim}"
        
        Please identify 5 key search terms or phrases that would be most effective for 
        finding relevant academic research about this claim. Focus on specific technical terms
        and combinations that would yield scientific papers.
        
        Return only the keywords separated by commas, with no additional text.
        """
        
        try:
            content = self.llm_service.call_gemini_api(prompt)
            keywords = content.split(',')
            return [k.strip() for k in keywords]
        except LLMRequestError as e:
            logger.error(f"Error extracting keywords with LLM: {str(e)}")
            # Fallback to simple keywords if API fails
            logger.info("Using simple keyword extraction as fallback")
            return self._fallback_keyword_extraction(claim)
    
    def _fallback_keyword_extraction(self, claim: str) -> List[str]:
        """
        Simple keyword extraction as fallback when LLM is unavailable.
        
        Args:
            claim: The claim to extract keywords from
            
        Returns:
            List of keywords
        """
        words = claim.lower().split()
        # Remove common words
        stopwords = ['a', 'an', 'the', 'and', 'or', 'but', 'if', 'because', 'as', 'what', 'when', 'where', 'how', 'why', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'for', 'of', 'on', 'to', 'with', 'by', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'causes']
        keywords = [word for word in words if word not in stopwords]
        if 'causes' in words:
            # Make sure we include what's being caused
            causes_index = words.index('causes')
            if causes_index > 0 and causes_index < len(words) - 1:
                keywords = [words[causes_index-1], words[causes_index], words[causes_index+1]]
        
        # Create combination search terms
        if len(keywords) >= 2:
            combinations = []
            for i in range(len(keywords) - 1):
                combinations.append(f"{keywords[i]} {keywords[i+1]}")
            keywords.extend(combinations[:2])  # Add up to 2 combinations
        
        # Ensure we have at least the main content words
        return keywords[:5]  # Limit to 5 keywords
    
    def extract_paper_findings(self, papers: List[Dict[str, Any]], claim: str) -> List[Dict[str, Any]]:
        """
        Extract key findings from each paper relevant to the claim.
        
        Args:
            papers: List of paper dictionaries
            claim: The claim being fact-checked
            
        Returns:
            Enhanced papers with findings and relevance assessment
        """
        if not papers:
            return []
        
        enhanced_papers = []
        
        for i, paper in enumerate(papers):
            try:
                title = paper.get('title', f'Paper {i+1}')
                snippet = paper.get('snippet', 'No abstract available')
                
                # Skip if snippet is too short
                if len(snippet) < 50:
                    paper['relevance'] = 'Low'
                    paper['key_findings'] = 'Abstract too short to extract meaningful findings.'
                    enhanced_papers.append(paper)
                    continue
                
                prompt = f"""
                CLAIM: "{claim}"
                
                PAPER TITLE: {title}
                
                PAPER ABSTRACT:
                {snippet}
                
                Based solely on the abstract above, answer these questions:
                
                1. How relevant is this paper to evaluating the claim (High/Medium/Low)?
                2. What are the key findings or conclusions from this paper that relate to the claim?
                3. Does this paper support, refute, or provide neutral evidence regarding the claim?
                
                Format your response ONLY as a strict JSON object with this structure:
                {{
                    "relevance": "High|Medium|Low",
                    "key_findings": "2-3 sentence summary of findings relevant to the claim",
                    "position": "Supports|Refutes|Neutral"
                }}
                
                Return ONLY valid JSON without any additional text, comments, or explanations.
                """
                
                content = self.llm_service.call_gemini_api(prompt)
                
                # Try to parse the JSON response
                try:
                    findings = self.llm_service.parse_json_response(content)
                    # Add findings to the paper dict
                    paper.update(findings)
                except json.JSONDecodeError:
                    # Set defaults if parsing fails
                    paper['relevance'] = 'Low'
                    paper['key_findings'] = 'Unable to extract findings from paper abstract.'
                    paper['position'] = 'Neutral'
            
            except Exception as e:
                logger.error(f"Error processing paper {i+1}: {str(e)}")
                paper['relevance'] = 'Unknown'
                paper['key_findings'] = 'Error processing paper.'
                paper['position'] = 'Neutral'
            
            enhanced_papers.append(paper)
        
        return enhanced_papers
    
    def analyze_with_llm(self, claim: str, papers: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyze the claim against the papers using LLM.
        
        Args:
            claim: The claim being fact-checked
            papers: List of paper dictionaries with findings
            
        Returns:
            Analysis result as a dictionary
        """
        # Format papers for analysis
        paper_contexts = []
        for i, paper in enumerate(papers, 1):
            snippet = paper.get('snippet', 'No abstract available')
            title = paper.get('title', f'Paper {i}')
            
            # Handle authors - ensure it's a string
            authors = paper.get('authors', [])
            string_authors = []
            for author in authors:
                if isinstance(author, dict):
                    # If author is a dictionary, extract a readable value
                    if 'name' in author:
                        string_authors.append(author['name'])
                    else:
                        # Use first value or stringified dict
                        val = next(iter(author.values())) if author else "Unknown"
                        string_authors.append(str(val))
                else:
                    # If already a string or other type, just convert to string
                    string_authors.append(str(author))
            
            # Now join the string authors
            authors_text = ', '.join(string_authors) if string_authors else 'Unknown'
                
            year = paper.get('year', 'Unknown year')
            
            # Include key findings and position if available
            key_findings = paper.get('key_findings', '')
            position = paper.get('position', 'Not assessed')
            relevance = paper.get('relevance', 'Not assessed')
            
            paper_context = f"""
            PAPER {i}:
            Title: {title}
            Authors: {authors_text}
            Year: {year}
            Relevance: {relevance}
            Position: {position}
            Abstract/Snippet: {snippet}
            Key Findings: {key_findings}
            """
            paper_contexts.append(paper_context)
        
        all_context = '\n\n'.join(paper_contexts)
        
        prompt = f"""
        CLAIM TO FACT-CHECK: "{claim}"
        
        RESEARCH EVIDENCE:
        {all_context}
        
        Based ONLY on the research evidence provided above, provide a comprehensive fact-check analysis:
        
        1. Assess whether the claim is "Supported", "Refuted", or "Lacks Sufficient Evidence".
        2. Provide a detailed explanation (5-7 sentences) summarizing the evidence and reasoning behind your assessment.
        3. For each paper, briefly describe how it relates to the claim and what specific evidence it provides.
        
        Format your response as a strict JSON object with the following structure:
        {{
            "assessment": "Supported|Refuted|Lacks Sufficient Evidence",
            "explanation": "Your detailed explanation here.",
            "paper_analyses": [
                {{
                    "paper_number": 1, 
                    "relation_to_claim": "Brief description of how this paper relates to the claim"
                }},
                ...
            ]
        }}
        
        IMPORTANT: Return ONLY valid JSON without any additional text, comments, or formatting. 
        Ensure that all quotes are properly escaped and there are no trailing commas.
        """
        
        try:
            content = self.llm_service.call_gemini_api(prompt)
            logger.debug(f"Raw LLM response: {content}")
            
            # Try to parse the JSON response
            try:
                return self.llm_service.parse_json_response(content)
            except json.JSONDecodeError as e:
                logger.error(f"JSON decode error: {str(e)}")
                # Return a fallback assessment with manual extraction
                return {
                    "assessment": "Lacks Sufficient Evidence",
                    "explanation": "Unable to properly analyze the evidence due to technical issues.",
                    "paper_analyses": []
                }
                
        except LLMRequestError as e:
            logger.error(f"Error with LLM API for analysis: {str(e)}")
            # Return a fallback assessment
            return {
                "assessment": "Lacks Sufficient Evidence",
                "explanation": "Unable to properly analyze the evidence due to technical issues.",
                "paper_analyses": []
            }
    
    def generate_human_friendly_response(self, result: Dict[str, Any], papers: List[Dict[str, Any]]) -> str:
        """
        Create a formatted, user-friendly response from the fact-checking results.
        
        Args:
            result: The fact-check result
            papers: List of papers with findings
            
        Returns:
            Formatted markdown response
        """
        claim = result.get


    def generate_human_friendly_response(self, result: Dict[str, Any], papers: List[Dict[str, Any]]) -> str:
        """
        Create a formatted, user-friendly response from the fact-checking results.
        
        Args:
            result: The fact-check result
            papers: List of papers with findings
            
        Returns:
            Formatted markdown response
        """
        claim = result.get("claim", "")
        assessment = result.get("assessment", "Unknown")
        explanation = result.get("explanation", "No explanation available.")
        paper_analyses = result.get("paper_analyses", [])
        
        # Create an appropriate emoji based on assessment
        if assessment == "Supported":
            emoji = "✅"
            assessment_color = "GREEN"
        elif assessment == "Refuted":
            emoji = "❌"
            assessment_color = "RED" 
        else:  # Lacks Sufficient Evidence
            emoji = "⚠️"
            assessment_color = "YELLOW"
        
        # Format the response nicely with line breaks and sections
        response = f"""
# Fact Check: "{claim}"

## Assessment: {emoji} {assessment} {emoji}

**{explanation}**

## Research Summary:
"""
        # Add detailed analysis of each paper
        for i, paper in enumerate(papers, 1):
            title = paper.get('title', f'Paper {i}')
            authors = ', '.join(paper.get('authors', [])) if paper.get('authors') else 'Unknown'
            year = paper.get('year', '')
            findings = paper.get('key_findings', 'No specific findings extracted.')
            position = paper.get('position', 'Not determined')
            relevance = paper.get('relevance', 'Not assessed')
            
            # Find the corresponding analysis from paper_analyses
            paper_analysis = next((p for p in paper_analyses if p.get("paper_number") == i), None)
            relation = paper_analysis.get("relation_to_claim", "Relation to claim not specified.") if paper_analysis else "Relation to claim not specified."
            
            response += f"""
### Paper {i}: {title}
**Authors:** {authors} ({year})
**Relevance:** {relevance}
**Position on Claim:** {position}
**Key Findings:** {findings}
**Analysis:** {relation}

"""
        
        # Add citations section
        response += f"""
## References:
"""
        for i, paper in enumerate(papers, 1):
            title = paper.get('title', f'Paper {i}')
            url = paper.get('url', '#')
            response += f"{i}. [{title}]({url})\n"
        
        # Add a conclusion
        response += f"""
## Bottom Line:
This fact check was conducted using scientific research papers and academic sources. The assessment is based on the available evidence at the time of checking. As scientific understanding evolves, assessments may change with new research.
        """
        
        return response
    
    async def fact_check(self, claim: str) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
        """
        Run the complete fact-checking pipeline on a claim.
        
        Args:
            claim: The claim to fact-check
            
        Returns:
            Tuple of (fact check result, enhanced papers)
            
        Raises:
            Various exceptions depending on what part of the pipeline fails
        """
        logger.info(f"Starting fact-check for claim: '{claim}'")
        
        # Step 1: Extract keywords
        keywords = self.extract_keywords(claim)
        logger.info(f"Extracted keywords: {keywords}")
        
        # Step 2: Search for relevant papers
        papers = self.search_service.search_papers(keywords, settings.PAPER_SEARCH_LIMIT)
        logger.info(f"Found {len(papers)} relevant papers")
        
        # Step 3: Extract findings from each paper
        if papers:
            enhanced_papers = self.extract_paper_findings(papers, claim)
            logger.info("Extracted findings from papers")
        else:
            enhanced_papers = []
        
        # Step 4: Analyze with LLM
        if enhanced_papers:
            analysis = self.analyze_with_llm(claim, enhanced_papers)
        else:
            analysis = {
                "assessment": "Lacks Sufficient Evidence",
                "explanation": "No relevant research papers were found to evaluate this claim.",
                "paper_analyses": []
            }
        
        # Step 5: Prepare final response
        references = []
        for paper in enhanced_papers:
            title = paper.get('title', 'Untitled')
            url = paper.get('url', '#')
            references.append({"title": title, "url": url})
        
        result = {
            "claim": claim,
            "assessment": analysis.get("assessment"),
            "explanation": analysis.get("explanation"),
            "paper_analyses": analysis.get("paper_analyses", []),
            "references": references
        }
        
        return result, enhanced_papers