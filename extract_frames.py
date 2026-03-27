from PIL import Image
import os

gif_path = "reference.gif"
output_dir = "screenshots"
os.makedirs(output_dir, exist_ok=True)

with Image.open(gif_path) as im:
    num_frames = getattr(im, "n_frames", 1)
    print(f"Total frames: {num_frames}")
    
    # Extract around 5 key frames
    interval = max(1, num_frames // 5)
    for i in range(0, num_frames, interval):
        im.seek(i)
        im.convert("RGB").save(f"{output_dir}/section_{i}.png")
        print(f"Saved {output_dir}/section_{i}.png")
