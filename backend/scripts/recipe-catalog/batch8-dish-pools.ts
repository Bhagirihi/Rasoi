/** 25 base dishes per cuisine — combined with 4 style prefixes → 100 unique titles each. */
export const BATCH8_STYLE_PREFIXES = ['', 'Home-style', 'Festive', 'Quick'] as const;

export const BATCH8_DISH_POOLS: Record<string, readonly string[]> = {
  gujarati: [
    'Undhiyu', 'Handvo', 'Dhokla', 'Khaman', 'Thepla', 'Methi Thepla', 'Dhebra', 'Bajri Rotla',
    'Sev Tameta', 'Ringan nu Shaak', 'Oondhiya', 'Fafda Jalebi', 'Khichu', 'Patra', 'Lilva nu Shaak',
    'Bharela Ringan', 'Mag ni Dal', 'Tuver Dal', 'Khatti Dal', 'Gujarati Kadhi', 'Shrikhand',
    'Basundi', 'Mohanthal', 'Ghughra', 'Muthia',
  ],
  street: [
    'Pav Bhaji', 'Vada Pav', 'Misal Pav', 'Dabeli', 'Pani Puri', 'Bhel Puri', 'Sev Puri',
    'Ragda Pattice', 'Samosa Chaat', 'Kachori Chaat', 'Aloo Tikki', 'Chole Kulche', 'Amritsari Kulcha',
    'Egg Bhurji Pav', 'Bread Pakora', 'Kathi Roll', 'Frankie', 'Keema Pav', 'Bun Maska',
    'Cutting Chai', 'Jalebi Rabri', 'Dahi Vada', 'Papdi Chaat', 'Basket Chaat', 'Tawa Pulao',
  ],
  south: [
    'Masala Dosa', 'Plain Dosa', 'Rava Dosa', 'Neer Dosa', 'Set Dosa', 'Uttapam', 'Idli',
    'Medu Vada', 'Sambar', 'Rasam', 'Avial', 'Poriyal', 'Kootu', 'Pongal', 'Bisi Bele Bath',
    'Lemon Rice', 'Curd Rice', 'Tamarind Rice', 'Coconut Rice', 'Appam', 'Puttu', 'Kerala Stew',
    'Chettinad Chicken', 'Fish Curry', 'Payasam',
  ],
  north: [
    'Dal Makhani', 'Rajma', 'Chole', 'Kadhi Pakora', 'Dum Aloo', 'Baingan Bharta', 'Palak Paneer',
    'Paneer Butter Masala', 'Malai Kofta', 'Aloo Gobi', 'Jeera Rice', 'Pulao', 'Paratha',
    'Aloo Paratha', 'Gobi Paratha', 'Luchi', 'Bedmi Puri', 'Kachori', 'Chole Bhature',
    'Rajma Chawal', 'Kadhi Chawal', 'Stuffed Capsicum', 'Methi Malai Matar', 'Navratan Korma', 'Tandoori Roti',
  ],
  punjabi: [
    'Sarson da Saag', 'Makki di Roti', 'Dal Makhani', 'Amritsari Kulcha', 'Chole Bhature',
    'Paneer Tikka', 'Tandoori Chicken', 'Butter Chicken', 'Amritsari Fish', 'Pinni', 'Rajma',
    'Kadhi Pakora', 'Stuffed Paratha', 'Lassi', 'Gur Halwa', 'Maa ki Dal', 'Bhindi Masala',
    'Aloo Paratha', 'Mutton Curry', 'Keema Matar', 'Egg Curry', 'Baingan Bharta', 'Jeera Rice',
    'Phirni', 'Gobi Paratha',
  ],
  rajasthani: [
    'Dal Baati Churma', 'Gatte ki Sabzi', 'Ker Sangri', 'Pyaaz Kachori', 'Mirchi Vada',
    'Bajra Khichda', 'Mohan Maas', 'Laal Maas', 'Safed Maas', 'Panchmel Dal', 'Ghevar',
    'Malpua', 'Mawa Kachori', 'Besan Chakki', 'Bajra Roti', 'Missi Roti', 'Papad ki Sabzi',
    'Govind Gatta', 'Kalmi Vada', 'Bajra Dhebra', 'Gatta Pulao', 'Haldi ki Sabzi', 'Aloo Pyaz ki Sabzi',
    'Churma Laddoo', 'Rajasthani Kadhi',
  ],
  bengali: [
    'Luchi Alur Dom', 'Shukto', 'Aloo Posto', 'Chingri Malai Curry', 'Kosha Mangsho', 'Fish Fry',
    'Ilish Bhapa', 'Rui Kalia', 'Cholar Dal', 'Mishti Doi', 'Sandesh', 'Rasgulla', 'Mishti Pulao',
    'Macher Jhol', 'Dim er Dalna', 'Labra', 'Begun Bhaja', 'Potol Posto', 'Chorchori',
    'Panta Bhat', 'Aam Pora Shorbot', 'Payesh', 'Nolen Gurer Sandesh', 'Mutton Rezala', 'Bhetki Paturi',
  ],
  maharashtrian: [
    'Misal Pav', 'Pav Bhaji', 'Vada Pav', 'Pithla Bhakri', 'Thalipeeth', 'Bharli Vangi', 'Puran Poli',
    'Modak', 'Sol Kadhi', 'Sabudana Khichdi', 'Kanda Poha', 'Batata Vada',
    'Zunka Bhakri', 'Kolhapuri Chicken', 'Malvani Fish Curry', 'Amti', 'Varan Bhat', 'Taambda Rassa',
    'Pandhra Rassa', 'Shrikhand', 'Basundi', 'Kothimbir Vadi', 'Alu Wadi', 'Masale Bhat', 'Bharli Bhendi',
  ],
  hyderabadi: [
    'Hyderabadi Biryani', 'Mirchi ka Salan', 'Bagara Baingan', 'Haleem', 'Shikampuri Kebab',
    'Double ka Meetha', 'Khubani ka Meetha', 'Dum ka Murgh', 'Kacche Gosht ki Biryani', 'Dalcha',
    'Tamatar ka Kut', 'Qubooli Biryani', 'Pathar ka Gosht', 'Khatti Dal', 'Ande ka Salan',
    'Hyderabadi Marag', 'Osmania Biscuit Chai', 'Sheer Khurma', 'Lukhmi', 'Chakna', 'Talawa Gosht',
    'Dahi Chutney', 'Tamate ka Kut', 'Kaddu ki Kheer', 'Bagara Chawal',
  ],
  goan: [
    'Fish Recheado', 'Goan Fish Curry', 'Pork Vindaloo', 'Chicken Cafreal', 'Bebinca', 'Sannas',
    'Sorpotel', 'Xacuti', 'Prawn Balchao', 'Crab Xec Xec', 'Ambot Tik', 'Goan Sausages',
    'Caldo Verde', 'Ros Omelette', 'Patoleo', 'Khatkhate', 'Sol Kadhi', 'Goan Bread',
    'Mushroom Xacuti', 'Prawn Curry', 'Fish Caldin', 'Chicken Xacuti', 'Doce', 'Bolinhas', 'Neuro',
  ],
  kerala: [
    'Appam Stew', 'Puttu Kadala', 'Avial', 'Erissery', 'Fish Moilee', 'Malabar Parotta', 'Kerala Egg Roast',
    'Beef Fry', 'Chicken Stew', 'Ishtu', 'Thoran', 'Olan', 'Pachadi', 'Kalan', 'Ada Pradhaman',
    'Payasam', 'Kappa Puzhukku', 'Meen Pollichathu', 'Kerala Biryani', 'Chemmeen Curry', 'Nadan Kozhi Curry',
    'Vegetable Stew', 'Banana Fritters', 'Unniyappam', 'Kerala Porotta',
  ],
  chinese: [
    'Veg Manchurian', 'Gobi Manchurian', 'Chilli Paneer', 'Schezwan Paneer', 'Hakka Noodles',
    'Chow Mein', 'Fried Rice', 'Chicken Fried Rice', 'Chilli Chicken', 'Veg Spring Rolls',
    'Hot and Sour Soup', 'Sweet Corn Soup', 'Manchow Soup', 'Triple Schezwan Rice', 'American Chop Suey',
    'Crispy Honey Chilli Potato', 'Dragon Chicken', 'Kung Pao Chicken', 'Szechuan Fried Rice',
    'Paneer 65', 'Baby Corn Manchurian', 'Chilli Garlic Noodles', 'Sizzler', 'Dim Sum', 'Thai Curry',
  ],
  assamese: [
    'Masor Tenga', 'Ou Tenga Maas', 'Duck Roast', 'Khar', 'Aloo Pitika', 'Assamese Pitha', 'Komolar Kheer',
    'Xaak aru Bhaji', 'Bengena Pitika', 'Tenga Dal', 'Pork with Bamboo Shoot', 'Chicken with Bamboo Shoot',
    'Fish Tenga', 'Aloo Kumura', 'Black Sesame Laddoo', 'Pani Pitha', 'Til Pitha', 'Narikol Laru',
    'Masor Petu', 'Haah Kumura', 'Posola Bhaji', 'Kharoli', 'Ou Khatta', 'Pani Komolar Bhaji', 'Jolpan',
  ],
  kashmiri: [
    'Rogan Josh', 'Yakhni', 'Dum Olav', 'Kashmiri Pulao', 'Lyodur Tschaman', 'Shufta', 'Gushtaba',
    'Rista', 'Tabak Maaz', 'Kahwa', 'Modur Pulao', 'Haak', 'Monji Haak', 'Nadir Yakhni', 'Matschgand',
    'Chaman Qaliya', 'Kashmiri Rajma', 'Mutton Yakhni', 'Kokur Yakhni', 'Kashmiri Naan', 'Sheermal',
    'Phirni', 'Shab Deg', 'Aab Gosht', 'Kashmiri Dum Aloo',
  ],
  chettinad: [
    'Chettinad Chicken', 'Pepper Chicken', 'Chettinad Egg Curry', 'Meen Kuzhambu', 'Urlai Roast',
    'Paniyaram', 'Mushroom Chettinad', 'Aattu Kari', 'Seeraga Samba Biryani', 'Milagu Kozhi',
    'Kothamalli Chicken', 'Chettinad Veg Kurma', 'Kara Kuzhi Paniyaram', 'Chettinad Fish Fry',
    'Nattu Kozhi Curry', 'Chettinad Mutton', 'Vendhaya Kuzhambu', 'Chettinad Rasam', 'Kuzhi Paniyaram',
    'Chettinad Crab Masala', 'Kola Urundai', 'Chettinad Prawn Masala', 'Chettinad Brinjal Curry',
    'Chettinad Sambar', 'Chettinad Payasam',
  ],
};

export const BATCH8_CUISINE_META: Record<
  string,
  { region: string; descriptionPrefix: string; defaultProtein: string }
> = {
  gujarati: { region: 'West', descriptionPrefix: 'a Gujarati home-style dish with sweet-savoury balance.', defaultProtein: 'Tuver dal' },
  street: { region: 'North', descriptionPrefix: 'a bold Indian street-food favourite with chatpata flavours.', defaultProtein: 'Bateta' },
  south: { region: 'South', descriptionPrefix: 'a South Indian classic with coconut, spice, and comfort.', defaultProtein: 'Toor dal' },
  north: { region: 'North', descriptionPrefix: 'a hearty North Indian dish for everyday meals.', defaultProtein: 'Paneer' },
  punjabi: { region: 'North', descriptionPrefix: 'a rich Punjabi dish with ghee, spice, and warmth.', defaultProtein: 'Paneer' },
  rajasthani: { region: 'West', descriptionPrefix: 'a Rajasthani dish with desert spices and bold flavour.', defaultProtein: 'Tuver dal' },
  bengali: { region: 'East', descriptionPrefix: 'a Bengali dish balancing mustard, fish, and subtle spice.', defaultProtein: 'Chana dal' },
  maharashtrian: { region: 'West', descriptionPrefix: 'a Maharashtrian dish with kokum, peanut, and spice.', defaultProtein: 'Toor dal' },
  hyderabadi: { region: 'South', descriptionPrefix: 'a Hyderabadi dish with dum cooking and layered spice.', defaultProtein: 'Chicken' },
  goan: { region: 'West', descriptionPrefix: 'a Goan dish with coconut, vinegar, and coastal spice.', defaultProtein: 'Fish' },
  kerala: { region: 'South', descriptionPrefix: 'a Kerala dish with coconut oil, curry leaves, and warmth.', defaultProtein: 'Fish' },
  chinese: { region: 'North', descriptionPrefix: 'an Indo-Chinese wok classic with bold sauce and heat.', defaultProtein: 'Paneer' },
  assamese: { region: 'East', descriptionPrefix: 'an Assamese dish with mustard oil and gentle sourness.', defaultProtein: 'Fish' },
  kashmiri: { region: 'North', descriptionPrefix: 'a Kashmiri dish with saffron, yogurt, and aromatic spice.', defaultProtein: 'Paneer' },
  chettinad: { region: 'South', descriptionPrefix: 'a fiery Chettinad dish with roasted spices and coconut.', defaultProtein: 'Chicken' },
};
