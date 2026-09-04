import { buildBatch6Recipes, type Batch6CuisineConfig } from './batch6-shared';
import type { RecipeCatalogEntry } from './types';

/** 100 curated recipes (7 per cuisine × 10 + 6 per cuisine × 5), ids ${START_ID}+ per cuisine. */
const START_ID = 292;

const BATCH7_CONFIGS: Batch6CuisineConfig[] = [
  {
    kitchenStyleId: "gujarati",
    region: "West",
    startId: 292,
    dishes: [
      {
        title: "Khandvi",
        prepTime: 30,
        calories: 260,
        difficulty: "Medium",
        description: "Silky gram-flour rolls tempered with mustard and coconut — a delicate Gujarati snack.",
        imageKeyword: "khandvi",
        tags: [
          "quick",
          "festive"
        ],
        ingredients: [
          {
            name: "Besan",
            isStaple: true
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Hing",
            isStaple: true
          },
          {
            name: "Rai",
            isStaple: true
          },
          {
            name: "Nariyal",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ]
      },
      {
        title: "Dabeli",
        prepTime: 25,
        calories: 380,
        difficulty: "Easy",
        description: "Spicy potato filling in a butter-toasted pav with sev, peanuts, and tamarind chutney.",
        imageKeyword: "dabeli",
        tags: [
          "quick",
          "under20"
        ],
        ingredients: [
          {
            name: "Dabeli masala",
            isStaple: false
          },
          {
            name: "Bateta",
            isStaple: true
          },
          {
            name: "Pav",
            isStaple: true
          },
          {
            name: "Sev",
            isStaple: true
          },
          {
            name: "Mungfali",
            isStaple: true
          },
          {
            name: "Imli chutney",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ]
      },
      {
        title: "Locho",
        prepTime: 22,
        calories: 300,
        difficulty: "Easy",
        description: "Steamed surti gram-flour cake topped with oil, sev, and coriander — a Surat street classic.",
        imageKeyword: "locho",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Besan",
            isStaple: true
          },
          {
            name: "Hing",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Sev",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Dal Dhokli",
        prepTime: 45,
        calories: 420,
        difficulty: "Medium",
        description: "Wheat flour dumplings simmered in sweet-spicy tuvar dal — one-pot Gujarati comfort food.",
        imageKeyword: "dal-dhokli",
        tags: [
          "festive",
          "kids"
        ],
        ingredients: [
          {
            name: "Tuver dal",
            isStaple: false
          },
          {
            name: "Atta",
            isStaple: true
          },
          {
            name: "Gud",
            isStaple: true
          },
          {
            name: "Hing",
            isStaple: true
          },
          {
            name: "Haldi",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          }
        ]
      },
      {
        title: "Mohanthal",
        prepTime: 55,
        calories: 480,
        difficulty: "Hard",
        description: "Rich gram-flour fudge with ghee, mawa, and cardamom — a festive mithai from Gujarat.",
        imageKeyword: "mohanthal",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Besan",
            isStaple: false
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Gud",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Kesar",
            isStaple: true
          },
          {
            name: "Mawa",
            isStaple: true
          },
          {
            name: "Badam",
            isStaple: true
          }
        ]
      },
      {
        title: "Sukhdi",
        prepTime: 20,
        calories: 390,
        difficulty: "Easy",
        description: "Whole wheat, ghee, and jaggery squares set in a tray — quick winter sweet in minutes.",
        imageKeyword: "sukhdi",
        tags: [
          "under20",
          "festive"
        ],
        ingredients: [
          {
            name: "Atta",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Gud",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Badam",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Chakri",
        prepTime: 40,
        calories: 350,
        difficulty: "Medium",
        description: "Crisp spiral snacks from rice and gram flour — Diwali favourite with chaat masala.",
        imageKeyword: "chakri",
        tags: [
          "festive",
          "kids"
        ],
        ingredients: [
          {
            name: "Chawal ka atta",
            isStaple: true
          },
          {
            name: "Besan",
            isStaple: true
          },
          {
            name: "Ajwain",
            isStaple: true
          },
          {
            name: "Hing",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Lal mirch",
            isStaple: true
          }
        ]
      }
    ]
  },
  {
    kitchenStyleId: "street",
    region: "North",
    startId: 292,
    dishes: [
      {
        title: "Egg Bhurji Pav",
        prepTime: 15,
        calories: 360,
        difficulty: "Easy",
        description: "Fluffy scrambled eggs with onion and masala stuffed in buttered pav.",
        imageKeyword: "egg-bhurji-pav",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Anda",
            isStaple: false
          },
          {
            name: "Pav",
            isStaple: true
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Tamatar",
            isStaple: true
          },
          {
            name: "Hari mirch",
            isStaple: true
          },
          {
            name: "Masala",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ],
        dietType: "Egg"
      },
      {
        title: "Bread Pakora",
        prepTime: 20,
        calories: 340,
        difficulty: "Easy",
        description: "Spiced potato-stuffed bread slices dipped in besan batter and deep-fried until crisp.",
        imageKeyword: "bread-pakora",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Bread",
            isStaple: false
          },
          {
            name: "Besan",
            isStaple: true
          },
          {
            name: "Bateta",
            isStaple: true
          },
          {
            name: "Haldi",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Hari mirch",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Ragda Pattice",
        prepTime: 35,
        calories: 400,
        difficulty: "Medium",
        description: "Crisp potato patties topped with white pea ragda, chutneys, and sev.",
        imageKeyword: "ragda-pattice",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Bateta",
            isStaple: false
          },
          {
            name: "Ragda",
            isStaple: true
          },
          {
            name: "Sev",
            isStaple: true
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Imli chutney",
            isStaple: true
          },
          {
            name: "Chaat masala",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          }
        ]
      },
      {
        title: "Dahi Samosa Chaat",
        prepTime: 25,
        calories: 380,
        difficulty: "Easy",
        description: "Crushed samosa layered with spiced yogurt, chutneys, and crunchy sev.",
        imageKeyword: "dahi-samosa-chaat",
        tags: [
          "quick",
          "under20"
        ],
        ingredients: [
          {
            name: "Samosa",
            isStaple: false
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Imli chutney",
            isStaple: true
          },
          {
            name: "Hari chutney",
            isStaple: true
          },
          {
            name: "Sev",
            isStaple: true
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Chaat masala",
            isStaple: true
          }
        ]
      },
      {
        title: "Amritsari Kulcha",
        prepTime: 40,
        calories: 450,
        difficulty: "Medium",
        description: "Stuffed leavened bread from Amritsar baked with potato and served with chole.",
        imageKeyword: "amritsari-kulcha",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Atta",
            isStaple: false
          },
          {
            name: "Bateta",
            isStaple: true
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Baking soda",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Ajwain",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Keema Pav",
        prepTime: 35,
        calories: 470,
        difficulty: "Medium",
        description: "Spiced minced meat cooked dry and served in soft pav with onion and lemon.",
        imageKeyword: "keema-pav",
        tags: [
          "quick",
          "festive"
        ],
        ingredients: [
          {
            name: "Keema",
            isStaple: false
          },
          {
            name: "Pav",
            isStaple: true
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Adrak",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          },
          {
            name: "Garam masala",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Kathi Roll",
        prepTime: 25,
        calories: 420,
        difficulty: "Easy",
        description: "Paratha wrapped around spiced filling with onion, chutney, and a squeeze of lemon.",
        imageKeyword: "kathi-roll",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Paratha",
            isStaple: false
          },
          {
            name: "Paneer",
            isStaple: true
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Hari chutney",
            isStaple: true
          },
          {
            name: "Masala",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ]
      }
    ]
  },
  {
    kitchenStyleId: "south",
    region: "South",
    startId: 292,
    dishes: [
      {
        title: "Bisi Bele Bath",
        prepTime: 50,
        calories: 440,
        difficulty: "Medium",
        description: "Hot lentil-rice melange with vegetables and aromatic masala — Karnataka one-pot meal.",
        imageKeyword: "bisi-bele-bath",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Toor dal",
            isStaple: false
          },
          {
            name: "Chawal",
            isStaple: true
          },
          {
            name: "Bisi bele powder",
            isStaple: true
          },
          {
            name: "Sabzi mix",
            isStaple: true
          },
          {
            name: "Tamarind",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Lemon Rice",
        prepTime: 22,
        calories: 320,
        difficulty: "Easy",
        description: "Tempered rice with lemon juice, peanuts, and curry leaves — tangy tiffin classic.",
        imageKeyword: "lemon-rice",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Chawal",
            isStaple: true
          },
          {
            name: "Nimbu",
            isStaple: true
          },
          {
            name: "Rai",
            isStaple: true
          },
          {
            name: "Kadi patta",
            isStaple: true
          },
          {
            name: "Mungfali",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ]
      },
      {
        title: "Curd Rice",
        prepTime: 20,
        calories: 300,
        difficulty: "Easy",
        description: "Cooling yogurt rice tempered with mustard, urad dal, and ginger — South Indian comfort.",
        imageKeyword: "curd-rice",
        tags: [
          "under20",
          "kids"
        ],
        ingredients: [
          {
            name: "Chawal",
            isStaple: true
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Rai",
            isStaple: true
          },
          {
            name: "Urad dal",
            isStaple: true
          },
          {
            name: "Kadi patta",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Ven Pongal",
        prepTime: 30,
        calories: 360,
        difficulty: "Easy",
        description: "Ghee-rich rice and moong dal khara pongal with pepper and cumin — breakfast staple.",
        imageKeyword: "ven-pongal",
        tags: [
          "quick",
          "festive"
        ],
        ingredients: [
          {
            name: "Chawal",
            isStaple: true
          },
          {
            name: "Moong dal",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Kali mirch",
            isStaple: true
          },
          {
            name: "Jeera",
            isStaple: true
          },
          {
            name: "Kadi patta",
            isStaple: true
          }
        ]
      },
      {
        title: "Medu Vada",
        prepTime: 35,
        calories: 340,
        difficulty: "Medium",
        description: "Crisp urad dal donuts with fluffy centres — served with sambar and coconut chutney.",
        imageKeyword: "medu-vada",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Urad dal",
            isStaple: false
          },
          {
            name: "Rai",
            isStaple: true
          },
          {
            name: "Kadi patta",
            isStaple: true
          },
          {
            name: "Hing",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Hari mirch",
            isStaple: true
          }
        ]
      },
      {
        title: "Mysore Pak",
        prepTime: 45,
        calories: 520,
        difficulty: "Hard",
        description: "Ghee-laden gram-flour fudge that melts in the mouth — iconic Karnataka sweet.",
        imageKeyword: "mysore-pak",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Besan",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Sugar",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Pani",
            isStaple: true
          }
        ]
      },
      {
        title: "Puliyodharai",
        prepTime: 28,
        calories: 330,
        difficulty: "Easy",
        description: "Tamarind rice with roasted peanuts and spice powder — travel-friendly temple prasad style.",
        imageKeyword: "puliyodharai",
        tags: [
          "quick",
          "leftover"
        ],
        ingredients: [
          {
            name: "Chawal",
            isStaple: true
          },
          {
            name: "Tamarind",
            isStaple: true
          },
          {
            name: "Peanuts",
            isStaple: true
          },
          {
            name: "Puliyodharai powder",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      }
    ]
  },
  {
    kitchenStyleId: "north",
    region: "North",
    startId: 292,
    dishes: [
      {
        title: "Kadhi Pakora",
        prepTime: 40,
        calories: 390,
        difficulty: "Medium",
        description: "Yogurt-based curry with besan fritters — tangy, comforting North Indian lunch.",
        imageKeyword: "kadhi-pakora",
        tags: [
          "festive",
          "kids"
        ],
        ingredients: [
          {
            name: "Dahi",
            isStaple: false
          },
          {
            name: "Besan",
            isStaple: true
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Rai",
            isStaple: true
          },
          {
            name: "Methi dana",
            isStaple: true
          },
          {
            name: "Haldi",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ]
      },
      {
        title: "Dum Aloo",
        prepTime: 45,
        calories: 380,
        difficulty: "Medium",
        description: "Baby potatoes slow-cooked in rich Kashmiri-style yogurt gravy.",
        imageKeyword: "dum-aloo",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Baby aloo",
            isStaple: false
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Fennel powder",
            isStaple: true
          },
          {
            name: "Ginger powder",
            isStaple: true
          },
          {
            name: "Garam masala",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Tamatar",
            isStaple: true
          }
        ]
      },
      {
        title: "Baingan Bharta",
        prepTime: 35,
        calories: 320,
        difficulty: "Medium",
        description: "Smoky roasted aubergine mashed with onion, tomato, and spices.",
        imageKeyword: "baingan-bharta",
        tags: [
          "quick",
          "leftover"
        ],
        ingredients: [
          {
            name: "Baingan",
            isStaple: false
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Tamatar",
            isStaple: true
          },
          {
            name: "Adrak",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ]
      },
      {
        title: "Aloo Paratha",
        prepTime: 35,
        calories: 420,
        difficulty: "Medium",
        description: "Stuffed potato flatbread roasted with ghee until golden — Punjabi breakfast icon.",
        imageKeyword: "aloo-paratha",
        tags: [
          "festive",
          "kids"
        ],
        ingredients: [
          {
            name: "Atta",
            isStaple: false
          },
          {
            name: "Bateta",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Ajwain",
            isStaple: true
          },
          {
            name: "Lal mirch",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Chole Bhature",
        prepTime: 50,
        calories: 520,
        difficulty: "Medium",
        description: "Puffy fried bread with spiced chickpea curry — Delhi weekend favourite.",
        imageKeyword: "chole-bhature",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Chana",
            isStaple: false
          },
          {
            name: "Maida",
            isStaple: true
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Chole masala",
            isStaple: true
          },
          {
            name: "Adrak",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Bhatura",
            isStaple: true
          }
        ]
      },
      {
        title: "Rajma Masala",
        prepTime: 45,
        calories: 410,
        difficulty: "Medium",
        description: "Kidney beans in thick tomato-onion gravy — best with steamed basmati rice.",
        imageKeyword: "rajma-masala",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Rajma",
            isStaple: false
          },
          {
            name: "Tamatar",
            isStaple: true
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Adrak",
            isStaple: true
          },
          {
            name: "Rajma masala",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          }
        ]
      },
      {
        title: "Malai Kofta",
        prepTime: 55,
        calories: 480,
        difficulty: "Hard",
        description: "Cottage cheese dumplings in creamy tomato-cashew gravy — restaurant-style treat.",
        imageKeyword: "malai-kofta",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Paneer",
            isStaple: false
          },
          {
            name: "Makhan",
            isStaple: true
          },
          {
            name: "Cream",
            isStaple: true
          },
          {
            name: "Cashew",
            isStaple: true
          },
          {
            name: "Tamatar",
            isStaple: true
          },
          {
            name: "Garam masala",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ]
      }
    ]
  },
  {
    kitchenStyleId: "punjabi",
    region: "North",
    startId: 292,
    dishes: [
      {
        title: "Sarson da Saag",
        prepTime: 50,
        calories: 360,
        difficulty: "Medium",
        description: "Mustard greens slow-cooked and finished with white butter — winter Punjabi classic.",
        imageKeyword: "sarson-da-saag",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Sarson",
            isStaple: false
          },
          {
            name: "Makki atta",
            isStaple: true
          },
          {
            name: "Makhan",
            isStaple: true
          },
          {
            name: "Adrak",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Makki di Roti",
        prepTime: 30,
        calories: 340,
        difficulty: "Medium",
        description: "Yellow corn flatbreads roasted on tawa — traditional pair for sarson saag.",
        imageKeyword: "makki-di-roti",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Makki atta",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Pani",
            isStaple: true
          },
          {
            name: "Atta",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ]
      },
      {
        title: "Amritsari Fish",
        prepTime: 35,
        calories: 420,
        difficulty: "Medium",
        description: "Gram-flour coated fish fried until crisp with carom seeds — Amritsar speciality.",
        imageKeyword: "amritsari-fish",
        tags: [
          "quick",
          "festive"
        ],
        ingredients: [
          {
            name: "Fish",
            isStaple: false
          },
          {
            name: "Besan",
            isStaple: true
          },
          {
            name: "Ajwain",
            isStaple: true
          },
          {
            name: "Lal mirch",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Nimbu",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Pinni",
        prepTime: 40,
        calories: 510,
        difficulty: "Medium",
        description: "Whole wheat, khoya, and dry fruit laddoos bound with ghee — winter energy bites.",
        imageKeyword: "pinni",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Atta",
            isStaple: true
          },
          {
            name: "Khoya",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Gud",
            isStaple: true
          },
          {
            name: "Badam",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          }
        ]
      },
      {
        title: "Rajma Chawal",
        prepTime: 40,
        calories: 430,
        difficulty: "Easy",
        description: "Red kidney bean curry served over steamed rice — everyday Punjabi comfort meal.",
        imageKeyword: "rajma-chawal",
        tags: [
          "quick",
          "kids"
        ],
        ingredients: [
          {
            name: "Rajma",
            isStaple: false
          },
          {
            name: "Chawal",
            isStaple: true
          },
          {
            name: "Tamatar",
            isStaple: true
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Rajma masala",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          }
        ]
      },
      {
        title: "Tandoori Roti",
        prepTime: 25,
        calories: 280,
        difficulty: "Easy",
        description: "Whole wheat flatbread with smoky tandoor char — essential with dal makhani.",
        imageKeyword: "tandoori-roti",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Atta",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Pani",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Yeast",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ]
      },
      {
        title: "Paneer Tikka",
        prepTime: 35,
        calories: 390,
        difficulty: "Medium",
        description: "Marinated cottage cheese cubes grilled with capsicum and onion.",
        imageKeyword: "paneer-tikka",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Paneer",
            isStaple: false
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Tikka masala",
            isStaple: true
          },
          {
            name: "Capsicum",
            isStaple: true
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Kasuri methi",
            isStaple: true
          }
        ]
      }
    ]
  },
  {
    kitchenStyleId: "rajasthani",
    region: "West",
    startId: 292,
    dishes: [
      {
        title: "Gatte ki Sabzi",
        prepTime: 45,
        calories: 380,
        difficulty: "Medium",
        description: "Gram-flour dumplings in spiced yogurt gravy — Rajasthani desert classic.",
        imageKeyword: "gatte-ki-sabzi",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Besan",
            isStaple: false
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Rai",
            isStaple: true
          },
          {
            name: "Hing",
            isStaple: true
          },
          {
            name: "Lal mirch",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          }
        ]
      },
      {
        title: "Ker Sangri",
        prepTime: 50,
        calories: 340,
        difficulty: "Hard",
        description: "Desert beans and berries slow-cooked with masala — iconic Marwari sabzi.",
        imageKeyword: "ker-sangri",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Ker Sangri",
            isStaple: false
          },
          {
            name: "Hing",
            isStaple: true
          },
          {
            name: "Amchur",
            isStaple: true
          },
          {
            name: "Lal mirch",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          }
        ]
      },
      {
        title: "Bajra Khichda",
        prepTime: 55,
        calories: 400,
        difficulty: "Medium",
        description: "Pearl millet and lentil porridge cooked with ghee — warming winter one-pot.",
        imageKeyword: "bajra-khichda",
        tags: [
          "festive",
          "kids"
        ],
        ingredients: [
          {
            name: "Bajra",
            isStaple: false
          },
          {
            name: "Moong dal",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Jeera",
            isStaple: true
          },
          {
            name: "Hing",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Pani",
            isStaple: true
          }
        ]
      },
      {
        title: "Mohan Maas",
        prepTime: 60,
        calories: 520,
        difficulty: "Hard",
        description: "Royal meat curry cooked in milk and mild spices — rich Rajasthani feast dish.",
        imageKeyword: "mohan-maas",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Mutton",
            isStaple: false
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Milk",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Kesar",
            isStaple: true
          },
          {
            name: "Garam masala",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Mirchi Vada",
        prepTime: 30,
        calories: 360,
        difficulty: "Medium",
        description: "Large green chillies stuffed with potato, coated in besan and fried.",
        imageKeyword: "mirchi-vada",
        tags: [
          "quick",
          "festive"
        ],
        ingredients: [
          {
            name: "Mirchi",
            isStaple: false
          },
          {
            name: "Besan",
            isStaple: true
          },
          {
            name: "Bateta",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Hing",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Chutney",
            isStaple: true
          }
        ]
      },
      {
        title: "Pyaaz Kachori",
        prepTime: 40,
        calories: 420,
        difficulty: "Medium",
        description: "Flaky pastry filled with spiced onion and fried until golden — Jodhpur snack.",
        imageKeyword: "pyaaz-kachori",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Maida",
            isStaple: false
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Besan",
            isStaple: true
          },
          {
            name: "Saunf",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Imli chutney",
            isStaple: true
          }
        ]
      }
    ]
  },
  {
    kitchenStyleId: "bengali",
    region: "East",
    startId: 292,
    dishes: [
      {
        title: "Luchi Alur Dom",
        prepTime: 35,
        calories: 410,
        difficulty: "Medium",
        description: "Puffy fried bread with slow-cooked spiced potatoes — Bengali breakfast favourite.",
        imageKeyword: "luchi-alur-dom",
        tags: [
          "festive",
          "kids"
        ],
        ingredients: [
          {
            name: "Maida",
            isStaple: false
          },
          {
            name: "Bateta",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Panch phoron",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          }
        ]
      },
      {
        title: "Shukto",
        prepTime: 40,
        calories: 320,
        difficulty: "Medium",
        description: "Mild mixed vegetable stew with bitter gourd and milk — traditional first course.",
        imageKeyword: "shukto",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Karela",
            isStaple: false
          },
          {
            name: "Baingan",
            isStaple: true
          },
          {
            name: "Drumstick",
            isStaple: true
          },
          {
            name: "Milk",
            isStaple: true
          },
          {
            name: "Panch phoron",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Bori",
            isStaple: true
          }
        ]
      },
      {
        title: "Chingri Malai Curry",
        prepTime: 45,
        calories: 460,
        difficulty: "Medium",
        description: "Prawns in coconut-milk gravy with gentle spices — celebratory Bengali curry.",
        imageKeyword: "chingri-malai",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Prawns",
            isStaple: false
          },
          {
            name: "Nariyal",
            isStaple: true
          },
          {
            name: "Nariyal milk",
            isStaple: true
          },
          {
            name: "Panch phoron",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Haldi",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Kosha Mangsho",
        prepTime: 75,
        calories: 540,
        difficulty: "Hard",
        description: "Slow-braised mutton in dark onion-spice gravy — Durga Puja special.",
        imageKeyword: "kosha-mangsho",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Mutton",
            isStaple: false
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Adrak",
            isStaple: true
          },
          {
            name: "Garam masala",
            isStaple: true
          },
          {
            name: "Mustard oil",
            isStaple: true
          },
          {
            name: "Yogurt",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Aloo Posto",
        prepTime: 30,
        calories: 310,
        difficulty: "Easy",
        description: "Potatoes in poppy seed paste — simple, nutty Bengali everyday sabzi.",
        imageKeyword: "aloo-posto",
        tags: [
          "quick",
          "kids"
        ],
        ingredients: [
          {
            name: "Bateta",
            isStaple: false
          },
          {
            name: "Posto",
            isStaple: true
          },
          {
            name: "Kali mirch",
            isStaple: true
          },
          {
            name: "Green chilli",
            isStaple: true
          },
          {
            name: "Mustard oil",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ]
      },
      {
        title: "Mishti Doi",
        prepTime: 45,
        calories: 280,
        difficulty: "Easy",
        description: "Caramelized jaggery yogurt set in earthen pots — iconic Bengali sweet.",
        imageKeyword: "mishti-doi",
        tags: [
          "festive",
          "kids"
        ],
        ingredients: [
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Gud",
            isStaple: true
          },
          {
            name: "Full cream milk",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Sugar",
            isStaple: true
          }
        ]
      },
      {
        title: "Bhetki Fry",
        prepTime: 30,
        calories: 390,
        difficulty: "Medium",
        description: "Marinated barramundi fillets shallow-fried until crisp — Kolkata fish fry style.",
        imageKeyword: "bhetki-fry",
        tags: [
          "quick",
          "festive"
        ],
        ingredients: [
          {
            name: "Bhetki",
            isStaple: false
          },
          {
            name: "Besan",
            isStaple: true
          },
          {
            name: "Lal mirch",
            isStaple: true
          },
          {
            name: "Nimbu",
            isStaple: true
          },
          {
            name: "Mustard oil",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      }
    ]
  },
  {
    kitchenStyleId: "maharashtrian",
    region: "West",
    startId: 292,
    dishes: [
      {
        title: "Misal Pav",
        prepTime: 40,
        calories: 430,
        difficulty: "Medium",
        description: "Spicy sprout curry topped with farsan and served with pav — Kolhapuri breakfast.",
        imageKeyword: "misal-pav",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Matki",
            isStaple: false
          },
          {
            name: "Misal rassa",
            isStaple: true
          },
          {
            name: "Pav",
            isStaple: true
          },
          {
            name: "Farsan",
            isStaple: true
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Nimbu",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          }
        ]
      },
      {
        title: "Bharli Vangi",
        prepTime: 45,
        calories: 360,
        difficulty: "Medium",
        description: "Baby brinjals stuffed with coconut-peanut masala and slow-cooked.",
        imageKeyword: "bharli-vangi",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Vangi",
            isStaple: false
          },
          {
            name: "Mungfali",
            isStaple: true
          },
          {
            name: "Nariyal",
            isStaple: true
          },
          {
            name: "Goda masala",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Thalipeeth",
        prepTime: 35,
        calories: 380,
        difficulty: "Medium",
        description: "Multigrain spiced flatbread roasted with oil — nutritious Maharashtrian breakfast.",
        imageKeyword: "thalipeeth",
        tags: [
          "quick",
          "festive"
        ],
        ingredients: [
          {
            name: "Bhajani flour",
            isStaple: true
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          }
        ]
      },
      {
        title: "Ukadiche Modak",
        prepTime: 55,
        calories: 420,
        difficulty: "Hard",
        description: "Steamed rice-flour dumplings filled with jaggery-coconut — Ganesh Chaturthi prasad.",
        imageKeyword: "modak",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Modak filling",
            isStaple: false
          },
          {
            name: "Rice flour",
            isStaple: true
          },
          {
            name: "Nariyal",
            isStaple: true
          },
          {
            name: "Gud",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Puran Poli",
        prepTime: 50,
        calories: 450,
        difficulty: "Hard",
        description: "Sweet lentil-stuffed flatbread with ghee — festive Maharashtrian classic.",
        imageKeyword: "puran-poli",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Chana dal",
            isStaple: false
          },
          {
            name: "Atta",
            isStaple: true
          },
          {
            name: "Gud",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ]
      },
      {
        title: "Pithla Bhakri",
        prepTime: 30,
        calories: 390,
        difficulty: "Easy",
        description: "Gram-flour curry with rustic jowar flatbread — farmer's lunch combo.",
        imageKeyword: "pithla-bhakri",
        tags: [
          "quick",
          "kids"
        ],
        ingredients: [
          {
            name: "Besan",
            isStaple: false
          },
          {
            name: "Jowar atta",
            isStaple: true
          },
          {
            name: "Hing",
            isStaple: true
          },
          {
            name: "Haldi",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          },
          {
            name: "Mirchi",
            isStaple: true
          }
        ]
      },
      {
        title: "Sol Kadhi",
        prepTime: 15,
        calories: 180,
        difficulty: "Easy",
        description: "Pink kokum-coconut drink that aids digestion — served chilled with rice meals.",
        imageKeyword: "sol-kadhi",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Kokum",
            isStaple: true
          },
          {
            name: "Nariyal milk",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          },
          {
            name: "Hing",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          }
        ]
      }
    ]
  },
  {
    kitchenStyleId: "hyderabadi",
    region: "South",
    startId: 292,
    dishes: [
      {
        title: "Mirchi ka Salan",
        prepTime: 40,
        calories: 340,
        difficulty: "Medium",
        description: "Long green chillies in peanut-sesame gravy — classic biryani accompaniment.",
        imageKeyword: "mirchi-ka-salan",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Mirchi",
            isStaple: false
          },
          {
            name: "Mungfali",
            isStaple: true
          },
          {
            name: "Til",
            isStaple: true
          },
          {
            name: "Tamarind",
            isStaple: true
          },
          {
            name: "Ginger garlic",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Masala",
            isStaple: true
          }
        ]
      },
      {
        title: "Hyderabadi Haleem",
        prepTime: 90,
        calories: 520,
        difficulty: "Hard",
        description: "Slow-pounded wheat and meat porridge with fried onions — Ramadan speciality.",
        imageKeyword: "haleem",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Mutton",
            isStaple: false
          },
          {
            name: "Gehu",
            isStaple: true
          },
          {
            name: "Chana dal",
            isStaple: true
          },
          {
            name: "Fried onion",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Shahi jeera",
            isStaple: true
          },
          {
            name: "Adrak",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Shikampuri Kebab",
        prepTime: 45,
        calories: 410,
        difficulty: "Medium",
        description: "Minced meat patties stuffed with hung yogurt and herbs — royal Hyderabadi starter.",
        imageKeyword: "shikampuri-kebab",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Keema",
            isStaple: false
          },
          {
            name: "Hung curd",
            isStaple: true
          },
          {
            name: "Pudina",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          },
          {
            name: "Garam masala",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Bagara Baingan",
        prepTime: 40,
        calories: 360,
        difficulty: "Medium",
        description: "Baby brinjals in nutty tamarind-coconut gravy — vegetarian Hyderabadi classic.",
        imageKeyword: "bagara-baingan",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Baingan",
            isStaple: false
          },
          {
            name: "Nariyal",
            isStaple: true
          },
          {
            name: "Til",
            isStaple: true
          },
          {
            name: "Mungfali",
            isStaple: true
          },
          {
            name: "Tamarind",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Masala",
            isStaple: true
          }
        ]
      },
      {
        title: "Double ka Meetha",
        prepTime: 45,
        calories: 480,
        difficulty: "Medium",
        description: "Bread pudding soaked in saffron milk and nuts — Hyderabadi dessert.",
        imageKeyword: "double-ka-meetha",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Bread",
            isStaple: false
          },
          {
            name: "Milk",
            isStaple: true
          },
          {
            name: "Sugar",
            isStaple: true
          },
          {
            name: "Kesar",
            isStaple: true
          },
          {
            name: "Badam",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          }
        ]
      },
      {
        title: "Khubani ka Meetha",
        prepTime: 35,
        calories: 420,
        difficulty: "Easy",
        description: "Apricot compote topped with cream — wedding feast dessert.",
        imageKeyword: "khubani-ka-meetha",
        tags: [
          "festive",
          "kids"
        ],
        ingredients: [
          {
            name: "Khubani",
            isStaple: false
          },
          {
            name: "Sugar",
            isStaple: true
          },
          {
            name: "Cream",
            isStaple: true
          },
          {
            name: "Kesar",
            isStaple: true
          },
          {
            name: "Badam",
            isStaple: true
          },
          {
            name: "Pani",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          }
        ]
      }
    ]
  },
  {
    kitchenStyleId: "goan",
    region: "West",
    startId: 292,
    dishes: [
      {
        title: "Fish Recheado",
        prepTime: 40,
        calories: 420,
        difficulty: "Medium",
        description: "Whole fish stuffed with tangy recheado masala and pan-fried — Goan Catholic classic.",
        imageKeyword: "fish-recheado",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Fish",
            isStaple: false
          },
          {
            name: "Recheado masala",
            isStaple: true
          },
          {
            name: "Vinegar",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Nimbu",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Goan Pork Vindaloo",
        prepTime: 60,
        calories: 510,
        difficulty: "Hard",
        description: "Tangy vinegar-chilli pork curry with Portuguese roots — Goan feast dish.",
        imageKeyword: "pork-vindaloo",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Pork",
            isStaple: false
          },
          {
            name: "Vinegar",
            isStaple: true
          },
          {
            name: "Kashmiri mirch",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          },
          {
            name: "Adrak",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Masala",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Bebinca",
        prepTime: 90,
        calories: 540,
        difficulty: "Hard",
        description: "Layered coconut-egg pudding baked until caramelized — Goan Christmas dessert.",
        imageKeyword: "bebinca",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Nariyal milk",
            isStaple: true
          },
          {
            name: "Anda",
            isStaple: true
          },
          {
            name: "Sugar",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Maida",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          }
        ],
        dietType: "Egg"
      },
      {
        title: "Goan Sannas",
        prepTime: 35,
        calories: 340,
        difficulty: "Medium",
        description: "Sweet fermented rice cakes steamed until fluffy — pair with sorpotel or curry.",
        imageKeyword: "sannas",
        tags: [
          "festive",
          "kids"
        ],
        ingredients: [
          {
            name: "Chawal",
            isStaple: true
          },
          {
            name: "Toddy",
            isStaple: true
          },
          {
            name: "Sugar",
            isStaple: true
          },
          {
            name: "Yeast",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ]
      },
      {
        title: "Goan Fish Curry",
        prepTime: 35,
        calories: 400,
        difficulty: "Medium",
        description: "Tamarind-coconut fish curry with kokum — everyday Goan coastal meal.",
        imageKeyword: "goan-fish-curry",
        tags: [
          "quick",
          "festive"
        ],
        ingredients: [
          {
            name: "Fish",
            isStaple: false
          },
          {
            name: "Nariyal",
            isStaple: true
          },
          {
            name: "Tamarind",
            isStaple: true
          },
          {
            name: "Kokum",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Haldi",
            isStaple: true
          },
          {
            name: "Mirchi",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Chicken Cafreal",
        prepTime: 45,
        calories: 460,
        difficulty: "Medium",
        description: "Green coriander-chilli marinated chicken roasted until charred and juicy.",
        imageKeyword: "chicken-cafreal",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Chicken",
            isStaple: false
          },
          {
            name: "Pudina",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          },
          {
            name: "Hari mirch",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          },
          {
            name: "Masala",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      }
    ]
  },
  {
    kitchenStyleId: "kerala",
    region: "South",
    startId: 292,
    dishes: [
      {
        title: "Appam with Stew",
        prepTime: 45,
        calories: 380,
        difficulty: "Medium",
        description: "Lacy fermented rice pancakes with mild coconut vegetable stew.",
        imageKeyword: "appam-stew",
        tags: [
          "festive",
          "kids"
        ],
        ingredients: [
          {
            name: "Appam batter",
            isStaple: false
          },
          {
            name: "Nariyal milk",
            isStaple: true
          },
          {
            name: "Sabzi",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Kali mirch",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Puttu Kadala",
        prepTime: 40,
        calories: 410,
        difficulty: "Medium",
        description: "Steamed rice cylinders with black chickpea curry — Kerala breakfast duo.",
        imageKeyword: "puttu-kadala",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Puttu",
            isStaple: false
          },
          {
            name: "Kadala",
            isStaple: true
          },
          {
            name: "Nariyal",
            isStaple: true
          },
          {
            name: "Shallots",
            isStaple: true
          },
          {
            name: "Curry leaves",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Masala",
            isStaple: true
          }
        ]
      },
      {
        title: "Erissery",
        prepTime: 35,
        calories: 360,
        difficulty: "Easy",
        description: "Pumpkin and beans in coconut gravy with roasted coconut — Onam sadya dish.",
        imageKeyword: "erissery",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Mathanga",
            isStaple: false
          },
          {
            name: "Vanpayar",
            isStaple: true
          },
          {
            name: "Nariyal",
            isStaple: true
          },
          {
            name: "Jeera",
            isStaple: true
          },
          {
            name: "Curry leaves",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Fish Moilee",
        prepTime: 35,
        calories: 400,
        difficulty: "Medium",
        description: "Mild coconut milk fish curry with turmeric — Syrian Christian Kerala classic.",
        imageKeyword: "fish-moilee",
        tags: [
          "quick",
          "festive"
        ],
        ingredients: [
          {
            name: "Fish",
            isStaple: false
          },
          {
            name: "Nariyal milk",
            isStaple: true
          },
          {
            name: "Nimbu",
            isStaple: true
          },
          {
            name: "Haldi",
            isStaple: true
          },
          {
            name: "Curry leaves",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Shallots",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Malabar Parotta",
        prepTime: 40,
        calories: 440,
        difficulty: "Medium",
        description: "Flaky layered flatbread from Malabar — torn and dipped in curry.",
        imageKeyword: "malabar-parotta",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Maida",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Milk",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Sugar",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          }
        ]
      },
      {
        title: "Avial",
        prepTime: 35,
        calories: 330,
        difficulty: "Easy",
        description: "Mixed vegetables in coarse coconut-yogurt sauce — essential Onam side.",
        imageKeyword: "avial",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Mixed veg",
            isStaple: false
          },
          {
            name: "Nariyal",
            isStaple: true
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Curry leaves",
            isStaple: true
          },
          {
            name: "Coconut oil",
            isStaple: true
          },
          {
            name: "Jeera",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Kerala Egg Roast",
        prepTime: 25,
        calories: 370,
        difficulty: "Easy",
        description: "Boiled eggs in peppery onion-tomato masala — tea-shop favourite.",
        imageKeyword: "kerala-egg-roast",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Anda",
            isStaple: false
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Tamatar",
            isStaple: true
          },
          {
            name: "Kali mirch",
            isStaple: true
          },
          {
            name: "Curry leaves",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Masala",
            isStaple: true
          }
        ],
        dietType: "Egg"
      }
    ]
  },
  {
    kitchenStyleId: "chinese",
    region: "North",
    startId: 292,
    dishes: [
      {
        title: "Veg Manchurian",
        prepTime: 30,
        calories: 360,
        difficulty: "Easy",
        description: "Crisp vegetable balls in tangy garlic-soy gravy — Indo-Chinese favourite.",
        imageKeyword: "veg-manchurian",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Manchurian balls",
            isStaple: false
          },
          {
            name: "Soya sauce",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          },
          {
            name: "Adrak",
            isStaple: true
          },
          {
            name: "Spring onion",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Cornflour",
            isStaple: true
          }
        ]
      },
      {
        title: "Hakka Noodles",
        prepTime: 25,
        calories: 390,
        difficulty: "Easy",
        description: "Wok-tossed noodles with vegetables and soy on high flame.",
        imageKeyword: "hakka-noodles",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Noodles",
            isStaple: false
          },
          {
            name: "Capsicum",
            isStaple: true
          },
          {
            name: "Cabbage",
            isStaple: true
          },
          {
            name: "Soya sauce",
            isStaple: true
          },
          {
            name: "Spring onion",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          }
        ]
      },
      {
        title: "Chicken Fried Rice",
        prepTime: 30,
        calories: 430,
        difficulty: "Easy",
        description: "Day-old rice stir-fried with egg, chicken, and soy — quick one-wok meal.",
        imageKeyword: "chicken-fried-rice",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Chicken",
            isStaple: false
          },
          {
            name: "Chawal",
            isStaple: true
          },
          {
            name: "Anda",
            isStaple: true
          },
          {
            name: "Soya sauce",
            isStaple: true
          },
          {
            name: "Spring onion",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Carrot",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Chilli Chicken",
        prepTime: 35,
        calories: 420,
        difficulty: "Medium",
        description: "Crisp fried chicken tossed in spicy soy-chilli sauce with capsicum.",
        imageKeyword: "chilli-chicken",
        tags: [
          "quick",
          "festive"
        ],
        ingredients: [
          {
            name: "Chicken",
            isStaple: false
          },
          {
            name: "Soya sauce",
            isStaple: true
          },
          {
            name: "Chilli sauce",
            isStaple: true
          },
          {
            name: "Capsicum",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Cornflour",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Veg Spring Rolls",
        prepTime: 35,
        calories: 340,
        difficulty: "Medium",
        description: "Crisp pastry rolls filled with shredded vegetables — party starter classic.",
        imageKeyword: "spring-rolls",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Spring roll sheet",
            isStaple: false
          },
          {
            name: "Cabbage",
            isStaple: true
          },
          {
            name: "Carrot",
            isStaple: true
          },
          {
            name: "Soya sauce",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Cornflour",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          }
        ]
      },
      {
        title: "Schezwan Paneer",
        prepTime: 28,
        calories: 400,
        difficulty: "Easy",
        description: "Paneer cubes in fiery schezwan sauce with bell peppers.",
        imageKeyword: "schezwan-paneer",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Paneer",
            isStaple: false
          },
          {
            name: "Schezwan sauce",
            isStaple: true
          },
          {
            name: "Capsicum",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          },
          {
            name: "Spring onion",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Soya sauce",
            isStaple: true
          }
        ]
      }
    ]
  },
  {
    kitchenStyleId: "assamese",
    region: "East",
    startId: 292,
    dishes: [
      {
        title: "Masor Tenga",
        prepTime: 35,
        calories: 380,
        difficulty: "Medium",
        description: "Tangy tomato-fish curry that refreshes the palate — Assamese lunch staple.",
        imageKeyword: "masor-tenga",
        tags: [
          "quick",
          "festive"
        ],
        ingredients: [
          {
            name: "Rui maach",
            isStaple: false
          },
          {
            name: "Tamatar",
            isStaple: true
          },
          {
            name: "Nimbu",
            isStaple: true
          },
          {
            name: "Panch phoron",
            isStaple: true
          },
          {
            name: "Mustard oil",
            isStaple: true
          },
          {
            name: "Haldi",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Assamese Duck Roast",
        prepTime: 70,
        calories: 520,
        difficulty: "Hard",
        description: "Whole duck slow-roasted with whole spices and potatoes — festive Assamese centrepiece.",
        imageKeyword: "duck-roast",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Duck",
            isStaple: false
          },
          {
            name: "Aloo",
            isStaple: true
          },
          {
            name: "Whole spices",
            isStaple: true
          },
          {
            name: "Mustard oil",
            isStaple: true
          },
          {
            name: "Adrak",
            isStaple: true
          },
          {
            name: "Lasun",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Khar",
        prepTime: 40,
        calories: 300,
        difficulty: "Medium",
        description: "Unique alkaline curry with raw papaya — traditional Assamese first course.",
        imageKeyword: "khar",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Papaya",
            isStaple: false
          },
          {
            name: "Kharoli",
            isStaple: true
          },
          {
            name: "Panch phoron",
            isStaple: true
          },
          {
            name: "Mustard oil",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Pani",
            isStaple: true
          },
          {
            name: "Mirchi",
            isStaple: true
          }
        ]
      },
      {
        title: "Assamese Pitha",
        prepTime: 45,
        calories: 360,
        difficulty: "Medium",
        description: "Steamed rice flour dumplings filled with jaggery-coconut — Bihu festival sweet.",
        imageKeyword: "assamese-pitha",
        tags: [
          "festive",
          "kids"
        ],
        ingredients: [
          {
            name: "Rice flour",
            isStaple: false
          },
          {
            name: "Gud",
            isStaple: true
          },
          {
            name: "Nariyal",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Pani",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ]
      },
      {
        title: "Ou Tenga Maas",
        prepTime: 40,
        calories: 390,
        difficulty: "Medium",
        description: "Fish cooked with elephant apple for sourness — signature Assamese flavour.",
        imageKeyword: "ou-tenga-maas",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Fish",
            isStaple: false
          },
          {
            name: "Ou tenga",
            isStaple: true
          },
          {
            name: "Mustard oil",
            isStaple: true
          },
          {
            name: "Panch phoron",
            isStaple: true
          },
          {
            name: "Haldi",
            isStaple: true
          },
          {
            name: "Mirchi",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Aloo Pitika",
        prepTime: 20,
        calories: 280,
        difficulty: "Easy",
        description: "Mashed potato with mustard oil, onion, and green chilli — simple side dish.",
        imageKeyword: "aloo-pitika",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Bateta",
            isStaple: false
          },
          {
            name: "Mustard oil",
            isStaple: true
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Hari mirch",
            isStaple: true
          },
          {
            name: "Dhania",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          },
          {
            name: "Nimbu",
            isStaple: true
          }
        ]
      },
      {
        title: "Komolar Kheer",
        prepTime: 35,
        calories: 340,
        difficulty: "Easy",
        description: "Orange-infused rice pudding — light Assamese dessert after meals.",
        imageKeyword: "komolar-kheer",
        tags: [
          "festive",
          "kids"
        ],
        ingredients: [
          {
            name: "Chawal",
            isStaple: false
          },
          {
            name: "Orange",
            isStaple: true
          },
          {
            name: "Milk",
            isStaple: true
          },
          {
            name: "Sugar",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Kesar",
            isStaple: true
          },
          {
            name: "Badam",
            isStaple: true
          }
        ]
      }
    ]
  },
  {
    kitchenStyleId: "kashmiri",
    region: "North",
    startId: 292,
    dishes: [
      {
        title: "Kashmiri Rogan Josh",
        prepTime: 75,
        calories: 520,
        difficulty: "Hard",
        description: "Aromatic red lamb curry with fennel and dry ginger — Wazwan classic.",
        imageKeyword: "rogan-josh",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Mutton",
            isStaple: false
          },
          {
            name: "Rogan josh masala",
            isStaple: true
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Saunf",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Yakhni",
        prepTime: 60,
        calories: 440,
        difficulty: "Medium",
        description: "Mild yogurt-based mutton broth with whole spices — delicate Kashmiri curry.",
        imageKeyword: "yakhni",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Mutton",
            isStaple: false
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Saunf",
            isStaple: true
          },
          {
            name: "Dhania powder",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Dum Olav",
        prepTime: 45,
        calories: 360,
        difficulty: "Medium",
        description: "Baby potatoes cooked in yogurt gravy with Kashmiri spices.",
        imageKeyword: "dum-olav",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Baby aloo",
            isStaple: false
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Ginger powder",
            isStaple: true
          },
          {
            name: "Fennel",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Kashmiri Pulao",
        prepTime: 50,
        calories: 460,
        difficulty: "Medium",
        description: "Saffron rice with nuts and dried fruits — celebratory vegetarian pulao.",
        imageKeyword: "kashmiri-pulao",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Basmati chawal",
            isStaple: false
          },
          {
            name: "Kesar",
            isStaple: true
          },
          {
            name: "Badam",
            isStaple: true
          },
          {
            name: "Kishmish",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Dalchini",
            isStaple: true
          }
        ]
      },
      {
        title: "Lyodur Tschaman",
        prepTime: 35,
        calories: 390,
        difficulty: "Easy",
        description: "Cottage cheese in golden turmeric yogurt gravy — Kashmiri pandit classic.",
        imageKeyword: "lyodur-tschaman",
        tags: [
          "quick",
          "festive"
        ],
        ingredients: [
          {
            name: "Paneer",
            isStaple: false
          },
          {
            name: "Dahi",
            isStaple: true
          },
          {
            name: "Haldi",
            isStaple: true
          },
          {
            name: "Saunf",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Shufta",
        prepTime: 30,
        calories: 420,
        difficulty: "Easy",
        description: "Dry fruit and paneer sweet with saffron — Kashmiri festival dessert.",
        imageKeyword: "shufta",
        tags: [
          "festive",
          "kids"
        ],
        ingredients: [
          {
            name: "Paneer",
            isStaple: false
          },
          {
            name: "Badam",
            isStaple: true
          },
          {
            name: "Kishmish",
            isStaple: true
          },
          {
            name: "Sugar",
            isStaple: true
          },
          {
            name: "Kesar",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Elaichi",
            isStaple: true
          }
        ]
      }
    ]
  },
  {
    kitchenStyleId: "chettinad",
    region: "South",
    startId: 292,
    dishes: [
      {
        title: "Chettinad Aattu Kari",
        prepTime: 55,
        calories: 480,
        difficulty: "Medium",
        description: "Mutton curry with roasted Chettinad spices and coconut — fiery and aromatic.",
        imageKeyword: "aattu-kari",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Mutton",
            isStaple: false
          },
          {
            name: "Chettinad masala",
            isStaple: true
          },
          {
            name: "Nariyal",
            isStaple: true
          },
          {
            name: "Curry leaves",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Shallots",
            isStaple: true
          },
          {
            name: "Tamarind",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Chettinad Veg Kurma",
        prepTime: 40,
        calories: 360,
        difficulty: "Medium",
        description: "Mixed vegetables in coconut-spice gravy — vegetarian Chettinad staple.",
        imageKeyword: "chettinad-veg-kurma",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Mixed veg",
            isStaple: false
          },
          {
            name: "Chettinad masala",
            isStaple: true
          },
          {
            name: "Nariyal",
            isStaple: true
          },
          {
            name: "Curry leaves",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Shallots",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      },
      {
        title: "Seeraga Samba Biryani",
        prepTime: 65,
        calories: 510,
        difficulty: "Hard",
        description: "Short-grain seeraga samba rice layered with spiced meat — Chettinad biryani style.",
        imageKeyword: "seeraga-samba-biryani",
        tags: [
          "festive",
          "leftover"
        ],
        ingredients: [
          {
            name: "Mutton",
            isStaple: false
          },
          {
            name: "Seeraga samba rice",
            isStaple: true
          },
          {
            name: "Chettinad masala",
            isStaple: true
          },
          {
            name: "Curry leaves",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Onion",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Milagu Kozhi",
        prepTime: 45,
        calories: 440,
        difficulty: "Medium",
        description: "Black pepper chicken roast with fennel and curry leaves.",
        imageKeyword: "milagu-kozhi",
        tags: [
          "festive",
          "quick"
        ],
        ingredients: [
          {
            name: "Chicken",
            isStaple: false
          },
          {
            name: "Kali mirch",
            isStaple: true
          },
          {
            name: "Saunf",
            isStaple: true
          },
          {
            name: "Curry leaves",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Shallots",
            isStaple: true
          },
          {
            name: "Chettinad masala",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Kothamalli Chicken",
        prepTime: 40,
        calories: 420,
        difficulty: "Medium",
        description: "Coriander-heavy green chicken curry — fresh and peppery Chettinad style.",
        imageKeyword: "kothamalli-chicken",
        tags: [
          "quick",
          "festive"
        ],
        ingredients: [
          {
            name: "Chicken",
            isStaple: false
          },
          {
            name: "Dhania",
            isStaple: true
          },
          {
            name: "Hari mirch",
            isStaple: true
          },
          {
            name: "Curry leaves",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Shallots",
            isStaple: true
          },
          {
            name: "Chettinad masala",
            isStaple: true
          }
        ],
        dietType: "Non-Veg"
      },
      {
        title: "Chettinad Ven Pongal",
        prepTime: 30,
        calories: 350,
        difficulty: "Easy",
        description: "Pepper-cumin rice-lentil pongal with ghee — Chettinad breakfast.",
        imageKeyword: "chettinad-ven-pongal",
        tags: [
          "under20",
          "quick"
        ],
        ingredients: [
          {
            name: "Chawal",
            isStaple: true
          },
          {
            name: "Moong dal",
            isStaple: true
          },
          {
            name: "Ghee",
            isStaple: true
          },
          {
            name: "Kali mirch",
            isStaple: true
          },
          {
            name: "Jeera",
            isStaple: true
          },
          {
            name: "Curry leaves",
            isStaple: true
          }
        ]
      },
      {
        title: "Kara Kuzhi Paniyaram",
        prepTime: 35,
        calories: 330,
        difficulty: "Easy",
        description: "Spicy fermented batter dumplings cooked in paniyaram pan until crisp.",
        imageKeyword: "kara-kuzhi-paniyaram",
        tags: [
          "quick",
          "kids"
        ],
        ingredients: [
          {
            name: "Idli batter",
            isStaple: false
          },
          {
            name: "Pyaaz",
            isStaple: true
          },
          {
            name: "Curry leaves",
            isStaple: true
          },
          {
            name: "Rai",
            isStaple: true
          },
          {
            name: "Tel",
            isStaple: true
          },
          {
            name: "Hari mirch",
            isStaple: true
          },
          {
            name: "Namak",
            isStaple: true
          }
        ]
      }
    ]
  }
];

export const ALL_CUISINES_BATCH7_RECIPES: RecipeCatalogEntry[] = BATCH7_CONFIGS.flatMap((config) =>
  buildBatch6Recipes(config),
);

export const BATCH7_RECIPE_COUNT = ALL_CUISINES_BATCH7_RECIPES.length;
