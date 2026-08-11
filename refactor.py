import os
import re


def process_dir(directory):
    count = 0
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.js', '.jsx', '.tsx')):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original_content = content
                
                # Remove next-themes
                content = re.sub(r"import\s+\{\s*ThemeProvider\s*\}\s+from\s+['\"`]next-themes['\"`];?\s*", "", content)
                content = re.sub(r"<ThemeProvider[^>]*>", "<>", content)
                content = re.sub(r"</ThemeProvider>", "</>", content)
                
                # Remove dark classes
                content = re.sub(r"dark:[a-zA-Z0-9_\-\[\]/#]+", "", content)
                
                # Dark mode hardcoded colors -> Light mode
                content = content.replace("bg-[#09090b]", "bg-[#f7f9fc]")
                content = content.replace("bg-[#09090B]", "bg-[#f7f9fc]")
                content = content.replace("bg-zinc-950", "bg-[#f7f9fc]")
                content = content.replace("bg-zinc-900", "bg-white")
                content = content.replace("bg-[#18181b]", "bg-white")
                content = content.replace("bg-[#1A1A1A]", "bg-white")
                
                # Caution: blindly replacing bg-black might break some Overlays. 
                # Instead, we will target specific background utilities used in backgrounds
                
                # Dark borders -> Light borders
                content = content.replace("border-white/10", "border-[#183964]/10")
                content = content.replace("border-white/20", "border-[#183964]/20")
                content = content.replace("border-zinc-800", "border-[#183964]/10")
                content = content.replace("border-zinc-900", "border-[#183964]/5")
                
                # Text colors -> Navy Blue / Dark Gray
                # Many buttons have text-white. If we replace text-white with text-[#183964], buttons will break.
                # Let's NOT replace text-white blindly.
                # Let's replace text-zinc-400 and text-zinc-500
                content = content.replace("text-[#E4E4E7]", "text-[#4b5563]")
                content = content.replace("text-zinc-400", "text-[#4b5563]")
                content = content.replace("text-zinc-500", "text-[#6b7280]")
                content = content.replace("text-zinc-300", "text-[#4b5563]")
                
                # Yellow -> Orange
                content = content.replace("text-[#FFB800]", "text-[#f36c21]")
                content = content.replace("text-yellow-500", "text-[#f36c21]")
                content = content.replace("bg-[#FFB800]", "bg-[#f36c21]")
                content = content.replace("bg-yellow-500", "bg-[#f36c21]")
                content = content.replace("border-[#FFB800]", "border-[#f36c21]")
                content = content.replace("border-yellow-500", "border-[#f36c21]")
                content = content.replace("text-[#ECA500]", "text-[#f36c21]")
                content = content.replace("bg-[#ECA500]", "bg-[#f36c21]")
                content = content.replace("border-[#ECA500]", "border-[#f36c21]")

                # Admin specific 
                content = content.replace("text-[#A1A1AA]", "text-[#6b7280]")
                content = content.replace("bg-[#121214]", "bg-[#f1f5f9]")
                
                # For layout.js and providers, fix <><>
                content = content.replace("<><>", "<>")
                content = content.replace("</></>", "</>")
                
                if content != original_content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    count += 1
    print(f"Processed {count} files in {directory}")

process_dir(r"d:\freelance\skConstruction\admin\src")
process_dir(r"d:\freelance\skConstruction\career\src")
