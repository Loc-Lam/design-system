#!/usr/bin/env python3

from PIL import Image, ImageDraw, ImageFont
import os

# Create directory for receipt images
output_dir = "public/images/mock-receipts"
os.makedirs(output_dir, exist_ok=True)

# Receipt data
receipts_data = [
    {
        "filename": "receipt-starbucks.png",
        "store": "STARBUCKS COFFEE",
        "address": ["123 Main Street", "Seattle, WA 98101", "(206) 555-0123"],
        "date": "03/15/2024 09:23:45",
        "items": [
            ("Grande Latte", "$5.45"),
            ("Blueberry Muffin", "$3.25"),
            ("Extra Shot", "$0.75")
        ],
        "subtotal": "$9.45",
        "tax": "$0.85",
        "total": "$10.30",
        "payment": "Credit Card ****1234"
    },
    {
        "filename": "receipt-wholefoods.png",
        "store": "WHOLE FOODS MARKET",
        "address": ["456 Oak Avenue", "Portland, OR 97201", "(503) 555-0456"],
        "date": "03/16/2024 14:15:30",
        "items": [
            ("Organic Bananas (3 lbs)", "$4.47"),
            ("Almond Milk", "$3.99"),
            ("Whole Grain Bread", "$4.49"),
            ("Greek Yogurt (4-pack)", "$5.99"),
            ("Organic Spinach", "$2.99")
        ],
        "subtotal": "$21.93",
        "tax": "$0.00",
        "total": "$19.78",
        "payment": "Debit Card ****9876"
    },
    {
        "filename": "receipt-shell.png",
        "store": "SHELL GAS STATION",
        "address": ["789 Highway 101", "San Francisco, CA 94102", "(415) 555-0789"],
        "date": "03/17/2024 16:42:12",
        "items": [
            ("Regular Unleaded", ""),
            ("12.45 Gallons @ $3.89/gal", "$48.43"),
            ("Car Wash Basic", "$8.99")
        ],
        "subtotal": "$57.42",
        "tax": "$0.00",
        "total": "$57.42",
        "payment": "Credit Card ****2468"
    },
    {
        "filename": "receipt-bestbuy.png",
        "store": "BEST BUY",
        "address": ["321 Tech Boulevard", "Austin, TX 78701", "(512) 555-0321"],
        "date": "03/18/2024 11:28:15",
        "items": [
            ("USB-C Cable (6ft)", "$19.99"),
            ("Wireless Mouse", "$29.99"),
            ("Screen Protector", "$12.99")
        ],
        "subtotal": "$62.97",
        "tax": "$5.14",
        "total": "$68.11",
        "payment": "MasterCard ****5678"
    },
    {
        "filename": "receipt-ubereats.png",
        "store": "UBER EATS",
        "address": ["Order from: Tony's Pizza", "123 Food Street", "Chicago, IL 60601"],
        "date": "03/19/2024 19:35:22",
        "items": [
            ("Margherita Pizza (Large)", "$18.99"),
            ("Caesar Salad", "$8.50"),
            ("Garlic Bread", "$4.99")
        ],
        "subtotal": "$32.48",
        "tax": "$2.92",
        "total": "$46.84",
        "payment": "Credit Card ****4321"
    }
]

def create_receipt_image(data):
    # Create image with white background
    width, height = 400, 600
    img = Image.new('RGB', (width, height), 'white')
    draw = ImageDraw.Draw(img)

    # Try to load a monospace font, fallback to default
    try:
        font_large = ImageFont.truetype("/System/Library/Fonts/Courier.ttc", 16)
        font_medium = ImageFont.truetype("/System/Library/Fonts/Courier.ttc", 14)
        font_small = ImageFont.truetype("/System/Library/Fonts/Courier.ttc", 12)
    except:
        font_large = ImageFont.load_default()
        font_medium = ImageFont.load_default()
        font_small = ImageFont.load_default()

    y = 20

    # Store name (centered)
    store_bbox = draw.textbbox((0, 0), data["store"], font=font_large)
    store_width = store_bbox[2] - store_bbox[0]
    x = (width - store_width) // 2
    draw.text((x, y), data["store"], fill='black', font=font_large)
    y += 25

    # Address (centered)
    for line in data["address"]:
        line_bbox = draw.textbbox((0, 0), line, font=font_small)
        line_width = line_bbox[2] - line_bbox[0]
        x = (width - line_width) // 2
        draw.text((x, y), line, fill='black', font=font_small)
        y += 18

    # Dashed line
    y += 10
    for i in range(20, width-20, 10):
        draw.line([(i, y), (i+5, y)], fill='black', width=1)
    y += 20

    # Date
    draw.text((20, y), data["date"], fill='black', font=font_small)
    y += 25

    # Items
    for item_name, item_price in data["items"]:
        # Item name
        draw.text((20, y), item_name, fill='black', font=font_small)

        # Item price (right aligned)
        if item_price:
            price_bbox = draw.textbbox((0, 0), item_price, font=font_small)
            price_width = price_bbox[2] - price_bbox[0]
            draw.text((width - 20 - price_width, y), item_price, fill='black', font=font_small)
        y += 18

    # Dashed line
    y += 10
    for i in range(20, width-20, 10):
        draw.line([(i, y), (i+5, y)], fill='black', width=1)
    y += 15

    # Totals
    draw.text((20, y), "Subtotal:", fill='black', font=font_small)
    subtotal_bbox = draw.textbbox((0, 0), data["subtotal"], font=font_small)
    subtotal_width = subtotal_bbox[2] - subtotal_bbox[0]
    draw.text((width - 20 - subtotal_width, y), data["subtotal"], fill='black', font=font_small)
    y += 18

    draw.text((20, y), "Tax:", fill='black', font=font_small)
    tax_bbox = draw.textbbox((0, 0), data["tax"], font=font_small)
    tax_width = tax_bbox[2] - tax_bbox[0]
    draw.text((width - 20 - tax_width, y), data["tax"], fill='black', font=font_small)
    y += 18

    # Total (bold line above)
    draw.line([(20, y), (width-20, y)], fill='black', width=2)
    y += 8

    draw.text((20, y), "TOTAL:", fill='black', font=font_medium)
    total_bbox = draw.textbbox((0, 0), data["total"], font=font_medium)
    total_width = total_bbox[2] - total_bbox[0]
    draw.text((width - 20 - total_width, y), data["total"], fill='black', font=font_medium)
    y += 25

    # Payment info
    draw.text((20, y), data["payment"], fill='black', font=font_small)
    y += 30

    # Footer
    draw.text((20, y), "Thank you for your business!", fill='black', font=font_small)
    y += 15

    footer_text = "*** CUSTOMER COPY ***"
    footer_bbox = draw.textbbox((0, 0), footer_text, font=font_small)
    footer_width = footer_bbox[2] - footer_bbox[0]
    x = (width - footer_width) // 2
    draw.text((x, y), footer_text, fill='black', font=font_small)

    return img

# Generate all receipt images
print("Generating mock receipt images...")
for receipt_data in receipts_data:
    img = create_receipt_image(receipt_data)
    filepath = os.path.join(output_dir, receipt_data["filename"])
    img.save(filepath)
    print(f"Created: {filepath}")

print(f"\nAll {len(receipts_data)} receipt images have been generated in {output_dir}/")