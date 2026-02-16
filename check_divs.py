
import re
import sys

def check_div_balance(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove strings
    content = re.sub(r'"[^"]*"', '""', content)
    content = re.sub(r"'[^']*'", "''", content)
    # Remove comments
    content = re.sub(r'{\s*/\*.*?\*/\s*}', '', content, flags=re.DOTALL)
    content = re.sub(r'//.*', '', content)
    
    lines = content.splitlines()
    count = 0
    
    for i, line in enumerate(lines):
        opened = len(re.findall(r'<div(?!\w)', line))
        self_closed = len(re.findall(r'<div[^>]*/>', line))
        closed = len(re.findall(r'</div', line))
        
        diff = opened - self_closed - closed
        if diff != 0:
            count += diff
            # Only print if balance is unexpectedly high or changes significantly in modal areas
            if i + 1 > 1000:
                 pass
        
        if count < 0:
            print(f"Line {i+1}: {line.strip()}")
            print(f"Negative balance! Count: {count}")
            count = 0 
            
    print(f"Final balance: {count}")

if __name__ == "__main__":
    check_div_balance(sys.argv[1])
