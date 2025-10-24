const CONFIG = {
  GROQ_API_URL: 'https://api.groq.com/openai/v1/chat/completions',
  GROQ_MODEL: 'llama-3.1-8b-instant',
  SERP_API_URL: 'https://serpapi.com/search',
  
  SHEET_NAMES: {
    trending: 'Trending Foods',
    ideas: 'AI Product Ideas',
    settings: 'Settings',
    flavors: 'Flavor Trends'
  },
  
  FOCUS_CATEGORIES: [
    'chocolate',
    'dessert',
    'candy',
    'beverage',
    'snack',
    'ice cream',
    'flavor',
    'sweet'
  ],
  
  SEARCH_QUERIES: [
    'viral chocolate products latest',
    'trending dessert flavors',
    'new candy trends',
    'popular beverage flavors',
    'viral food products',
    'trending snack flavors',
    'viral food Europe latest',
    'trending European flavors',
    'popular European snacks',
    'European dessert trends',
    'viral European products',
    'trending food UK Germany France'
  ],
  
  EMAIL_SUBJECT: '🍫 Daily Food & Flavor Trends Report',
  
  SOCIAL_KEYWORDS: [
    'new chocolate flavor',
    'viral dessert',
    'trending candy',
    'must try snack'
  ]
};

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🍫 Trends Tracker')
      .addItem('🔍 Discover Trends Now', 'discoverTrends')
      .addItem('📧 Send Email Report', 'sendEmailReport')
      .addSeparator()
      .addItem('⚙️ Setup (API Keys & Email)', 'showSetup')
      .addItem('🧪 Test APIs', 'testApis')
      .addSeparator()
      .addItem('📅 Schedule Daily Email', 'setupDailyTrigger')
      .addItem('🗑️ Remove Schedule', 'removeTriggers')
      .addSeparator()
      .addItem('🎨 Customize AI Prompt', 'showPromptEditor')
      .addToUi();
  
  Logger.log('✅ Trends Tracker menu loaded!');
}

function showSetup() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settingsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.settings);
  
  const existingGroqKey = settingsSheet.getRange('B2').getValue() || '';
  const existingSerpKey = settingsSheet.getRange('B3').getValue() || '';
  const existingEmail = settingsSheet.getRange('B4').getValue() || '';
  
  const maskedGroqKey = existingGroqKey ? '••••' + existingGroqKey.slice(-4) : '';
  const maskedSerpKey = existingSerpKey ? '••••' + existingSerpKey.slice(-4) : '';
  
  const html = HtmlService.createHtmlOutput(`
    <style>
      body { 
        font-family: 'Google Sans', Arial, sans-serif; 
        padding: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
      }
      .container {
        background: white;
        color: #333;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      }
      h2 { 
        color: #667eea; 
        margin-top: 0;
      }
      .section { 
        margin: 20px 0; 
        padding: 20px; 
        background: #f8f9fa; 
        border-radius: 10px;
        border-left: 4px solid #667eea;
      }
      .section h3 {
        margin-top: 0;
        color: #764ba2;
      }
      input, textarea { 
        width: 100%; 
        padding: 12px; 
        margin: 8px 0; 
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 14px;
        box-sizing: border-box;
      }
      input:focus, textarea:focus {
        outline: none;
        border-color: #667eea;
      }
      button { 
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white; 
        padding: 12px 24px; 
        border: none; 
        border-radius: 8px; 
        cursor: pointer; 
        margin: 5px;
        font-weight: bold;
        font-size: 14px;
        transition: transform 0.2s;
      }
      button:hover { 
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
      }
      .btn-cancel {
        background: #6c757d;
      }
      .info { 
        background: #e3f2fd; 
        padding: 15px; 
        border-radius: 8px; 
        margin: 15px 0;
        border-left: 4px solid #2196f3;
        color: #0d47a1;
      }
      .info strong {
        color: #1565c0;
      }
      a {
        color: #667eea;
        text-decoration: none;
        font-weight: bold;
      }
      a:hover {
        text-decoration: underline;
      }
      .emoji {
        font-size: 1.5em;
        margin-right: 10px;
      }
    </style>
    
    <div class="container">
      <h2><span class="emoji">🚀</span>Setup Food Trends Tracker</h2>
      
      <div class="info">
        <strong>📝 Quick Setup:</strong><br>
        1. Get free API keys from the links below<br>
        2. Enter your email for daily reports<br>
        3. Click "Save & Test"
      </div>
      
      <div class="section">
        <h3><span class="emoji">🤖</span>Groq AI Key</h3>
        <p>Get your free key: <a href="https://console.groq.com" target="_blank">console.groq.com</a></p>
        <input type="password" id="groqKey" placeholder="${maskedGroqKey || 'gsk_xxxxxxxxxxxxxxxx'}" value="${existingGroqKey}">
        ${existingGroqKey ? '<p style="color: #4caf50; font-size: 12px;">✓ Already configured</p>' : ''}
      </div>
      
      <div class="section">
        <h3><span class="emoji">🔍</span>SERP API Key</h3>
        <p>Get your free key (100 searches/month): <a href="https://serpapi.com/users/sign_up" target="_blank">serpapi.com</a></p>
        <input type="password" id="serpKey" placeholder="${maskedSerpKey || 'Your SERP API key'}" value="${existingSerpKey}">
        ${existingSerpKey ? '<p style="color: #4caf50; font-size: 12px;">✓ Already configured</p>' : ''}
      </div>
      
      <div class="section">
        <h3><span class="emoji">📧</span>Your Email</h3>
        <p>Daily reports will be sent here:</p>
        <input type="email" id="emailAddr" placeholder="your.email@example.com" value="${existingEmail}">
        ${existingEmail ? '<p style="color: #4caf50; font-size: 12px;">✓ Already configured</p>' : ''}
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <button onclick="saveAndTest()">💾 Save & Test</button>
        <button class="btn-cancel" onclick="google.script.host.close()">❌ Cancel</button>
      </div>
      
      <div id="status" style="margin-top: 20px; padding: 15px; border-radius: 8px; display: none;"></div>
    </div>
    
    <script>
      function saveAndTest() {
        const groqKey = document.getElementById('groqKey').value.trim();
        const serpKey = document.getElementById('serpKey').value.trim();
        const email = document.getElementById('emailAddr').value.trim();
        const status = document.getElementById('status');
        
        if (!groqKey && !serpKey && !email) {
          status.style.display = 'block';
          status.style.background = '#ffebee';
          status.style.color = '#c62828';
          status.innerHTML = '⚠️ Please fill in at least one field!';
          return;
        }
        
        if (email && !email.includes('@')) {
          status.style.display = 'block';
          status.style.background = '#ffebee';
          status.style.color = '#c62828';
          status.innerHTML = '⚠️ Please enter a valid email address!';
          return;
        }
        
        status.style.display = 'block';
        status.style.background = '#fff3e0';
        status.style.color = '#e65100';
        status.innerHTML = '⏳ Saving and testing... Please wait...';
        
        google.script.run
          .withSuccessHandler(function() {
            status.style.background = '#e8f5e9';
            status.style.color = '#2e7d32';
            status.innerHTML = '✅ Setup complete! APIs verified. You can close this window.';
            setTimeout(function() {
              google.script.host.close();
            }, 2000);
          })
          .withFailureHandler(function(error) {
            status.style.background = '#ffebee';
            status.style.color = '#c62828';
            status.innerHTML = '❌ Error: ' + error;
          })
          .saveSettingsAndTest(groqKey, serpKey, email);
      }
    </script>
  `)
  .setWidth(600)
  .setHeight(700);
  
  ui.showModalDialog(html, 'Setup Food Trends Tracker');
}

function saveSettingsAndTest(groqKey, serpKey, email) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settingsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.settings);
  
  if (groqKey) settingsSheet.getRange('B2').setValue(groqKey);
  if (serpKey) settingsSheet.getRange('B3').setValue(serpKey);
  if (email) settingsSheet.getRange('B4').setValue(email);
  
  try {
    const currentGroqKey = settingsSheet.getRange('B2').getValue();
    const currentSerpKey = settingsSheet.getRange('B3').getValue();
    
    if (!currentGroqKey || !currentSerpKey) {
      throw new Error('Both API keys are required for testing. Please fill in all fields.');
    }
    
    // Test SERP API
    const serpTest = UrlFetchApp.fetch(CONFIG.SERP_API_URL + '?engine=google&q=test&api_key=' + currentSerpKey);
    
    // Test Groq API
    const groqPayload = {
      model: CONFIG.GROQ_MODEL,
      messages: [{ role: 'user', content: 'Say "API works"' }],
      max_tokens: 10
    };
    
    const groqOptions = {
      method: 'post',
      contentType: 'application/json',
      headers: { 'Authorization': 'Bearer ' + currentGroqKey },
      payload: JSON.stringify(groqPayload),
      muteHttpExceptions: true
    };
    
    const groqTest = UrlFetchApp.fetch(CONFIG.GROQ_API_URL, groqOptions);
    const groqResult = JSON.parse(groqTest.getContentText());
    
    if (groqResult.error) {
      throw new Error('Groq API error: ' + groqResult.error.message);
    }
    
    Logger.log('✅ All APIs verified');
    return true;
    
  } catch (error) {
    throw new Error('API test failed: ' + error.toString());
  }
}

function getSettings() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const settingsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.settings);
  
  const groqKey = settingsSheet.getRange('B2').getValue();
  const serpKey = settingsSheet.getRange('B3').getValue();
  const email = settingsSheet.getRange('B4').getValue();
  
  if (!groqKey || !serpKey) {
    throw new Error('⚠️ Please run "Setup" first to configure API keys!');
  }
  
  return { groqKey, serpKey, email };
}

function discoverTrends() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const settings = getSettings();
    
    ui.alert(
      '🔍 Discovering Trends',
      '⏳ Searching for food & flavor trends...\n\nThis takes about 45-60 seconds.\n\nWait for success message!',
      ui.ButtonSet.OK
    );
    
    Logger.log('🔍 Starting trend discovery...');
    
    const trendingItems = searchForTrendingFoods(settings.serpKey);
    Logger.log('✅ Found ' + trendingItems.length + ' trending items');
    
    const filteredItems = filterByCategories(trendingItems);
    Logger.log('✅ Filtered to ' + filteredItems.length + ' relevant items');
    
    writeTrendingFoodsToSheet(filteredItems);
    
    const aiAnalysis = analyzeWithAI(filteredItems, settings.groqKey);
    Logger.log('✅ AI generated insights');
    
    writeAiIdeasToSheet(aiAnalysis);
    extractAndWriteFlavorTrends(filteredItems, aiAnalysis);
    updateStats(filteredItems.length, aiAnalysis.trends.length);
    
    ui.alert(
      '✅ Trends Discovered!',
      '🔥 Found: ' + filteredItems.length + ' trending items\n' +
      '💡 Generated: ' + aiAnalysis.trends.length + ' product ideas\n\n' +
      '📊 Check the sheets for details!',
      ui.ButtonSet.OK
    );
    
    return { items: filteredItems, analysis: aiAnalysis };
    
  } catch (error) {
    Logger.log('❌ Error: ' + error);
    ui.alert('❌ Error', error.toString(), ui.ButtonSet.OK);
    throw error;
  }
}

function searchForTrendingFoods(serpApiKey) {
  const allItems = [];
  const itemCounts = {};
  const queries = CONFIG.SEARCH_QUERIES;
  
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    Logger.log('📡 Searching: ' + query);
    
    try {
      const url = CONFIG.SERP_API_URL + '?engine=google&q=' + encodeURIComponent(query) + '&num=10&api_key=' + serpApiKey;
      const response = UrlFetchApp.fetch(url);
      const results = JSON.parse(response.getContentText());
      
      if (results.organic_results) {
        for (let j = 0; j < Math.min(8, results.organic_results.length); j++) {
          const result = results.organic_results[j];
          const title = result.title || '';
          const snippet = result.snippet || '';
          const items = extractItemsFromText(title + ' ' + snippet);
          
          items.forEach(function(item) {
            const itemLower = item.toLowerCase();
            itemCounts[itemLower] = (itemCounts[itemLower] || 0) + 1;
          });
        }
      }
      
      Utilities.sleep(2000);
      
    } catch (error) {
      Logger.log('⚠️ Error with query "' + query + '": ' + error);
    }
  }
  
  const scoredItems = [];
  for (let item in itemCounts) {
    scoredItems.push({
      name: capitalizeWords(item),
      score: itemCounts[item] * 10,
      mentions: itemCounts[item],
      source: 'google_search',
      category: categorizeItem(item)
    });
  }
  
  scoredItems.sort(function(a, b) { return b.score - a.score; });
  return scoredItems.slice(0, 30);
}

function extractItemsFromText(text) {
  const items = [];
  const patterns = [
    /(\w+\s+chocolate)/gi,
    /(chocolate\s+\w+)/gi,
    /(\w+\s+cake)/gi,
    /(\w+\s+brownie)/gi,
    /(\w+\s+cookie)/gi,
    /(\w+\s+ice cream)/gi,
    /(\w+\s+candy)/gi,
    /(\w+\s+gummy)/gi,
    /(\w+\s+gummies)/gi,
    /(\w+\s+latte)/gi,
    /(\w+\s+coffee)/gi,
    /(\w+\s+tea)/gi,
    /(\w+\s+smoothie)/gi,
    /(\w+\s+drink)/gi,
    /(\w+\s+chips)/gi,
    /(\w+\s+popcorn)/gi,
    /(\w+\s+crackers)/gi,
    /(salted caramel)/gi,
    /(brown butter)/gi,
    /(cookie butter)/gi,
    /(matcha)/gi,
    /(ube)/gi,
    /(tahini)/gi,
    /(miso)/gi,
    /(yuzu)/gi,
    /(elderflower)/gi,
    /(pistachio)/gi
  ];
  
  patterns.forEach(function(pattern) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(function(match) {
        const cleaned = match.trim().toLowerCase();
        if (cleaned.length > 3 && !cleaned.includes('trending') && !cleaned.includes('viral') && !cleaned.includes('popular') && !cleaned.includes('new')) {
          items.push(cleaned);
        }
      });
    }
  });
  
  return items;
}

function categorizeItem(item) {
  const lowItem = item.toLowerCase();
  
  if (lowItem.includes('chocolate')) return 'Chocolate';
  if (lowItem.includes('cake') || lowItem.includes('brownie') || lowItem.includes('cookie')) return 'Dessert';
  if (lowItem.includes('candy') || lowItem.includes('gummy')) return 'Candy';
  if (lowItem.includes('latte') || lowItem.includes('coffee') || lowItem.includes('tea') || lowItem.includes('drink')) return 'Beverage';
  if (lowItem.includes('chip') || lowItem.includes('popcorn') || lowItem.includes('cracker')) return 'Snack';
  if (lowItem.includes('ice cream')) return 'Ice Cream';
  
  return 'Other';
}

function filterByCategories(items) {
  const focusCategories = CONFIG.FOCUS_CATEGORIES;
  
  return items.filter(function(item) {
    const itemLower = item.name.toLowerCase();
    for (let i = 0; i < focusCategories.length; i++) {
      if (itemLower.includes(focusCategories[i])) return true;
    }
    return false;
  });
}

function analyzeWithAI(items, groqApiKey) {
  let itemList = '';
  items.slice(0, 15).forEach(function(item, index) {
    itemList += (index + 1) + '. ' + item.name + ' (' + item.category + ') - Score: ' + item.score + '\n';
  });
  
  const prompt = `You are a food product innovation consultant specializing in chocolate, desserts, and flavored products.

TRENDING PRODUCTS & FLAVORS:
${itemList}

YOUR TASK:
Analyze these trends and generate INNOVATIVE product ideas for a food company.

Focus on:
- New flavor combinations
- Product format innovations
- Cross-category applications
- Market opportunities

For each trend, provide:
1. Why it's trending (consumer insight)
2. Innovation potential (High/Medium/Low)
3. Target demographic
4. 3-5 specific product ideas that could be launched

Return JSON format:
{
  "summary": "Executive summary of key opportunities",
  "trends": [
    {
      "name": "Trend Name",
      "category": "Chocolate/Dessert/Candy/Beverage/Snack",
      "description": "Why this is trending and what it means",
      "innovation_potential": "High/Medium/Low",
      "target_market": "Demographic details",
      "product_ideas": [
        "Specific product idea 1",
        "Specific product idea 2",
        "Specific product idea 3"
      ]
    }
  ]
}`;

  const response = callGroqAI(prompt, groqApiKey);
  
  try {
    const analysis = JSON.parse(response);
    return analysis;
  } catch (error) {
    Logger.log('AI Response: ' + response);
    return {
      summary: 'Analysis completed with ' + items.length + ' trends',
      trends: []
    };
  }
}

function callGroqAI(prompt, apiKey) {
  const payload = {
    model: CONFIG.GROQ_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a food product innovation expert. Always return valid JSON with actionable insights.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 3000,
    response_format: { type: 'json_object' }
  };
  
  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + apiKey },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  const response = UrlFetchApp.fetch(CONFIG.GROQ_API_URL, options);
  const result = JSON.parse(response.getContentText());
  
  if (result.error) {
    throw new Error('Groq API Error: ' + result.error.message);
  }
  
  return result.choices[0].message.content;
}

function writeTrendingFoodsToSheet(items) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.trending);
  
  sheet.getRange('A2:F1000').clearContent();
  
  const now = new Date();
  items.forEach(function(item, index) {
    const row = index + 2;
    sheet.getRange(row, 1).setValue(item.name);
    sheet.getRange(row, 2).setValue(item.category);
    sheet.getRange(row, 3).setValue(item.score);
    sheet.getRange(row, 4).setValue(item.mentions);
    sheet.getRange(row, 5).setValue(item.source);
    sheet.getRange(row, 6).setValue(now);
  });
  
  sheet.getRange('A1:F1').setFontWeight('bold').setBackground('#8E44AD').setFontColor('white');
  Logger.log('✅ Wrote ' + items.length + ' items to Trending Foods sheet');
}

function writeAiIdeasToSheet(analysis) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.ideas);
  
  sheet.getRange('A2:F1000').clearContent();
  
  let row = 2;
  analysis.trends.forEach(function(trend) {
    if (trend.product_ideas) {
      trend.product_ideas.forEach(function(idea) {
        sheet.getRange(row, 1).setValue(idea);
        sheet.getRange(row, 2).setValue(trend.name);
        sheet.getRange(row, 3).setValue(trend.category);
        sheet.getRange(row, 4).setValue(trend.description);
        sheet.getRange(row, 5).setValue(trend.innovation_potential);
        sheet.getRange(row, 6).setValue(trend.target_market);
        row++;
      });
    }
  });
  
  sheet.getRange('A1:F1').setFontWeight('bold').setBackground('#3498DB').setFontColor('white');
  Logger.log('✅ Wrote AI ideas to sheet');
}

function extractAndWriteFlavorTrends(items, analysis) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.flavors);
  
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAMES.flavors);
    sheet.getRange('A1:D1').setValues([['Flavor/Product', 'Category', 'Trend Strength', 'Notes']]);
  }
  
  sheet.getRange('A2:D1000').clearContent();
  
  let row = 2;
  items.forEach(function(item) {
    sheet.getRange(row, 1).setValue(item.name);
    sheet.getRange(row, 2).setValue(item.category);
    sheet.getRange(row, 3).setValue(item.score);
    sheet.getRange(row, 4).setValue('Mentioned ' + item.mentions + ' times');
    row++;
  });
  
  sheet.getRange('A1:D1').setFontWeight('bold').setBackground('#E74C3C').setFontColor('white');
  Logger.log('✅ Wrote flavor trends');
}

function updateStats(itemCount, ideaCount) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.settings);
  
  sheet.getRange('B5').setValue(new Date());
  sheet.getRange('B6').setValue(itemCount);
  sheet.getRange('B7').setValue(ideaCount);
}

function sendEmailReport() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const settings = getSettings();
    
    if (!settings.email) {
      ui.alert('⚠️ No Email Set', 'Please run Setup and add your email address first.', ui.ButtonSet.OK);
      return;
    }
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const trendingSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.trending);
    const ideasSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.ideas);
    const settingsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.settings);
    
    const lastUpdated = settingsSheet.getRange('B5').getValue();
    const itemCount = settingsSheet.getRange('B6').getValue();
    const ideaCount = settingsSheet.getRange('B7').getValue();
    
    if (!lastUpdated) {
      ui.alert('⚠️ No Data Yet', 'Please run "Discover Trends Now" first!', ui.ButtonSet.OK);
      return;
    }
    
    const trendingData = trendingSheet.getRange('A2:C' + Math.min(11, itemCount + 1)).getValues();
    let trendingHtml = '<ol>';
    trendingData.forEach(function(row) {
      if (row[0]) {
        trendingHtml += '<li><strong>' + row[0] + '</strong> (' + row[1] + ') - Score: ' + row[2] + '</li>';
      }
    });
    trendingHtml += '</ol>';
    
    const ideasData = ideasSheet.getRange('A2:C' + Math.min(11, ideaCount + 1)).getValues();
    let ideasHtml = '<ul>';
    ideasData.forEach(function(row) {
      if (row[0]) {
        ideasHtml += '<li><strong>' + row[0] + '</strong><br><em>Based on: ' + row[1] + ' (' + row[2] + ')</em></li>';
      }
    });
    ideasHtml += '</ul>';
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .header h1 { color: white !important; margin: 0; }
          .header p { color: rgba(255,255,255,0.95); }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .section h2 { color: #667eea; margin-top: 0; }
          .stats { display: flex; justify-content: space-around; margin: 20px 0; }
          .stat { text-align: center; }
          .stat-number { font-size: 2em; font-weight: bold; color: #764ba2; }
          .stat-label { color: #666; }
          ol, ul { padding-left: 20px; }
          li { margin: 10px 0; }
          .footer { text-align: center; color: #999; padding: 20px; font-size: 0.9em; }
          a { color: #667eea; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🍫 Daily Food & Flavor Trends Report</h1>
            <p>Your AI-powered insights for ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="content">
            <div class="stats">
              <div class="stat">
                <div class="stat-number">${itemCount}</div>
                <div class="stat-label">Trending Items</div>
              </div>
              <div class="stat">
                <div class="stat-number">${ideaCount}</div>
                <div class="stat-label">Product Ideas</div>
              </div>
            </div>
            
            <div class="section">
              <h2>🔥 Top Trending Products & Flavors</h2>
              ${trendingHtml}
            </div>
            
            <div class="section">
              <h2>💡 AI-Generated Product Ideas</h2>
              ${ideasHtml}
            </div>
            
            <div class="section" style="text-align: center;">
              <p><strong>📊 View Full Report:</strong></p>
              <a href="${ss.getUrl()}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; border-radius: 5px; text-decoration: none; font-weight: bold;">Open Google Sheet</a>
            </div>
          </div>
          
          <div class="footer">
            <p>Last updated: ${lastUpdated}</p>
            <p>This is an automated report from your Food Trends Tracker</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    GmailApp.sendEmail(
      settings.email,
      CONFIG.EMAIL_SUBJECT + ' - ' + new Date().toLocaleDateString(),
      'Please view this email in HTML format.',
      {
        htmlBody: htmlBody,
        name: 'Food Trends Tracker'
      }
    );
    
    Logger.log('✅ Email sent to: ' + settings.email);
    ui.alert('✅ Email Sent!', 'Report sent to: ' + settings.email, ui.ButtonSet.OK);
    
  } catch (error) {
    Logger.log('❌ Email error: ' + error);
    ui.alert('❌ Error', 'Failed to send email: ' + error.toString(), ui.ButtonSet.OK);
  }
}

function setupDailyTrigger() {
  const ui = SpreadsheetApp.getUi();
  
  const response = ui.alert(
    '📅 Schedule Daily Report',
    'This will:\n\n' +
    '1. Discover trends every day at 9 AM\n' +
    '2. Update the Google Sheet\n' +
    '3. Email you the results\n\n' +
    'Continue?',
    ui.ButtonSet.YES_NO
  );
  
  if (response !== ui.Button.YES) {
    return;
  }
  
  try {
    removeTriggers();
    
    ScriptApp.newTrigger('runDailyReport')
      .timeBased()
      .atHour(9)
      .everyDays(1)
      .create();
    
    Logger.log('✅ Daily trigger created');
    ui.alert(
      '✅ Scheduled!',
      'Daily report will run at 9:00 AM every day.\n\n' +
      'You will receive:\n' +
      '• Updated Google Sheet\n' +
      '• Email report\n\n' +
      'To stop, click "Remove Schedule"',
      ui.ButtonSet.OK
    );
    
  } catch (error) {
    Logger.log('❌ Trigger error: ' + error);
    ui.alert('❌ Error', error.toString(), ui.ButtonSet.OK);
  }
}

function removeTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'runDailyReport') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  Logger.log('✅ Removed all daily triggers');
  
  try {
    SpreadsheetApp.getUi().alert('✅ Removed', 'Daily schedule has been removed.', SpreadsheetApp.getUi().ButtonSet.OK);
  } catch (e) {}
}

function runDailyReport() {
  try {
    Logger.log('🕐 Running scheduled daily report...');
    
    discoverTrends();
    sendEmailReport();
    
    Logger.log('✅ Daily report completed');
    
  } catch (error) {
    Logger.log('❌ Daily report error: ' + error);
    
    const settings = getSettings();
    if (settings.email) {
      GmailApp.sendEmail(
        settings.email,
        '⚠️ Food Trends Tracker - Error Report',
        'The daily report failed to run.\n\nError: ' + error.toString() + '\n\nPlease check your Google Sheet.'
      );
    }
  }
}

function showPromptEditor() {
  const ui = SpreadsheetApp.getUi();
  
  const html = HtmlService.createHtmlOutput(`
    <style>
      body { font-family: Arial; padding: 20px; }
      h3 { color: #667eea; }
      textarea { width: 100%; height: 300px; padding: 10px; font-family: monospace; font-size: 12px; }
      button { background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
      .info { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
    
    <h3>🎨 Customize AI Prompt</h3>
    
    <div class="info">
      <strong>💡 How to customize:</strong><br>
      1. Edit the prompt in Code.gs (line ~450)<br>
      2. The prompt is in the <code>analyzeWithAI</code> function<br>
      3. Modify the instructions to focus on your specific needs<br><br>
      <strong>Example changes:</strong><br>
      • "Focus on premium/luxury products"<br>
      • "Target Gen Z consumers"<br>
      • "Include sustainability aspects"<br>
      • "Analyze health trends"
    </div>
    
    <p><strong>Current prompt location:</strong> Code.gs → analyzeWithAI function</p>
    
    <button onclick="google.script.host.close()">Close</button>
  `)
  .setWidth(600)
  .setHeight(400);
  
  ui.showModalDialog(html, 'Customize AI Prompt');
}

function testApis() {
  const ui = SpreadsheetApp.getUi();
  
  try {
    const settings = getSettings();
    
    ui.alert('🧪 Testing APIs', '⏳ Testing your API keys...', ui.ButtonSet.OK);
    
    // Test SERP API
    const serpTest = UrlFetchApp.fetch(CONFIG.SERP_API_URL + '?engine=google&q=test&api_key=' + settings.serpKey);
    Logger.log('✅ SERP API works');
    
    // Test Groq API
    const groqTest = callGroqAI('Say "API works"', settings.groqKey);
    Logger.log('✅ Groq API works');
    
    ui.alert('✅ Success!', 'Both APIs are working correctly!', ui.ButtonSet.OK);
    
  } catch (error) {
    ui.alert('❌ Error', 'API test failed: ' + error.toString(), ui.ButtonSet.OK);
    Logger.log('❌ API test error: ' + error);
  }
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, function(char) {
    return char.toUpperCase();
  });
}

