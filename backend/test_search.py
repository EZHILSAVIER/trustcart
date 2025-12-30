import requests
from bs4 import BeautifulSoup
import re

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
]

def test_ddg(query):
    url = "https://www.bing.com/search"
    params = {'q': query}
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    }
    
    print(f"Testing Bing with query: {query}")
    try:
        resp = requests.get(url, params=params, headers=headers, timeout=10)
        print(f"Status: {resp.status_code}")
        print(f"Response Snippet: {resp.content[:500]}") # Debug print
        
        soup = BeautifulSoup(resp.content, "html.parser")
        
        results = []
        links = soup.find_all('a')
        print(f"Found {len(links)} links.")
        for l in links[:20]: # Print first 20 links
            print(f"Link: {l.get('href')}")
            
        # Bing structure: li class="b_algo"
        for item in soup.find_all('li', class_='b_algo'):
            title_tag = item.find('h2')
            if not title_tag: continue
            
            link_tag = title_tag.find('a')
            if not link_tag: continue
            
            link = link_tag['href']
            title_text = link_tag.get_text(strip=True)
            
            snippet_tag = item.find('div', class_='b_caption')
            snippet_text = snippet_tag.get_text(strip=True) if snippet_tag else ""

            # Find price in text
            full_text = title_text + " " + snippet_text
            print(f"[DEBUG] Text: {full_text[:100]}...") # Debug print
            price_regex = re.compile(r"(?:₹|Rs\.?|INR)\s?[\d,]+(?:\.\d{2})?")
            match = price_regex.search(full_text)
            price = match.group(0) if match else "No Price"
            
            results.append({
                "title": title_text,
                "price": price,
                "link": link
            })
            
        return results[:5]
    except Exception as e:
        print(f"Error: {e}")
        return []

if __name__ == "__main__":
    products = ["iPhone 13", "Sony WH-1000XM5"]
    for p in products:
        results = test_ddg(f"buy {p} online amazon flipkart price")
        print(f"\n--- Results for {p} ---")
        for r in results:
            print(r)
