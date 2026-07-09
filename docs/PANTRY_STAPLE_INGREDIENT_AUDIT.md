# Pantry staple ingredient audit

Generated: 2026-07-05T08:46:30.102Z

## Summary

| Metric | Count |
|--------|------:|
| Supabase published recipes scanned | 5388 |
| JSON catalog recipes scanned | 0 |
| Flagged recipes (merged) | 2865 |

### By severity

| Severity | Meaning | Count |
|----------|---------|------:|
| **P1** | Hero ingredient marked staple | 0 |
| **P2** | Tracked liquid (Pani/Water/Ice) | 0 |
| **P3** | 100% staple bloat | 0 |
| **P4** | Assumed-at-home drives missing UI | 2865 |

### By rule

| Rule | Count |
|------|------:|
| Rule 1 — all_staple_bloat | 0 |
| Rule 2 — hero_as_staple | 0 |
| Rule 3 — tracked_liquid | 0 |
| Rule 4 — assumed_at_home_overlap | 2865 |

## Rule definitions

1. **all_staple_bloat** — Every ingredient has `isStaple: true` (except salt/water-only edge cases).
2. **hero_as_staple** — A title-defining ingredient (Aloo, Paneer, Chicken, …) is marked staple.
3. **tracked_liquid** — Pani, Water, or Ice appears in the structured ingredient array.
4. **assumed_at_home_overlap** — User stocked on hero/distinctive items but missing UI shows only Namak/Tel/Ghee/Haldi.

## P1 — Hero marked staple (sample)

| ID | Title | Heroes [S] | Source |
|---|---|---|---|

## P2 — Tracked liquids (full list)

| ID | Title | Liquids | Source |
|---|---|---|---|

## Full flagged recipes

| Sev | ID | Title | Rules | Source | Suggested fix |
|:---:|---|---|---|---|---|
| P4 | kashmiri-17 | Aab Gosht | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | bengali-54 | Aam Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Rai, Ghee |
| P4 | bengali-319 | Aam Pora Shorbot | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-306 | Aattu Kari | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-45 | Achari Aloo Mutter | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | north-25 | Achari Baingan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | hyderabadi-68 | Achari Gosht Hyderabadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Tel |
| P4 | assamese-53 | Ada Morich Murgi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | kerala-25 | Ada Pradhaman | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | italian-b9-025 | Affogato | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-008 | Aglio e Olio | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-36 | Ajwaini Aloo Kulcha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-64 | Ajwaini Fish Fry Punjabi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | maharashtrian-61 | Aliv Ladoo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | goan-28 | Alle Belle | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | assamese-42 | Aloo Bengena Khar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Namak |
| P4 | household-14 | Aloo Capsicum | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Haldi, Tel, Namak |
| P4 | vegetarian-b9-009 | Aloo Gobi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-01 | Aloo Jeera | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Haldi, Tel, Namak |
| P4 | assamese-312 | Aloo Kumura | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-12 | Aloo Matar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel, Namak |
| P4 | assamese-59 | Aloo Ou Pitika | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | north-03 | Aloo Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | assamese-04 | Aloo Pitika | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | bengali-04 | Aloo Posto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | rajasthani-29 | Aloo Posto Dry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | north-14 | Aloo Puri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Haldi, Tel |
| P4 | rajasthani-24 | Aloo Pyaaz ki Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Haldi |
| P4 | north-291 | Aloo Pyaaz Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | rajasthani-321 | Aloo Pyaz ki Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-309 | Aloo Tikki | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-016 | Aloo Tikki Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-13 | Aloo Tomato | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Haldi, Tel, Namak |
| P4 | maharashtrian-321 | Alu Wadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-24 | Aluchi Patal Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | maharashtrian-60 | Amboli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Tel |
| P4 | goan-309 | Ambot Tik | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-26 | Ambotik Shark Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | chinese-313 | American Chop Suey | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-59 | Amritsari Aloo Wadiyan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | punjabi-53 | Amritsari Anda Kulcha Pocket | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-bread-poha-16 | Amritsari Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-16 | Amritsari Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-16 | Amritsari Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-16 | Amritsari Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-16 | Amritsari Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | punjabi-291 | Amritsari Fish | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel, Namak |
| P4 | punjabi-81 | Amritsari Fish Pakora | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | punjabi-80 | Amritsari Fish Pepper Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-gujarati-handvo-16 | Amritsari Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-16 | Amritsari Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-16 | Amritsari High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-16 | Amritsari Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | punjabi-16 | Amritsari Kulcha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter |
| P4 | ad-mkt-medu-vada-16 | Amritsari Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-16 | Amritsari Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-16 | Amritsari Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-16 | Amritsari Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-16 | Amritsari Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | punjabi-285 | Amritsari Sarson Saag | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-soya-chunk-curry-16 | Amritsari Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-16 | Amritsari Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | maharashtrian-314 | Amti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-06 | Anda Bhurji Pav | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter |
| P4 | hyderabadi-53 | Anda Biryani Hyderabadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | hyderabadi-06 | Anda Khagina | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Kali Mirch |
| P4 | hyderabadi-71 | Anda Khagina Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Ghee |
| P4 | punjabi-06 | Anda Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | north-71 | Anda Methi Keema | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | punjabi-51 | Anda Tawa Bhurji Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | hyderabadi-27 | Ande ka Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Garam Masala, Ghee |
| P4 | hyderabadi-313 | Ande ka Salan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-318 | Appam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-299 | Appam Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-13 | Appam Vegetable Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-285 | Appam with Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Tel |
| P4 | kerala-01 | Appam with Vegetable Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kashmiri-55 | Apricot Rogan Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | italian-b9-020 | Arancini | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-34 | Arbi ka Salan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | jain-b9-007 | Arbi Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | assamese-293 | Assamese Duck Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-285 | Assamese Masor Tenga | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | kerala-03 | Avial | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera |
| P4 | healthy-b9-025 | Avocado Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-007 | Avocado Toast Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-34 | Awadhi Tehri Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | assamese-13 | Baanhgajor Diya Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | assamese-60 | Baanhgajor Duck Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | hyderabadi-66 | Badam ka Ashrafi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | north-57 | Badami Kofta Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | hyderabadi-323 | Bagara Chawal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-32 | Bagara Khana | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | hyderabadi-74 | Baghare Tamatar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | rajasthani-72 | Bajra Corn Handvo Rajasthani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-318 | Bajra Dhebra | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-294 | Bajra Khichda | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Jeera, Hing, Namak |
| P4 | diabetic-friendly-b9-001 | Bajra Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-67 | Bajra Kofta Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-38 | Bajra Methi Roti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-45 | Bajra Raabdi Namkeen | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-313 | Bajra Roti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-010 | Bajra Roti Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-19 | Bajra Roti with Lehsun Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | diabetic-friendly-b9-007 | Bajra Rotla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-52 | Bajre Ki Khichri Lehsuni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-286 | Bajre ki Raab | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | gujarati-306 | Bajri Rotla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-21 | Bajri Rotlo ane Ringan Olo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Jeera |
| P4 | continental-b9-017 | Baked Mac and Cheese | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-36 | Banana Blossom Caldin | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | kerala-321 | Banana Fritters | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-004 | Banana Pancakes | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-35 | Banarasi Tamatar Chaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | bengali-42 | Bandhakopir Ghonto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | ad-mkt-bread-poha-18 | Bangalore Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-18 | Bangalore Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-18 | Bangalore Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-18 | Bangalore Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-18 | Bangalore Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-18 | Bangalore Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-18 | Bangalore Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-18 | Bangalore High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-18 | Bangalore Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-18 | Bangalore Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-18 | Bangalore Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-18 | Bangalore Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-18 | Bangalore Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-18 | Bangalore Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-18 | Bangalore Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-18 | Bangalore Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | maharashtrian-35 | Bangda Kalvan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | bengali-23 | Basanti Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Haldi |
| P4 | thai-b9-006 | Basil Chicken Stir Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-322 | Basket Chaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-64 | Basundi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini |
| P4 | maharashtrian-29 | Batata Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Haldi |
| P4 | maharashtrian-310 | Batata Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-20 | Beans Potato | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Haldi, Tel, Namak |
| P4 | goan-10 | Bebinca | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | goan-83 | Bebinca Layer Cake | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | north-40 | Bedmi Aloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | north-285 | Bedmi Puri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Tel, Namak |
| P4 | north-84 | Bedmi Puri Combo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Tel |
| P4 | chinese-b9-015 | Beef Broccoli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-002 | Beef Burrito Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-306 | Beef Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-013 | Beef Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-08 | Beef Ularthiyathu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | household-34 | Beetroot Raita | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Rai, Tel, Namak |
| P4 | healthy-b9-012 | Beetroot Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-24 | Begun Bhaja | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Lal Mirch Powder, Namak |
| P4 | ad-mkt-bread-poha-12 | Bengali Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-12 | Bengali Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-12 | Bengali Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-12 | Bengali Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-12 | Bengali Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-12 | Bengali Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-12 | Bengali Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-12 | Bengali High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-12 | Bengali Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-12 | Bengali Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-12 | Bengali Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-12 | Bengali Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-12 | Bengali Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-12 | Bengali Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-12 | Bengali Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-12 | Bengali Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | assamese-307 | Bengena Pitika | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-312 | Besan Chakki | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-26 | Besan Chilla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | rajasthani-32 | Besan Gatta Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | bengali-09 | Bhapa Bhetki | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | bengali-31 | Bhapa Ilish | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | assamese-22 | Bhapot Diya Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-73 | Bhapot Koni Paturi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | gujarati-29 | Bharela Karela | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Tel |
| P4 | gujarati-13 | Bharela Marcha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Rai |
| P4 | gujarati-290 | Bharela Ringan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | maharashtrian-77 | Bharit | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | maharashtrian-39 | Bharli Bhendi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | maharashtrian-40 | Bharli Tondli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | north-75 | Bharwan Shimla Mirch | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | hyderabadi-44 | Bheja Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | bengali-298 | Bhetki Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Tel |
| P4 | assamese-37 | Bhetki Khar Tenga | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | gujarati-26 | Bhinda Sambhariya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder |
| P4 | north-15 | Bhindi Do Pyaza | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder, Jeera |
| P4 | household-02 | Bhindi Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel, Namak |
| P4 | punjabi-315 | Bhindi Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-46 | Bhoot Jolokia Anda Jhol | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | hyderabadi-46 | Bhuna Gosht Hyderabadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | street-26 | Bhutte ka Kees | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | rajasthani-53 | Bikaneri Aloo Bhujia Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | south-20 | Bisi Bele Bath | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | diabetic-friendly-b9-014 | Bitter Gourd Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-010 | Black Bean Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-32 | Black Pepper Chicken Stir Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | assamese-313 | Black Sesame Laddoo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-56 | Bohag Bilahi Muror Tenga | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | goan-322 | Bolinhas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-32 | Bombil Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel |
| P4 | maharashtrian-72 | Bombil Kalvan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | assamese-63 | Borali Maach Pani Khar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | bengali-51 | Bori Diye Lau Ghonto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera |
| P4 | assamese-48 | Boror Jool Khar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-14 | Boror Tok Jhol | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | hyderabadi-45 | Boti ka Salan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | hyderabadi-22 | Boti Kebab | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Lal Mirch Powder, Dhania Powder |
| P4 | diabetic-friendly-b9-021 | Bottle Gourd Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-006 | Bottle Gourd Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-20 | Bread Pakora | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel |
| P4 | ad-mkt-bread-poha-01 | Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | continental-b9-025 | Bread Pudding | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-42 | Bread Roll | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel, Namak |
| P4 | ad-mkt-bread-upma-01 | Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | healthy-b9-006 | Brown Rice Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-012 | Brown Rice Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-011 | Bruschetta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-317 | Bun Maska | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-21 | Bun Maska Omelette | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | chinese-08 | Burnt Garlic Noodles | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | italian-b9-024 | Burrata Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-81 | Butter Masala Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter |
| P4 | kids-special-b9-009 | Butter Toast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-38 | Buttery Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-38 | Buttery Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-38 | Buttery Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-38 | Buttery Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-38 | Buttery Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-38 | Buttery Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-38 | Buttery Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-38 | Buttery High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-38 | Buttery Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-38 | Buttery Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-38 | Buttery Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-38 | Buttery Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-38 | Buttery Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-38 | Buttery Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-38 | Buttery Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-38 | Buttery Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | chettinad-48 | Cabbage Chettinad Poriyal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Rai, Namak |
| P4 | diabetic-friendly-b9-019 | Cabbage Peas Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-18 | Cabbage Poriyal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | weight-loss-b9-005 | Cabbage Stir Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-04 | Cabbage Thoran | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | continental-b9-002 | Caesar Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-311 | Caldo Verde | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-021 | Calzone | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-009 | Caprese Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-013 | Carnitas Tacos | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-018 | Cashew Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-38 | Cashew Nut Curry Goa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | weight-loss-b9-018 | Cauliflower Rice Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-48 | Chakna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Tel |
| P4 | gujarati-298 | Chakri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Tel |
| P4 | kashmiri-10 | Chaman Kaliya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Ghee |
| P4 | kashmiri-314 | Chaman Qaliya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-39 | Chana Dal Parantha Marwari | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | high-protein-b9-017 | Chana Masala Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-08 | Chana Ros | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi, Tel |
| P4 | diabetic-friendly-b9-024 | Chana Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-21 | Chanar Dalna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | household-05 | Chapati | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Ghee |
| P4 | chinese-b9-004 | Char Siu Pork | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-84 | Cheese Chilli Gathiya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter |
| P4 | kids-special-b9-021 | Cheese Omelette | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-005 | Cheese Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-003 | Cheese Quesadilla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-001 | Cheese Sandwich | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-30 | Chef Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-30 | Chef Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-30 | Chef Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-30 | Chef Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-30 | Chef Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-30 | Chef Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-30 | Chef Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-30 | Chef High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-30 | Chef Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-30 | Chef Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-30 | Chef Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-30 | Chef Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-30 | Chef Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-30 | Chef Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-30 | Chef Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-30 | Chef Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | italian-b9-100 | Chef-style Affogato | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-083 | Chef-style Aglio e Olio | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-084 | Chef-style Aloo Gobi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-091 | Chef-style Aloo Tikki Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-095 | Chef-style Arancini | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | jain-b9-082 | Chef-style Arbi Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | healthy-b9-100 | Chef-style Avocado Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-082 | Chef-style Avocado Toast Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-085 | Chef-style Baingan Bharta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-076 | Chef-style Bajra Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-085 | Chef-style Bajra Roti Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-082 | Chef-style Bajra Rotla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-092 | Chef-style Baked Mac and Cheese | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-079 | Chef-style Banana Pancakes | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-081 | Chef-style Basil Chicken Stir Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-090 | Chef-style Beef Broccoli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-077 | Chef-style Beef Burrito Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-088 | Chef-style Beef Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-087 | Chef-style Beetroot Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-089 | Chef-style Bitter Gourd Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-085 | Chef-style Black Bean Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-096 | Chef-style Bottle Gourd Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-081 | Chef-style Bottle Gourd Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-100 | Chef-style Bread Pudding | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-081 | Chef-style Brown Rice Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-087 | Chef-style Brown Rice Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-086 | Chef-style Bruschetta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-099 | Chef-style Burrata Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-084 | Chef-style Butter Toast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-094 | Chef-style Cabbage Peas Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-080 | Chef-style Cabbage Stir Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-077 | Chef-style Caesar Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-096 | Chef-style Calzone | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-084 | Chef-style Caprese Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-088 | Chef-style Carnitas Tacos | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-093 | Chef-style Cashew Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-093 | Chef-style Cauliflower Rice Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-092 | Chef-style Chana Masala Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-099 | Chef-style Chana Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-079 | Chef-style Char Siu Pork | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-096 | Chef-style Cheese Omelette | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-080 | Chef-style Cheese Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-078 | Chef-style Cheese Quesadilla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-076 | Chef-style Cheese Sandwich | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-095 | Chef-style Chicken Alfredo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-089 | Chef-style Chicken Keema Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-091 | Chef-style Chicken Piccata | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-081 | Chef-style Chicken Salad Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-087 | Chef-style Chicken Schnitzel | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-076 | Chef-style Chicken Tacos | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-099 | Chef-style Chicken Tortilla Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-078 | Chef-style Chickpea Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-093 | Chef-style Chipotle Bean Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-088 | Chef-style Chocolate Milkshake Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-079 | Chef-style Chole Bhature | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-083 | Chef-style Chow Mein | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-083 | Chef-style Churros | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-076 | Chef-style Clear Vegetable Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-100 | Chef-style Coconut Chia Pudding | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-084 | Chef-style Coconut Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-098 | Chef-style Coconut Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-090 | Chef-style Coconut Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-085 | Chef-style Coleslaw Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-085 | Chef-style Corn Cheese Balls | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-093 | Chef-style Corn Chowder | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-098 | Chef-style Corn Palak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-081 | Chef-style Creamy Pasta Bake | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-088 | Chef-style Cucumber Mint Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-095 | Chef-style Cucumber Raita | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-083 | Chef-style Cucumber Raita Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-080 | Chef-style Dal Makhani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-082 | Chef-style Dan Dan Noodles | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-100 | Chef-style Detox Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-091 | Chef-style Drunken Noodles | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-093 | Chef-style Dum Aloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-087 | Chef-style Egg Bhurji Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-095 | Chef-style Egg Curry Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-094 | Chef-style Egg Foo Young | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-077 | Chef-style Egg White Omelette | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-094 | Chef-style Egg White Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-090 | Chef-style Eggplant Parmigiana | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-084 | Chef-style Elote Cup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-082 | Chef-style Fajita Platter | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-079 | Chef-style Fish and Chips | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-089 | Chef-style Fish Tacos | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-082 | Chef-style Fish Tikka Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-087 | Chef-style Focaccia | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-097 | Chef-style French Onion Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-084 | Chef-style Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-082 | Chef-style Fruit Custard Cup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-090 | Chef-style Fruit Nut Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-093 | Chef-style Fruit Salad Cup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-089 | Chef-style Garden Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-089 | Chef-style Garlic Bok Choy | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-083 | Chef-style Garlic Bread | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-089 | Chef-style Gnocchi Pomodoro | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-085 | Chef-style Greek Yogurt Parfait | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-077 | Chef-style Green Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-095 | Chef-style Green Smoothie Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-076 | Chef-style Grilled Chicken Breast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-086 | Chef-style Grilled Chicken Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-076 | Chef-style Grilled Chicken Steak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-093 | Chef-style Grilled Fish Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-078 | Chef-style Grilled Fish Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-092 | Chef-style Grilled Paneer Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-077 | Chef-style Grilled Salad Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-094 | Chef-style Grilled Salmon | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-080 | Chef-style Guacamole Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-099 | Chef-style Herb Chicken Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-097 | Chef-style Herb Grilled Fish | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-099 | Chef-style Herb Rice Pilaf | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-100 | Chef-style Honey Toast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-093 | Chef-style Honey Walnut Shrimp | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-081 | Chef-style Hot and Sour Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-095 | Chef-style Hot Pot | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-095 | Chef-style Huevos Rancheros | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-092 | Chef-style Hummus Veg Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-090 | Chef-style Jackfruit Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | jain-b9-098 | Chef-style Jain Aloo Mutter | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-079 | Chef-style Jain Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-095 | Chef-style Jain Chole | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-077 | Chef-style Jain Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-085 | Chef-style Jain Dhokla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-092 | Chef-style Jain Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-100 | Chef-style Jain Fruit Custard | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-086 | Chef-style Jain Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-091 | Chef-style Jain Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-088 | Chef-style Jain Kachori | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-083 | Chef-style Jain Kadhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-078 | Chef-style Jain Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-097 | Chef-style Jain Paneer Tikka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-094 | Chef-style Jain Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-076 | Chef-style Jain Pav Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-090 | Chef-style Jain Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-080 | Chef-style Jain Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-096 | Chef-style Jain Rajma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-089 | Chef-style Jain Samosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-084 | Chef-style Jain Thepla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-099 | Chef-style Jain Tomato Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-087 | Chef-style Jain Undhiyu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-093 | Chef-style Jain Uttapam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-078 | Chef-style Jowar Roti Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-092 | Chef-style Kadhi Pakora | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-079 | Chef-style Karela Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-077 | Chef-style Kung Pao Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-088 | Chef-style Larb Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-079 | Chef-style Lasagna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-083 | Chef-style Lauki Chana Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-082 | Chef-style Lauki Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-091 | Chef-style Lemon Coriander Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-093 | Chef-style Lemon Herb Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-100 | Chef-style Lemongrass Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-088 | Chef-style Lentil Paneer Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-080 | Chef-style Lentil Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-100 | Chef-style Low GI Veg Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-099 | Chef-style Low Oil Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-097 | Chef-style Ma Po Eggplant | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-089 | Chef-style Mac and Cheese | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-078 | Chef-style Malai Kofta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-100 | Chef-style Mango Salsa Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-083 | Chef-style Mango Sticky Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-076 | Chef-style Mapo Tofu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-076 | Chef-style Margherita Pizza | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-086 | Chef-style Mashed Potato Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-085 | Chef-style Massaman Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-080 | Chef-style Methi Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-099 | Chef-style Methi Malai Matar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-097 | Chef-style Methi Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-077 | Chef-style Methi Thepla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-092 | Chef-style Mexican Street Corn Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-097 | Chef-style Mild Chicken Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-092 | Chef-style Mild Dal Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-083 | Chef-style Mild Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-082 | Chef-style Millet Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-085 | Chef-style Minestrone Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-086 | Chef-style Mini Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-078 | Chef-style Mini Idli Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-099 | Chef-style Mini Uttapam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-084 | Chef-style Mixed Millet Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-096 | Chef-style Mixed Veg Steamer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-083 | Chef-style Moong Dal Chilla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-078 | Chef-style Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-092 | Chef-style Multigrain Roti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-096 | Chef-style Multigrain Roti Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-083 | Chef-style Mushroom Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-085 | Chef-style Mushroom Pepper Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-081 | Chef-style Mushroom Risotto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-080 | Chef-style Mushroom Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-090 | Chef-style Mushroom Tacos | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-098 | Chef-style Mutton Keema Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-081 | Chef-style Nachos Supreme | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-094 | Chef-style Navratan Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-089 | Chef-style Oats Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-079 | Chef-style Oats Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-092 | Chef-style Orange Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-092 | Chef-style Osso Buco | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-076 | Chef-style Pad Thai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-086 | Chef-style Palak Methi Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-077 | Chef-style Palak Paneer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-084 | Chef-style Palak Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-086 | Chef-style Panang Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-096 | Chef-style Paneer Bhurji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-076 | Chef-style Paneer Butter Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-094 | Chef-style Paneer Cubes Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-090 | Chef-style Paneer Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-087 | Chef-style Paneer Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-094 | Chef-style Paneer Salad Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-082 | Chef-style Paneer Tikka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-078 | Chef-style Paneer Tikka Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-094 | Chef-style Panna Cotta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-096 | Chef-style Papaya Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-088 | Chef-style Peanut Noodle Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-087 | Chef-style Peking Duck Pancakes | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-078 | Chef-style Penne Arrabbiata | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-082 | Chef-style Pesto Pasta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-098 | Chef-style Pico de Gallo Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-082 | Chef-style Pineapple Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-098 | Chef-style Polenta Fries | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-086 | Chef-style Pozole Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-079 | Chef-style Protein Dal Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-100 | Chef-style Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-091 | Chef-style Protein Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-090 | Chef-style Quiche Lorraine | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-084 | Chef-style Quinoa Paneer Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-077 | Chef-style Quinoa Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-081 | Chef-style Ragi Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-088 | Chef-style Ragi Porridge | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-097 | Chef-style Rajma Protein Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-091 | Chef-style Ratatouille | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-088 | Chef-style Ravioli Spinach Ricotta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | jain-b9-081 | Chef-style Raw Banana Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | thai-b9-078 | Chef-style Red Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-080 | Chef-style Risotto Milanese | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-082 | Chef-style Roast Vegetable Platter | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-094 | Chef-style Roasted Sweet Potato | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-087 | Chef-style Roasted Veg Quinoa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-091 | Chef-style Salsa Verde Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-099 | Chef-style Salt and Pepper Squid | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-089 | Chef-style Satay Skewers | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-096 | Chef-style Sattu Drink Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-096 | Chef-style Scallion Pancakes | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-097 | Chef-style Seafood Linguine | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-091 | Chef-style Sesame Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-097 | Chef-style Seven Layer Dip | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-100 | Chef-style Shahi Paneer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-078 | Chef-style Shepherd Pie | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-084 | Chef-style Som Tam Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-080 | Chef-style Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-077 | Chef-style Spaghetti Carbonara | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-098 | Chef-style Spinach Lentil Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-098 | Chef-style Spinach Lentil Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-095 | Chef-style Spring Roll Basket | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-086 | Chef-style Spring Rolls | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-087 | Chef-style Sprout Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-090 | Chef-style Sprout Chaat Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-080 | Chef-style Sprout Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-090 | Chef-style Sprout Usal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-097 | Chef-style Steamed Broccoli Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-085 | Chef-style Steamed Dumplings | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-098 | Chef-style Steamed Fish Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-079 | Chef-style Steamed Fish Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-083 | Chef-style Steamed Idli Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-089 | Chef-style Steamed Momo Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-076 | Chef-style Steamed Veg Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-085 | Chef-style Steamed Veg Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-090 | Chef-style Steamed Veg Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-084 | Chef-style Stuffed Bell Peppers | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-088 | Chef-style Stuffed Capsicum | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-098 | Chef-style Stuffed Mushrooms | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-078 | Chef-style Sweet and Sour Pork | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-098 | Chef-style Sweet Corn Cup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-094 | Chef-style Sweet Potato Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-088 | Chef-style Szechuan Eggplant | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-096 | Chef-style Taco Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-094 | Chef-style Tamale Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-086 | Chef-style Tandoori Chicken Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-100 | Chef-style Tea Eggs | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-096 | Chef-style Tempeh Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-087 | Chef-style Thai Basil Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-094 | Chef-style Thai Fish Cakes | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-097 | Chef-style Thai Iced Tea Jelly | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-099 | Chef-style Thai Omelette | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-092 | Chef-style Thai Yellow Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-098 | Chef-style Three Cup Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-093 | Chef-style Tiramisu Cup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-099 | Chef-style Tofu Protein Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-077 | Chef-style Tofu Stir Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-080 | Chef-style Tom Kha Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-079 | Chef-style Tom Yum Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-098 | Chef-style Tomato Basil Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-093 | Chef-style Tomato Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-085 | Chef-style Tomato Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-087 | Chef-style Tostada Stack | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-081 | Chef-style Veg Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-097 | Chef-style Veg Cutlet | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-087 | Chef-style Veg Cutlet Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-079 | Chef-style Veg Enchiladas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-089 | Chef-style Veg Hakka Noodles | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-095 | Chef-style Veg Maggi Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-091 | Chef-style Veg Manchurian | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-081 | Chef-style Veg Nuggets | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-077 | Chef-style Veg Pasta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-090 | Chef-style Veg Pizza Slice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-086 | Chef-style Veg Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-095 | Chef-style Veg Seekh Kebab | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-079 | Chef-style Vegan Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-076 | Chef-style Vegan Buddha Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-089 | Chef-style Vegan Burger | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-086 | Chef-style Vegan Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-095 | Chef-style Vegan Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-091 | Chef-style Vegan Pad Thai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-081 | Chef-style Vegan Pasta Primavera | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-093 | Chef-style Vegan Pizza | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-097 | Chef-style Vegan Sambar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-083 | Chef-style Vegan Tacos | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-099 | Chef-style Vegan Wrap | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-091 | Chef-style Vegetable Clear Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-096 | Chef-style Veggie Burger Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-080 | Chef-style Wonton Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-092 | Chef-style Zucchini Noodles | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-318 | Chemmeen Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-28 | Chemmeen Ularthiyathu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | ad-mkt-bread-poha-13 | Chennai Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-13 | Chennai Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-13 | Chennai Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-13 | Chennai Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-13 | Chennai Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-13 | Chennai Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-13 | Chennai Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-13 | Chennai High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-13 | Chennai Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-13 | Chennai Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-13 | Chennai Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-13 | Chennai Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-13 | Chennai Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-13 | Chennai Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-13 | Chennai Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-13 | Chennai Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | chettinad-292 | Chettinad Aattu Kari | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | chettinad-321 | Chettinad Brinjal Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-299 | Chettinad Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-01 | Chettinad Chicken Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | chettinad-318 | Chettinad Crab Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-84 | Chettinad Egg Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | chettinad-03 | Chettinad Fish Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | chettinad-58 | Chettinad Kaalan Chops | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | chettinad-51 | Chettinad Kaikari Kurma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | chettinad-285 | Chettinad Kozhi Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | chettinad-81 | Chettinad Kozhi Kuzhambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | chettinad-288 | Chettinad Muttai Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | chettinad-18 | Chettinad Muttai Podimas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | chettinad-314 | Chettinad Mutton | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-323 | Chettinad Payasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-286 | Chettinad Pepper Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Tel |
| P4 | chettinad-320 | Chettinad Prawn Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-316 | Chettinad Rasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-322 | Chettinad Sambar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-69 | Chettinad South Coconut Adai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | chettinad-33 | Chettinad Vazhakkai Chops | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Rai, Namak |
| P4 | chettinad-293 | Chettinad Veg Kurma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel, Namak |
| P4 | chettinad-75 | Chettinad Veg Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Ghee, Namak |
| P4 | chettinad-297 | Chettinad Ven Pongal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Kali Mirch, Jeera |
| P4 | bengali-74 | Chhanar Jilipi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee, Tel |
| P4 | bengali-73 | Chhanar Payesh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini |
| P4 | continental-b9-020 | Chicken Alfredo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-07 | Chicken Bamboo Shoot Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | goan-03 | Chicken Cafreal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Tel |
| P4 | chinese-294 | Chicken Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | street-08 | Chicken Kathi Roll | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | high-protein-b9-014 | Chicken Keema Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-08 | Chicken Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Garam Masala |
| P4 | ad-mkt-chicken-kosha-01 | Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | chettinad-60 | Chicken Kothamalli Chukka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | chinese-05 | Chicken Manchurian | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | italian-b9-016 | Chicken Piccata | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-006 | Chicken Salad Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-012 | Chicken Schnitzel | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-23 | Chicken Shawarma Roll | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-307 | Chicken Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-10 | Chicken Sukka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | maharashtrian-71 | Chicken Sukka Malvani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | mexican-b9-001 | Chicken Tacos | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-024 | Chicken Tortilla Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-310 | Chicken with Bamboo Shoot | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-003 | Chickpea Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-320 | Chilli Garlic Noodles | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-59 | Chingri Cutlet | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | bengali-02 | Chingri Malai Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Ghee, Garam Masala |
| P4 | hyderabadi-79 | Chintachiguru Mamsam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | mexican-b9-018 | Chipotle Bean Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-285 | Chitranna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Haldi |
| P4 | kids-special-b9-013 | Chocolate Milkshake Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-84 | Chocolate Samosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kashmiri-42 | Chokh Wangun Gogji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | bengali-05 | Cholar Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | north-301 | Chole | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-290 | Chorizo Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel, Garam Masala |
| P4 | chinese-b9-008 | Chow Mein | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-49 | Chur Chur Naan Thali | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | rajasthani-322 | Churma Laddoo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-008 | Churros | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-035 | Classic Baingan Bharta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-31 | Classic Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-31 | Classic Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-31 | Classic Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | vegetarian-b9-029 | Classic Chole Bhature | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-dal-fry-31 | Classic Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | vegetarian-b9-030 | Classic Dal Makhani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-dal-tadka-31 | Classic Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-31 | Classic Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-31 | Classic Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-31 | Classic High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-31 | Classic Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | vegetarian-b9-042 | Classic Kadhi Pakora | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-medu-vada-31 | Classic Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | vegetarian-b9-049 | Classic Methi Malai Matar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-047 | Classic Mild Chicken Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-042 | Classic Mild Dal Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-033 | Classic Mild Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-036 | Classic Mini Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-028 | Classic Mini Idli Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-049 | Classic Mini Uttapam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-046 | Classic Paneer Bhurji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-paneer-pulao-31 | Classic Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-31 | Classic Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-31 | Classic Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | vegetarian-b9-039 | Classic Veg Hakka Noodles | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-041 | Classic Veg Manchurian | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-vegetable-pulao-31 | Classic Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | weight-loss-b9-001 | Clear Vegetable Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-025 | Coconut Chia Pudding | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-09 | Coconut Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Tel, Namak |
| P4 | vegan-b9-009 | Coconut Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-50 | Coconut Jaggery Neureos | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | thai-b9-023 | Coconut Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-015 | Coconut Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-010 | Coleslaw Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-288 | Colocasia Patra Roll | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-poha-45 | Comfort Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-45 | Comfort Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-45 | Comfort Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-45 | Comfort Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-45 | Comfort Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-45 | Comfort Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-45 | Comfort Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-45 | Comfort High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-45 | Comfort Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-45 | Comfort Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-45 | Comfort Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-45 | Comfort Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-45 | Comfort Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-45 | Comfort Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-45 | Comfort Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-45 | Comfort Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | kids-special-b9-010 | Corn Cheese Balls | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-018 | Corn Chowder | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-023 | Corn Palak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-76 | Corn Palak Seekh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | continental-b9-006 | Creamy Pasta Bake | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-67 | Creamy Turnip Peas Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | maharashtrian-288 | Crisp Kothimbir Vadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing, Tel |
| P4 | north-63 | Crisp Lotus Stem Stir Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | ad-mkt-bread-poha-36 | Crispy Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-36 | Crispy Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-36 | Crispy Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | chinese-33 | Crispy Corn Salt Pepper | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | ad-mkt-dal-fry-36 | Crispy Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-36 | Crispy Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-36 | Crispy Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-36 | Crispy Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-36 | Crispy High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-36 | Crispy Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-36 | Crispy Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-36 | Crispy Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-36 | Crispy Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-36 | Crispy Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-36 | Crispy Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-36 | Crispy Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-36 | Crispy Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | healthy-b9-013 | Cucumber Mint Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-020 | Cucumber Raita | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-008 | Cucumber Raita Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-05 | Curd Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | goan-66 | Curry Leaf Crab Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | street-318 | Cutting Chai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-57 | Daal Gosht | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | hyderabadi-320 | Dahi Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-43 | Dahi Ke Sholey | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | maharashtrian-58 | Dahi Pohe | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Namak |
| P4 | street-320 | Dahi Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-01 | Dal Baati Churma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | gujarati-05 | Dal Dhokli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Jeera |
| P4 | ad-mkt-dal-fry-01 | Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | punjabi-73 | Dal Palak Punjabi Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-tadka-01 | Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | chinese-b9-007 | Dan Dan Noodles | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-63 | Daniwal Fish Kaliya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-22 | Daniwal Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | bengali-52 | Danta Chorchori | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | maharashtrian-43 | Danyachi Amti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | punjabi-46 | Degi Mirch Paneer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-bread-poha-08 | Delhi Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-08 | Delhi Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-08 | Delhi Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-08 | Delhi Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-08 | Delhi Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-08 | Delhi Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-08 | Delhi Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-08 | Delhi High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-08 | Delhi Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-08 | Delhi Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-08 | Delhi Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | north-32 | Delhi Paneer Lababdar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | ad-mkt-paneer-pulao-08 | Delhi Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-08 | Delhi Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-08 | Delhi Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-08 | Delhi Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-08 | Delhi Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | rajasthani-66 | Desert Chili Paneer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-78 | Desert Egg Tikka Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-58 | Desert Style Egg Bhurji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | weight-loss-b9-025 | Detox Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-02 | Dhaba Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-02 | Dhaba Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | punjabi-58 | Dhaba Chicken Kali Mirch | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-chicken-kosha-02 | Dhaba Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-02 | Dhaba Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-02 | Dhaba Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-02 | Dhaba Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-02 | Dhaba Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-02 | Dhaba High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-02 | Dhaba Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-02 | Dhaba Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-02 | Dhaba Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-02 | Dhaba Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | punjabi-32 | Dhaba Paneer Tawa Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-prawn-malai-02 | Dhaba Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-02 | Dhaba Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-02 | Dhaba Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | north-31 | Dhaba Style Chana Saag | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | punjabi-77 | Dhaba Veg Jalfrezi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-02 | Dhaba Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | punjabi-38 | Dhabewali Kali Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | gujarati-305 | Dhebra | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-61 | Dhekia Xaak Chingri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | bengali-22 | Dhokar Dalna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera |
| P4 | gujarati-301 | Dhokla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-47 | Dhungar Paneer Kali Mirch | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | bengali-58 | Dim er Dalna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | bengali-57 | Dim Posto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | chinese-322 | Dim Sum | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-07 | Dimer Dalna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | assamese-06 | Dimer Tenga | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | goan-321 | Doce | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-19 | Doi Maach | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | assamese-30 | Doi Maach Axomiya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | kashmiri-36 | Doodhi Yakhni Mutton | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | hyderabadi-10 | Double Ka Meetha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | thai-b9-016 | Drunken Noodles | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-03 | Duck Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | assamese-301 | Duck Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-82 | Duck with Ash Gourd | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | gujarati-15 | Dudhi Muthiya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Rai |
| P4 | vegetarian-b9-018 | Dum Aloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-04 | Dum Aloo Kashmiri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | north-287 | Dum Aloo Kashmiri Style | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | hyderabadi-40 | Dum ka Keema | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Ghee |
| P4 | hyderabadi-25 | Dum ka Murgh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Ghee |
| P4 | kashmiri-286 | Dum Olav | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | bengali-39 | Echorer Dalna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | high-protein-b9-012 | Egg Bhurji Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-292 | Egg Bhurji Pav | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | north-07 | Egg Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Garam Masala |
| P4 | high-protein-b9-020 | Egg Curry Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-019 | Egg Foo Young | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-28 | Egg Ghee Roast Dosa Wrap | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | chettinad-04 | Egg Masala Kuzhambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | south-26 | Egg Podimas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | goan-06 | Egg Recheado Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | high-protein-b9-002 | Egg White Omelette | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-019 | Egg White Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-015 | Eggplant Parmigiana | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-76 | Eggplant Seeraga Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Namak |
| P4 | mexican-b9-009 | Elote Cup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-66 | Eral Kuzhambu Kari Patta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | chettinad-32 | Eral Thokku Seeraga | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Namak |
| P4 | kerala-10 | Erissery | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Rai |
| P4 | gujarati-285 | Fafda | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel, Namak |
| P4 | gujarati-310 | Fafda Jalebi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-17 | Fajeto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | mexican-b9-007 | Fajita Platter | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-29 | Family Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-29 | Family Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-29 | Family Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-29 | Family Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-29 | Family Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-29 | Family Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-29 | Family Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-29 | Family High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-29 | Family Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-29 | Family Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-29 | Family Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-29 | Family Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-29 | Family Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-29 | Family Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-29 | Family Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-29 | Family Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | maharashtrian-287 | Farmer Zunka Bhakar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Tel |
| P4 | north-358 | Festive Aloo Gobi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-357 | Festive Amritsari Fish | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-04 | Festive Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-04 | Festive Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-04 | Festive Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | south-367 | Festive Coconut Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-364 | Festive Crispy Honey Chilli Potato | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-352 | Festive Dabeli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-dal-fry-04 | Festive Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-04 | Festive Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | north-353 | Festive Dum Aloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-369 | Festive Egg Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-gujarati-handvo-04 | Festive Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | gujarati-368 | Festive Gujarati Kadhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-gulab-jamun-04 | Festive Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-04 | Festive High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | hyderabadi-364 | Festive Hyderabadi Marag | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-368 | Festive Keema Matar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-355 | Festive Kerala Egg Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-357 | Festive Malai Kofta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-354 | Festive Methi Thepla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-moong-dal-soup-04 | Festive Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | north-372 | Festive Navratan Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-paneer-pulao-04 | Festive Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-04 | Festive Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-04 | Festive Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | kashmiri-369 | Festive Sheermal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-soya-chunk-curry-04 | Festive Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | north-370 | Festive Stuffed Capsicum | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-373 | Festive Tandoori Roti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-vegetable-pulao-04 | Festive Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | chettinad-365 | Festive Vendhaya Kuzhambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-004 | Fish and Chips | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-319 | Fish Caldin | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-322 | Fish Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-304 | Fish Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-62 | Fish Kabiraji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | kerala-295 | Fish Moilee | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel |
| P4 | mexican-b9-014 | Fish Tacos | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-311 | Fish Tenga | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-007 | Fish Tikka Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-012 | Focaccia | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-315 | Frankie | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-291 | Frankie Roll | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Tel |
| P4 | household-47 | French Fries | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel, Namak, Kali Mirch |
| P4 | continental-b9-022 | French Onion Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-009 | Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-007 | Fruit Custard Cup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-015 | Fruit Nut Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-018 | Fruit Salad Cup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-10 | Gajar Halwa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Chini |
| P4 | continental-b9-014 | Garden Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-014 | Garlic Bok Choy | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-008 | Garlic Bread | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-63 | Garlic Butter Chonak Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter, Kali Mirch |
| P4 | household-38 | Garlic Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Tel |
| P4 | rajasthani-319 | Gatta Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-81 | Gatte Ka Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | rajasthani-02 | Gatte ki Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Ghee |
| P4 | maharashtrian-74 | Gavran Chicken Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | household-21 | Gawar Fali | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing, Haldi, Tel, Namak |
| P4 | maharashtrian-59 | Ghavan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Tel |
| P4 | north-69 | Ghee Roast Achari Aloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | rajasthani-290 | Ghevar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Chini |
| P4 | bengali-79 | Ghugni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | north-62 | Ginger Methi Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | italian-b9-014 | Gnocchi Pomodoro | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-77 | Goan Beetroot Pachadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | goan-316 | Goan Bread | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-22 | Goan Caldin | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | goan-70 | Goan Millet Upkari | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | goan-35 | Goan Mushroom Cafreal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | goan-56 | Goan Pepper Chicken Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | goan-73 | Goan Pepper Mushroom Toast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter, Kali Mirch |
| P4 | goan-65 | Goan Pineapple Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | goan-293 | Goan Pork Vindaloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | goan-81 | Goan Prawn Balchao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | goan-17 | Goan Prawn Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | goan-37 | Goan Pumpkin Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | goan-64 | Goan Red Rice Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | goan-57 | Goan Rice Kheer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini |
| P4 | goan-20 | Goan Sanna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Namak |
| P4 | goan-295 | Goan Sannas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Namak, Tel |
| P4 | goan-310 | Goan Sausages | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-62 | Goan Sweet Potato Caldin | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | goan-60 | Goan Tomato Saar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera |
| P4 | goan-286 | Goan Xacuti Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | north-26 | Gobi 65 Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | north-313 | Gobi Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-75 | Gogji Dum Aloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-48 | Gogji Haakh Shorba | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | kashmiri-14 | Gogji Rajma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | bengali-55 | Gondhoraj Lebu Bhetki | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | hyderabadi-39 | Gongura Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | south-16 | Gongura Mamsam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Lal Mirch Powder, Haldi, Jeera |
| P4 | hyderabadi-38 | Gongura Mutton | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | gujarati-286 | Gota | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Tel |
| P4 | rajasthani-316 | Govind Gatta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-27 | Grand Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-27 | Grand Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-27 | Grand Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-27 | Grand Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-27 | Grand Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-27 | Grand Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-27 | Grand Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-27 | Grand High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-27 | Grand Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-27 | Grand Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-27 | Grand Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-27 | Grand Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-27 | Grand Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-27 | Grand Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-27 | Grand Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-27 | Grand Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | ad-mkt-bread-poha-49 | Grandma's Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-49 | Grandma's Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-49 | Grandma's Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-49 | Grandma's Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-49 | Grandma's Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-49 | Grandma's Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-49 | Grandma's Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-49 | Grandma's High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-49 | Grandma's Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-49 | Grandma's Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-49 | Grandma's Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-49 | Grandma's Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-49 | Grandma's Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-49 | Grandma's Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-49 | Grandma's Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-49 | Grandma's Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | high-protein-b9-010 | Greek Yogurt Parfait | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-08 | Green Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Jeera |
| P4 | thai-b9-002 | Green Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-020 | Green Smoothie Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-001 | Grilled Chicken Breast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-011 | Grilled Chicken Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-001 | Grilled Chicken Steak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-018 | Grilled Fish Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-003 | Grilled Fish Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-017 | Grilled Paneer Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-002 | Grilled Salad Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-019 | Grilled Salmon | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-005 | Guacamole Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-64 | Gucchi Pulao Koshur | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | ad-mkt-bread-poha-11 | Gujarati Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-11 | Gujarati Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-11 | Gujarati Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-11 | Gujarati Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-11 | Gujarati Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-11 | Gujarati Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-11 | Gujarati Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-gujarati-handvo-01 | Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-high-protein-khichdi-11 | Gujarati High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-11 | Gujarati Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | gujarati-08 | Gujarati Kadhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-medu-vada-11 | Gujarati Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-11 | Gujarati Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-11 | Gujarati Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-11 | Gujarati Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-11 | Gujarati Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-11 | Gujarati Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-11 | Gujarati Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | ad-mkt-gulab-jamun-01 | Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | punjabi-313 | Gur Halwa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-71 | Gurh Wali Kaddu Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | kashmiri-03 | Gushtaba | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | assamese-65 | Haah Aloo Jol | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | assamese-318 | Haah Kumura | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-310 | Haak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-06 | Haak Saag | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Namak |
| P4 | kashmiri-34 | Haakh Anda Saag | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-34 | Hahor Logot Lai Xaak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | rajasthani-320 | Haldi ki Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-05 | Haleem | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Garam Masala |
| P4 | north-39 | Hara Pyaz Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | hyderabadi-67 | Hare Masale ka Murgh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | north-56 | Hariyali Chicken Tikka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | ad-mkt-bread-poha-46 | Healthy Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-46 | Healthy Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-46 | Healthy Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-46 | Healthy Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-46 | Healthy Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-46 | Healthy Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-46 | Healthy Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-46 | Healthy High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-46 | Healthy Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-46 | Healthy Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-46 | Healthy Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-46 | Healthy Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-46 | Healthy Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-46 | Healthy Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-46 | Healthy Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-46 | Healthy Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | healthy-b9-024 | Herb Chicken Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-022 | Herb Grilled Fish | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-024 | Herb Rice Pilaf | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-high-protein-khichdi-01 | High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | kashmiri-347 | Home-style Aab Gosht | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-344 | Home-style Aam Pora Shorbot | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-331 | Home-style Aattu Kari | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-338 | Home-style Ada Pradhaman | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-333 | Home-style Aloo Gobi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-337 | Home-style Aloo Kumura | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-337 | Home-style Aloo Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-328 | Home-style Aloo Pitika | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-326 | Home-style Aloo Posto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-346 | Home-style Aloo Pyaz ki Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-334 | Home-style Aloo Tikki | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-346 | Home-style Alu Wadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-334 | Home-style Ambot Tik | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-338 | Home-style American Chop Suey | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-332 | Home-style Amritsari Fish | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-339 | Home-style Amti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-338 | Home-style Ande ka Salan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-343 | Home-style Appam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-324 | Home-style Appam Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-329 | Home-style Assamese Pitha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-326 | Home-style Avial | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-344 | Home-style Baby Corn Manchurian | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-326 | Home-style Bagara Baingan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-348 | Home-style Bagara Chawal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-329 | Home-style Baingan Bharta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-343 | Home-style Bajra Dhebra | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-329 | Home-style Bajra Khichda | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-338 | Home-style Bajra Roti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-331 | Home-style Bajri Rotla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-346 | Home-style Banana Fritters | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-347 | Home-style Basket Chaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-344 | Home-style Basundi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-335 | Home-style Batata Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-328 | Home-style Bebinca | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-340 | Home-style Bedmi Puri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-331 | Home-style Beef Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-340 | Home-style Begun Bhaja | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-332 | Home-style Bengena Pitika | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-337 | Home-style Besan Chakki | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-339 | Home-style Bharela Ringan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-348 | Home-style Bharli Bhendi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-329 | Home-style Bharli Vangi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-329 | Home-style Bhel Puri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-348 | Home-style Bhetki Paturi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-340 | Home-style Bhindi Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-338 | Home-style Bisi Bele Bath | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-338 | Home-style Black Sesame Laddoo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-347 | Home-style Bolinhas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-338 | Home-style Bread Pakora | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-342 | Home-style Bun Maska | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-331 | Home-style Butter Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-336 | Home-style Caldo Verde | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-343 | Home-style Chakna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-339 | Home-style Chaman Qaliya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-343 | Home-style Chemmeen Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-346 | Home-style Chettinad Brinjal Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-324 | Home-style Chettinad Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-343 | Home-style Chettinad Crab Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-337 | Home-style Chettinad Fish Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-339 | Home-style Chettinad Mutton | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-348 | Home-style Chettinad Payasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-345 | Home-style Chettinad Prawn Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-341 | Home-style Chettinad Rasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-347 | Home-style Chettinad Sambar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-335 | Home-style Chettinad Veg Kurma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-327 | Home-style Chicken Cafreal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-331 | Home-style Chicken Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-332 | Home-style Chicken Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-335 | Home-style Chicken with Bamboo Shoot | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-332 | Home-style Chilli Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-345 | Home-style Chilli Garlic Noodles | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-326 | Home-style Chilli Paneer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-332 | Home-style Cholar Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-326 | Home-style Chole | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-329 | Home-style Chow Mein | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-347 | Home-style Churma Laddoo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-342 | Home-style Coconut Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-339 | Home-style Crispy Honey Chilli Potato | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-340 | Home-style Curd Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-343 | Home-style Cutting Chai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-327 | Home-style Dabeli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-345 | Home-style Dahi Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-345 | Home-style Dahi Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-324 | Home-style Dal Makhani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-333 | Home-style Dalcha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-330 | Home-style Dhebra | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-326 | Home-style Dhokla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-338 | Home-style Dim er Dalna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-347 | Home-style Dim Sum | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-346 | Home-style Doce | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-329 | Home-style Double ka Meetha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-340 | Home-style Dragon Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-326 | Home-style Duck Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-328 | Home-style Dum Aloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-331 | Home-style Dum ka Murgh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-326 | Home-style Dum Olav | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-337 | Home-style Egg Bhurji Pav | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-344 | Home-style Egg Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-327 | Home-style Erissery | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-335 | Home-style Fafda Jalebi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-344 | Home-style Fish Caldin | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-347 | Home-style Fish Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-329 | Home-style Fish Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-328 | Home-style Fish Moilee | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-336 | Home-style Fish Tenga | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-340 | Home-style Frankie | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-330 | Home-style Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-344 | Home-style Gatta Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-334 | Home-style Ghevar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-347 | Home-style Ghughra | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-341 | Home-style Goan Bread | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-335 | Home-style Goan Sausages | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-325 | Home-style Gobi Manchurian | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-338 | Home-style Gobi Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-341 | Home-style Govind Gatta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-343 | Home-style Gujarati Kadhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-338 | Home-style Gur Halwa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-343 | Home-style Haah Kumura | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-335 | Home-style Haak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-328 | Home-style Hakka Noodles | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-345 | Home-style Haldi ki Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-327 | Home-style Haleem | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-325 | Home-style Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-334 | Home-style Hot and Sour Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-339 | Home-style Hyderabadi Marag | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-330 | Home-style Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-330 | Home-style Ilish Bhapa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-333 | Home-style Ishtu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-344 | Home-style Jalebi Rabri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-334 | Home-style Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-348 | Home-style Jolpan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-332 | Home-style Kacche Gosht ki Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-341 | Home-style Kachori | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-333 | Home-style Kachori Chaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-347 | Home-style Kaddu ki Kheer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-344 | Home-style Kadhi Chawal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-327 | Home-style Kadhi Pakora | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-333 | Home-style Kahwa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-337 | Home-style Kalan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-342 | Home-style Kalmi Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-334 | Home-style Kanda Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-340 | Home-style Kappa Puzhukku | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-336 | Home-style Kara Kuzhi Paniyaram | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-343 | Home-style Kashmiri Naan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-327 | Home-style Kashmiri Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-340 | Home-style Kashmiri Rajma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-339 | Home-style Kathi Roll | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-343 | Home-style Keema Matar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-341 | Home-style Keema Pav | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-326 | Home-style Ker Sangri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-342 | Home-style Kerala Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-330 | Home-style Kerala Egg Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-348 | Home-style Kerala Porotta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-345 | Home-style Kerala Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-327 | Home-style Khaman | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-339 | Home-style Khatkhate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-336 | Home-style Khichu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-330 | Home-style Khubani ka Meetha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-342 | Home-style Kokur Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-344 | Home-style Kola Urundai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-337 | Home-style Kolhapuri Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-330 | Home-style Komolar Kheer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-336 | Home-style Kootu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-328 | Home-style Kosha Mangsho | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-334 | Home-style Kothamalli Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-345 | Home-style Kothimbir Vadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-341 | Home-style Kung Pao Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-342 | Home-style Kuzhi Paniyaram | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-331 | Home-style Laal Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-337 | Home-style Lassi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-339 | Home-style Lemon Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-338 | Home-style Lilva nu Shaak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-339 | Home-style Luchi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-324 | Home-style Luchi Alur Dom | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-342 | Home-style Lukhmi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-328 | Home-style Lyodur Tschaman | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-339 | Home-style Maa ki Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-337 | Home-style Macher Jhol | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-329 | Home-style Malabar Parotta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-332 | Home-style Malai Kofta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-335 | Home-style Malpua | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-338 | Home-style Malvani Fish Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-336 | Home-style Manchow Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-324 | Home-style Masala Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-347 | Home-style Masale Bhat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-342 | Home-style Masor Petu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-338 | Home-style Matschgand | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-336 | Home-style Mawa Kachori | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-331 | Home-style Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-327 | Home-style Meen Kuzhambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-341 | Home-style Meen Pollichathu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-346 | Home-style Methi Malai Matar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-329 | Home-style Methi Thepla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-333 | Home-style Milagu Kozhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-325 | Home-style Mirchi ka Salan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-328 | Home-style Mirchi Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-333 | Home-style Mishti Doi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-336 | Home-style Mishti Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-339 | Home-style Missi Roti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-331 | Home-style Modak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-334 | Home-style Modur Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-330 | Home-style Mohan Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-346 | Home-style Mohanthal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-336 | Home-style Monji Haak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-330 | Home-style Mushroom Chettinad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-342 | Home-style Mushroom Xacuti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-348 | Home-style Muthia | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-342 | Home-style Mutton Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-347 | Home-style Mutton Rezala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-341 | Home-style Mutton Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-344 | Home-style Nadan Kozhi Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-337 | Home-style Nadir Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-341 | Home-style Narikol Laru | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-338 | Home-style Nattu Kozhi Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-347 | Home-style Navratan Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-327 | Home-style Neer Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-348 | Home-style Neuro | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-346 | Home-style Nolen Gurer Sandesh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-335 | Home-style Olan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-334 | Home-style Oondhiya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-340 | Home-style Osmania Biscuit Chai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-346 | Home-style Ou Khatta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-325 | Home-style Ou Tenga Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-336 | Home-style Pachadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-342 | Home-style Pandhra Rassa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-343 | Home-style Paneer 65 | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-347 | Home-style Pani Komolar Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-339 | Home-style Pani Pitha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-328 | Home-style Pani Puri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-329 | Home-style Paniyaram | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-343 | Home-style Panta Bhat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-340 | Home-style Papad ki Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-346 | Home-style Papdi Chaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-336 | Home-style Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-336 | Home-style Pathar ka Gosht | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-338 | Home-style Patoleo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-337 | Home-style Patra | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-324 | Home-style Pav Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-339 | Home-style Payasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-345 | Home-style Payesh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-325 | Home-style Pepper Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-345 | Home-style Phirni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-333 | Home-style Pinni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-327 | Home-style Pithla Bhakri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-325 | Home-style Plain Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-337 | Home-style Pongal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-335 | Home-style Poriyal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-326 | Home-style Pork Vindaloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-334 | Home-style Pork with Bamboo Shoot | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-344 | Home-style Posola Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-341 | Home-style Potol Posto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-343 | Home-style Prawn Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-335 | Home-style Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-330 | Home-style Puran Poli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-344 | Home-style Puttu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-325 | Home-style Puttu Kadala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-327 | Home-style Pyaaz Kachori | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-335 | Home-style Qubooli Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-331 | Home-style Ragda Pattice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-348 | Home-style Rajasthani Kadhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-325 | Home-style Rajma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-343 | Home-style Rajma Chawal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-333 | Home-style Rasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-335 | Home-style Rasgulla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-326 | Home-style Rava Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-333 | Home-style Ringan nu Shaak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-337 | Home-style Ros Omelette | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-331 | Home-style Rui Kalia | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-333 | Home-style Sabudana Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-332 | Home-style Safed Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-332 | Home-style Sambar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-332 | Home-style Samosa Chaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-334 | Home-style Sandesh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-329 | Home-style Sannas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-327 | Home-style Schezwan Paneer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-332 | Home-style Seeraga Samba Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-328 | Home-style Set Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-330 | Home-style Sev Puri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-332 | Home-style Sev Tameta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-341 | Home-style Sheer Khurma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-344 | Home-style Sheermal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-328 | Home-style Shikampuri Kebab | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-343 | Home-style Shrikhand | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-329 | Home-style Shufta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-346 | Home-style Sizzler | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-332 | Home-style Sol Kadhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-330 | Home-style Sorpotel | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-345 | Home-style Stuffed Capsicum | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-336 | Home-style Stuffed Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-335 | Home-style Sweet Corn Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-342 | Home-style Szechuan Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-341 | Home-style Taambda Rassa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-332 | Home-style Tabak Maaz | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-344 | Home-style Talawa Gosht | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-341 | Home-style Tamarind Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-334 | Home-style Tamatar ka Kut | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-346 | Home-style Tamate ka Kut | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-330 | Home-style Tandoori Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-348 | Home-style Tandoori Roti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-348 | Home-style Tawa Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-333 | Home-style Tenga Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-348 | Home-style Thai Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-328 | Home-style Thalipeeth | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-328 | Home-style Thepla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-334 | Home-style Thoran | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-340 | Home-style Til Pitha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-337 | Home-style Triple Schezwan Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-341 | Home-style Tuver Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-324 | Home-style Undhiyu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-347 | Home-style Unniyappam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-328 | Home-style Urlai Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-329 | Home-style Uttapam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-325 | Home-style Vada Pav | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-340 | Home-style Varan Bhat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-324 | Home-style Veg Manchurian | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-333 | Home-style Veg Spring Rolls | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-345 | Home-style Vegetable Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-340 | Home-style Vendhaya Kuzhambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-331 | Home-style Xaak aru Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-331 | Home-style Xacuti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-325 | Home-style Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-336 | Home-style Zunka Bhakri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-025 | Honey Toast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-018 | Honey Walnut Shrimp | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-006 | Hot and Sour Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-020 | Hot Pot | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-26 | Hotel-style Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-26 | Hotel-style Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-26 | Hotel-style Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-26 | Hotel-style Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-26 | Hotel-style Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-26 | Hotel-style Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-26 | Hotel-style Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-26 | Hotel-style High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-26 | Hotel-style Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-26 | Hotel-style Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-26 | Hotel-style Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-26 | Hotel-style Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-26 | Hotel-style Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-26 | Hotel-style Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-26 | Hotel-style Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-26 | Hotel-style Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | mexican-b9-020 | Huevos Rancheros | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-017 | Hummus Veg Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-14 | Hyderabadi Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-14 | Hyderabadi Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-14 | Hyderabadi Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-14 | Hyderabadi Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-14 | Hyderabadi Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | hyderabadi-01 | Hyderabadi Dum Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-gujarati-handvo-14 | Hyderabadi Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-14 | Hyderabadi Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-14 | Hyderabadi High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-14 | Hyderabadi Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | hyderabadi-41 | Hyderabadi Keema Samosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Tel |
| P4 | ad-mkt-medu-vada-14 | Hyderabadi Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | hyderabadi-286 | Hyderabadi Mirchi Salan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | ad-mkt-moong-dal-soup-14 | Hyderabadi Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-14 | Hyderabadi Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-14 | Hyderabadi Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-14 | Hyderabadi Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-14 | Hyderabadi Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-14 | Hyderabadi Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | kerala-20 | Idiyappam Egg Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | south-305 | Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-02 | Idli Sambar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | bengali-56 | Ilish Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kerala-308 | Ishtu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-015 | Jackfruit Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-290 | Jaggery Ada Pradhaman | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | jain-b9-023 | Jain Aloo Mutter | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-004 | Jain Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-020 | Jain Chole | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-002 | Jain Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-010 | Jain Dhokla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-017 | Jain Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-025 | Jain Fruit Custard | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-011 | Jain Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-016 | Jain Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-013 | Jain Kachori | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-008 | Jain Kadhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-003 | Jain Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-022 | Jain Paneer Tikka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-019 | Jain Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-001 | Jain Pav Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-015 | Jain Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-005 | Jain Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-021 | Jain Rajma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-014 | Jain Samosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-009 | Jain Thepla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-024 | Jain Tomato Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-012 | Jain Undhiyu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | jain-b9-018 | Jain Uttapam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-19 | Jaipur Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-19 | Jaipur Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-19 | Jaipur Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-19 | Jaipur Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-19 | Jaipur Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-19 | Jaipur Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-19 | Jaipur Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-19 | Jaipur High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-19 | Jaipur Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-19 | Jaipur Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-19 | Jaipur Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-19 | Jaipur Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-19 | Jaipur Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-19 | Jaipur Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-19 | Jaipur Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-19 | Jaipur Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | rajasthani-55 | Jaipuri Gatte Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-37 | Jaisalmeri Chana | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-63 | Jaisalmeri Mutton Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | street-319 | Jalebi Rabri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-63 | Jauzi Halwa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Chini |
| P4 | north-06 | Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | bengali-41 | Jhuri Aloo Bhaja | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | rajasthani-60 | Jodhpuri Chicken Sukha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-31 | Jodhpuri Kabuli Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-46 | Jodhpuri Mawa Kachori | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | assamese-36 | Joha Saul Bhapa Pitha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | assamese-77 | Joha Saul Chicken Pulao Axomiya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | assamese-54 | Joha Saulor Kheer Pitha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | assamese-25 | Joha Saulor Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | assamese-323 | Jolpan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-30 | Jowar Bhakri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Ghee |
| P4 | diabetic-friendly-b9-003 | Jowar Roti Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-79 | Jungli Murgh Tawa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | chettinad-68 | Kaara Kollu Rasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Jeera, Rai, Namak |
| P4 | kashmiri-23 | Kabargah | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | hyderabadi-307 | Kacche Gosht ki Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-66 | Kacha Aamer Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Rai, Namak, Tel |
| P4 | north-316 | Kachori | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-308 | Kachori Chaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-24 | Kachori Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Tel |
| P4 | rajasthani-35 | Kachri Ki Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | assamese-51 | Kachu Xaak Diya Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | household-36 | Kachumber Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | north-19 | Kadai Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | chettinad-42 | Kadalai Urundai Kuzhambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Rai, Namak |
| P4 | hyderabadi-322 | Kaddu ki Kheer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-319 | Kadhi Chawal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-11 | Kadhi Pakora | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Hing |
| P4 | kashmiri-308 | Kahwa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-40 | Kairi Pyaz Ki Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | bengali-60 | Kakrar Jhal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | household-24 | Kala Chana Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel, Namak |
| P4 | north-42 | Kala Chana Kebab | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | maharashtrian-44 | Kala Vatana Usal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | kerala-312 | Kalan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-80 | Kaleji Masala Hyderabadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | kashmiri-43 | Kaliya Chicken Koshur | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | rajasthani-317 | Kalmi Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-73 | Kambu Kozhi Kanji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Jeera, Namak |
| P4 | chettinad-38 | Kambu Kozhukattai Kurma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | bengali-65 | Kanchkolar Kofta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | maharashtrian-26 | Kanda Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Lal Mirch Powder, Tel |
| P4 | maharashtrian-76 | Kanda Lasun Masala Bhendi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | maharashtrian-20 | Kanda Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Haldi |
| P4 | kashmiri-71 | Kanti Paneer Tikki | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kerala-21 | Kappa Meen Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | kerala-83 | Kappa Puzhukku | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera |
| P4 | chettinad-11 | Kara Kozhi Milagu Varuval | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | chettinad-298 | Kara Kuzhi Paniyaram | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Tel, Namak |
| P4 | chettinad-52 | Karaikudi Fish Kuzhambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | chettinad-80 | Karaikudi Tomato Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | household-22 | Karela Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel, Namak |
| P4 | diabetic-friendly-b9-004 | Karela Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-64 | Karupatti Paal Paniyaram | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | chettinad-17 | Karuveppilai Eral Thokku | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | chettinad-40 | Karuveppilai Paneer Pepper Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | north-82 | Kashmiri Dum Aloo Banarasi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kashmiri-46 | Kashmiri Dum Chole | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-08 | Kashmiri Egg Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Ghee |
| P4 | kashmiri-61 | Kashmiri Haakh Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Hing, Namak |
| P4 | kashmiri-21 | Kashmiri Kanti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | kashmiri-77 | Kashmiri Lahsuni Haakh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Namak |
| P4 | kashmiri-66 | Kashmiri Methi Rogan Josh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-49 | Kashmiri Mirch Paneer Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | north-66 | Kashmiri Muji Chetin | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | kashmiri-318 | Kashmiri Naan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-295 | Kashmiri Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kashmiri-73 | Kashmiri Punjabi Kebab Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Ghee, Namak |
| P4 | kashmiri-288 | Kashmiri Rajma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Hing |
| P4 | kashmiri-54 | Kashmiri Rajma Chut Gogji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-35 | Kashmiri Rogan Aloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | north-54 | Kasundi Fish Tikka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | north-33 | Kasuri Malai Kofta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | north-79 | Kasuri Paneer Jalfrezi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | maharashtrian-38 | Katachi Amti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | street-288 | Kathi Roll | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | chettinad-71 | Kathirikai Kola Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | chettinad-37 | Kathirikai Milagu Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Rai, Namak |
| P4 | chettinad-15 | Kathirikai Puli Pachadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Lal Mirch Powder |
| P4 | bengali-34 | Katla Kalia | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | north-28 | Keema Matar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Dhania Powder |
| P4 | punjabi-10 | Keema Mutter | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Garam Masala |
| P4 | hyderabadi-42 | Keema Naan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | chettinad-72 | Keema Paniyaram Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | street-10 | Keema Pav | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Butter |
| P4 | street-82 | Keema Pav Grill | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter |
| P4 | street-27 | Keema Samosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Dhania Powder, Tel |
| P4 | hyderabadi-77 | Keeme ke Muthiya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | chettinad-55 | Keerai Kadalai Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | maharashtrian-53 | Kelyachi Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Haldi, Tel |
| P4 | rajasthani-49 | Ker Dahi Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-71 | Ker Sangri Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-82 | Ker Sangri Shaak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | kerala-55 | Kerala Banana Stem Thoran | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | kerala-37 | Kerala Beetroot Thoran | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | kerala-317 | Kerala Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-77 | Kerala Black Pepper Paneer Wrap | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-58 | Kerala Coconut Ladoo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kerala-46 | Kerala Coconut Lemon Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | kerala-70 | Kerala Coconut Millet Pongal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-59 | Kerala Cucumber Kichadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | kerala-31 | Kerala Duck Mappas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-39 | Kerala Egg Curry with Appam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | south-14 | Kerala Egg Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-12 | Kerala Fish Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Lal Mirch Powder, Haldi |
| P4 | kerala-06 | Kerala Fish Molee | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-44 | Kerala Green Gram Sundal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | kerala-73 | Kerala Malabar Veg Noodles | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-64 | Kerala Moringa Leaf Thoran | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | kerala-49 | Kerala Mushroom Pepper Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-47 | Kerala Paal Pori | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini |
| P4 | kerala-287 | Kerala Parotta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel, Namak |
| P4 | kerala-42 | Kerala Pepper Rasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Jeera |
| P4 | kerala-66 | Kerala Pepper Tofu Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-76 | Kerala Pineapple Chicken Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-323 | Kerala Porotta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-75 | Kerala Pumpkin Erissery Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera |
| P4 | kerala-80 | Kerala Spiced Coconut Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Rai |
| P4 | kerala-65 | Kerala Spiced Tapioca Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | south-320 | Kerala Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-60 | Kerala Tamarind Fish Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-53 | Kerala Vegetable Ularthiyathu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kashmiri-39 | Kesar Badam Pulao Koshur | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-52 | Kesar Tsot Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | hyderabadi-26 | Khagina | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Ghee |
| P4 | gujarati-302 | Khaman | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-06 | Khaman Dhokla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Rai |
| P4 | gujarati-23 | Khaman Kadhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | assamese-01 | Khar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-31 | Kharoli Diya Borali | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | assamese-26 | Kharoli Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | maharashtrian-67 | Kharvas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | north-48 | Khasta Moong Dal Kachori | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | goan-314 | Khatkhate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-11 | Khatta Dhokla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | kashmiri-60 | Khatta Nadru Tschok | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | kashmiri-25 | Khatte Baingan Koshur | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | hyderabadi-55 | Khatti Arvi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | hyderabadi-04 | Khatti Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Ghee |
| P4 | hyderabadi-75 | Khatti Moong | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | bengali-70 | Kheerer Chop | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Tel |
| P4 | hyderabadi-29 | Khichdi Khatta Kheema | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Ghee |
| P4 | gujarati-16 | Khichu Chilli Garlic | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera |
| P4 | assamese-71 | Khorisa Diya Kukura | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | hyderabadi-288 | Khubani ka Meetha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini |
| P4 | hyderabadi-62 | Kimami Seviyan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | bengali-50 | Kochu Shaak Chingri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | kashmiri-317 | Kokur Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-319 | Kola Urundai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-47 | Kola Urundai Pepper Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | maharashtrian-36 | Kolambi Bhaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | assamese-44 | Koldil Aru Chana Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-11 | Koldil Mangxo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | assamese-76 | Koldil Matar Khar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Namak |
| P4 | assamese-52 | Koldil Narikol Pitika | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | maharashtrian-312 | Kolhapuri Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-08 | Kolhapuri Egg Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | maharashtrian-31 | Kolhapuri Pav Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter |
| P4 | maharashtrian-16 | Kolhapuri Tambda Rassa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | ad-mkt-bread-poha-17 | Kolkata Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-17 | Kolkata Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-17 | Kolkata Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-17 | Kolkata Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-17 | Kolkata Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-17 | Kolkata Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-17 | Kolkata Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-17 | Kolkata High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-17 | Kolkata Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-17 | Kolkata Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-17 | Kolkata Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-17 | Kolkata Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-17 | Kolkata Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-17 | Kolkata Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-17 | Kolkata Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-17 | Kolkata Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | chettinad-34 | Kollu Milagu Masiyal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Jeera, Namak |
| P4 | assamese-298 | Komolar Kheer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini |
| P4 | assamese-57 | Koni Kharoli Bhurji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-35 | Koni Posola Bhurta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | maharashtrian-34 | Konkan Malvani Fish Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | south-311 | Kootu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-45 | Koraishutir Ghugni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Tel |
| P4 | bengali-44 | Koraishutir Kochuri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Tel |
| P4 | bengali-63 | Koraishutir Kofta Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | bengali-03 | Kosha Mangsho | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | kashmiri-57 | Koshur Anda Pulav | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-69 | Koshur Kesar Halwa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Chini |
| P4 | assamese-24 | Kosu Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | assamese-55 | Kosu Dhekia Bhaja | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-70 | Kothal Guti Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | chettinad-296 | Kothamalli Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | maharashtrian-04 | Kothimbir Vadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | maharashtrian-80 | Kothimbir Vatanachi Amti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | south-21 | Kothu Parotta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | chettinad-31 | Kozhi Puli Milagu Kuzhambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | bengali-40 | Kumro Phool Bhaja | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-38 | Kumura Aru Mator Ghonto Axomiya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-66 | Kumura Khar Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | chinese-b9-002 | Kung Pao Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-05 | Kuzhi Paniyaram | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | rajasthani-09 | Laal Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Ghee |
| P4 | north-47 | Lachha Pyaz Paneer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | hyderabadi-73 | Lagan ka Gosht | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | hyderabadi-72 | Lagan ka Murgh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | punjabi-31 | Lahore Style Chole Kulcha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | north-58 | Lahori Paneer Bhuna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | bengali-71 | Langcha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | thai-b9-013 | Larb Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-004 | Lasagna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-19 | Lasaniya Bataka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Lal Mirch Powder, Dhania Powder, Haldi, Tel |
| P4 | punjabi-30 | Lassi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini |
| P4 | maharashtrian-50 | Lasun Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Tel |
| P4 | rajasthani-36 | Lasun Ki Chutney Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | assamese-49 | Lau Aru Til Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | bengali-36 | Lau Chingri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera |
| P4 | diabetic-friendly-b9-008 | Lauki Chana Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-007 | Lauki Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-65 | Lauz | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | goan-288 | Layered Bebinca | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Chini |
| P4 | rajasthani-75 | Lehsun Methi Paneer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | punjabi-40 | Lehsuni Palak Corn | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | weight-loss-b9-016 | Lemon Coriander Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-018 | Lemon Herb Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-41 | Lemon Pickle | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | south-04 | Lemon Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Haldi |
| P4 | thai-b9-025 | Lemongrass Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-013 | Lentil Paneer Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-005 | Lentil Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-289 | Lilva Nu Shaak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Garam Masala, Tel |
| P4 | ad-mkt-bread-poha-33 | Lite Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-33 | Lite Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-33 | Lite Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-33 | Lite Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-33 | Lite Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-33 | Lite Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-33 | Lite Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-33 | Lite High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-33 | Lite Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-33 | Lite Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-33 | Lite Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-33 | Lite Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-33 | Lite Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-33 | Lite Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-33 | Lite Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-33 | Lite Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | gujarati-294 | Locho | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Tel, Namak |
| P4 | diabetic-friendly-b9-025 | Low GI Veg Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-024 | Low Oil Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-314 | Luchi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-08 | Luchi Aloor Dom | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Tel |
| P4 | bengali-289 | Luchi Alur Dom | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Tel |
| P4 | ad-mkt-bread-poha-15 | Lucknowi Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-15 | Lucknowi Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-15 | Lucknowi Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-15 | Lucknowi Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-15 | Lucknowi Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-15 | Lucknowi Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-15 | Lucknowi Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-15 | Lucknowi High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-15 | Lucknowi Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | north-36 | Lucknowi Matar Nimona | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | ad-mkt-medu-vada-15 | Lucknowi Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-15 | Lucknowi Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-15 | Lucknowi Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-15 | Lucknowi Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-15 | Lucknowi Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-15 | Lucknowi Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-15 | Lucknowi Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | hyderabadi-19 | Lukhmi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Ghee |
| P4 | kashmiri-290 | Lyodur Tschaman | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Ghee |
| P4 | chinese-b9-022 | Ma Po Eggplant | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-314 | Maa ki Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-67 | Maah Proxad Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing, Namak |
| P4 | kids-special-b9-014 | Mac and Cheese | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-46 | Macaroni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | bengali-61 | Macher Chop | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | bengali-312 | Macher Jhol | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-11 | Machher Jhol | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | gujarati-81 | Mag ni Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | gujarati-20 | Mag ni Dal na Dhokla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | assamese-45 | Magur Maach Jhal Axomiya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi, Namak |
| P4 | hyderabadi-58 | Mahi Qalia | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | rajasthani-28 | Makai Raab | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | north-70 | Makhana Matar Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | punjabi-37 | Makkhan Wali Mutter Paneer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-68 | Makkhani Soya Matar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-02 | Makki di Roti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Ghee, Butter |
| P4 | punjabi-290 | Makki Roti Sarson | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kerala-29 | Malabar Chicken Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kerala-09 | Malabar Parotta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Tel, Namak, Ghee |
| P4 | kerala-15 | Malabar Parotta with Beef Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | vegetarian-b9-003 | Malai Kofta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-310 | Malpua | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-311 | Manchow Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-40 | Mango Pickle | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | mexican-b9-025 | Mango Salsa Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-008 | Mango Sticky Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-33 | Mangodi Aloo Rasawala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | chinese-b9-001 | Mapo Tofu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-20 | Marag | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Ghee |
| P4 | kashmiri-40 | Marchwangan Anda | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | italian-b9-001 | Margherita Pizza | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-41 | Marwari Aloo Gatte | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-51 | Marwari Besan Mirchi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-61 | Marwari Chicken Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-73 | Marwari Chole Gatta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-80 | Marwari Fish Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-69 | Marwari Kaddu Panchphoran | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-285 | Marwari Ker Sangri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | north-44 | Masala Arbi Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | south-01 | Masala Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Haldi |
| P4 | punjabi-29 | Masala Egg Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Garam Masala |
| P4 | gujarati-30 | Masala Khichdi Kathiawadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Garam Masala |
| P4 | street-29 | Masala Maggi Tawa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | punjabi-54 | Masala Omelette Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-42 | Masala Tawa Mushroom | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | maharashtrian-37 | Masale Bhaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | maharashtrian-322 | Masale Bhat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-289 | Mashed Aloo Pitika | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | continental-b9-011 | Mashed Potato Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-27 | Masoor Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee, Namak |
| P4 | assamese-317 | Masor Petu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-02 | Masor Tenga | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | assamese-39 | Masor Tenga Jolokia | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | thai-b9-010 | Massaman Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-49 | Matar Kulcha Skillet | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | rajasthani-59 | Mathania Chicken Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-64 | Mathania Fish Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | north-41 | Mathura Dubki Wale Aloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | assamese-32 | Mati Dali Aru Kosu Xaak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing, Ghee, Namak |
| P4 | assamese-19 | Mati Mahor Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Haldi, Ghee, Hing, Namak |
| P4 | assamese-69 | Mati Mahor Tenga Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | kashmiri-313 | Matschgand | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-75 | Mattha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Namak |
| P4 | rajasthani-311 | Mawa Kachori | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-83 | Mawa Kachori Jodhpur | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | south-03 | Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Tel |
| P4 | chettinad-289 | Meen Kuzhambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | kerala-19 | Meen Pollichathu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | rajasthani-27 | Methi Bajra Khichda | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Jeera |
| P4 | household-17 | Methi Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel, Namak |
| P4 | kashmiri-11 | Methi Chaman | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | diabetic-friendly-b9-005 | Methi Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-47 | Methi Dana Aloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | hyderabadi-36 | Methi Keema | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Tel |
| P4 | punjabi-59 | Methi Malai Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | north-20 | Methi Malai Matar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | diabetic-friendly-b9-022 | Methi Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-42 | Methi Pithla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Tel |
| P4 | diabetic-friendly-b9-002 | Methi Thepla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-51 | Metkut Bhaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | mexican-b9-017 | Mexican Street Corn Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-83 | Milagu Crab Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | chettinad-54 | Milagu Jeera Prawn Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Jeera, Namak |
| P4 | chettinad-21 | Milagu Jeera Rasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Jeera, Rai |
| P4 | chettinad-295 | Milagu Kozhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Tel |
| P4 | south-82 | Milagu Rasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | ad-mkt-bread-poha-35 | Mild Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-35 | Mild Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-35 | Mild Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | kids-special-b9-022 | Mild Chicken Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-dal-fry-35 | Mild Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | kids-special-b9-017 | Mild Dal Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-dal-tadka-35 | Mild Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | kids-special-b9-008 | Mild Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-gujarati-handvo-35 | Mild Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-35 | Mild Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-35 | Mild High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-35 | Mild Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-35 | Mild Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-35 | Mild Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-35 | Mild Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-35 | Mild Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-35 | Mild Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-35 | Mild Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-35 | Mild Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | healthy-b9-007 | Millet Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-010 | Minestrone Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-28 | Mini Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-28 | Mini Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-28 | Mini Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-28 | Mini Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-28 | Mini Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | kids-special-b9-011 | Mini Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-gujarati-handvo-28 | Mini Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-28 | Mini Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-28 | Mini High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | kids-special-b9-003 | Mini Idli Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-jeera-rice-28 | Mini Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-28 | Mini Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-28 | Mini Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-28 | Mini Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-28 | Mini Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-28 | Mini Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-28 | Mini Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | kids-special-b9-024 | Mini Uttapam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-vegetable-pulao-28 | Mini Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | household-35 | Mint Raita | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | north-77 | Minty Rajma Galouti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | rajasthani-20 | Mirchi Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel |
| P4 | bengali-297 | Mishti Doi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Chini |
| P4 | bengali-10 | Mishti Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Chini |
| P4 | rajasthani-314 | Missi Roti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-009 | Mixed Millet Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-33 | Mixed Veg Raita | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | weight-loss-b9-021 | Mixed Veg Steamer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-77 | Moa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | bengali-20 | Mochar Ghonto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | maharashtrian-306 | Modak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-48 | Modern Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-48 | Modern Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-48 | Modern Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-48 | Modern Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-48 | Modern Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-48 | Modern Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-48 | Modern Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-48 | Modern High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-48 | Modern Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-48 | Modern Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-48 | Modern Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-48 | Modern Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-48 | Modern Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-48 | Modern Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-48 | Modern Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-48 | Modern Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | kashmiri-07 | Modur Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | kashmiri-287 | Modur Pulav | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | rajasthani-10 | Mohan Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kashmiri-67 | Monje Chana Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-13 | Monje Haakh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Namak |
| P4 | kashmiri-311 | Monji Haak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-21 | Monsoon Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-21 | Monsoon Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-21 | Monsoon Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-21 | Monsoon Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-21 | Monsoon Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-21 | Monsoon Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-21 | Monsoon Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-21 | Monsoon High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-21 | Monsoon Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-21 | Monsoon Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-21 | Monsoon Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-21 | Monsoon Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-21 | Monsoon Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-21 | Monsoon Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-21 | Monsoon Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-21 | Monsoon Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | bengali-64 | Moong Dal Bhaja | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Ghee, Jeera, Namak |
| P4 | high-protein-b9-008 | Moong Dal Chilla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-30 | Moong Dal Halwa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Chini |
| P4 | weight-loss-b9-003 | Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-68 | Moong Mangodi Palak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-50 | Moth Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | assamese-27 | Muga Xaakaru Chana | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-64 | Muga Xaakor Bora Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | north-17 | Mughlai Anda Kathi Roll | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | north-52 | Mughlai Chicken Rezala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | kashmiri-18 | Mujh Gaad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | kashmiri-58 | Mujh Nadru Tarkari | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | kashmiri-45 | Muji Chetin Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | kashmiri-70 | Muji Gaad Fried Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | bengali-47 | Mulo Ghonto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera |
| P4 | diabetic-friendly-b9-017 | Multigrain Roti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-021 | Multigrain Roti Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-291 | Multigrain Thalipeeth | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Tel, Namak |
| P4 | ad-mkt-bread-poha-07 | Mumbai Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-07 | Mumbai Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-07 | Mumbai Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-07 | Mumbai Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-07 | Mumbai Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-07 | Mumbai Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-07 | Mumbai Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-07 | Mumbai High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-07 | Mumbai Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-07 | Mumbai Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-07 | Mumbai Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-07 | Mumbai Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-07 | Mumbai Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-07 | Mumbai Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-07 | Mumbai Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-07 | Mumbai Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | punjabi-56 | Murgh Achari Tikka Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | hyderabadi-51 | Murgh Badami Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | hyderabadi-59 | Murgh Choliya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | punjabi-26 | Murgh Lababdar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter |
| P4 | punjabi-79 | Murgh Methi Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | bengali-25 | Muri Ghonto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | chettinad-67 | Murungai Ilai Paruppu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Namak |
| P4 | chettinad-41 | Murungakkai Mutton Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Jeera, Namak |
| P4 | chettinad-16 | Murungakkai Poricha Kuzhambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Rai |
| P4 | goan-09 | Mushroom Cafreal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Butter |
| P4 | chettinad-291 | Mushroom Chettinad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | vegetarian-b9-008 | Mushroom Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-47 | Mushroom Pepper Bao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | vegan-b9-010 | Mushroom Pepper Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-006 | Mushroom Risotto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-005 | Mushroom Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-015 | Mushroom Tacos | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-323 | Muthia | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-35 | Muttai Kara Kuzhambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | chettinad-49 | Muttai Kari Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | chettinad-62 | Mutton Chinna Vengayam Thokku | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | chettinad-02 | Mutton Chukka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | punjabi-317 | Mutton Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-14 | Mutton Haleem | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Garam Masala |
| P4 | high-protein-b9-023 | Mutton Keema Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-50 | Mutton Kofta Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | hyderabadi-08 | Mutton Marag | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kashmiri-79 | Mutton Monje Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | bengali-322 | Mutton Rezala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-43 | Mutton Shorba | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | south-27 | Mutton Sukka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | chettinad-23 | Mutton Uppu Kari | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kashmiri-316 | Mutton Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-51 | Mutton Yakhni Kanti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | north-55 | Mutton Yakhni Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | south-288 | Mysore Bisi Bele Bath | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | south-07 | Mysore Bonda | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Tel |
| P4 | south-297 | Mysore Pak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Chini, Namak |
| P4 | mexican-b9-006 | Nachos Supreme | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-07 | Nadan Chicken Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-05 | Nadan Egg Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kerala-18 | Nadan Kozhi Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Dhania Powder |
| P4 | kashmiri-312 | Nadir Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-32 | Nadru Chaman Kaliya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-50 | Nadru Methi Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-15 | Nadru Monje | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel, Namak |
| P4 | kashmiri-41 | Nadru Palak Monje | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Namak |
| P4 | kashmiri-78 | Nadru Saffron Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-68 | Nadru Tamatar Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-05 | Nadru Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Hing |
| P4 | maharashtrian-68 | Nagpuri Saoji Mutton | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | north-45 | Nainital Aloo Gutke | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | hyderabadi-30 | Nalli Nihari | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | chettinad-13 | Nandu Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | chettinad-36 | Nandu Poondu Varuval | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | maharashtrian-66 | Narali Bhaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | north-27 | Nargisi Kofta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Ghee |
| P4 | hyderabadi-69 | Nargisi Kofta Hyderabadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Ghee |
| P4 | assamese-62 | Narikol Bilahi Koni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-40 | Narikol Boror Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-20 | Narikol Diya Xaak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-316 | Narikol Laru | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-70 | Nariyal Milagu Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | bengali-46 | Narkel Diye Cholar Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | bengali-76 | Narkel Naru | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | chettinad-313 | Nattu Kozhi Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-22 | Nattu Kozhi Kulambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | vegetarian-b9-019 | Navratan Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-12 | Neer Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Tel |
| P4 | chettinad-50 | Nethili Podi Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | chettinad-24 | Nethili Varuval | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | goan-323 | Neuro | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-30 | Nihari | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | north-83 | Nihari Vegetarian | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | hyderabadi-287 | Nizam Bagara Baingan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | hyderabadi-76 | Nizami Aab Gosht | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | bengali-321 | Nolen Gurer Sandesh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-24 | Noon Chai Anda Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-53 | Noon Chai Murg Tikka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | weight-loss-b9-014 | Oats Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-004 | Oats Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-81 | Old Delhi Mutton Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Ghee |
| P4 | north-290 | Old Delhi Nihari | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-bread-poha-41 | One-pot Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-41 | One-pot Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-41 | One-pot Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-41 | One-pot Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-41 | One-pot Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-41 | One-pot Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-41 | One-pot Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-41 | One-pot High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-41 | One-pot Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-41 | One-pot Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-41 | One-pot Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-41 | One-pot Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-41 | One-pot Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-41 | One-pot Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-41 | One-pot Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-41 | One-pot Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | gujarati-309 | Oondhiya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-017 | Orange Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-315 | Osmania Biscuit Chai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-017 | Osso Buco | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-47 | Ou Diya Mati Mah | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing, Ghee, Namak |
| P4 | assamese-79 | Ou Khar Aru Chana | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-321 | Ou Khatta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-12 | Ou Khatta Murgi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | assamese-09 | Ou Tenga Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Rai |
| P4 | assamese-286 | Ou Tenga Fish Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | assamese-296 | Ou Tenga Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | chettinad-22 | Paal Paniyaram | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | bengali-26 | Pabda Jhal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | chettinad-43 | Pacha Milagai Chicken Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | kerala-311 | Pachadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-001 | Pad Thai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-38 | Pahadi Aloo Thechwani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | kerala-26 | Palada Payasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | punjabi-34 | Palak Chana Punjabi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | north-46 | Palak Corn Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | north-22 | Palak Gosht | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Ghee |
| P4 | diabetic-friendly-b9-011 | Palak Methi Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-002 | Palak Paneer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-009 | Palak Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-55 | Palakchi Patal Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Tel |
| P4 | thai-b9-011 | Panang Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-18 | Panchmel Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | maharashtrian-17 | Pandhra Rassa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | chinese-318 | Paneer 65 | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-16 | Paneer Bhurji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Garam Masala |
| P4 | vegetarian-b9-001 | Paneer Butter Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-019 | Paneer Cubes Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-015 | Paneer Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-75 | Paneer Methi Chaman | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | chettinad-63 | Paneer Milagai Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | vegetarian-b9-012 | Paneer Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-paneer-pulao-01 | Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | high-protein-b9-019 | Paneer Salad Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-007 | Paneer Tikka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-003 | Paneer Tikka Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-21 | Pani Hamuk Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | assamese-50 | Pani Hamuk Tenga | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | assamese-322 | Pani Komolar Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-314 | Pani Pitha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-290 | Paniyaram | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Tel, Namak |
| P4 | italian-b9-019 | Panna Cotta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-318 | Panta Bhat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-72 | Pantua | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Tel |
| P4 | rajasthani-06 | Papad ki Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing, Ghee |
| P4 | thai-b9-021 | Papaya Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-311 | Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-23 | Parippu Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Haldi, Rai, Ghee |
| P4 | ad-mkt-bread-poha-44 | Party Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-44 | Party Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-44 | Party Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-44 | Party Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-44 | Party Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-44 | Party Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-44 | Party Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-44 | Party High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-44 | Party Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-44 | Party Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-44 | Party Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-44 | Party Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-44 | Party Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-44 | Party Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-44 | Party Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-44 | Party Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | hyderabadi-49 | Pasinde | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | hyderabadi-15 | Pathar ka Gosht | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Lal Mirch Powder, Ghee |
| P4 | punjabi-66 | Patiala Chicken Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | bengali-291 | Patishapta Pitha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | goan-19 | Patoleo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | gujarati-07 | Patra | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Dhania Powder |
| P4 | gujarati-22 | Patudi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Rai, Hing |
| P4 | maharashtrian-46 | Patwadi Rassa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | street-02 | Pav Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter |
| P4 | hyderabadi-47 | Paya Shorba | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kerala-314 | Payasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-68 | Payesh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini |
| P4 | household-37 | Peanut Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Tel |
| P4 | vegan-b9-013 | Peanut Noodle Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-29 | Peas Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | maharashtrian-54 | Peeth Perun Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | chinese-b9-012 | Peking Duck Pancakes | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-003 | Penne Arrabbiata | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-74 | Pepper Crab Kuzhambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | chinese-74 | Pepper Garlic Chicken Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | north-72 | Pepper Garlic Mutton Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | north-78 | Peshawari Chole Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | punjabi-62 | Peshawari Mutton Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | italian-b9-007 | Pesto Pasta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-320 | Phirni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-48 | Phodnicha Bhaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel |
| P4 | household-06 | Phulka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | mexican-b9-023 | Pico de Gallo Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-64 | Pindi Aloo Anardana | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | punjabi-43 | Pindi Kala Chana | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | thai-b9-007 | Pineapple Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kerala-33 | Pineapple Pachadi Kerala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | punjabi-287 | Pinni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | bengali-75 | Pithe Puli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | maharashtrian-01 | Pithla Bhakri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Rai |
| P4 | assamese-80 | Pitika Trio Axomiya | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | household-45 | Pizza Toast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel, Namak |
| P4 | south-300 | Plain Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-04 | Plain Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Ghee |
| P4 | south-29 | Podi Paneer Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | italian-b9-023 | Polenta Fries | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-312 | Pongal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-83 | Pongal Paniyaram | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Kali Mirch |
| P4 | chettinad-46 | Poondu Era Puli Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | chettinad-29 | Poondu Kuzhambu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | chettinad-79 | Poondu Milagu Kuzhi Paniyaram | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | south-310 | Poriyal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-04 | Pork Vindaloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera |
| P4 | assamese-309 | Pork with Bamboo Shoot | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-08 | Pork with Lai Xaak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | assamese-17 | Posola Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | assamese-68 | Posola Til Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | bengali-37 | Potol Dorma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | bengali-38 | Potol Posto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | mexican-b9-011 | Pozole Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | goan-02 | Prawn Balchao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | goan-318 | Prawn Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-24 | Prawn Ghee Roast Roll | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-01 | Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | bengali-287 | Prawn Malai Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Ghee |
| P4 | chettinad-09 | Prawn Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | chettinad-78 | Prawn Thengai Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | ad-mkt-bread-poha-32 | Premium Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-32 | Premium Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-32 | Premium Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-32 | Premium Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-32 | Premium Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-32 | Premium Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-32 | Premium Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-32 | Premium High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-32 | Premium Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-32 | Premium Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-32 | Premium Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-32 | Premium Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-32 | Premium Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-32 | Premium Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-32 | Premium Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-32 | Premium Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | ad-mkt-bread-poha-40 | Pressure-cooker Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-40 | Pressure-cooker Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-40 | Pressure-cooker Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-40 | Pressure-cooker Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-40 | Pressure-cooker Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-40 | Pressure-cooker Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-40 | Pressure-cooker Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-40 | Pressure-cooker High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-40 | Pressure-cooker Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-40 | Pressure-cooker Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-40 | Pressure-cooker Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-40 | Pressure-cooker Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-40 | Pressure-cooker Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-40 | Pressure-cooker Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-40 | Pressure-cooker Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-40 | Pressure-cooker Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | high-protein-b9-004 | Protein Dal Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-025 | Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-016 | Protein Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-310 | Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-61 | Puli Inji Chettinad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Namak |
| P4 | south-298 | Puliyodharai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel, Namak |
| P4 | south-23 | Puliyogare | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | punjabi-72 | Punjabi Arbi Masala Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-76 | Punjabi Chana Palak Rice Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-60 | Punjabi Chicken Chaap Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-57 | Punjabi Chicken Keema Kaleji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-69 | Punjabi Corn Capsicum Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-52 | Punjabi Egg Bhuna | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-78 | Punjabi Egg Tikka Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-63 | Punjabi Fish Tikka Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-41 | Punjabi Kadak Bhindi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | north-286 | Punjabi Kadhi Chawal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Haldi |
| P4 | punjabi-05 | Punjabi Kadhi Pakora | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | punjabi-44 | Punjabi Karela Pyaz | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-74 | Punjabi Lauki Kofta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-48 | Punjabi Masala Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-67 | Punjabi Mutton Kofta Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | kashmiri-27 | Punjabi Rajma Gogji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Ghee |
| P4 | punjabi-33 | Punjabi Soya Chaap Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-bread-poha-09 | Punjabi-style Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-09 | Punjabi-style Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-09 | Punjabi-style Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-09 | Punjabi-style Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-09 | Punjabi-style Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-09 | Punjabi-style Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-09 | Punjabi-style Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-09 | Punjabi-style High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-09 | Punjabi-style Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-09 | Punjabi-style Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-09 | Punjabi-style Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-09 | Punjabi-style Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-09 | Punjabi-style Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-09 | Punjabi-style Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-09 | Punjabi-style Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-09 | Punjabi-style Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | assamese-72 | Pura Aloo Khar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Namak |
| P4 | assamese-41 | Pura Bilahi Pitika | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | maharashtrian-62 | Puran Poli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | maharashtrian-82 | Puran Poli with Katachi Amti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | south-319 | Puttu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-288 | Pyaz Kachori | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel, Namak |
| P4 | hyderabadi-17 | Qubani ka Meetha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini |
| P4 | hyderabadi-310 | Qubooli Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-015 | Quiche Lorraine | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-03 | Quick Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-03 | Quick Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-03 | Quick Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-03 | Quick Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-03 | Quick Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-03 | Quick Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-03 | Quick Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-03 | Quick High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-moong-dal-soup-03 | Quick Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-03 | Quick Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-03 | Quick Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-03 | Quick Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-03 | Quick Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-03 | Quick Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | high-protein-b9-009 | Quinoa Paneer Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-002 | Quinoa Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-23 | Rabodi ki Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Haldi, Ghee |
| P4 | bengali-78 | Radhaballabhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Tel, Namak |
| P4 | diabetic-friendly-b9-006 | Ragi Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-30 | Ragi Mudde Saaru | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | weight-loss-b9-013 | Ragi Porridge | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-34 | Rajasthani Aam Ki Launji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-48 | Rajasthani Chane Ka Saag | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-70 | Rajasthani Chilli Garlic Tinda | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-56 | Rajasthani Egg Mirchi Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-65 | Rajasthani Fish Jhol | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-07 | Rajasthani Kadhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing, Ghee |
| P4 | rajasthani-287 | Rajasthani Laal Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Garam Masala |
| P4 | rajasthani-62 | Rajasthani Mutton Jungli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-77 | Rajasthani Onion Mirch Pakoda Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-42 | Rajasthani Papad Mangodi Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-74 | Rajasthani Soya Aloo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-54 | Rajasthani Tamatar Sev | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | north-300 | Rajma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-02 | Rajma Chawal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kashmiri-31 | Rajma Gogji Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | high-protein-b9-022 | Rajma Protein Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-57 | Rajputana Anda Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | rajasthani-76 | Rajwadi Veg Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | street-18 | Ram Ladoo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | south-308 | Rasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-310 | Rasgulla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-50 | Rasmalai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini |
| P4 | ad-mkt-bread-poha-50 | Rasoi Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-50 | Rasoi Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-50 | Rasoi Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-50 | Rasoi Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-50 | Rasoi Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-50 | Rasoi Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-50 | Rasoi Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-50 | Rasoi High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-50 | Rasoi Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-50 | Rasoi Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-50 | Rasoi Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-50 | Rasoi Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-50 | Rasoi Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-50 | Rasoi Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-50 | Rasoi Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-50 | Rasoi Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | maharashtrian-56 | Ratalyacha Kees | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | continental-b9-016 | Ratatouille | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-11 | Rava Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Kali Mirch |
| P4 | goan-21 | Rava Fried Fish | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Lal Mirch Powder, Haldi |
| P4 | ad-mkt-rava-idli-01 | Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | italian-b9-013 | Ravioli Spinach Ricotta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | jain-b9-006 | Raw Banana Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing, Haldi, Namak, Tel |
| P4 | goan-289 | Recheado Masala Fish | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | goan-27 | Recheado Pomfret | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | thai-b9-003 | Red Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-287 | Rice Khichu | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Lal Mirch Powder, Tel, Namak |
| P4 | gujarati-10 | Ringan Bateta nu Shaak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera |
| P4 | gujarati-308 | Ringan nu Shaak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-005 | Risotto Milanese | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | continental-b9-007 | Roast Vegetable Platter | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-019 | Roasted Sweet Potato | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-012 | Roasted Veg Quinoa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-75 | Rohu Narikol Jhol | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | goan-30 | Ros Omelette | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Tel |
| P4 | ad-mkt-bread-poha-05 | Royal Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-05 | Royal Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-05 | Royal Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-05 | Royal Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-05 | Royal Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-05 | Royal Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-05 | Royal Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-05 | Royal High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-05 | Royal Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-05 | Royal Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-05 | Royal Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-05 | Royal Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-05 | Royal Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-05 | Royal Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-05 | Royal Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-05 | Royal Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | bengali-33 | Rui Kalia | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | kashmiri-12 | Ruwangan Chaman | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | maharashtrian-06 | Sabudana Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | rajasthani-25 | Safed Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kashmiri-62 | Saffron Ver Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | north-50 | Saffron Zafrani Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | mexican-b9-016 | Salsa Verde Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-024 | Salt and Pepper Squid | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-307 | Sambar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-57 | Sambar Vengayam Egg Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | bengali-309 | Sandesh | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | rajasthani-44 | Sangri Aloo Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | goan-304 | Sannas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-69 | Saoji Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | punjabi-01 | Sarson da Saag | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | punjabi-65 | Sarson Fish Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-82 | Sarson Ka Saag Makki Roti Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | thai-b9-014 | Satay Skewers | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-021 | Sattu Drink Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-68 | Sattu Stuffed Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | chinese-20 | Scallion Pancakes | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | chinese-297 | Schezwan Paneer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | italian-b9-022 | Seafood Linguine | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-294 | Seeraga Samba Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Tel |
| P4 | chettinad-59 | Seeraga Samba Lemon Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Namak |
| P4 | chinese-b9-016 | Sesame Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-74 | Sesame Honey Chicken Bites | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | rajasthani-22 | Sev Tamatar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | gujarati-307 | Sev Tameta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-02 | Sev Tameta nu Shaak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Lal Mirch Powder, Dhania Powder, Rai |
| P4 | mexican-b9-022 | Seven Layer Dip | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-289 | Shahi Double ka Meetha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | north-51 | Shahi Egg Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | vegetarian-b9-025 | Shahi Paneer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-64 | Shahi Tukda | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | kashmiri-65 | Shalgam Kebab Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | hyderabadi-61 | Sheer Khurma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | household-48 | Sheera | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Chini |
| P4 | hyderabadi-28 | Sheermal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | continental-b9-003 | Shepherd Pie | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-41 | Shepu Chi Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | hyderabadi-21 | Shikampur Kebab | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | hyderabadi-294 | Shikampuri Kebab | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Tel, Namak |
| P4 | bengali-01 | Shorshe Ilish | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | maharashtrian-63 | Shrikhand | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini |
| P4 | kashmiri-30 | Shufta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | bengali-06 | Shukto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | household-31 | Sindhi Kadhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing, Tel, Namak |
| P4 | chinese-321 | Sizzler | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-288 | Slow Kosha Mangsho | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Ghee |
| P4 | north-61 | Smoked Dal Panchratan | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | punjabi-55 | Smoked Egg Keema | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-bread-poha-06 | Smoky Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-06 | Smoky Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-06 | Smoky Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-06 | Smoky Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-06 | Smoky Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-06 | Smoky Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-06 | Smoky Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-06 | Smoky High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-06 | Smoky Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-06 | Smoky Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-06 | Smoky Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-06 | Smoky Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-06 | Smoky Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-06 | Smoky Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-06 | Smoky Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-06 | Smoky Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | hyderabadi-52 | Sofiyani Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-bread-poha-37 | Soft Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-37 | Soft Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-37 | Soft Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-37 | Soft Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-37 | Soft Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-37 | Soft Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-37 | Soft Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-37 | Soft High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-37 | Soft Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | south-291 | Soft Kuzhi Paniyaram | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Tel, Namak |
| P4 | ad-mkt-medu-vada-37 | Soft Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-37 | Soft Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-37 | Soft Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-37 | Soft Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-37 | Soft Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-37 | Soft Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-37 | Soft Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | maharashtrian-73 | Solapuri Shenga Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Tel |
| P4 | maharashtrian-27 | Solkadhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | thai-b9-009 | Som Tam Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-47 | Sonth Saunf Fish Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | goan-07 | Sorak Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | chettinad-27 | South Chettinad Egg Dosa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | chettinad-26 | South Chettinad Tomato Bath | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | chettinad-25 | South Chettinad Vegetable Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | ad-mkt-bread-poha-10 | South Indian Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-10 | South Indian Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-10 | South Indian Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-10 | South Indian Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-10 | South Indian Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-10 | South Indian Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-10 | South Indian Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-10 | South Indian High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-10 | South Indian Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-10 | South Indian Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-10 | South Indian Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-10 | South Indian Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-10 | South Indian Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-10 | South Indian Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-10 | South Indian Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-10 | South Indian Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | high-protein-b9-005 | Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | italian-b9-002 | Spaghetti Carbonara | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-80 | Spiced Beetroot Tikki | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | ad-mkt-bread-poha-34 | Spicy Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-34 | Spicy Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-34 | Spicy Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-34 | Spicy Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-34 | Spicy Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-34 | Spicy Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-34 | Spicy Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-34 | Spicy High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-34 | Spicy Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-34 | Spicy Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-34 | Spicy Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-34 | Spicy Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-34 | Spicy Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-34 | Spicy Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-34 | Spicy Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-34 | Spicy Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | north-60 | Spinach Hara Bhara Kebab | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | weight-loss-b9-023 | Spinach Lentil Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-023 | Spinach Lentil Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-020 | Spring Roll Basket | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-011 | Spring Rolls | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-012 | Sprout Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-015 | Sprout Chaat Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-005 | Sprout Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-015 | Sprout Usal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-022 | Steamed Broccoli Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-010 | Steamed Dumplings | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-023 | Steamed Fish Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-004 | Steamed Fish Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-008 | Steamed Idli Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-285 | Steamed Modak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | healthy-b9-014 | Steamed Momo Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-001 | Steamed Veg Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | diabetic-friendly-b9-010 | Steamed Veg Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | weight-loss-b9-015 | Steamed Veg Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-25 | Street-style Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-25 | Street-style Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-25 | Street-style Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-25 | Street-style Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-25 | Street-style Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-25 | Street-style Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-25 | Street-style Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-25 | Street-style High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-25 | Street-style Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-25 | Street-style Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-25 | Street-style Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-25 | Street-style Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-25 | Street-style Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-25 | Street-style Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-25 | Street-style Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-25 | Street-style Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | punjabi-286 | Stuffed Amritsari Kulcha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter |
| P4 | continental-b9-009 | Stuffed Bell Peppers | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-286 | Stuffed Bharli Vangi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | vegetarian-b9-013 | Stuffed Capsicum | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-35 | Stuffed Gobhi Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | continental-b9-023 | Stuffed Mushrooms | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | punjabi-311 | Stuffed Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-70 | Subz Nargisi Kofta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | hyderabadi-54 | Subz Zafrani Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | household-49 | Suji Halwa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Chini |
| P4 | chettinad-77 | Sukka Mutton Masiyal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | ad-mkt-bread-poha-23 | Summer Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-23 | Summer Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-23 | Summer Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-23 | Summer Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-23 | Summer Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-23 | Summer Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-23 | Summer Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-23 | Summer High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-23 | Summer Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-23 | Summer Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-23 | Summer Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-23 | Summer Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-23 | Summer Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-23 | Summer Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-23 | Summer Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-23 | Summer Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | ad-mkt-bread-poha-43 | Sunday Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-43 | Sunday Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-43 | Sunday Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-43 | Sunday Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-43 | Sunday Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-43 | Sunday Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-43 | Sunday Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-43 | Sunday High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-43 | Sunday Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-43 | Sunday Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-43 | Sunday Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-43 | Sunday Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-43 | Sunday Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-43 | Sunday Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-43 | Sunday Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-43 | Sunday Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | gujarati-83 | Surati Undhiyu Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | maharashtrian-33 | Surmai Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel |
| P4 | gujarati-09 | Surti Anda Ghotala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter |
| P4 | gujarati-25 | Surti Kolmi no Patia | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Lal Mirch Powder |
| P4 | chinese-b9-003 | Sweet and Sour Pork | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-023 | Sweet Corn Cup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-310 | Sweet Corn Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-019 | Sweet Potato Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-013 | Szechuan Eggplant | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-317 | Szechuan Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-81 | Szechuan Paneer Dry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | maharashtrian-316 | Taambda Rassa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-09 | Tabak Maaz | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | mexican-b9-021 | Taco Salad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-43 | Tahri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Tel, Namak |
| P4 | maharashtrian-52 | Takachi Kadhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | hyderabadi-09 | Talawa Gosht | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Ghee |
| P4 | maharashtrian-65 | Talniche Modak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Tel |
| P4 | mexican-b9-019 | Tamale Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-39 | Tamarind Chutney | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | south-286 | Tamarind Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | household-23 | Tamatar Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing, Tel, Namak |
| P4 | hyderabadi-309 | Tamatar ka Kut | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-56 | Tamatar Kut | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Tel |
| P4 | kashmiri-33 | Tamatar Tschok Gaad | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | hyderabadi-321 | Tamate ka Kut | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | hyderabadi-35 | Tamatey Gosht | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | maharashtrian-289 | Tamda Rassa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | gujarati-28 | Tameta Bateta nu Rasa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Jeera, Lal Mirch Powder |
| P4 | gujarati-82 | Tameta Bhakri Pizza | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | punjabi-39 | Tandoori Broccoli Punjabi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | north-65 | Tandoori Broccoli Tikka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | punjabi-84 | Tandoori Cauliflower Steak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter |
| P4 | punjabi-09 | Tandoori Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | high-protein-b9-011 | Tandoori Chicken Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | street-83 | Tandoori Momo Sizzler | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Butter |
| P4 | punjabi-61 | Tandoori Mutton Chaap | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-297 | Tandoori Roti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Ghee, Tel |
| P4 | north-37 | Tandoori Soya Chaap Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | punjabi-70 | Tandoori Veg Seekh Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-bread-poha-39 | Tawa Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-39 | Tawa Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-39 | Tawa Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-39 | Tawa Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-39 | Tawa Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-39 | Tawa Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-39 | Tawa Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-39 | Tawa High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-39 | Tawa Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | north-24 | Tawa Kaleji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Dhania Powder |
| P4 | ad-mkt-medu-vada-39 | Tawa Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-39 | Tawa Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-39 | Tawa Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-39 | Tawa Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-39 | Tawa Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-39 | Tawa Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | punjabi-50 | Tawa Soya Keema | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | north-53 | Tawa Tangdi Masala | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | ad-mkt-vegetable-pulao-39 | Tawa Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | chinese-b9-025 | Tea Eggs | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-021 | Tempeh Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-24 | Temple Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-24 | Temple Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-24 | Temple Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-24 | Temple Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-24 | Temple Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-24 | Temple Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-24 | Temple Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-24 | Temple High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-24 | Temple Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-24 | Temple Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-24 | Temple Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-24 | Temple Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-24 | Temple Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-24 | Temple Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-24 | Temple Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-24 | Temple Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | maharashtrian-47 | Tendli Bhaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | assamese-308 | Tenga Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-53 | Tetor Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | thai-b9-012 | Thai Basil Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-323 | Thai Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-019 | Thai Fish Cakes | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-022 | Thai Iced Tea Jelly | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-024 | Thai Omelette | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-017 | Thai Yellow Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-45 | Thakkali Milagu Rasam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Jeera, Rai, Namak |
| P4 | kerala-291 | Thalassery Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | maharashtrian-07 | Thalipeeth | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | south-289 | Thayir Sadam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | chettinad-56 | Thengai Mutton Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | gujarati-303 | Thepla | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | bengali-48 | Thor Ghonto | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | kerala-309 | Thoran | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-b9-023 | Three Cup Chicken | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-78 | Til Dhania Anda Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-18 | Til Diya Murgi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | assamese-58 | Til Gos Maangxo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | hyderabadi-23 | Til ka Khatta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | rajasthani-43 | Til Methi Bajra Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder, Ghee |
| P4 | assamese-29 | Til Pitha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | assamese-33 | Til Pora Bilahi Maas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | household-18 | Tinda Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Haldi, Tel, Namak |
| P4 | italian-b9-018 | Tiramisu Cup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | high-protein-b9-024 | Tofu Protein Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-002 | Tofu Stir Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-005 | Tom Kha Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | thai-b9-004 | Tom Yum Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-023 | Tomato Basil Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | south-290 | Tomato Bath | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Tel |
| P4 | diabetic-friendly-b9-018 | Tomato Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | north-73 | Tomato Fenugreek Fish Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Dhania Powder |
| P4 | south-17 | Tomato Rasam Shorba | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Jeera |
| P4 | weight-loss-b9-010 | Tomato Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-03 | Toor Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Ghee, Jeera, Hing |
| P4 | household-19 | Tori Sabzi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Haldi, Tel, Namak |
| P4 | mexican-b9-012 | Tostada Stack | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | ad-mkt-bread-poha-47 | Traditional Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-47 | Traditional Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-47 | Traditional Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-47 | Traditional Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-47 | Traditional Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-47 | Traditional Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-47 | Traditional Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-47 | Traditional High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-47 | Traditional Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-47 | Traditional Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-47 | Traditional Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-47 | Traditional Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-47 | Traditional Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-47 | Traditional Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-47 | Traditional Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-47 | Traditional Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | kashmiri-72 | Tschaman Matar Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-20 | Tsok Wangun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | hyderabadi-78 | Turai Gosht | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | kashmiri-38 | Turnip Mujh Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-56 | Turnip Paneer Yemberzal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | gujarati-316 | Tuver Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-18 | Tuver Ringan Shaak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Dhania Powder |
| P4 | ad-mkt-bread-poha-20 | Udaipur Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-20 | Udaipur Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-20 | Udaipur Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-20 | Udaipur Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-20 | Udaipur Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-20 | Udaipur Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-20 | Udaipur Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-20 | Udaipur High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-20 | Udaipur Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-20 | Udaipur Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-20 | Udaipur Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-20 | Udaipur Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-20 | Udaipur Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-20 | Udaipur Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-20 | Udaipur Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-20 | Udaipur Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | maharashtrian-30 | Ukadiche Modak | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kerala-322 | Unniyappam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-53 | Uppu Kari Kozhi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | household-28 | Urad Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee, Namak |
| P4 | chettinad-287 | Urlai Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel, Namak |
| P4 | maharashtrian-45 | Usal Pav | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | south-304 | Uttapam | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | gujarati-27 | Vaal ni Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | street-01 | Vada Pav | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Haldi |
| P4 | gujarati-14 | Vaghareli Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Jeera, Haldi, Lal Mirch Powder |
| P4 | maharashtrian-03 | Varan Bhaat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Ghee, Hing, Jeera |
| P4 | maharashtrian-315 | Varan Bhat | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-79 | Varhadi Mutton Rassa | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | maharashtrian-70 | Varhadi Mutton Sukka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala, Kali Mirch, Tel |
| P4 | maharashtrian-49 | Varhadi Thecha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak, Tel |
| P4 | chettinad-44 | Vazhaipoo Kozhi Cutlet | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | chettinad-20 | Vazhaipoo Paruppu Usili | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | chettinad-65 | Vazhakkai Muttai Podimas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Namak |
| P4 | chettinad-30 | Vazhakkai Podi Roast | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Rai, Namak |
| P4 | vegetarian-b9-006 | Veg Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-022 | Veg Cutlet | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-012 | Veg Cutlet Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | mexican-b9-004 | Veg Enchiladas | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-15 | Veg Kolhapuri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel, Namak |
| P4 | kids-special-b9-020 | Veg Maggi Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-006 | Veg Nuggets | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kids-special-b9-002 | Veg Pasta | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-51 | Veg Pepper Salt Momos | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch |
| P4 | kids-special-b9-015 | Veg Pizza Slice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-011 | Veg Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegetarian-b9-020 | Veg Seekh Kebab | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chinese-290 | Veg Spring Rolls | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | vegan-b9-004 | Vegan Biryani | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-001 | Vegan Buddha Bowl | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-014 | Vegan Burger | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-011 | Vegan Fried Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-020 | Vegan Korma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-016 | Vegan Pad Thai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-006 | Vegan Pasta Primavera | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-018 | Vegan Pizza | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-022 | Vegan Sambar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-008 | Vegan Tacos | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | vegan-b9-024 | Vegan Wrap | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | healthy-b9-016 | Vegetable Clear Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-16 | Vegetable Jalfrezi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel, Namak |
| P4 | ad-mkt-vegetable-pulao-01 | Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | kerala-320 | Vegetable Stew | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | household-44 | Vegetable Tehri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Tel, Namak |
| P4 | chinese-83 | Vegetable Triple Schezwan Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | continental-b9-021 | Veggie Burger Plate | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | chettinad-14 | Vellai Paniyaram | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | south-287 | Ven Pongal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Jeera, Ghee |
| P4 | south-25 | Vendakkai Pachadi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | kashmiri-74 | Ver Masala Egg Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-37 | Ver Masala Tchaaman | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-26 | Ver Masala Tchok Vangun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak |
| P4 | household-11 | Vermicelli Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Tel, Namak |
| P4 | kashmiri-59 | Walnut Gushtaba Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-44 | Walnut Haakh Paneer | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | kashmiri-76 | Walnut Rajma Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | hyderabadi-60 | Warqi Paratha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak, Tel |
| P4 | kashmiri-289 | Wazwan Tabak Maaz | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Garam Masala |
| P4 | hyderabadi-290 | Wedding Marag Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-bread-poha-42 | Weeknight Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-42 | Weeknight Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-42 | Weeknight Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-42 | Weeknight Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-42 | Weeknight Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-42 | Weeknight Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-42 | Weeknight Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-42 | Weeknight High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-42 | Weeknight Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-42 | Weeknight Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-42 | Weeknight Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-42 | Weeknight Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-42 | Weeknight Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-42 | Weeknight Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-42 | Weeknight Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-42 | Weeknight Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | household-25 | White Chana Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Tel, Namak |
| P4 | ad-mkt-bread-poha-22 | Winter Bread Poha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-bread-upma-22 | Winter Bread Upma | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | ad-mkt-chicken-kosha-22 | Winter Chicken Kosha | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-dal-fry-22 | Winter Dal Fry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera |
| P4 | ad-mkt-dal-tadka-22 | Winter Dal Tadka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Hing |
| P4 | ad-mkt-gujarati-handvo-22 | Winter Gujarati Handvo | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Hing |
| P4 | ad-mkt-gulab-jamun-22 | Winter Gulab Jamun | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Chini, Ghee |
| P4 | ad-mkt-high-protein-khichdi-22 | Winter High-Protein Khichdi | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee |
| P4 | ad-mkt-jeera-rice-22 | Winter Jeera Rice | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee, Namak |
| P4 | ad-mkt-medu-vada-22 | Winter Medu Vada | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Hing, Tel |
| P4 | ad-mkt-moong-dal-soup-22 | Winter Moong Dal Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Kali Mirch, Haldi |
| P4 | ad-mkt-paneer-pulao-22 | Winter Paneer Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | ad-mkt-prawn-malai-22 | Winter Prawn Malai | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi |
| P4 | ad-mkt-rava-idli-22 | Winter Rava Idli | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai, Hing |
| P4 | ad-mkt-soya-chunk-curry-22 | Winter Soya Chunk Curry | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Garam Masala |
| P4 | ad-mkt-vegetable-pulao-22 | Winter Vegetable Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Jeera, Ghee |
| P4 | chinese-b9-005 | Wonton Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-306 | Xaak aru Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | assamese-05 | Xaak Bhaji | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-43 | Xaak Murgi Jool | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | assamese-74 | Xaakor Tenga Soup | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Namak |
| P4 | goan-306 | Xacuti | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | kashmiri-285 | Yakhni | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kashmiri-02 | Yakhni Gosht | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | kashmiri-80 | Yakhni Prawn Koshur | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | household-26 | Yellow Dal | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Jeera, Ghee, Namak |
| P4 | kashmiri-19 | Yemberzal Tschaman | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee, Namak |
| P4 | hyderabadi-31 | Zafrani Murgh Pulao | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Ghee |
| P4 | weight-loss-b9-017 | Zucchini Noodles | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
| P4 | maharashtrian-15 | Zunka | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Rai |
| P4 | maharashtrian-78 | Zunka Bhakar | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Tel |
| P4 | maharashtrian-311 | Zunka Bhakri | assumed_at_home_overlap | supabase | Exclude assumed-at-home from pantry match or user pantry — blocks on: Haldi, Namak, Tel |
