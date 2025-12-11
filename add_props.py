import os

files = [
    "/Users/swiveltech/Disk/Swivel/acentra/libs/aurora-design-system/src/icons/AuroraLiveIconChrome.tsx",
    "/Users/swiveltech/Disk/Swivel/acentra/libs/aurora-design-system/src/icons/AuroraLiveIconDice6.tsx",
    "/Users/swiveltech/Disk/Swivel/acentra/libs/aurora-design-system/src/icons/AuroraLiveIconMagnet.tsx",
    "/Users/swiveltech/Disk/Swivel/acentra/libs/aurora-design-system/src/icons/AuroraLiveIconMartini.tsx",
    "/Users/swiveltech/Disk/Swivel/acentra/libs/aurora-design-system/src/icons/AuroraLiveIconMusic.tsx",
    "/Users/swiveltech/Disk/Swivel/acentra/libs/aurora-design-system/src/icons/AuroraLiveIconOrigami.tsx",
    "/Users/swiveltech/Disk/Swivel/acentra/libs/aurora-design-system/src/icons/AuroraLiveIconPlane.tsx",
    "/Users/swiveltech/Disk/Swivel/acentra/libs/aurora-design-system/src/icons/AuroraLiveIconRocket.tsx",
    "/Users/swiveltech/Disk/Swivel/acentra/libs/aurora-design-system/src/icons/AuroraLiveIconSprayCan.tsx",
    "/Users/swiveltech/Disk/Swivel/acentra/libs/aurora-design-system/src/icons/AuroraLiveIconTestTubes.tsx",
    "/Users/swiveltech/Disk/Swivel/acentra/libs/aurora-design-system/src/icons/AuroraLiveIconThumbsDown.tsx",
    "/Users/swiveltech/Disk/Swivel/acentra/libs/aurora-design-system/src/icons/AuroraLiveIconThumbsUp.tsx",
    "/Users/swiveltech/Disk/Swivel/acentra/libs/aurora-design-system/src/icons/AuroraLiveIconWine.tsx"
]

for file_path in files:
    try:
        with open(file_path, "r") as f:
            content = f.read()
        
        if "{...props}" in content:
            print(f"Skipping {file_path}, already has {{...props}}")
            continue
            
        # Find the svg tag start
        svg_start = content.find("<svg")
        if svg_start == -1:
            print(f"Skipping {file_path}, no svg tag found")
            continue
            
        # Find the end of the opening svg tag
        # It's usually ">" but we need to loop carefully in case of > inside attributes (unlikely for svg)
        # But we look effectively for the first ">" after <svg
        svg_open_end = content.find(">", svg_start)
        
        if svg_open_end == -1:
             print(f"Skipping {file_path}, malformed svg tag")
             continue
             
        # Look for the last attribute line to match indentation
        last_newline = content.rfind("\n", svg_start, svg_open_end)
        indentation = "        " # Default
        if last_newline != -1:
            # Find indentation of the line before >
            line_start = last_newline + 1
            # Check how many spaces
            indent_count = 0
            while line_start + indent_count < len(content) and content[line_start + indent_count] == ' ':
                indent_count += 1
            if indent_count > 0:
                indentation = " " * indent_count
        
        # Insert {...props} before the closing >
        # We assume the tag ends with `...attribute="value">` or just `...>`
        # We want to insert it as a new line
        
        new_content = content[:svg_open_end] + "\n" + indentation + "{...props}\n" + indentation + content[svg_open_end:]
        
        # Wait, if there was already a newline and indentation before >, we might be doubling it or messing it up.
        # Let's inspect standard format from the view_file earlier:
        # strokeLinejoin="round"
        # >
        # Wait, the view_file for Chrome.tsx showed:
        # 64:         strokeLinejoin="round"
        # 65:       >
        # So it ends quite cleanly.
        
        # If we insert:
        # strokeLinejoin="round"
        #         {...props}
        #       >
        # The closing > is indented with 6 spaces usually (inside div which is 4, svg is 6?)
        # Let's just blindly insert `        {...props}` before the `>` if it's on a new line, or just append it.
        
        # Let's try to be smarter.
        # If the tag ends with "      >", we replace it with "        {...props}\n      >"
        
        # Let's just replace `strokeLinejoin="round"` with `strokeLinejoin="round"\n        {...props}`
        # This is a bit brittle if that attribute is missing or different, but all these icons seem to be generated/consistent.
        
        if 'strokeLinejoin="round"' in content:
            new_content = content.replace('strokeLinejoin="round"', 'strokeLinejoin="round"\n        {...props}')
        else:
            # Fallback for unexpected format
             print(f"Skipping {file_path}, standard attribute not found")
             continue

        with open(file_path, "w") as f:
            f.write(new_content)
        print(f"Updated {file_path}")

    except Exception as e:
        print(f"Error processing {file_path}: {e}")
