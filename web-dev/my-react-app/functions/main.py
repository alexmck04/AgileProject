import os
from firebase_functions import https_fn
from firebase_admin import initialize_app
import joblib 
import pandas as pd
import numpy as np
import json 
from typing import Set

# years for the consoles
LAST_ACTIVE_YEAR = {
    
    '2600': 1992,
    '5200': 1984,
    '7800': 1992,
    'Int': 1984,
    'CV': 1984,
    'GG': 1997,
    'Lynx': 1994,
    'TG16': 1995,
    'VB': 1996,

    'C64': 1992,
    'C128': 1989,
    'Amig': 1996,
    'MSX': 1990,
    'BBCM': 1986,
    'ACPC': 1990,
    'ApII': 1994,
    
    'GEN': 1998,      
    'SCD': 1996,
    'S32X': 1996,
    'SAT': 2000,      
    'DC': 2006,      

    'NES': 1994,   
    'SNES': 1998,    
    'N64': 2002,    
    'GB': 2001,    
    'GBC': 2002,
    'GBA': 2008,   
    'DS': 2008,       
    'DSi': 2009,
    '3DS': 2012,   
    'FDS': 1994,
    'GC': 2007,
    'Wii': 2015,     
    'WiiU': 2017,   
    'iQue': 2006,
    'WS': 2004,

    'PS': 2006,    
    'PS2': 2012,     
    'PS3': 2017,       
    'PSP': 2016,      
    'PSV': 2019, 
    'XB': 2008,
    'X360': 2016,
    '3DO': 1996,
    'CDi': 1999,
    'CD32': 1994,
    'Ouya': 2015,
    'GIZ': 2006,
    'NG': 2001,
    'NGage': 2009,

    # modern consoles
    'And': 2099,
    'iOS': 2099,
    'Linux': 2099,
    'OSX': 2099,
    'WinP': 2030,
    'PS4': 2099,
    'PS5': 2099,
    'XOne': 2099,
    'XS': 2099,
    'NS': 2099,
    'PC': 2099,

    # virtual consoles
    'Arc': 2020,
    'Mob': 2013,
    'OR': 2020,
    'VC': 2019,
    'ZXS': 1992,

    'Series': 2099
}

# ------------------------------------------------------------------------------------

initialize_app()

# --- MODEL LOADING (CRITICAL SECTION: Load inside function body to ensure stability) ---
try:
    model = joblib.load('model.pkl')
    model_columns = joblib.load('model_columns.pkl')
    print("ML Model loaded successfully.")
except Exception as e:
    raise e 

@https_fn.on_request()
def predict_sales(req: https_fn.Request) -> https_fn.Response:
    
    # 1. Handle CORS Preflight (OPTIONS request)
    if req.method == "OPTIONS":
        headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600"
        }
        return https_fn.Response(status=204, headers=headers)

    # 2. Data Retrieval & Processing
    try:
        data = req.get_json()
        input_df = pd.DataFrame(columns=model_columns)
        input_df.loc[0] = 0

        # Map Platform Fixes (MAC -> OSX, PS1 -> PS)
        user_platform_input = data.get('Platform')
        if user_platform_input == "MAC": user_platform_input = "OSX"
        if user_platform_input == "PS1": user_platform_input = "PS"
        
        # Populate input_df features
        if f"genre_{data.get('Genre')}" in input_df.columns:
            input_df.at[0, f"genre_{data.get('Genre')}"] = 1
            
        if f"console_{user_platform_input}" in input_df.columns:
            input_df.at[0, f"console_{user_platform_input}"] = 1
            
        # Regions, Scores, Years
        regions = data.get('Regions', [])
        if 'NA' in regions: input_df.at[0, 'released_na'] = 1
        if 'EU' in regions: input_df.at[0, 'released_eu'] = 1
        if 'Japan' in regions: input_df.at[0, 'released_jp'] = 1
        if 'Other' in regions: input_df.at[0, 'released_other'] = 1

        score = float(data.get('Critic_Score', 70))
        input_df.at[0, 'critic_score'] = (score - 70) / 15.0 

        year = float(data.get('Release_Year', 2015)) 
        input_df.at[0, 'release_year'] = (year - 2007.0) / 5.0
        
        # 3. Initial Prediction
        prediction = model.predict(input_df)[0]
        
        # 4. FINAL OBSOLESCENCE PENALTY LOGIC (DATA-DRIVEN)
        user_year = float(data.get('Release_Year', 2015))
        
        # Check if the platform is in our L.A.Y. list
        if user_platform_input in LAST_ACTIVE_YEAR:
            
            # Get the last active year from the dictionary
            lay = LAST_ACTIVE_YEAR[user_platform_input]
            
            # Apply penalty only if the input year is AFTER the platform's last recorded activity
            if user_year > lay:
                # 99.9% penalty to force sales down to niche/zero level
                penalty_factor = 0.001 
                prediction *= penalty_factor
                
                print(f"Applied L.A.Y. penalty: {user_platform_input} ended in {lay}. New Prediction: {prediction:.4f}")

    except Exception as e:
        # If any part of the prediction logic fails (e.g., missing input), return a 500
        return https_fn.Response(f"Prediction Error: {str(e)}", status=500)
    
    # 5. Final Response (CORS-Compliant and JSON-Correct)
    return https_fn.Response(
        response=json.dumps({"predicted_sales": round(prediction, 2)}),
        status=200,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        }
    )