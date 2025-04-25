# app/core/exceptions.py
from fastapi import HTTPException, status


class APIKeyNotFoundError(Exception):
    """Raised when an API key is missing."""
    pass


class LLMRequestError(Exception):
    """Raised when there's an issue with LLM request."""
    pass


class SearchRequestError(Exception):
    """Raised when there's an issue with search request."""
    pass


# HTTP exceptions
class FactCheckHTTPException:
    """HTTP exception factory for the application."""
    
    @staticmethod
    def api_key_error(detail: str = "API key not found") -> HTTPException:
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=detail
        )
    
    @staticmethod
    def llm_request_error(detail: str = "Error calling LLM service") -> HTTPException:
        return HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail
        )
    
    @staticmethod
    def search_request_error(detail: str = "Error calling search service") -> HTTPException:
        return HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail
        )
    
    @staticmethod
    def validation_error(detail: str = "Validation error") -> HTTPException:
        return HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail
        )