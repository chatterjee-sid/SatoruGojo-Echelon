import httpx
import asyncio
import json
from app.core.security_tools import calculate_entropy, parse_logs, get_ip_threat_score

async def verify():
    # 1. Verify /predict endpoint
    print("--- Verifying /predict endpoint ---")
    payload = {"data": "test_verification_data"}
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post("http://localhost:8000/predict", json=payload)
            print(f"Server Response: {response.status_code}")
            print(f"Response Body: {json.dumps(response.json(), indent=2)}")
        except Exception as e:
            print(f"Error calling /predict: {e}")

    # 2. Verify Security Toolkit
    print("\n--- Verifying Security Toolkit ---")
    
    # Entropy
    test_str = "H4ck3r_Z0n3_1337"
    entropy = calculate_entropy(test_str)
    print(f"Entropy of '{test_str}': {entropy}")

    # Log Parsing (JSON)
    json_log = '{"timestamp": "2023-10-27T10:00:00Z", "event": "login", "user": "admin"}'
    parsed_json = parse_logs(json_log, "json")
    print(f"Parsed JSON log: {parsed_json}")

    # Log Parsing (CSV)
    csv_log = "timestamp,event,user\n2023-10-27T10:01:00Z,logout,admin"
    parsed_csv = parse_logs(csv_log, "csv")
    print(f"Parsed CSV log: {parsed_csv}")

    # IP Threat Score (Async)
    print("Fetching IP threat score for 8.8.8.8...")
    threat_info = await get_ip_threat_score("8.8.8.8")
    print(f"Threat Info: {json.dumps(threat_info, indent=2)}")

if __name__ == "__main__":
    asyncio.run(verify())
