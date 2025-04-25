# app/api/endpoints/fact_check.py
from fastapi import APIRouter, Depends, HTTPException, status
import logging
from typing import Dict, Any

from app.api.models.schemas import FactCheckRequest, FactCheckResponse, HealthCheckResponse
from app.services.fact_check_pipeline import FactCheckPipeline
from app.core.exceptions import (
    APIKeyNotFoundError, 
    LLMRequestError, 
    SearchRequestError,
    FactCheckHTTPException
)


# Configure logger
logger = logging.getLogger(__name__)

# Create router
router = APIRouter()


def get_fact_check_pipeline():
    """Dependency to get fact check pipeline instance."""
    try:
        return FactCheckPipeline()
    except APIKeyNotFoundError as e:
        raise FactCheckHTTPException.api_key_error(str(e))
    except Exception as e:
        logger.error(f"Error initializing fact check pipeline: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error initializing fact check service: {str(e)}"
        )


@router.get("/health", response_model=HealthCheckResponse, tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify the service is running.
    
    Returns:
        HealthCheckResponse: Status of the service
    """
    return HealthCheckResponse(status="ok", version="1.0.0")


@router.post("/fact-check", response_model=FactCheckResponse, tags=["Fact Check"])
async def fact_check(
    request: FactCheckRequest,
    pipeline: FactCheckPipeline = Depends(get_fact_check_pipeline)
):
    """
    Fact check a claim using academic research papers.
    
    Args:
        request: The fact check request containing the claim
        pipeline: FactCheckPipeline instance (injected by dependency)
        
    Returns:
        FactCheckResponse: The fact check result with assessment and papers
        
    Raises:
        HTTPException: If there's an error during the fact-checking process
    """
    try:
        # Run the fact-checking pipeline
        result, enhanced_papers = await pipeline.fact_check(request.claim)
        
        # Generate human-friendly response
        human_friendly = pipeline.generate_human_friendly_response(result, enhanced_papers)
        
        # Prepare response
        response = FactCheckResponse(
            claim=result["claim"],
            assessment=result["assessment"],
            explanation=result["explanation"],
            paper_analyses=result["paper_analyses"],
            references=result["references"],
            papers=enhanced_papers,
            human_friendly_response=human_friendly
        )
        
        return response
    
    except LLMRequestError as e:
        logger.error(f"LLM service error: {str(e)}")
        raise FactCheckHTTPException.llm_request_error(str(e))
    
    except SearchRequestError as e:
        logger.error(f"Search service error: {str(e)}")
        raise FactCheckHTTPException.search_request_error(str(e))
    
    except Exception as e:
        logger.error(f"Unexpected error during fact-checking: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during fact-checking: {str(e)}"
        )