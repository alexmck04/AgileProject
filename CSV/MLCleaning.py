import pandas as pd
from sklearn.preprocessing import OneHotEncoder, StandardScaler

# === LOAD THE CLEANED CSV ===
df = pd.read_csv("GameSales_MLReady.csv")

print("\n===== DESCRIPTIVE STATISTICS =====")
print(df.describe(include="all"))

# === Identify columns ===
categorical_cols = ["console", "genre"]
numeric_cols = [col for col in df.columns if col not in categorical_cols]

# === STEP 4 + 5: Missing value handling ===
missing_percent = df.isnull().mean()
cols_to_drop = missing_percent[missing_percent > 0.5].index
df = df.drop(columns=cols_to_drop)

# Fill categorical using .loc to avoid chained assignment warnings
for col in categorical_cols:
    if col in df.columns:
        most_freq = df[col].mode()[0]
        df.loc[:, col] = df[col].fillna(most_freq)

# Fill numeric using .loc
for col in numeric_cols:
    if col in df.columns:
        median_val = df[col].median()
        df.loc[:, col] = df[col].fillna(median_val)

# === STEP 2: One-Hot Encoding ===
ohe = OneHotEncoder(sparse_output=False, handle_unknown="ignore")

encoded_cols = ohe.fit_transform(df[categorical_cols])
encoded_df = pd.DataFrame(encoded_cols, columns=ohe.get_feature_names_out(categorical_cols))

df = df.drop(columns=categorical_cols)
df = pd.concat([df, encoded_df], axis=1)

# === STEP 3: Scaling numeric values ===
scaler = StandardScaler()
scaled_numeric = scaler.fit_transform(df[numeric_cols])
scaled_numeric_df = pd.DataFrame(scaled_numeric, columns=numeric_cols)

df.loc[:, numeric_cols] = scaled_numeric_df

# === SAVE FINAL OUTPUT ===
output_path = "GameSales_Final_ML.csv"
df.to_csv(output_path, index=False)

print("\nSaved final ML-ready file to:", output_path)
