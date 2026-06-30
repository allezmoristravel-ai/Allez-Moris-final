
import os

file_path = r'public\allez-moris-logo-dark-text.svg'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the white filter matrix with a black filter matrix
# Original (White): 0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0
# New (Black):      0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0

old_matrix = 'values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"'
new_matrix = 'values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"'

if old_matrix in content:
    new_content = content.replace(old_matrix, new_matrix)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully modified SVG.")
else:
    print("Error: Could not find target matrix string.")
