document.addEventListener('DOMContentLoaded', function() {
    // Game configuration
    const MIN_PLAYERS = 3;
    const MAX_PLAYERS = 15;
    const MIN_IMPOSTORS = 1;
    const DEFAULT_PLAYER_NAMES = [
        "Player 1", "Player 2", "Player 3", "Player 4", "Player 5", 
        "Player 6", "Player 7", "Player 8", "Player 9", "Player 10",
        "Player 11", "Player 12", "Player 13", "Player 14", "Player 15"
    ];
    
    // Hint mode: for each topic, the hint shown to the impostors for every word.
    // Only topics listed here can be played in hint mode. Hints don't need to be unique
    // and should stay vague (a trait, a setting, a theme), not a giveaway.
    // In hint mode, these topics are merged into a broader one:
    // their checkbox is hidden and their words are played under the target topic.
    const HINT_MODE_MERGED_TOPICS = {
        disney: "filmtv"
    };

    const HINTS = {
        oggetti_comuni: {
            "palla": "rotondo",
            "sedia": "casa",
            "compasso": "studio",
            "scuola": "mattina",
            "capra": "animale",
            "cappuccino": "colazione",
            "vaso": "fragile",
            "prosciutto": "salato",
            "cappello": "testa",
            "peperoncino": "caldo",
            "sole": "caldo",
            "ombrello": "autunno",
            "forchetta": "tavola",
            "cuscino": "morbido",
            "specchio": "bagno",
            "orologio": "metallo",
            "chiave": "tasca",
            "candela": "luce",
            "spazzolino": "bagno",
            "frigorifero": "cucina",
            "pizza": "cena",
            "gelato": "dolce",
            "bicicletta": "parco",
            "libro": "carta",
            "matita": "legno",
            "telefono": "tasca",
            "lampadina": "luce",
            "zaino": "viaggio",
            "scarpa": "pelle",
            "occhiali": "faccia",
            "coltello": "cucina",
            "pentola": "metallo",
            "tazza": "ceramica",
            "finestra": "casa",
            "porta": "legno",
            "letto": "notte",
            "divano": "morbido",
            "televisione": "salotto",
            "chitarra": "musica",
            "pianoforte": "pesante",
            "banana": "giallo",
            "mela": "rosso",
            "limone": "giallo",
            "arancia": "succo",
            "uovo": "colazione",
            "latte": "bianco",
            "formaggio": "giallo",
            "pane": "forno",
            "caffè": "amaro",
            "vino": "festa",
            "birra": "bar",
            "cioccolato": "dolce",
            "miele": "colazione",
            "pasta": "pranzo",
            "spaghetti": "cena",
            "cane": "parco",
            "gatto": "pelo",
            "pesce": "mare",
            "cavallo": "veloce",
            "mucca": "fattoria",
            "pecora": "bianco",
            "gallina": "mattina",
            "elefante": "grigio",
            "leone": "pericoloso",
            "ape": "estate",
            "ragno": "paura",
            "serpente": "paura",
            "treno": "viaggio",
            "aereo": "cielo",
            "nave": "viaggio",
            "automobile": "strada",
            "semaforo": "colori",
            "ospedale": "edificio",
            "spiaggia": "estate",
            "neve": "freddo",
            "pioggia": "grigio",
            "luna": "cielo",
            "stella": "notte",
            "albero": "verde",
            "fiore": "primavera",
            "erba": "verde",
            "montagna": "alto",
            "fuoco": "caldo",
            "ghiaccio": "freddo",
            "computer": "lavoro",
            "lavatrice": "casa",
            "aspirapolvere": "rumore",
            "forbici": "ufficio",
            "colla": "bambini",
            "martello": "rumore",
            "cacciavite": "garage",
            "scala": "alto",
            "torta": "festa",
            "regalo": "sorpresa",
            "palloncino": "bambini",
            "maschera": "faccia",
            "calzino": "coppia",
            "guanto": "inverno",
            "sciarpa": "inverno",
            "cintura": "pelle",
            "borsa": "negozio",
            "portafoglio": "tasca",
            "moneta": "rotondo",
            "dado": "gioco",
            "carte da gioco": "gioco",
            "scacchi": "pensare",
            "medaglia": "sport",
            "corona": "oro",
            "spada": "storia",
            "castello": "antico",
            "faro": "mare",
            "tenda": "vacanza",
            "sapone": "pulito",
            "asciugamano": "bagno",
            "doccia": "acqua",
            "dentifricio": "pulito",
            "profumo": "regalo",
            "rossetto": "rosso",
            "pettine": "mattina",
            "anello": "oro",
            "termometro": "medico",
            "cerotto": "pelle",
            "siringa": "paura",
            "bandiera": "colori",
            "mappa": "viaggio",
            "bussola": "avventura",
            "microfono": "musica",
            "fotografia": "vacanza",
            "cartolina": "carta",
            "busta": "carta",
            "calendario": "muro",
            "sveglia": "mattina",
            "tappo": "piccolo",
            "bottiglia": "vetro",
            "cannuccia": "plastica",
            "popcorn": "salato",
            "biglietto": "viaggio",
            "zucca": "autunno",
            "albero di Natale": "inverno",
            "pupazzo di neve": "bianco",
            "carota": "orto",
            "patata": "terra",
            "pomodoro": "orto",
            "cipolla": "cucina",
            "aglio": "odore",
            "fungo": "autunno"
        },

        filmtv: {
            "Il trono di Spade": "regno",
            "Il signore degli anelli": "viaggio",
            "Breaking Bad": "droga",
            "La casa di carta": "soldi",
            "Stranger Things": "anni '80",
            "Friends": "amicizia",
            "The Office": "lavoro",
            "Squid Game": "soldi",
            "The Mandalorian": "spazio",
            "The Witcher": "mostri",
            "Titanic": "amore",
            "Avatar": "natura",
            "Il padrino": "famiglia",
            "Pulp Fiction": "crimine",
            "Inception": "sogno",
            "Interstellar": "spazio",
            "Forrest Gump": "America",
            "Matrix": "tecnologia",
            "The Crown": "regno",
            "Peaky Blinders": "Inghilterra",
            "Vikings": "guerra",
            "Narcos": "droga",
            "La regina degli scacchi": "talento",
            "Dark": "tempo",
            "Black Mirror": "tecnologia",
            "The Walking Dead": "sopravvivenza",
            "Lost": "mistero",
            "The Big Bang Theory": "scienza",
            "Modern Family": "famiglia",
            "Grey's Anatomy": "ospedale",
            "Doctor Who": "tempo",
            "The Last of Us": "sopravvivenza",
            "Better Call Saul": "tribunale",
            "The Boys": "supereroi",
            "True Detective": "indagine",
            "Westworld": "robot",
            "Chernobyl": "disastro",
            "Loki": "supereroi",
            "Bridgerton": "nobiltà",
            "Succession": "potere",
            "Euphoria": "adolescenti",
            "Il Gladiatore": "vendetta",
            "Salvate il soldato Ryan": "guerra",
            "Schindler's List": "guerra",
            "Il cavaliere oscuro": "città",
            "The Social Network": "tecnologia",
            "Fight Club": "follia",
            "Kill Bill": "vendetta",
            "Quei bravi ragazzi": "mafia",
            "Ritorno al futuro": "tempo",
            "Jurassic Park": "scienza",
            "Star Wars": "spazio",
            "E.T. l'extra-terrestre": "alieni",
            "Indiana Jones": "avventura",
            "Harry Potter": "magia",
            "Il silenzio degli innocenti": "indagine",
            "Joker": "follia",
            "Parasite": "famiglia",
            "La La Land": "musica",
            "The Bear": "cucina",
            "Ted Lasso": "sport",
            "Mindhunter": "indagine",
            "Sex Education": "scuola",
            "The End of the F***ing World": "adolescenti",
            "Lupin": "furto",
            "Elite": "scuola",
            "Baby Driver": "musica",
            "The Gentlemen": "Inghilterra",
            "The Wolf of Wall Street": "soldi",
            "Django Unchained": "far west",
            "Bastardi senza gloria": "guerra",
            "Una notte da leoni": "festa",
            "American Pie": "risate",
            "Pretty Woman": "amore",
            "Notting Hill": "Inghilterra",
            "Il diavolo veste Prada": "moda",
            "Le pagine della nostra vita": "amore",
            "Bohemian Rhapsody": "musica",
            "A Star Is Born": "fama",
            "Top Gun": "cielo",
            "Mission: Impossible": "spie",
            "Fast & Furious": "velocità",
            "John Wick": "vendetta",
            "James Bond": "spie",
            "I pirati dei Caraibi": "mare",
            "The Avengers": "squadra",
            "Spider-Man": "supereroi",
            "Batman": "notte",
            "Superman": "volare",
            "Wonder Woman": "supereroi",
            "Captain America": "America",
            "Iron Man": "tecnologia",
            "Thor": "supereroi",
            "Hulk": "rabbia",
            "Black Panther": "regno",
            "Doctor Strange": "magia",
            "Guardiani della Galassia": "spazio",
            "Deadpool": "risate",
            "X-Men": "supereroi",
            "Dune": "deserto",
            "Blade Runner": "futuro",
            "2001: Odissea nello spazio": "spazio",
            "The Truman Show": "finzione",
            "V per Vendetta": "ribellione",
            "The Prestige": "rivalità",
            "The Departed": "polizia",
            "Zodiac": "indagine",
            "Il curioso caso di Benjamin Button": "tempo",
            "The Revenant": "freddo",
            "Gomorra": "crimine",
            "Boris": "televisione",
            "Don Matteo": "Italia",
            "Mare fuori": "prigione",
            "Il commissario Montalbano": "polizia",
            "Strappare lungo i bordi": "animazione",
            "Tutto chiede salvezza": "ospedale",
            "Il cacciatore": "armi",
            "House of the Dragon": "regno",
            "The Umbrella Academy": "famiglia",
            "Lucifer": "religione",
            "You": "ossessione",
            "The Haunting of Hill House": "paura",
            "American Horror Story": "paura",
            "Penny Dreadful": "mostri",
            "Hannibal": "assassino",
            "Dexter": "sangue",
            "The X-Files": "alieni",
            "Sherlock": "indagine",
            "I Soprano": "mafia",
            "Suits": "tribunale",
            "The Good Wife": "tribunale",
            "Criminal Minds": "indagine",
            "CSI": "polizia",
            "Prison Break": "prigione",
            "Orange Is the New Black": "prigione",
            "Cobra Kai": "sport",
            "Emily in Paris": "moda",
            "Brooklyn Nine-Nine": "polizia",
            "Scrubs": "ospedale",
            "How I Met Your Mother": "amicizia",
            "I Griffin": "famiglia",
            "I Simpson": "giallo",
            "South Park": "ragazzi",
            "Rick e Morty": "scienza",
            "BoJack Horseman": "fama",
            "Love, Death & Robots": "robot",
            "Arcane": "videogioco",
            "Attack on Titan": "sopravvivenza",
            "Death Note": "morte",
            "One Piece": "tesoro",
            "Dragon Ball": "combattimento",
            "Demon Slayer": "Giappone",
            "Jujutsu Kaisen": "Giappone",
            "Fullmetal Alchemist": "fratelli",
            "Cowboy Bebop": "spazio",
            "The Sandman": "sogno",
            "Wednesday": "scuola",
            "Dahmer": "assassino",
            "Inventing Anna": "inganno",
            "The Chair": "lavoro",
            "All of Us Are Dead": "zombie",
            "Reservation Dogs": "ragazzi",
            "Yellowstone": "America",
            "The Rings of Power": "magia",
            "Andor": "ribellione",
            "Obi-Wan Kenobi": "spazio",
            "Moon Knight": "supereroi",
            "Ms. Marvel": "ragazzi",
            "Station Eleven": "sopravvivenza",
            "Pachinko": "famiglia",
            "Scissione": "lavoro",
            "Midnight Mass": "religione",
            "Il problema dei tre corpi": "scienza",
            "Shogun": "Giappone",
            "Fallout": "videogioco",
            "The Morning Show": "televisione",
            "For All Mankind": "spazio",
            "L'amore e la vita": "ospedale",
            "L'alienista": "indagine",
            "Il nome della rosa": "mistero",
            "Il processo": "tribunale",
            "Il Re": "potere",
            "Noi (Us)": "paura",
            "Psycho": "paura",
            "Arancia meccanica": "violenza",
            "Taxi Driver": "notte",
            "Shining": "hotel",
            "Quarto potere": "giornali",
            "Il grande Lebowski": "risate",
            "Apocalypse Now": "guerra",
            "Scarface": "droga",
            "American Psycho": "assassino",
            "Il buono, il brutto, il cattivo": "far west",
            "Il mago di Oz": "viaggio",
            "Via col vento": "amore",
            "Memento": "memoria",
            "Full Metal Jacket": "guerra",
            "Reservoir Dogs - Le iene": "crimine",
            "Alien": "spazio",
            "Mary Poppins": "magia",
            "Il settimo sigillo": "morte",
            "C'era una volta in America": "mafia",
            "Vertigo - La donna che visse due volte": "ossessione",
            "Frankenstein": "mostri",
            "Toro scatenato": "sport",
            "L'esorcista": "religione",
            "Non aprite quella porta": "paura",
            "8½": "cinema",
            "Seven": "assassino",
            "Whiplash": "musica",
            "La grande bellezza": "Italia",
            "La vita è bella": "guerra",
            "Il pianista": "guerra",
            "Requiem for a Dream": "droga",
            "Rocky": "sport",
            "Oppenheimer": "scienza"
        },

        disney: {
            "Biancaneve e i sette nani": "principessa",
            "Pinocchio": "legno",
            "Dumbo": "circo",
            "Bambi": "bosco",
            "I tre moschettieri": "amicizia",
            "Cenerentola": "principessa",
            "Alice nel Paese delle Meraviglie": "sogno",
            "Le avventure di Peter Pan": "volare",
            "La bella addormentata nel bosco": "principessa",
            "La carica dei 101": "animali",
            "La spada nella roccia": "magia",
            "Il libro della giungla": "giungla",
            "Gli Aristogatti": "Parigi",
            "Robin Hood": "animali",
            "Le avventure di Winnie the Pooh": "amicizia",
            "La sirenetta": "mare",
            "La bella e la bestia": "castello",
            "Aladdin": "deserto",
            "Il re leone": "famiglia",
            "Pocahontas": "natura",
            "Il gobbo di Notre Dame": "Parigi",
            "Hercules": "eroe",
            "Mulan": "guerra",
            "Tarzan": "giungla",
            "Atlantis - L'impero perduto": "avventura",
            "Lilo & Stitch": "alieni",
            "Il pianeta del tesoro": "spazio",
            "I Robinson - Una famiglia spaziale": "futuro",
            "La principessa e il ranocchio": "musica",
            "Rapunzel - L'intreccio della torre": "principessa",
            "Ralph Spaccatutto": "videogioco",
            "Frozen - Il regno di ghiaccio": "inverno",
            "Big Hero 6": "robot",
            "Zootropolis": "città",
            "Raya e l'ultimo drago": "magia",
            "Toy Story": "amicizia",
            "A Bug's Life - Megaminimondo": "piccolo",
            "Monsters & Co.": "paura",
            "Alla ricerca di Nemo": "mare",
            "Gli Incredibili": "supereroi",
            "Cars": "velocità",
            "Ratatouille": "cucina",
            "WALL•E": "robot",
            "Up": "viaggio",
            "Inside Out": "emozioni",
            "Alla ricerca di Dory": "memoria",
            "Coco": "musica",
            "Onward - Oltre la magia": "fratelli",
            "Soul": "vita",
            "Luca": "estate",
            "Red": "crescere",
            "Lightyear - La vera storia di Buzz": "spazio",
            "Elemental": "opposti"
        },

        specific_places: {
            "Fiume Nilo": "acqua",
            "Foresta Amazzonica": "verde",
            "Torre Eiffel": "altezza",
            "Colosseo": "antico",
            "Big Ben": "tempo",
            "Statua della Libertà": "simbolo",
            "Grande Muraglia cinese": "difesa",
            "Taj Mahal": "amore",
            "Piramidi di Giza": "deserto",
            "Machu Picchu": "montagna",
            "Cristo Redentore": "religione",
            "Acropoli di Atene": "antico",
            "Sagrada Familia": "architettura",
            "Stonehenge": "mistero",
            "Cattedrale di Notre-Dame": "religione",
            "Golden Gate Bridge": "rosso",
            "Grand Canyon": "roccia",
            "Monte Everest": "freddo",
            "Basilica di San Pietro": "religione",
            "Empire State Building": "altezza",
            "Petra": "roccia",
            "Burj Khalifa": "lusso",
            "Monte Fuji": "neve",
            "Cascate del Niagara": "acqua",
            "Torre di Pisa": "Italia",
            "Isola di Pasqua": "mistero",
            "Cattedrale di San Basilio": "colori",
            "Basilica di Santa Sofia": "storia",
            "Duomo di Milano": "piazza",
            "Duomo di Siena": "marmo",
            "Duomo di Orvieto": "collina",
            "Grande Barriera Corallina": "mare",
            "Cascate delle Marmore": "Italia",
            "Piazza San Marco": "turisti",
            "Chichén Itzá": "civiltà",
            "Ponte di Brooklyn": "città",
            "Times Square": "luci",
            "Hollywood Sign": "cinema",
            "Parco Nazionale di Yosemite": "natura",
            "Disneyland": "divertimento",
            "Valle Sacra degli Incas": "montagna",
            "Fontana di Trevi": "desiderio",
            "Pantheon": "antico",
            "Arena di Verona": "musica",
            "Palazzo di Versailles": "re",
            "Monte Kilimanjaro": "Africa",
            "Hollywood Walk of Fame": "fama",
            "Museo del Louvre": "arte",
            "La Casa Bianca": "potere",
            "Area 51": "segreto",
            "Città del Vaticano": "piccolo",
            "London Eye": "panorama",
            "Antelope Canyon": "roccia",
            "Città Maya di Tikal": "giungla",
            "Il Partenone": "colonne",
            "Arco di Trionfo": "vittoria",
            "Valle della Morte": "caldo",
            "Deserto del Sahara": "sabbia",
            "Lago di Como": "vacanza",
            "Mar Morto": "sale",
            "Linee di Nazca": "mistero",
            "Blue Lagoon": "relax",
            "Fiordi norvegesi": "freddo",
            "Monumento a Lincoln": "America",
            "Costiera Amalfitana": "estate",
            "Le Cinque Terre": "colori",
            "Palazzo Ducale": "storia",
            "Campidoglio degli Stati Uniti": "politica",
            "Il Cremlino": "politica",
            "Alcatraz": "prigione",
            "Tempio del Cielo": "Cina",
            "Tempio di Kyoto": "silenzio",
            "Teatro alla Scala": "musica",
            "Grand Bazaar": "caos",
            "Torre di Londra": "storia",
            "Palazzo Reale di Amsterdam": "re",
            "Muro di Berlino": "divisione",
            "Palazzo di Cnosso": "mito",
            "Palazzo dell'Alhambra": "giardini",
            "Blue Mosque": "cupole",
            "Cattedrale di San Marco": "oro",
            "Galleria degli Uffizi": "arte",
            "La Grande Sfinge di Giza": "deserto",
            "Monte Rushmore": "America"
        }
    };

    // Game state
    const gameState = {
        players: DEFAULT_PLAYER_NAMES.slice(0, 3),
        numPlayers: 3,
        numImpostors: 1,
        impostorIndices: [],
        currentPlayerIndex: 0,
        selectedTopics: [],
        topicWords: {
            generic_geography: [
                "montagna",
                "collina",
                "pianura",
                "altopiano",
                "vulcano",
                "cratere",
                "fiume",
                "ruscello",
                "lago",
                "stagno",
                "palude",
                "cascata",
                "ghiacciaio",
                "valle",
                "gola",
                "canyon",
                "delta",
                "sorgente",
                "bacino",
                "diga",
                "mare",
                "oceano",
                "golfo",
                "scogliera",
                "spiaggia",
                "litorale",
                "barriera corallina",
                "porto",
                "arcipelago",
                "isola",
                "penisola",
                "istmo",
                "Alpi",
                "Appennini",
                "Balcani",
                "città",
                "villaggio",
                "metropoli",
                "capitale",
                "confine",
                "stato",
                "regione",
                "provincia",
                "comune",
                "equatore",
                "tropico",
                "emisfero",
                "polo",
                "meridiano di greenwich",
                "terremoto",
                "eruzione",
                "crosta terrestre",
                "mantello terrestre",
                "nucleo terrestre",
                "foresta",
                "giungla",
                "savana",
                "deserto",
                "prateria",
                "bosco",
                "riserva naturale",
                "periferia",
                "centro storico",
                "zona industriale",
                "zona residenziale",
                "quartiere",
                "grattacielo",
                "autostrada",
                "ferrovia",
                "giardino",
                "villa a schiera",
                "baraccopoli",
                "falda acquifera",
                "laguna",
                "fonte termale",
                "diga artificiale"
            ],

            filmtv: [
                "Il trono di Spade",
                "Il signore degli anelli",
                "Breaking Bad",
                "La casa di carta",
                "Stranger Things",
                "Friends",
                "The Office",
                "Squid Game",
                "The Mandalorian",
                "The Witcher",
                "Titanic",
                "Avatar",
                "Il padrino",
                "Pulp Fiction",
                "Inception",
                "Interstellar",
                "Forrest Gump",
                "Matrix",
                "The Crown",
                "Peaky Blinders",
                "Vikings",
                "Narcos",
                "La regina degli scacchi",
                "Dark",
                "Black Mirror",
                "The Walking Dead",
                "Lost",
                "The Big Bang Theory",
                "Modern Family",
                "Grey's Anatomy",
                "Doctor Who",
                "The Last of Us",
                "Better Call Saul",
                "The Boys",
                "True Detective",
                "Westworld",
                "Chernobyl",
                "Loki",
                "Bridgerton",
                "Succession",
                "Euphoria",
                "Il Gladiatore",
                "Salvate il soldato Ryan",
                "Schindler's List",
                "Il cavaliere oscuro",
                "The Social Network",
                "Fight Club",
                "Kill Bill",
                "Quei bravi ragazzi",
                "Ritorno al futuro",
                "Jurassic Park",
                "Star Wars",
                "E.T. l'extra-terrestre",
                "Indiana Jones",
                "Harry Potter",
                "Il silenzio degli innocenti",
                "Joker",
                "Parasite",
                "La La Land",
                "The Bear",
                "Ted Lasso",
                "Mindhunter",
                "Sex Education",
                "The End of the F***ing World",
                "Lupin",
                "Elite",
                "Baby Driver",
                "The Gentlemen",
                "The Wolf of Wall Street",
                "Django Unchained",
                "Bastardi senza gloria",
                "Una notte da leoni",
                "American Pie",
                "Pretty Woman",
                "Notting Hill",
                "Il diavolo veste Prada",
                "Le pagine della nostra vita",
                "Bohemian Rhapsody",
                "A Star Is Born",
                "Top Gun",
                "Mission: Impossible",
                "Fast & Furious",
                "John Wick",
                "James Bond",
                "I pirati dei Caraibi",
                "The Avengers",
                "Spider-Man",
                "Batman",
                "Superman",
                "Wonder Woman",
                "Captain America",
                "Iron Man",
                "Thor",
                "Hulk",
                "Black Panther",
                "Doctor Strange",
                "Guardiani della Galassia",
                "Deadpool",
                "X-Men",
                "Dune",
                "Blade Runner",
                "2001: Odissea nello spazio",
                "The Truman Show",
                "V per Vendetta",
                "The Prestige",
                "The Departed",
                "Zodiac",
                "Il curioso caso di Benjamin Button",
                "The Revenant",
                "Gomorra",
                "Boris",
                "Don Matteo",
                "Mare fuori",
                "Il commissario Montalbano",
                "Strappare lungo i bordi",
                "Tutto chiede salvezza",
                "Il cacciatore",
                "House of the Dragon",
                "The Umbrella Academy",
                "Lucifer",
                "You",
                "The Haunting of Hill House",
                "American Horror Story",
                "Penny Dreadful",
                "Hannibal",
                "Dexter",
                "The X-Files",
                "Sherlock",
                "I Soprano",
                "Suits",
                "The Good Wife",
                "Criminal Minds",
                "CSI",
                "Prison Break",
                "Orange Is the New Black",
                "Cobra Kai",
                "Emily in Paris",
                "Brooklyn Nine-Nine",
                "Scrubs",
                "How I Met Your Mother",
                "I Griffin",
                "I Simpson",
                "South Park",
                "Rick e Morty",
                "BoJack Horseman",
                "Love, Death & Robots",
                "Arcane",
                "Attack on Titan",
                "Death Note",
                "One Piece",
                "Dragon Ball",
                "Demon Slayer",
                "Jujutsu Kaisen",
                "Fullmetal Alchemist",
                "Cowboy Bebop",
                "The Sandman",
                "Wednesday",
                "Dahmer",
                "Inventing Anna",
                "The Chair",
                "All of Us Are Dead",
                "Reservation Dogs",
                "Yellowstone",
                "The Rings of Power",
                "Andor",
                "Obi-Wan Kenobi",
                "Moon Knight",
                "Ms. Marvel",
                "Station Eleven",
                "Pachinko",
                "Scissione",
                "Midnight Mass",
                "Il problema dei tre corpi",
                "Shogun",
                "Fallout",
                "The Morning Show",
                "For All Mankind",
                "L'amore e la vita",
                "L'alienista", 
                "Il nome della rosa",
                "Il processo",
                "Il Re",
                "Noi (Us)",
                "Psycho",
                "Arancia meccanica",
                "Taxi Driver",
                "Shining",
                "Quarto potere",
                "Il grande Lebowski",
                "Apocalypse Now",
                "Scarface",
                "American Psycho",
                "Il buono, il brutto, il cattivo",
                "Il mago di Oz",
                "Via col vento",
                "Memento",
                "Full Metal Jacket",
                "Reservoir Dogs - Le iene",
                "Alien",
                "Mary Poppins",
                "Il settimo sigillo",
                "C'era una volta in America",
                "Vertigo - La donna che visse due volte",
                "Frankenstein",
                "Toro scatenato",
                "L'esorcista",
                "Non aprite quella porta",
                "8½",
                "Seven",
                "Whiplash",
                "La grande bellezza",
                "La vita è bella",
                "Il pianista",
                "Requiem for a Dream",
                "Rocky",
                "Oppenheimer"
            ],

            oggetti_comuni: Object.keys(HINTS.oggetti_comuni),

            disney: [
                "Biancaneve e i sette nani",
                "Pinocchio",
                "Dumbo",
                "Bambi",
                "I tre moschettieri",
                "Cenerentola",
                "Alice nel Paese delle Meraviglie",
                "Le avventure di Peter Pan",
                "La bella addormentata nel bosco",
                "La carica dei 101",
                "La spada nella roccia",
                "Il libro della giungla",
                "Gli Aristogatti",
                "Robin Hood",
                "Le avventure di Winnie the Pooh",
                "La sirenetta",
                "La bella e la bestia",
                "Aladdin",
                "Il re leone",
                "Pocahontas",
                "Il gobbo di Notre Dame",
                "Hercules",
                "Mulan",
                "Tarzan",
                "Atlantis - L'impero perduto",
                "Lilo & Stitch",
                "Il pianeta del tesoro",
                "I Robinson - Una famiglia spaziale",
                "La principessa e il ranocchio",
                "Rapunzel - L'intreccio della torre",
                "Ralph Spaccatutto",
                "Frozen - Il regno di ghiaccio",
                "Big Hero 6",
                "Zootropolis",
                "Raya e l'ultimo drago",
                "Toy Story",
                "A Bug's Life - Megaminimondo",
                "Monsters & Co.",
                "Alla ricerca di Nemo",
                "Gli Incredibili",
                "Cars",
                "Ratatouille",
                "WALL•E",
                "Up",
                "Inside Out",
                "Alla ricerca di Dory",
                "Coco",
                "Onward - Oltre la magia",
                "Soul",
                "Luca",
                "Red",
                "Lightyear - La vera storia di Buzz",
                "Elemental"
            ],

            specific_places: [
                "Fiume Nilo", 
                "Foresta Amazzonica",
                "Torre Eiffel",
                "Colosseo",
                "Big Ben",
                "Statua della Libertà",
                "Grande Muraglia cinese",
                "Taj Mahal",
                "Piramidi di Giza",
                "Machu Picchu",
                "Cristo Redentore",
                "Acropoli di Atene",
                "Sagrada Familia",
                "Stonehenge",
                "Cattedrale di Notre-Dame",
                "Golden Gate Bridge",
                "Grand Canyon",
                "Monte Everest",
                "Basilica di San Pietro",
                "Empire State Building",
                "Petra",
                "Burj Khalifa",
                "Monte Fuji",
                "Cascate del Niagara",
                "Torre di Pisa",
                "Isola di Pasqua",
                "Cattedrale di San Basilio",
                "Basilica di Santa Sofia",
                "Duomo di Milano",
                "Duomo di Siena",
                "Duomo di Orvieto",
                "Grande Barriera Corallina",
                "Cascate delle Marmore",
                "Piazza San Marco",
                "Chichén Itzá",
                "Ponte di Brooklyn",
                "Times Square",
                "Hollywood Sign",
                "Parco Nazionale di Yosemite",
                "Disneyland",
                "Valle Sacra degli Incas",
                "Fontana di Trevi",
                "Pantheon",
                "Arena di Verona",
                "Palazzo di Versailles",
                "Monte Kilimanjaro",
                "Hollywood Walk of Fame",
                "Museo del Louvre",
                "La Casa Bianca",
                "Area 51",
                "Città del Vaticano",
                "London Eye",
                "Antelope Canyon",
                "Città Maya di Tikal",
                "Il Partenone",
                "Arco di Trionfo",
                "Valle della Morte",
                "Deserto del Sahara",
                "Lago di Como",
                "Mar Morto",
                "Linee di Nazca",
                "Blue Lagoon",
                "Fiordi norvegesi",
                "Monumento a Lincoln",
                "Costiera Amalfitana",
                "Le Cinque Terre",
                "Palazzo Ducale",
                "Campidoglio degli Stati Uniti",
                "Il Cremlino",
                "Alcatraz",
                "Tempio del Cielo",
                "Tempio di Kyoto",
                "Teatro alla Scala",
                "Grand Bazaar",
                "Torre di Londra",
                "Palazzo Reale di Amsterdam",
                "Muro di Berlino",
                "Palazzo di Cnosso",
                "Palazzo dell'Alhambra",
                "Blue Mosque",
                "Cattedrale di San Marco",
                "Galleria degli Uffizi",
                "La Grande Sfinge di Giza",
                "Monte Rushmore",
            ],

            professions: [
                    "impiegato", "insegnante universitario", "operaio", "medico", "infermiere",
                    "avvocato", "ingegnere", "architetto", "giornalista", "commercialista",
                    "poliziotto", "vigile del fuoco", "idraulico", "elettricista", "muratore",
                    "falegname", "cuoco", "cameriere", "barista", "pasticciere",
                    "panettiere", "macellaio", "sarto", "parrucchiere", "estetista",
                    "farmacista", "dentista", "veterinario", "psicologo", "fisioterapista",
                    "autista", "tassista", "pilota", "hostess", "steward",
                    "guida turistica", "receptionist", "commesso", "cassiere", "magazziniere",
                    "giardiniere", "agricoltore", "pescatore", "allevatore", "fioraio",
                    "bibliotecario", "scrittore", "editore", "traduttore", "interprete",
                    "attore", "regista", "musicista", "cantante", "ballerino",
                    "fotografo", "grafico", "web designer", "programmatore", 
                    "consulente","manager", "imprenditore", "agente immobiliare",
                    "assicuratore", "bancario","economista", "notaio",
                    "giudice", "procuratore", "geologo", "biologo", "chimico",
                    "fisico", "astronomo", "archeologo", "antropologo", "sociologo",
                    "ricercatore", "maestro scuole elementari", "professore liceale", "badante",
                    "assistente sociale", "parroco", "sindaco", "politico",
                    "marinaio", "militare", "carabiniere", "astronauta", "critico d'arte",
                    "carpentiere", "orafo", "orologiaio", "ceramista", "scultore", 
                    "pittore", "designer", "stilista", "sommelier",
                    "personal trainer", "nutrizionista", "logopedista", "ottico",
                    "ostetrica", "erborista", "tatuatore", "truccatore", "costumista", "scenografo",
                    "coreografo", "direttore d'orchestra", "compositore", "speaker radiofonico", "presentatore",
                    "influencer", "social media manager", "content creator",
                    "doppiatore", "sceneggiatore", 
                    "restauratore", "antiquario", "meteorologo", "vulcanologo",
                    "sismologo", "zoologo", "botanico",
                    "genetista", "paleontologo",
                    "apicoltore", "distillatore",
                    "netturbino", "disinfestatore","parcheggiatore",
                    "guardia forestale", "bagnino", "istruttore di sci", "maestro di tennis",
                    "arbitro", "allenatore sportivo", "procuratore sportivo", "scommettitore professionista",
                    "investigatore privato", "guardia del corpo", "mediatore culturale", "organizzatore di eventi",
                    "ambasciatore", "console"
            ]
        },

        topicNames: {
            generic_geography: "Elementi geografici generici",
            filmtv: "Film e Serie TV",
            disney: "Disney e Pixar",
            specific_places: "Luoghi famosi",
            professions: "Professioni",
            oggetti_comuni: "Oggetti comuni"
        },

        currentWord: "",
        currentTopic: "",
        currentHint: "",
        hintMode: false,
        impostorCanBeFirst: true,
        clownEnabled: false,
        clownIndex: -1,
        firstPlayerIndex: 0,
        usedWords: [],
        timer: {
            minutes: 10,
            seconds: 0,
            interval: null,
            isRunning: false
        }
    };
    
    // DOM Elements - Screens
    const screens = {
        playerSetup: document.getElementById('playerSetupScreen'),
        playerPass: document.getElementById('playerPassScreen'),
        playerRole: document.getElementById('playerRoleScreen'),
        gamePlay: document.getElementById('gamePlayScreen'),
        gameEnd: document.getElementById('gameEndScreen')
    };
    
    // DOM Elements - Player Setup
    const p_decreaseBtn = document.getElementById('p_decreaseBtn');
    const p_increaseBtn = document.getElementById('p_increaseBtn');
    const playerCount = document.getElementById('playerCount');
    const playerFields = document.getElementById('playerFields');
    const i_decreaseBtn = document.getElementById('i_decreaseBtn');
    const i_increaseBtn = document.getElementById('i_increaseBtn');
    const impostorsCount = document.getElementById('impostorsCount');
    const startGameBtn = document.getElementById('startGameBtn');
    const hintModeToggle = document.getElementById('hintModeToggle');
    const impostorFirstToggle = document.getElementById('impostorFirstToggle');
    const clownToggle = document.getElementById('clownToggle');
    const hintModeBox = document.getElementById('hintModeBox');
    
    // DOM Elements - Player Pass
    const currentPlayerName = document.getElementById('currentPlayerName');
    const readyBtn = document.getElementById('readyBtn');
    
    // DOM Elements - Player Role
    const citizenRole = document.getElementById('citizenRole');
    const impostorRole = document.getElementById('impostorRole');
    const wordDisplay = document.getElementById('wordDisplay');
    const topicDisplay = document.getElementById('topicDisplay');
    const topicDisplayImpostor = document.getElementById('topicDisplayImpostor');
    const otherImpostorsContainer = document.getElementById('otherImpostorsContainer');
    const impostorHintContainer = document.getElementById('impostorHintContainer');
    const impostorHintDisplay = document.getElementById('impostorHintDisplay');
    const clownRole = document.getElementById('clownRole');
    const clownWordDisplay = document.getElementById('clownWordDisplay');
    const topicDisplayClown = document.getElementById('topicDisplayClown');
    const gotItBtn = document.getElementById('gotItBtn');
    
    // DOM Elements - Game Play
    const firstPlayerName = document.getElementById('firstPlayerName');
    const timerDisplay = document.getElementById('timerDisplay');
    const timerBtn = document.getElementById('timerBtn');
    const revealImpostorsBtn = document.getElementById('revealImpostorsBtn');
    
    // DOM Elements - Game End
    const finalWordDisplay = document.getElementById('finalWordDisplay');
    const finalTopicDisplay = document.getElementById('finalTopicDisplay');
    const finalHintDisplay = document.getElementById('finalHintDisplay');
    const impostorListDisplay = document.getElementById('impostorListDisplay');
    const clownRevealSection = document.getElementById('clownRevealSection');
    const clownRevealName = document.getElementById('clownRevealName');
    const newGameBtn = document.getElementById('newGameBtn');
    
    // Create background particles
    createParticles();
    
    // Initialize player fields
    updatePlayerFields();
    
    // Event Listeners - Player Setup
    p_decreaseBtn.addEventListener('click', function() {
        if (gameState.numPlayers > MIN_PLAYERS) {
            gameState.numPlayers--;
            playerCount.textContent = gameState.numPlayers;
            playerCount.classList.add('pulse');
            setTimeout(() => playerCount.classList.remove('pulse'), 300);
            updatePlayerFields();
            
            // Adjust impostors if needed
            if (gameState.numImpostors > Math.floor(gameState.numPlayers / 2)) {
                gameState.numImpostors = Math.floor(gameState.numPlayers / 2);
                impostorsCount.textContent = gameState.numImpostors;
            }
        }
    });
    
    p_increaseBtn.addEventListener('click', function() {
        if (gameState.numPlayers < MAX_PLAYERS) {
            gameState.numPlayers++;
            playerCount.textContent = gameState.numPlayers;
            playerCount.classList.add('pulse');
            setTimeout(() => playerCount.classList.remove('pulse'), 300);
            updatePlayerFields();
        }
    });
    
    i_decreaseBtn.addEventListener('click', function() {
        if (gameState.numImpostors > MIN_IMPOSTORS) {
            gameState.numImpostors--;
            impostorsCount.textContent = gameState.numImpostors;
            impostorsCount.classList.add('pulse');
            setTimeout(() => impostorsCount.classList.remove('pulse'), 300);
        }
    });
    
    i_increaseBtn.addEventListener('click', function() {
        // Make sure there are more non-impostors than impostors
        if (gameState.numImpostors < Math.floor(gameState.numPlayers / 2)) {
            gameState.numImpostors++;
            impostorsCount.textContent = gameState.numImpostors;
            impostorsCount.classList.add('pulse');
            setTimeout(() => impostorsCount.classList.remove('pulse'), 300);
        }
    });
    
    // Option switches: highlight the box of every switch that is on
    document.querySelectorAll('.mode-toggle').forEach(box => {
        const input = box.querySelector('.switch-input');
        const sync = () => box.classList.toggle('on', input.checked);
        input.addEventListener('change', sync);
        sync();
    });

    // Event Listeners - Hint mode switch
    hintModeToggle.addEventListener('change', updateHintModeUI);
    updateHintModeUI();

    function updateHintModeUI() {
        gameState.hintMode = hintModeToggle.checked;

        // In hint mode, hide the topics without hints and those merged into a broader topic
        document.querySelectorAll('.topic-checkbox').forEach(checkbox => {
            const topic = checkbox.value;
            const unavailable = gameState.hintMode && (!HINTS[topic] || topic in HINT_MODE_MERGED_TOPICS);
            checkbox.disabled = unavailable;
            checkbox.closest('.topic-item').classList.toggle('unavailable', unavailable);
        });
    }

    // Event Listeners - Start Game
    startGameBtn.addEventListener('click', function() {
        // Check if at least one topic is selected
        const selectedTopics = [];
        document.querySelectorAll('.topic-checkbox:checked:not(:disabled)').forEach(checkbox => {
            selectedTopics.push(checkbox.value);
        });
        
        if (selectedTopics.length === 0) {
            alert(gameState.hintMode
                ? 'Please select at least one topic that has hints.'
                : 'Please select at least one topic.');
            return;
        }
        
        // Update selected topics
        // In hint mode, a selected broader topic also brings in the topics merged into it
        if (gameState.hintMode) {
            Object.entries(HINT_MODE_MERGED_TOPICS).forEach(([topic, target]) => {
                if (selectedTopics.includes(target) && !selectedTopics.includes(topic)) {
                    selectedTopics.push(topic);
                }
            });
        }
        gameState.selectedTopics = selectedTopics;

        // Read the game options
        gameState.impostorCanBeFirst = impostorFirstToggle.checked;
        gameState.clownEnabled = clownToggle.checked;
        
        // Update player names
        document.querySelectorAll('.player-input').forEach((input, index) => {
            gameState.players[index] = input.value || `Player ${index + 1}`;
        });
        
        // Prepare the game
        prepareGame();
        
        // Start with the player pass screen
        gameState.currentPlayerIndex = 0;
        startPlayerPass();
    });
    
    // Event Listeners - Player Pass
    readyBtn.addEventListener('click', function() {
        showScreen('playerRole');
        showPlayerRole();
    });
    
    // Event Listeners - Player Role
    gotItBtn.addEventListener('click', function() {
        // Move to the next player or to the game play
        gameState.currentPlayerIndex++;
        
        if (gameState.currentPlayerIndex < gameState.numPlayers) {
            // More players to reveal
            startPlayerPass();
        } else {
            // All players have seen their roles
            showScreen('gamePlay');
            firstPlayerName.textContent = gameState.players[gameState.firstPlayerIndex];
            resetTimer();
        }
    });
    
    // Event Listeners - Game Play
    timerBtn.addEventListener('click', function() {
        if (gameState.timer.isRunning) {
            // Stop the timer
            clearInterval(gameState.timer.interval);
            gameState.timer.isRunning = false;
            timerBtn.textContent = 'Start Timer';
        } else {
            // Start the timer
            gameState.timer.interval = setInterval(updateTimer, 1000);
            gameState.timer.isRunning = true;
            timerBtn.textContent = 'Stop Timer';
        }
    });
    
    revealImpostorsBtn.addEventListener('click', function() {
        // Stop the timer if it's running
        if (gameState.timer.isRunning) {
            clearInterval(gameState.timer.interval);
            gameState.timer.isRunning = false;
        }
        
        // Show the game end screen
        showGameEnd();
    });
    
    // Event Listeners - Game End
    newGameBtn.addEventListener('click', function() {
        // Reset the game and show the player setup screen
        resetGame();
        showScreen('playerSetup');
    });
    
    function updatePlayerFields() {
        // Clear existing fields
        playerFields.innerHTML = '';
        
        // Add fields for each player
        for (let i = 0; i < gameState.numPlayers; i++) {
            const playerField = document.createElement('div');
            playerField.className = 'player-field';
            
            const playerLabel = document.createElement('div');
            playerLabel.className = 'player-label';
            playerLabel.textContent = `${i + 1}:`;
            
            const playerInput = document.createElement('input');
            playerInput.type = 'text';
            playerInput.className = 'player-input';
            playerInput.value = gameState.players[i] || `Player ${i + 1}`;
            playerInput.maxLength = 15;
            playerInput.dataset.playerIndex = i;
            
            // Update player name when input changes
            playerInput.addEventListener('input', function() {
                const index = parseInt(this.dataset.playerIndex);
                gameState.players[index] = this.value;
            });
            
            playerField.appendChild(playerLabel);
            playerField.appendChild(playerInput);
            playerFields.appendChild(playerField);
        }
    }
    
    function showScreen(screenName) {
        // Hide all screens
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show the requested screen
        screens[screenName].classList.add('active');
    }
    
    function prepareGame() {
        // Assign impostor roles
        gameState.impostorIndices = [];
        
        // Randomly select impostors
        while (gameState.impostorIndices.length < gameState.numImpostors) {
            const randomIndex = Math.floor(Math.random() * gameState.numPlayers);
            if (!gameState.impostorIndices.includes(randomIndex)) {
                gameState.impostorIndices.push(randomIndex);
            }
        }
        
        const allIndices = Array.from({ length: gameState.numPlayers }, (_, i) => i);
        const nonImpostors = allIndices.filter(i => !gameState.impostorIndices.includes(i));
        const randomItem = list => list[Math.floor(Math.random() * list.length)];

        // Pick the clown among the players who are not impostors
        gameState.clownIndex = gameState.clownEnabled ? randomItem(nonImpostors) : -1;

        // Pick who speaks first (never an impostor if that option is off)
        gameState.firstPlayerIndex = randomItem(gameState.impostorCanBeFirst ? allIndices : nonImpostors);

        // Select a random word (and its hint for the impostors in hint mode)
        selectRandomWord();
    }
    
    function selectRandomWord() {
        // Get all words from selected topics (in hint mode, only words that have a hint)
        let allWords = [];
        gameState.selectedTopics.forEach(topic => {
            let words = gameState.topicWords[topic];
            if (gameState.hintMode) {
                words = words.filter(word => HINTS[topic] && HINTS[topic][word]);
            }
            allWords = allWords.concat(words);
        });
        
        // Filter out used words
        let availableWords = allWords.filter(word => !gameState.usedWords.includes(word));
        
        // If all words have been used, reset the used words array
        if (availableWords.length === 0) {
            gameState.usedWords = [];
            availableWords = allWords;
        }
        
        // Select a random word
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        const word = availableWords[randomIndex];
        
        // Determine which topic this word belongs to
        let wordTopic = "";
        for (const topic of gameState.selectedTopics) {
            if (gameState.topicWords[topic].includes(word)) {
                wordTopic = topic;
                break;
            }
        }
        
        // Update game state
        gameState.currentWord = word;
        gameState.currentHint = gameState.hintMode ? HINTS[wordTopic][word] : "";
        // In hint mode, a word from a merged topic is shown under the broader topic
        gameState.currentTopic = (gameState.hintMode && HINT_MODE_MERGED_TOPICS[wordTopic]) || wordTopic;
        gameState.usedWords.push(word);
    }
    
    function startPlayerPass() {
        // Show the player pass screen
        showScreen('playerPass');
        
        // Update the player name
        currentPlayerName.textContent = gameState.players[gameState.currentPlayerIndex];
    }
    
    function showPlayerRole() {
        // Hide both role divs initially
        citizenRole.style.display = 'none';
        impostorRole.style.display = 'none';
        clownRole.style.display = 'none';
        
        // Check if the current player is a impostor
        const isImpostor = gameState.impostorIndices.includes(gameState.currentPlayerIndex);
        
        if (isImpostor) {
            // Show impostor role
            impostorRole.style.display = 'block';
            topicDisplayImpostor.textContent = `Topic: ${gameState.topicNames[gameState.currentTopic]}`;

            // In hint mode, show the hint word to the impostor
            if (gameState.hintMode && gameState.currentHint) {
                impostorHintDisplay.textContent = gameState.currentHint;
                impostorHintContainer.style.display = 'block';
            } else {
                impostorHintContainer.style.display = 'none';
            }
            
            // Check if there are multiple impostors
            if (gameState.impostorIndices.length > 1) {
                otherImpostorsContainer.style.display = 'block';
                otherImpostorsContainer.innerHTML = '<p>The other impostors are:</p>';
                
                // Get other impostor indices (all impostors except current player)
                const otherImpostorIndices = gameState.impostorIndices.filter(index => index !== gameState.currentPlayerIndex);
                
                // Create elements for each other impostor
                otherImpostorIndices.forEach(impostorIndex => {
                    const impostorName = gameState.players[impostorIndex];
                    const impostorElement = document.createElement('span');
                    impostorElement.className = 'other-impostor-name';
                    impostorElement.textContent = impostorName;
                    otherImpostorsContainer.appendChild(impostorElement);
                });
            } else {
                // If only one impostor, hide the container
                otherImpostorsContainer.style.display = 'none';
            }
        } else if (gameState.currentPlayerIndex === gameState.clownIndex) {
            // Show clown role: knows the word, wins if voted
            clownRole.style.display = 'block';
            clownWordDisplay.textContent = gameState.currentWord;
            topicDisplayClown.textContent = `Topic: ${gameState.topicNames[gameState.currentTopic]}`;
        } else {
            // Show citizen role with the word
            citizenRole.style.display = 'block';
            wordDisplay.textContent = gameState.currentWord;
            topicDisplay.textContent = `Topic: ${gameState.topicNames[gameState.currentTopic]}`;
        }
    }
    
    function resetTimer() {
        // Reset timer values
        gameState.timer.minutes = 10;
        gameState.timer.seconds = 0;
        gameState.timer.isRunning = false;
        
        // Update display
        timerDisplay.textContent = '10:00';
        timerBtn.textContent = 'Start Timer';
        
        // Clear any existing intervals
        if (gameState.timer.interval) {
            clearInterval(gameState.timer.interval);
        }
    }
    
    function updateTimer() {
        // Decrease seconds
        gameState.timer.seconds--;
        
        // Handle minute change
        if (gameState.timer.seconds < 0) {
            gameState.timer.minutes--;
            gameState.timer.seconds = 59;
        }
        
        // Check if timer is done
        if (gameState.timer.minutes < 0) {
            clearInterval(gameState.timer.interval);
            gameState.timer.isRunning = false;
            timerBtn.textContent = 'Time\'s Up!';
            timerBtn.disabled = true;
            return;
        }
        
        // Update display
        const minutesStr = gameState.timer.minutes.toString().padStart(2, '0');
        const secondsStr = gameState.timer.seconds.toString().padStart(2, '0');
        timerDisplay.textContent = `${minutesStr}:${secondsStr}`;
    }
    
    function showGameEnd() {
        // Show the game end screen
        showScreen('gameEnd');
        
        // Display the word and topic
        finalWordDisplay.textContent = gameState.currentWord;
        finalTopicDisplay.textContent = `Topic: ${gameState.topicNames[gameState.currentTopic]}`;

        // In hint mode, also reveal the hint the impostors received
        if (gameState.hintMode && gameState.currentHint) {
            finalHintDisplay.textContent = `Impostor hint: ${gameState.currentHint}`;
            finalHintDisplay.style.display = 'block';
        } else {
            finalHintDisplay.style.display = 'none';
        }
        
        // Show the impostors
        impostorListDisplay.innerHTML = '';
        impostorListDisplay.style.display = 'block';

        // Reveal the clown, if there was one
        if (gameState.clownIndex >= 0) {
            clownRevealName.textContent = gameState.players[gameState.clownIndex];
            clownRevealSection.style.display = 'block';
        } else {
            clownRevealSection.style.display = 'none';
        }
        
        if (gameState.impostorIndices.length > 0) {
            gameState.impostorIndices.forEach(impostorIndex => {
                const impostorName = gameState.players[impostorIndex];
                const impostorElement = document.createElement('div');
                impostorElement.textContent = impostorName;
                impostorListDisplay.appendChild(impostorElement);
            });
        } else {
            impostorListDisplay.textContent = 'No impostors in this game!';
        }
    }
    
    function resetGame() {
        // Reset game state
        gameState.currentPlayerIndex = 0;
        gameState.impostorIndices = [];
        
        // Stop timer if running
        if (gameState.timer.isRunning) {
            clearInterval(gameState.timer.interval);
            gameState.timer.isRunning = false;
        }
        
        // Re-enable timer button
        timerBtn.disabled = false;
    }
    
    function createParticles() {
        // Create floating background particles
        // Reduce number on mobile for better performance
        const isMobile = window.innerWidth < 768;
        const numParticles = isMobile ? 15 : 30;
        const colors = [
            '#4682b4', '#dc143c', '#32cd32', 
            '#ffa500', '#8a2be2', '#1e90ff'
        ];
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = 5 + Math.random() * (isMobile ? 10 : 15);
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            // Set translate variables for animation
            const translateX = -40 + Math.random() * 80;
            const translateY = -40 + Math.random() * 80;
            
            // Set styles
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.backgroundColor = color;
            particle.style.setProperty('--translate-x', `${translateX}px`);
            particle.style.setProperty('--translate-y', `${translateY}px`);
            
            // Set animation
            const animationDuration = 5 + Math.random() * 10;
            particle.style.animation = `floatParticle ${animationDuration}s ease-in-out infinite`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            
            // Add to document
            document.body.appendChild(particle);
        }
        
    }

    window.addEventListener('resize', function() {
        document.querySelectorAll('.particle').forEach(el => el.remove());
        createParticles();
    });
});
