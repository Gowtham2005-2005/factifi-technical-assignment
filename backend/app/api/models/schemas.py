# app/api/models/schemas.py
from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class AssessmentType(str, Enum):
    """Possible assessment outcomes for fact-checking."""
    SUPPORTED = "Supported"
    REFUTED = "Refuted"
    INSUFFICIENT = "Lacks Sufficient Evidence"


class RelevanceType(str, Enum):
    """Relevance level of research papers."""
    HIGH = "High"
    MEDIUM = "Medium"
    LOW = "Low"
    UNKNOWN = "Unknown"


class PositionType(str, Enum):
    """Position of paper regarding the claim."""
    SUPPORTS = "Supports"
    REFUTES = "Refutes"
    NEUTRAL = "Neutral"
    NOT_ASSESSED = "Not assessed"


class FactCheckRequest(BaseModel):
    """Request model for fact-checking."""
    claim: str = Field(..., description="The claim to fact-check", min_length=10, max_length=500)


class PaperAuthor(BaseModel):
    """Model for paper author."""
    name: str = Field(..., description="Author name")


class Reference(BaseModel):
    """Model for a research paper reference."""
    title: str = Field(..., description="Paper title")
    url: str = Field(..., description="Paper URL")


class PaperAnalysis(BaseModel):
    """Analysis of a paper in relation to a claim."""
    paper_number: int = Field(..., description="Paper number in the results")
    relation_to_claim: str = Field(..., description="Description of how the paper relates to the claim")


class Paper(BaseModel):
    """Model for a research paper."""
    title: str = Field(..., description="Paper title")
    snippet: str = Field(..., description="Paper abstract or summary")
    url: str = Field("", description="Paper URL")
    authors: List[str] = Field(default_factory=list, description="List of authors")
    year: str = Field("", description="Publication year")
    publication: str = Field("", description="Publication venue")
    citation_count: int = Field(0, description="Number of citations")
    relevance: RelevanceType = Field(RelevanceType.UNKNOWN, description="Relevance to the claim")
    key_findings: str = Field("", description="Key findings related to the claim")
    position: PositionType = Field(PositionType.NOT_ASSESSED, description="Position on the claim")


class FactCheckResponse(BaseModel):
    """Response model for fact-checking results."""
    claim: str = Field(..., description="The claim that was fact-checked")
    assessment: AssessmentType = Field(..., description="Assessment of the claim")
    explanation: str = Field(..., description="Explanation of the assessment")
    paper_analyses: List[PaperAnalysis] = Field(default_factory=list, description="Analyses of papers")
    references: List[Reference] = Field(default_factory=list, description="References")
    papers: List[Paper] = Field(default_factory=list, description="Detailed information about papers")
    human_friendly_response: str = Field("", description="Formatted human-readable response")


class HealthCheckResponse(BaseModel):
    """Response model for health check endpoint."""
    status: str = Field("ok", description="Service status")
    version: str = Field("1.0.0", description="API version")