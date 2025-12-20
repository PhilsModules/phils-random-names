
import re
import os

files = [
    r"f:/Dev-Foundry/Data/modules/phils-random-names/examples/Fantasy_Gemstones.md",
    r"f:/Dev-Foundry/Data/modules/phils-random-names/examples/Fantasy_Plants.md",
    r"f:/Dev-Foundry/Data/modules/phils-random-names/examples/Fantasy_Trinkets.md"
]

pattern = re.compile(r"^.+ \| .+ \[.+\]\s*$")

for file_path in files:
    print(f"Checking {os.path.basename(file_path)}...")
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            for i, line in enumerate(lines):
                line = line.strip()
                if not line or line.startswith("#") or line.startswith("List:"):
                    continue
                
                if not pattern.match(line):
                    print(f"  Line {i+1}: Invalid format -> {line}")
    except Exception as e:
        print(f"  Error reading file: {e}")
    print("Done.\n")
