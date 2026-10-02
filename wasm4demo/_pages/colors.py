from PIL import Image
im = Image.open("page.png").convert("RGB")
cols = im.getcolors(200000)
cols.sort(reverse=True)
print("top colors:", cols[:5])
print("distinct:", len(cols))
