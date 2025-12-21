import os
import re

def sort_lines_by_name(lines):
    def get_sort_key(line):
        # Remove line number if present (from previous tool output artifcats? No, raw file shouldn't have them)
        # But just in case, strip whitespace.
        line = line.strip()
        if not line:
            return ""
        # If line contains |, use content before |
        if '|' in line:
            return line.split('|')[0].strip().lower()
        return line.lower()

    return sorted(lines, key=get_sort_key)

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.readlines()

    new_content = []
    current_section_lines = []
    
    # Check if this is a file with headers (like Human.md) or just a list (like Fantasy_Food.md)
    # Actually, Fantasy_Food.md STARTS with "List:". Human.md starts with "Male:".
    # All start with a header line ending in ":".
    
    current_header = ""
    
    for line in content:
        stripped = line.strip()
        # Header detection
        if stripped.endswith(':') and not '|' in stripped: # Simple heuristic
             # If we have accumulated lines, sort them and append
            if current_section_lines:
                new_content.extend(sort_lines_by_name(current_section_lines))
                current_section_lines = []
            
            # Append the header line itself
            new_content.append(line)
        else:
            # If it's a content line (and not empty)
            if stripped:
                current_section_lines.append(line)
            else:
                 # It's an empty line. 
                 # If we have accumulating lines, sort them now?
                 # Usually empty lines separate sections or just exist.
                 # Let's treat empty lines as section delimiters too if needed, 
                 # but for now, let's keep them attached to the section or just append them?
                 # Ideally, we want to sort the block of non-empty lines.
                 
                 # Better approach: Collect valid list items.
                 # If we hit an empty line, do we stop sorting?
                 # In Human.md, there is an empty line between sections.
                 
                 if current_section_lines:
                     new_content.extend(sort_lines_by_name(current_section_lines))
                     current_section_lines = []
                 new_content.append(line)
    
    # Flush remaining
    if current_section_lines:
        new_content.extend(sort_lines_by_name(current_section_lines))

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_content)
    print(f"Processed {filepath}")

if __name__ == "__main__":
    target_dir = r"f:\Dev-Foundry\Data\modules\phils-random-names\examples"
    
    for filename in os.listdir(target_dir):
        if filename.endswith(".md"):
             process_file(os.path.join(target_dir, filename))
