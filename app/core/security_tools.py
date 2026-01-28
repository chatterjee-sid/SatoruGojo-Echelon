import math
import httpx
import json
import csv
import io
from typing import Any, Dict, List, Optional

async def get_ip_threat_score(ip: str) -> Dict[str, Any]:
    """
    Fetches basic threat intelligence/location data for an IP address.
    Using ip-api.com as a free alternative for demonstration.
    Returns a dictionary with status and threat-related info.
    """
    url = f"http://ip-api.com/json/{ip}?fields=status,message,country,city,isp,proxy,hosting"
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=5.0)
            data = response.json()
            
            # Simple heuristic for 'threat score'
            # (In a real app, you'd use VirusTotal or similar)
            is_proxy = data.get("proxy", False)
            is_hosting = data.get("hosting", False)
            
            threat_score = 0.0
            if is_proxy: threat_score += 0.5
            if is_hosting: threat_score += 0.2
            
            return {
                "ip": ip,
                "threat_score": min(threat_score, 1.0),
                "details": data,
                "source": "ip-api.com"
            }
        except Exception as e:
            return {"error": f"Failed to fetch IP data: {str(e)}", "ip": ip}

def calculate_entropy(text: str) -> float:
    """
    Calculates the Shannon entropy of a string.
    Higher entropy indicates more randomness/complexity (potential obfuscation).
    """
    if not text:
        return 0.0
    
    # Calculate character frequencies
    char_counts = {}
    for char in text:
        char_counts[char] = char_counts.get(char, 0) + 1
    
    # Shannon entropy formula: -sum(p * log2(p))
    entropy = 0.0
    length = len(text)
    for count in char_counts.values():
        p = count / length
        entropy -= p * math.log2(p)
    
    return round(entropy, 4)

def parse_logs(data: str, log_format: str = "json") -> List[Dict[str, Any]]:
    """
    Parses logs in JSON or CSV format into a list of dictionaries.
    """
    if log_format.lower() == "json":
        try:
            parsed = json.loads(data)
            return parsed if isinstance(parsed, list) else [parsed]
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            return []
            
    elif log_format.lower() == "csv":
        output = []
        try:
            f = io.StringIO(data.strip())
            reader = csv.DictReader(f)
            for row in reader:
                output.append(dict(row))
            return output
        except Exception as e:
            print(f"CSV Parse Error: {e}")
            return []
            
    else:
        print(f"Unsupported log format: {log_format}")
        return []
