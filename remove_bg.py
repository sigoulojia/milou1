import os
import glob
from rembg import remove
from PIL import Image

def process_images():
    files = glob.glob('*.jpg')
    for file in files:
        print(f"Processing {file}...")
        try:
            input_image = Image.open(file)
            output_image = remove(input_image)
            output_path = file.replace('.jpg', '.png')
            output_image.save(output_path)
            print(f"Saved to {output_path}")
        except Exception as e:
            print(f"Error processing {file}: {e}")

if __name__ == "__main__":
    process_images()
