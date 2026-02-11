---items table---
Column	Type	Description
id	bigint/UUID	Primary key (auto-generated)
product_id	bigint/UUID	Foreign key to products
asset_code	text	Auto-generated asset code
serial_number	text	Serial number
tag_number	text	Asset tag number
status	text	available / in_use / maintenance
location	text	warehouse / office
supplier_name	text	Vendor name
weight	numeric	Weight in kg
invoice_number	text	Invoice/quote reference
purchase_date	date	Date of purchase
purchase_price	numeric	Price paid
notes	text	Additional notes
created_at	timestamp	Auto-generated on create

---products table---
Column	Type	Description
id	bigint/UUID	Primary key (auto-generated)
brand	text	Brand name
model	text	Model name
category_id	bigint/UUID	Foreign key to categories
description	text	Product description

---categories table ---
Column	Type	Description
id	bigint/UUID	Primary key (auto-generated)
name	text	Category name
code	text	Short code (e.g., CCU, IRTX, CAM)