#!/usr/bin/env python3
import pandas as pd

# Load the datasets
df1 = pd.read_csv('gradPilot_train.csv')
df2 = pd.read_csv('Synthetic_Admission_Dataset.csv')
df = pd.concat([df1, df2], ignore_index=True)

universities = df['University'].dropna().unique()
print(f'Total unique universities in training data: {len(universities)}')
print('\nUniversities:')
for i, uni in enumerate(universities):
    print(f'{i+1}. {uni}')
