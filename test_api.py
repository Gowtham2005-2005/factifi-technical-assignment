#!/usr/bin/env python3
import requests
import json
import time
import sys
import os
from typing import List, Dict, Any

# Configuration
API_URL = "http://localhost:8000/api/v1/fact-check"
TEST_CASES_FILE = "test_cases.txt"
OUTPUT_DIRECTORY = "test_results"
DELAY_BETWEEN_REQUESTS = 1  # seconds
REQUEST_TIMEOUT = 30  # seconds

def read_test_cases(filename: str) -> List[str]:
    """Read test cases from a file, filtering out comments and empty lines."""
    claims = []
    with open(filename, 'r') as f:
        current_category = None
        for line in f:
            line = line.strip()
            if not line:
                continue
            if line.startswith("#"):
                continue
            if line.startswith("##"):
                current_category = line[2:].strip()
                continue
            if line.startswith("-"):
                claim = line[1:].strip()
                claims.append(claim)
    return claims

def make_api_request(claim: str) -> Dict[Any, Any]:
    """Make an API request to the fact-checking service using requests library."""
    try:
        headers = {
            "accept": "application/json",
            "Content-Type": "application/json"
        }
        payload = {"claim": claim}
        
        response = requests.post(
            API_URL, 
            headers=headers,
            json=payload,
            timeout=REQUEST_TIMEOUT
        )
        
        # Raise an exception for 4XX/5XX responses
        response.raise_for_status()
        
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error making request for claim: {claim}")
        print(f"Error: {str(e)}")
        return {"error": str(e)}
    except json.JSONDecodeError:
        print(f"Error decoding JSON response for claim: {claim}")
        return {"error": "Invalid JSON response"}
    except Exception as e:
        print(f"Unexpected error for claim: {claim}")
        print(f"Error: {str(e)}")
        return {"error": str(e)}

def save_result(claim: str, result: Dict[Any, Any], directory: str) -> None:
    """Save the API result to a file."""
    if not os.path.exists(directory):
        os.makedirs(directory)
    
    # Create safe filename from claim
    safe_filename = "".join(c if c.isalnum() else "_" for c in claim)
    safe_filename = safe_filename[:50]  # Limit filename length
    
    filepath = os.path.join(directory, f"{safe_filename}.json")
    
    with open(filepath, 'w') as f:
        json.dump(result, f, indent=2)
    
    print(f"Result saved to {filepath}")

def main():
    # Ensure requests library is available
    try:
        import requests
    except ImportError:
        print("The 'requests' library is required. Install it using 'pip install requests'")
        sys.exit(1)
    
    # Create output directory if it doesn't exist
    if not os.path.exists(OUTPUT_DIRECTORY):
        os.makedirs(OUTPUT_DIRECTORY)
    
    # Read test cases
    try:
        claims = read_test_cases(TEST_CASES_FILE)
    except Exception as e:
        print(f"Error reading test cases: {str(e)}")
        sys.exit(1)
    
    print(f"Found {len(claims)} claims to test")
    
    # Process each claim
    for i, claim in enumerate(claims):
        print(f"\nTesting claim {i+1}/{len(claims)}: '{claim}'")
        
        result = make_api_request(claim)
        
        # Print a summary of the result
        if "error" in result:
            print(f"Request failed: {result['error']}")
        else:
            assessment = result.get("assessment", "Unknown")
            print(f"Assessment: {assessment}")
        
        # Save the full result
        save_result(claim, result, OUTPUT_DIRECTORY)
        
        # Delay to avoid overwhelming the API
        if i < len(claims) - 1:
            print(f"Waiting {DELAY_BETWEEN_REQUESTS} seconds before next request...")
            time.sleep(DELAY_BETWEEN_REQUESTS)
    
    print("\nAll tests completed!")

if __name__ == "__main__":
    main()