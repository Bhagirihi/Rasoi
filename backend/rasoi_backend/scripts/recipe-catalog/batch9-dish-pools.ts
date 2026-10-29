/** 25 base dishes per category — combined with 4 style prefixes → 100 unique titles each. */
export const BATCH9_STYLE_PREFIXES = ['', 'Classic', 'Homestyle', 'Chef-style'] as const;

export const BATCH9_RECIPES_PER_CATEGORY = 100;

export const BATCH9_CATEGORY_IDS = [
  'chinese',
  'italian',
  'mexican',
  'thai',
  'continental',
  'jain',
  'vegan',
  'vegetarian',
  'high-protein',
  'healthy',
  'weight-loss',
  'kids-special',
  'diabetic-friendly',
] as const;

export type Batch9CategoryId = (typeof BATCH9_CATEGORY_IDS)[number];

export const BATCH9_DISH_POOLS: Record<Batch9CategoryId, readonly string[]> = {
  chinese: [
    'Mapo Tofu', 'Kung Pao Chicken', 'Sweet and Sour Pork', 'Char Siu Pork', 'Wonton Soup',
    'Hot and Sour Soup', 'Dan Dan Noodles', 'Chow Mein', 'Fried Rice', 'Steamed Dumplings',
    'Spring Rolls', 'Peking Duck Pancakes', 'Szechuan Eggplant', 'Garlic Bok Choy', 'Beef Broccoli',
    'Sesame Chicken', 'Orange Chicken', 'Honey Walnut Shrimp', 'Egg Foo Young', 'Hot Pot',
    'Scallion Pancakes', 'Ma Po Eggplant', 'Three Cup Chicken', 'Salt and Pepper Squid', 'Tea Eggs',
  ],
  italian: [
    'Margherita Pizza', 'Spaghetti Carbonara', 'Penne Arrabbiata', 'Lasagna', 'Risotto Milanese',
    'Mushroom Risotto', 'Pesto Pasta', 'Aglio e Olio', 'Caprese Salad', 'Minestrone Soup',
    'Bruschetta', 'Focaccia', 'Ravioli Spinach Ricotta', 'Gnocchi Pomodoro', 'Eggplant Parmigiana',
    'Chicken Piccata', 'Osso Buco', 'Tiramisu Cup', 'Panna Cotta', 'Arancini',
    'Calzone', 'Seafood Linguine', 'Polenta Fries', 'Burrata Salad', 'Affogato',
  ],
  mexican: [
    'Chicken Tacos', 'Beef Burrito Bowl', 'Cheese Quesadilla', 'Veg Enchiladas', 'Guacamole Bowl',
    'Nachos Supreme', 'Fajita Platter', 'Churros', 'Elote Cup', 'Black Bean Soup',
    'Pozole Bowl', 'Tostada Stack', 'Carnitas Tacos', 'Fish Tacos', 'Mushroom Tacos',
    'Salsa Verde Rice', 'Mexican Street Corn Salad', 'Chipotle Bean Bowl', 'Tamale Plate', 'Huevos Rancheros',
    'Taco Salad', 'Seven Layer Dip', 'Pico de Gallo Bowl', 'Chicken Tortilla Soup', 'Mango Salsa Bowl',
  ],
  thai: [
    'Pad Thai', 'Green Curry', 'Red Curry', 'Tom Yum Soup', 'Tom Kha Soup',
    'Basil Chicken Stir Fry', 'Pineapple Fried Rice', 'Mango Sticky Rice', 'Som Tam Salad', 'Massaman Curry',
    'Panang Curry', 'Thai Basil Fried Rice', 'Larb Salad', 'Satay Skewers', 'Coconut Soup',
    'Drunken Noodles', 'Thai Yellow Curry', 'Cashew Chicken', 'Thai Fish Cakes', 'Spring Roll Basket',
    'Papaya Salad', 'Thai Iced Tea Jelly', 'Coconut Rice', 'Thai Omelette', 'Lemongrass Soup',
  ],
  continental: [
    'Grilled Chicken Steak', 'Caesar Salad', 'Shepherd Pie', 'Fish and Chips', 'Mushroom Soup',
    'Creamy Pasta Bake', 'Roast Vegetable Platter', 'Garlic Bread', 'Stuffed Bell Peppers', 'Coleslaw Bowl',
    'Mashed Potato Bowl', 'Chicken Schnitzel', 'Beef Stew', 'Garden Salad', 'Quiche Lorraine',
    'Ratatouille', 'Baked Mac and Cheese', 'Corn Chowder', 'Grilled Salmon', 'Chicken Alfredo',
    'Veggie Burger Plate', 'French Onion Soup', 'Stuffed Mushrooms', 'Herb Rice Pilaf', 'Bread Pudding',
  ],
  jain: [
    'Jain Pav Bhaji', 'Jain Dal Tadka', 'Jain Khichdi', 'Jain Biryani', 'Jain Pulao',
    'Raw Banana Sabzi', 'Arbi Masala', 'Jain Kadhi', 'Jain Thepla', 'Jain Dhokla',
    'Jain Handvo', 'Jain Undhiyu', 'Jain Kachori', 'Jain Samosa', 'Jain Poha',
    'Jain Idli', 'Jain Dosa', 'Jain Uttapam', 'Jain Paratha', 'Jain Chole',
    'Jain Rajma', 'Jain Paneer Tikka', 'Jain Aloo Mutter', 'Jain Tomato Soup', 'Jain Fruit Custard',
  ],
  vegan: [
    'Vegan Buddha Bowl', 'Tofu Stir Fry', 'Chickpea Curry', 'Vegan Biryani', 'Lentil Soup',
    'Vegan Pasta Primavera', 'Avocado Toast Plate', 'Vegan Tacos', 'Coconut Dal', 'Mushroom Pepper Fry',
    'Vegan Fried Rice', 'Roasted Veg Quinoa', 'Peanut Noodle Bowl', 'Vegan Burger', 'Jackfruit Curry',
    'Vegan Pad Thai', 'Hummus Veg Plate', 'Vegan Pizza', 'Sweet Potato Bowl', 'Vegan Korma',
    'Tempeh Bowl', 'Vegan Sambar', 'Spinach Lentil Stew', 'Vegan Wrap', 'Coconut Chia Pudding',
  ],
  vegetarian: [
    'Paneer Butter Masala', 'Palak Paneer', 'Malai Kofta', 'Chole Bhature', 'Dal Makhani',
    'Veg Biryani', 'Paneer Tikka', 'Mushroom Masala', 'Aloo Gobi', 'Baingan Bharta',
    'Veg Pulao', 'Paneer Paratha', 'Stuffed Capsicum', 'Veg Hakka Noodles', 'Paneer Fried Rice',
    'Veg Manchurian', 'Kadhi Pakora', 'Dum Aloo', 'Navratan Korma', 'Veg Seekh Kebab',
    'Paneer Bhurji', 'Veg Cutlet', 'Corn Palak', 'Methi Malai Matar', 'Shahi Paneer',
  ],
  'high-protein': [
    'Grilled Chicken Breast', 'Egg White Omelette', 'Paneer Tikka Bowl', 'Protein Dal Bowl', 'Soya Chunk Curry',
    'Chicken Salad Bowl', 'Fish Tikka Plate', 'Moong Dal Chilla', 'Quinoa Paneer Bowl', 'Greek Yogurt Parfait',
    'Tandoori Chicken Plate', 'Egg Bhurji Bowl', 'Lentil Paneer Bowl', 'Chicken Keema Bowl', 'Sprout Chaat Bowl',
    'Protein Upma', 'Chana Masala Bowl', 'Grilled Fish Plate', 'Paneer Salad Bowl', 'Egg Curry Bowl',
    'Sattu Drink Bowl', 'Rajma Protein Bowl', 'Mutton Keema Plate', 'Tofu Protein Bowl', 'Protein Khichdi',
  ],
  healthy: [
    'Steamed Veg Bowl', 'Quinoa Salad', 'Grilled Fish Salad', 'Oats Upma', 'Sprout Salad',
    'Brown Rice Bowl', 'Millet Khichdi', 'Steamed Idli Plate', 'Ragi Dosa', 'Bajra Roti Bowl',
    'Palak Soup', 'Beetroot Salad', 'Cucumber Mint Bowl', 'Steamed Momo Plate', 'Fruit Nut Bowl',
    'Vegetable Clear Soup', 'Grilled Paneer Salad', 'Lemon Herb Rice', 'Roasted Sweet Potato', 'Green Smoothie Bowl',
    'Multigrain Roti Plate', 'Steamed Broccoli Bowl', 'Tomato Basil Soup', 'Herb Chicken Salad', 'Avocado Salad',
  ],
  'weight-loss': [
    'Clear Vegetable Soup', 'Grilled Salad Bowl', 'Moong Dal Soup', 'Steamed Fish Plate', 'Cabbage Stir Fry',
    'Bottle Gourd Soup', 'Lauki Sabzi', 'Cucumber Raita Bowl', 'Palak Soup', 'Tomato Soup',
    'Grilled Chicken Salad', 'Sprout Bowl', 'Ragi Porridge', 'Oats Khichdi', 'Steamed Veg Plate',
    'Lemon Coriander Soup', 'Zucchini Noodles', 'Cauliflower Rice Bowl', 'Egg White Salad', 'Mushroom Soup',
    'Mixed Veg Steamer', 'Herb Grilled Fish', 'Spinach Lentil Soup', 'Low Oil Khichdi', 'Detox Salad',
  ],
  'kids-special': [
    'Cheese Sandwich', 'Veg Pasta', 'Mini Idli Plate', 'Banana Pancakes', 'Cheese Paratha',
    'Veg Nuggets', 'Fruit Custard Cup', 'Mild Fried Rice', 'Butter Toast', 'Corn Cheese Balls',
    'Mini Dosa', 'Veg Cutlet Plate', 'Chocolate Milkshake Bowl', 'Mac and Cheese', 'Veg Pizza Slice',
    'Aloo Tikki Plate', 'Mild Dal Rice', 'Fruit Salad Cup', 'Paneer Cubes Plate', 'Veg Maggi Bowl',
    'Cheese Omelette', 'Mild Chicken Soup', 'Sweet Corn Cup', 'Mini Uttapam', 'Honey Toast',
  ],
  'diabetic-friendly': [
    'Bajra Khichdi', 'Methi Thepla', 'Jowar Roti Plate', 'Karela Sabzi', 'Methi Dal',
    'Ragi Dosa', 'Bajra Rotla', 'Lauki Chana Dal', 'Mixed Millet Bowl', 'Steamed Veg Khichdi',
    'Palak Methi Sabzi', 'Brown Rice Pulao', 'Moong Dal Chilla', 'Bitter Gourd Soup', 'Sprout Usal',
    'Ragi Porridge', 'Multigrain Roti', 'Tomato Dal', 'Cabbage Peas Sabzi', 'Cucumber Raita',
    'Bottle Gourd Dal', 'Methi Paratha', 'Steamed Fish Curry', 'Chana Salad', 'Low GI Veg Bowl',
  ],
};

export const BATCH9_CATEGORY_META: Record<
  Batch9CategoryId,
  { region: string; descriptionPrefix: string; defaultProtein: string; group: 'international' | 'diet' }
> = {
  chinese: {
    region: 'Central',
    descriptionPrefix: 'a Chinese classic with balanced soy, ginger, and wok flavour.',
    defaultProtein: 'Tofu',
    group: 'international',
  },
  italian: {
    region: 'Central',
    descriptionPrefix: 'an Italian comfort dish with herbs, olive oil, and slow savour.',
    defaultProtein: 'Paneer',
    group: 'international',
  },
  mexican: {
    region: 'Central',
    descriptionPrefix: 'a Mexican-inspired plate with beans, corn, and bright salsa notes.',
    defaultProtein: 'Rajma',
    group: 'international',
  },
  thai: {
    region: 'Central',
    descriptionPrefix: 'a Thai-style dish with coconut, basil, and tangy lime balance.',
    defaultProtein: 'Tofu',
    group: 'international',
  },
  continental: {
    region: 'Central',
    descriptionPrefix: 'a continental plate with grilled, baked, or creamy European comfort.',
    defaultProtein: 'Paneer',
    group: 'international',
  },
  jain: {
    region: 'West',
    descriptionPrefix: 'a Jain-friendly dish without onion or garlic, made for everyday thali meals.',
    defaultProtein: 'Tuver dal',
    group: 'diet',
  },
  vegan: {
    region: 'Central',
    descriptionPrefix: 'a fully plant-based vegan dish with no dairy or animal products.',
    defaultProtein: 'Tofu',
    group: 'diet',
  },
  vegetarian: {
    region: 'Central',
    descriptionPrefix: 'a vegetarian favourite with paneer, dal, or seasonal vegetables.',
    defaultProtein: 'Paneer',
    group: 'diet',
  },
  'high-protein': {
    region: 'Central',
    descriptionPrefix: 'a high-protein meal built for strength, satiety, and everyday fitness.',
    defaultProtein: 'Chicken',
    group: 'diet',
  },
  healthy: {
    region: 'Central',
    descriptionPrefix: 'a wholesome healthy plate with lighter oil and nutrient-rich ingredients.',
    defaultProtein: 'Moong dal',
    group: 'diet',
  },
  'weight-loss': {
    region: 'Central',
    descriptionPrefix: 'a light weight-loss friendly dish with controlled calories and clean flavours.',
    defaultProtein: 'Moong dal',
    group: 'diet',
  },
  'kids-special': {
    region: 'Central',
    descriptionPrefix: 'a mild, kid-friendly dish that is easy to eat and quick to love.',
    defaultProtein: 'Paneer',
    group: 'diet',
  },
  'diabetic-friendly': {
    region: 'Central',
    descriptionPrefix: 'a diabetic-friendly dish with low-GI grains, fibre, and gentle seasoning.',
    defaultProtein: 'Bajra atta',
    group: 'diet',
  },
};
