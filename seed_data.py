#!/usr/bin/env python3
# ============================================================================
# QR MENU PRO - SEED DATA GENERATOR
# ============================================================================
# Run this script to populate demo data into your Supabase database
# Usage: python seed_data.py

import os
import json
from datetime import datetime, timedelta

# Sample seed data
restaurants_data = [
    {
        "name": "The Delhi Bistro",
        "email": "demo@delhibistro.com",
        "phone": "+919876543210",
        "address": "123 Main Street, Delhi",
        "city": "Delhi",
        "country": "India",
        "currency": "INR",
        "subscription_plan": "growth",
        "subscription_status": "active",
    }
]

outlets_data = [
    {
        "name": "Main Branch",
        "slug": "delhi-bistro-main",
        "address": "123 Main Street, Delhi",
        "city": "Delhi",
        "phone": "+919876543210",
        "opening_time": "09:00:00",
        "closing_time": "23:00:00",
        "seating_capacity": 50,
    }
]

categories_data = [
    {"name": "Appetizers", "description": "Starters and small plates"},
    {"name": "Main Courses", "description": "Signature curries and grills"},
    {"name": "Breads", "description": "Naan and other Indian breads"},
    {"name": "Desserts", "description": "Sweet treats"},
    {"name": "Beverages", "description": "Drinks and beverages"},
]

dishes_data = [
    # Appetizers
    {
        "category": "Appetizers",
        "name": "Samosa",
        "description": "Crispy pastry filled with spiced potatoes and peas",
        "price": 80,
        "is_vegetarian": True,
        "spice_level": 2,
    },
    {
        "category": "Appetizers",
        "name": "Paneer Tikka",
        "description": "Cottage cheese marinated and grilled to perfection",
        "price": 180,
        "is_vegetarian": True,
        "spice_level": 3,
    },
    # Main Courses
    {
        "category": "Main Courses",
        "name": "Butter Chicken",
        "description": "Tender chicken in a rich tomato and cream sauce",
        "price": 280,
        "is_vegetarian": False,
        "spice_level": 2,
    },
    {
        "category": "Main Courses",
        "name": "Dal Makhani",
        "description": "Black lentils cooked overnight with spices and cream",
        "price": 220,
        "is_vegetarian": True,
        "spice_level": 2,
    },
    # Breads
    {
        "category": "Breads",
        "name": "Butter Naan",
        "description": "Soft flatbread with a touch of butter",
        "price": 50,
        "is_vegetarian": True,
        "spice_level": 1,
    },
    {
        "category": "Breads",
        "name": "Garlic Naan",
        "description": "Naan topped with fresh garlic",
        "price": 60,
        "is_vegetarian": True,
        "spice_level": 2,
    },
    # Desserts
    {
        "category": "Desserts",
        "name": "Gulab Jamun",
        "description": "Soft dough balls in sugar syrup",
        "price": 120,
        "is_vegetarian": True,
        "spice_level": 0,
    },
    # Beverages
    {
        "category": "Beverages",
        "name": "Mango Lassi",
        "description": "Yogurt-based drink with mango",
        "price": 100,
        "is_vegetarian": True,
        "spice_level": 0,
    },
]

tables_data = [
    {"table_number": "1", "capacity": 2},
    {"table_number": "2", "capacity": 2},
    {"table_number": "3", "capacity": 4},
    {"table_number": "4", "capacity": 4},
    {"table_number": "5", "capacity": 6},
    {"table_number": "6", "capacity": 6},
    {"table_number": "Outdoor-1", "capacity": 4},
    {"table_number": "Bar-1", "capacity": 2},
]

print("""
╔══════════════════════════════════════════════════════════════╗
║         QR MENU PRO - SEED DATA GENERATOR                   ║
║                                                              ║
║  This script generates sample data for demonstration         ║
║  Run this in Supabase SQL Editor or via your ORM            ║
╚══════════════════════════════════════════════════════════════╝
""")

print("\n📝 SEED DATA TO INSERT:\n")

print("1️⃣  RESTAURANTS")
print("-" * 60)
print(json.dumps(restaurants_data, indent=2))

print("\n2️⃣  OUTLETS")
print("-" * 60)
print(json.dumps(outlets_data, indent=2))

print("\n3️⃣  CATEGORIES")
print("-" * 60)
for cat in categories_data:
    print(f"  - {cat['name']}: {cat['description']}")

print("\n4️⃣  DISHES")
print("-" * 60)
for dish in dishes_data:
    print(f"  - {dish['name']} ({dish['category']}): ₹{dish['price']}")

print("\n5️⃣  TABLES")
print("-" * 60)
for table in tables_data:
    print(f"  - {table['table_number']}: {table['capacity']} seats")

print("\n" + "=" * 60)
print("\n✅ INSTRUCTIONS:")
print("""
1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Run the SQL INSERT statements below
4. Or use Supabase Python client to insert
5. Verify data in Table Editor

SAMPLE SQL (run one by one):

-- Insert Restaurant
INSERT INTO restaurants (name, email, phone, city, currency, subscription_plan, subscription_status)
VALUES ('The Delhi Bistro', 'demo@delhibistro.com', '+919876543210', 'Delhi', 'INR', 'growth', 'active');

-- Insert Outlet (replace restaurant_id with actual ID)
INSERT INTO outlets (restaurant_id, name, slug, address, city, opening_time, closing_time, seating_capacity)
VALUES (
  (SELECT id FROM restaurants WHERE email = 'demo@delhibistro.com' LIMIT 1),
  'Main Branch',
  'delhi-bistro-main',
  '123 Main Street, Delhi',
  'Delhi',
  '09:00:00',
  '23:00:00',
  50
);

-- Insert Categories
INSERT INTO categories (outlet_id, name, description, display_order)
SELECT
  (SELECT id FROM outlets WHERE slug = 'delhi-bistro-main' LIMIT 1),
  name,
  description,
  row_number() OVER (ORDER BY name) - 1
FROM (
  VALUES
  ('Appetizers', 'Starters and small plates'),
  ('Main Courses', 'Signature curries and grills'),
  ('Breads', 'Naan and other Indian breads'),
  ('Desserts', 'Sweet treats'),
  ('Beverages', 'Drinks and beverages')
) AS data(name, description);

-- Insert Dishes
INSERT INTO dishes (outlet_id, category_id, name, description, price, is_vegetarian, spice_level, display_order)
SELECT
  (SELECT id FROM outlets WHERE slug = 'delhi-bistro-main' LIMIT 1),
  (SELECT id FROM categories WHERE name = 'Appetizers' LIMIT 1),
  'Samosa',
  'Crispy pastry filled with spiced potatoes and peas',
  80,
  TRUE,
  2,
  0
);

-- Insert Tables
INSERT INTO tables (outlet_id, table_number, qr_code_deep_link, capacity)
SELECT
  (SELECT id FROM outlets WHERE slug = 'delhi-bistro-main' LIMIT 1),
  '1',
  '/m/delhi-bistro-main?table=1',
  2
);

""")

print("\n🎯 NEXT STEPS:")
print("""
1. ✅ Run the SQL INSERT statements
2. ✅ Verify data in Supabase Table Editor
3. ✅ Generate QR codes for tables
4. ✅ Test public menu at /m/delhi-bistro-main
5. ✅ Create a test order
6. ✅ View in dashboard
""")

print("\n" + "=" * 60)
print("\n✨ Demo data setup complete!")
print("\n📝 DEMO LOGIN:")
print("  Email: demo@delhibistro.com")
print("  (Set password during first signup)")
