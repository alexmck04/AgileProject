import pandas as pd
import joblib 
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import os

import numpy as np


current_dir = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(current_dir, "GameSales_Final_ML.csv")
df = pd.read_csv(csv_path) 

# regions
df['released_na'] = (df['na_sales'] > 0).astype(int)
df['released_eu'] = (df['pal_sales'] > 0).astype(int)
df['released_jp'] = (df['jp_sales'] > 0).astype(int)
df['released_other'] = (df['other_sales'] > 0).astype(int)

# defining inputs
drop_cols = ['total_sales', 'na_sales', 'jp_sales', 'pal_sales', 'other_sales']
X = df.drop(columns=drop_cols, errors='ignore')
y = df['total_sales']

# training model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = RandomForestRegressor(n_estimators=50, random_state=42)
model.fit(X_train, y_train)

# same model and column names
joblib.dump(model, 'functions/model.pkl')
joblib.dump(X.columns.tolist(), 'functions/model_columns.pkl') 

print("ML Model trained successfully using joblib.")
print("Files 'model.pkl' and 'model_columns.pkl' are ready in the 'functions/' directory.")