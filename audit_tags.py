import re

def audit(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    stack = []
    # Simplified regex for tags
    o_tag = re.compile(r'<([a-zA-Z0-9]+)(\s|>)')
    c_tag = re.compile(r'</([a-zA-Z0-9]+)>')
    self_closing = re.compile(r'<([a-zA-Z0-9]+)[^>]*/>')

    for i, line in enumerate(lines):
        line_num = i + 1
        clean = line.split('//')[0]
        
        # Remove self-closing tags
        clean = self_closing.sub('', clean)
        
        # Find opens
        for m in o_tag.finditer(clean):
            tag = m.group(1)
            # Only trace divs, forms, and maybe sections/main for now
            if tag in ['div', 'form', 'section', 'main']:
                stack.append((tag, line_num))
        
        # Find closes
        for m in c_tag.finditer(clean):
            tag = m.group(1)
            if tag in ['div', 'form', 'section', 'main']:
                if stack and stack[-1][0] == tag:
                    stack.pop()
                elif stack:
                    # Mismatch? Let's just pop if the tag is in the stack
                    found = False
                    for j in range(len(stack)-1, -1, -1):
                        if stack[j][0] == tag:
                            stack = stack[:j]
                            found = True
                            break
                    if not found:
                        pass # Stray closure
    
    # Print the remaining stack
    print(f"Remaining Stack Size: {len(stack)}")
    for tag, lpp in stack:
        print(f"Unclosed {tag} from L{lpp}")

if __name__ == "__main__":
    audit('App.tsx')
