"""
Food Trends Tracker - SERP API + Groq
Simple and clean implementation using only SERP API and Groq
"""

import os
from datetime import datetime
import json
from serpapi import GoogleSearch
from groq import Groq

class FoodTrendsTracker:
    def __init__(self, require_ai=True):
        # Initialize Groq AI
        groq_api_key = os.getenv('GROQ_API_KEY')
        if not groq_api_key:
            raise ValueError("GROQ_API_KEY is required. Get free key at: https://console.groq.com")
        
        self.ai_client = Groq(api_key=groq_api_key)
        self.ai_model = 'llama-3.1-8b-instant'
        print("🚀 Groq AI initialized")
        
        # Initialize SERP API
        self.serpapi_key = os.getenv('SERPAPI_KEY')
        if not self.serpapi_key:
            raise ValueError("SERPAPI_KEY is required. Get free key at: https://serpapi.com/users/sign_up")
        
        print("🔍 SERP API initialized")
    
    def get_trending_foods_from_search(self):
        """Get actual trending foods from Google Search results"""
        print("🔍 Searching Google for trending foods...")
        
        search_queries = [
            "viral food Latest",
            "trending food recipes Latest",
            "popular food trends Latest",
            "viral recipes Latest",
            "trending desserts Latest",
            "viral food products Latest",
            "trending food products Latest"
        ]
        
        trending_foods = []
        
        for query in search_queries:
            try:
                print(f"   → Searching: {query}")
                params = {
                    "engine": "google",
                    "q": query,
                    "api_key": self.serpapi_key,
                    "num": 20  # Get more results
                }
                
                search = GoogleSearch(params)
                results = search.get_dict()
                
                # Extract food names from organic results
                if "organic_results" in results:
                    for result in results["organic_results"][:10]:
                        title = result.get("title", "")
                        snippet = result.get("snippet", "")
                        
                        # Use AI to extract food names from title and snippet
                        food_items = self._extract_food_names_with_ai(title, snippet)
                        trending_foods.extend(food_items)
                        
                print(f"   ✓ Found results for: {query}")
                        
            except Exception as e:
                print(f"   ✗ Error searching '{query}': {str(e)}")
        
        # Remove duplicates and count mentions
        food_counts = {}
        for food in trending_foods:
            food_lower = food.lower()
            food_counts[food_lower] = food_counts.get(food_lower, 0) + 1
        
        # Create scored list (mentions = popularity score)
        scored_foods = []
        for food, count in food_counts.items():
            scored_foods.append({
                'keyword': food.title(),
                'interest_score': count * 10,  # Scale mentions to score
                'source': 'google_search',
                'mentions': count
            })
        
        # Sort by score
        scored_foods.sort(key=lambda x: x['interest_score'], reverse=True)
        
        print(f"✅ Found {len(scored_foods)} unique trending foods from search results")
        return scored_foods[:20]  # Return top 20
    
    def _extract_food_names_with_ai(self, title, snippet):
        """Extract food names from search result using AI"""
        try:
            prompt = f"""Extract ONLY specific, named food dishes or recipes from this text.

RULES:
- Return ONLY actual food names (e.g., "butter board", "Dubai chocolate", "tanghulu")
- DO NOT return generic terms like "food trends", "recipes", "viral food", "trending desserts"
- DO NOT return food categories like "desserts", "snacks", "meals"
- DO NOT return ingredients alone like "chocolate", "cheese" unless it's a specific dish
- Each item must be a specific, complete food name
- If NO specific named foods are found, return EMPTY

Text: {title}. {snippet}

Return format: comma-separated list of specific food names ONLY, or EMPTY if none found.
Example: butter board, Dubai chocolate, tanghulu, marry me chicken"""

            response = self.ai_client.chat.completions.create(
                model=self.ai_model,
                messages=[
                    {'role': 'system', 'content': 'You extract SPECIFIC food dish names from text. You return ONLY actual named dishes, NEVER generic terms or categories. Return comma-separated names or EMPTY.'},
                    {'role': 'user', 'content': prompt}
                ],
                temperature=0.1,  # Very low for strict extraction
                max_tokens=100
            )
            
            result = response.choices[0].message.content.strip()
            
            # Filter out generic/invalid responses
            invalid_terms = ['none', 'no foods', 'n/a', 'empty', 'food', 'recipe', 'trending', 'viral', 'popular', 'latest']
            result_lower = result.lower()
            
            if not result or any(term in result_lower for term in invalid_terms):
                return []
            
            # Split by comma and clean
            foods = [f.strip() for f in result.split(',') if f.strip() and len(f.strip()) > 2]
            
            # Filter out generic terms
            specific_foods = []
            for food in foods:
                food_lower = food.lower()
                # Skip if it's too generic
                if any(generic in food_lower for generic in ['food trend', 'viral food', 'trending', 'recipe collection', 'food ideas']):
                    continue
                specific_foods.append(food)
            
            return specific_foods
            
        except Exception as e:
            return []
    
    def get_google_trends(self, keywords=None):
        """Get Google Trends data via SERP API - searching for general food trends"""
        if keywords is None:
            # General food trend queries for discovering emerging trends
            keywords = [
                'Viral food',
                'trending food',
                'Food trends',
                'popular recipes',
                'Genz food',
                'Viral Recipes',
            ]
        
        print(f"🔍 Fetching Google Trends for {len(keywords)} food trends...")
        trends_data = []
        related_foods = []
        
        try:
            # Combine all keywords into comma-separated query (SERP API accepts up to 5 queries)
            query = ','.join(keywords[:5])  # Limit to 5 as per SERP API docs
            print(f"   → Querying: {query}")
            
            params = {
                "engine": "google_trends",
                "q": query,
                "data_type": "TIMESERIES",
                "api_key": self.serpapi_key
            }
            
            search = GoogleSearch(params)
            results = search.get_dict()
            
            print(f"   → Full API Response Keys: {results.keys()}")
            
            if "interest_over_time" in results and "timeline_data" in results["interest_over_time"]:
                timeline = results["interest_over_time"]["timeline_data"]
                print(f"   → Timeline data points: {len(timeline)}")
                
                if timeline and len(timeline) > 0:
                    # Check structure of first timeline item
                    first_item = timeline[0]
                    print(f"   → First item keys: {first_item.keys()}")
                    print(f"   → Number of values in first item: {len(first_item.get('values', []))}")
                    
                    # Process each query's results - match by query name
                    for keyword in keywords[:5]:
                        try:
                            # Extract values for this specific keyword by matching query field
                            values = []
                            for item in timeline:
                                item_values = item.get("values", [])
                                # Find the value object that matches this keyword
                                for val_obj in item_values:
                                    if val_obj.get("query") == keyword:
                                        extracted = val_obj.get("extracted_value")
                                        if extracted is not None:
                                            values.append(extracted)
                                        break
                            
                            if values:
                                avg_interest = sum(values) / len(values)
                                trends_data.append({
                                    'keyword': keyword,
                                    'interest_score': int(avg_interest),
                                    'source': 'serpapi'
                                })
                                print(f"   ✓ {keyword}: Score {int(avg_interest)} (from {len(values)} data points)")
                            else:
                                print(f"   ✗ {keyword}: No valid data points")
                        except Exception as e:
                            print(f"   ✗ {keyword}: Parse error - {str(e)}")
                else:
                    print(f"   ✗ Timeline is empty or invalid")
            else:
                print(f"   ✗ Missing 'interest_over_time' or 'timeline_data' in response")
            
            # Extract related queries (actual trending foods)
            if "related_queries" in results:
                related_queries = results["related_queries"]
                print(f"   → Found related_queries section")
                
                # Process both "top" and "rising" related queries
                for query_type in ["top", "rising"]:
                    if query_type in related_queries:
                        queries_list = related_queries[query_type]
                        print(f"   → Found {len(queries_list)} {query_type} related queries")
                        
                        for query_item in queries_list[:10]:  # Limit to top 10 per type
                            query_text = query_item.get("query", "")
                            extracted_value = query_item.get("extracted_value", 0)
                            
                            if query_text and extracted_value > 0:
                                related_foods.append({
                                    'keyword': query_text,
                                    'interest_score': extracted_value,
                                    'source': f'serpapi_related_{query_type}',
                                    'type': query_type
                                })
                                print(f"   ✓ Found {query_type} food: {query_text} (Score: {extracted_value})")
        
        except Exception as e:
            print(f"   ✗ Error: {str(e)}")
            import traceback
            traceback.print_exc()
        
        # Combine base trends with related foods
        all_trends = trends_data + related_foods
        print(f"✅ Collected {len(trends_data)} base trends + {len(related_foods)} related foods = {len(all_trends)} total")
        return all_trends
    
    
    def analyze_with_ai(self, google_data, trending_foods=None):
        """Analyze trends with Groq AI - Generate innovative food product ideas"""
        print("🤖 Analyzing trends with Groq AI to generate product ideas...")
        
        # Create a readable summary of the trends
        trend_summary = "\n".join([
            f"- {item['keyword']}: Interest Score {item['interest_score']}/100"
            for item in google_data
        ])
        
        # Create trending foods summary if available
        trending_foods_summary = ""
        if trending_foods and len(trending_foods) > 0:
            trending_foods_summary = "\n\nTRENDING FOODS FROM SEARCH:\n" + "\n".join([
                f"🔥 {food['name']}: Score {food['score']}/100"
                for food in trending_foods
            ])
        
        data_summary = f"""
Google Search Results - Actual Trending Foods:
{trend_summary}
{trending_foods_summary}
"""
        
        prompt = f"""You are a creative food industry innovation consultant. Your job is to generate INNOVATIVE product ideas for the specific trending foods found in Google Search results.

🎯 CRITICAL RULES:
1. ONLY analyze foods that are EXPLICITLY listed in the data below
2. SKIP generic terms like "viral food", "trending recipes", "food trends" 
3. Focus on SPECIFIC named foods with scores > 20
4. Each trend MUST use the EXACT food name from the list

📊 TRENDING FOODS FROM GOOGLE SEARCH:
{trend_summary}

💡 YOUR CREATIVE TASK:
For EACH specific named food (not generic keywords):
- Use the EXACT food name from the data
- Explain WHY this food is trending (cultural relevance, social media, taste, nostalgia, etc.)
- Generate 3-5 CREATIVE and INNOVATIVE product ideas featuring this food
- Think outside the box: new formats, fusion concepts, meal kits, beverages, retail products
- Be specific and actionable in your product concepts

Example Analysis:
If data shows "Dubai Chocolate: Score 50" → Create trend for Dubai Chocolate with ideas like:
  - Dubai Chocolate Ice Cream Bars
  - DIY Dubai Chocolate Making Kit
  - Dubai Chocolate Protein Shake
  - Dubai Chocolate Cheesecake Fusion

If data shows "viral food: Score 10" → SKIP (too generic, not a specific food)

📋 OUTPUT FORMAT for each SPECIFIC FOOD with score > 20:
1. Trend Name: [EXACT food name from data]
2. Category: Viral/Dessert/Cuisine/Beverage/Snack/Fusion
3. Description: Why [food name] is trending, its appeal, cultural context (2-3 sentences)
4. Innovation Potential: High (70+), Medium (50-69), Low (20-50) based on score
5. Target Market: Specific demographic who would buy this
6. Product Ideas: 3-5 creative, specific, actionable product concepts featuring this food

✨ BE CREATIVE with product ideas, but STRICT about only using foods from the data!

JSON structure:
{{
  "report_date": "2024-01-01",
  "summary": "Creative product innovation analysis for X trending foods from Google Search",
  "trends": [
    {{
      "name": "[EXACT FOOD NAME from data]",
      "category": "Viral/Dessert/Cuisine/etc",
      "description": "Why [EXACT FOOD] is trending: [cultural context, appeal, why people love it]",
      "innovation_potential": "High/Medium/Low",
      "target_market": "Specific demographic",
      "product_ideas": [
        "[Creative product 1 with EXACT FOOD]",
        "[Creative product 2 with EXACT FOOD]",
        "[Creative product 3 with EXACT FOOD]",
        "[Creative product 4 with EXACT FOOD]"
      ]
    }}
  ]
}}

Return empty trends array if no specific food names with score > 20 exist.
"""
        
        try:
            messages = [
                {
                    'role': 'system',
                    'content': 'You are a creative food product innovator. You ONLY analyze foods explicitly listed in the provided data - NEVER make up food trends. For each food from the data, you generate highly creative and innovative product ideas. Return valid JSON only.'
                },
                {
                    'role': 'user',
                    'content': f"{prompt}\n\nData:\n{data_summary}"
                }
            ]
            
            response = self.ai_client.chat.completions.create(
                model=self.ai_model,
                messages=messages,
                temperature=0.7,  # Higher temperature for creative product ideas, but strict prompt keeps it grounded
                max_tokens=3000,
                response_format={"type": "json_object"}
            )
            
            analysis = json.loads(response.choices[0].message.content.strip())
            analysis['report_date'] = datetime.now().strftime('%Y-%m-%d')
            print(f"✅ Found {len(analysis.get('trends', []))} trends")
            return analysis
            
        except Exception as e:
            print(f"❌ AI analysis error: {e}")
            return {
                'error': str(e),
                'report_date': datetime.now().strftime('%Y-%m-%d'),
                'trends': []
            }
    
    def run(self):
        """Searches Google for trending foods and analyzes with AI"""
        print("🍔 Food Trends Tracker\n")
        
        # Get actual trending foods from Google Search
        trending_foods = self.get_trending_foods_from_search()
        
        # Analyze with AI - only using Google Search results
        analysis = self.analyze_with_ai(trending_foods, trending_foods)
        
        output_file = f"trends_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, 'w') as f:
            json.dump(analysis, f, indent=2)
        
        print(f"\n✅ Saved: {output_file}")
        print(f"\n📊 {analysis.get('summary', '')}\n")
        
        print("🔥 Top Trending Foods:")
        for i, food in enumerate(trending_foods[:10], 1):
            print(f"{i}. {food['keyword']} - Score: {food['interest_score']}")
        
        print("\n💡 Product Innovation Ideas:")
        for i, trend in enumerate(analysis.get('trends', [])[:5], 1):
            print(f"{i}. {trend['name']} - {trend['category']}")
        
        return analysis


if __name__ == '__main__':
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    # Run tracker
    tracker = FoodTrendsTracker()
    results = tracker.run()

