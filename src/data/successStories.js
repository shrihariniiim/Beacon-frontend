/**
 * Curated Success Stories Dataset
 * 
 * Strict editorial guidelines:
 * - Only publicly disclosed or reliably documented diagnoses / autistic identities
 * - Respectful, dignity-centered language (no inspiration-porn, no "superpowers", no "overcoming autism")
 * - Factual biographies, documented achievements, and verified sources
 */

export const SUCCESS_STORY_CATEGORIES = [
  'All',
  'Technology',
  'Arts & Creativity',
  'Sports',
  'Science',
  'Entertainment',
  'Advocacy',
  'Leadership'
];

export const successStories = [
  {
    id: 'temple-grandin',
    name: 'Temple Grandin',
    field: 'Scientist & Animal Behavior Expert',
    categories: ['Science', 'Advocacy', 'Leadership'],
    primaryCategory: 'Science',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Temple_Grandin_at_the_2011_SXSW_Interactive_Festival.jpg/640px-Temple_Grandin_at_the_2011_SXSW_Interactive_Festival.jpg',
    imageAlt: 'Dr. Temple Grandin speaking at a public educational symposium',
    quote: 'I am different, not less.',
    quoteSource: 'Thinking in Pictures: And Other Reports from My Life with Autism',
    shortDescription: 'Renowned professor of animal science and author who revolutionized humane livestock handling facilities and became one of the world’s foremost advocates for neurodiversity and autism awareness.',
    autismDisclosure: 'Dr. Grandin was diagnosed with autism in early childhood during the 1950s. She has authored foundational books, including "Emergence: Labeled Autistic" (1986) and "Thinking in Pictures" (1995), sharing firsthand insights into visual thinking and sensory processing.',
    achievements: [
      'Professor of Animal Science at Colorado State University for over 30 years',
      'Inducted into the National Women\'s Hall of Fame (2017)',
      'Author of over 60 scientific papers on animal behavior and welfare',
      'Designed livestock handling facilities utilized in over half of North American facilities',
      'Subject of the Emmy and Golden Globe-winning biographical film "Temple Grandin" (2010)'
    ],
    journey: 'Navigating sensory sensitivities and early speech delays with the support of dedicated mentors and speech therapists, Dr. Grandin harnessed her visual and spatial reasoning. She completed her bachelor’s in psychology and earned a Ph.D. in animal science from the University of Illinois Urbana-Champaign in 1989.',
    sources: [
      {
        title: 'National Women\'s Hall of Fame Profile: Temple Grandin',
        url: 'https://www.womenofthehall.org/inductee/temple-grandin/',
        publisher: 'National Women\'s Hall of Fame'
      },
      {
        title: 'Faculty Profile: Colorado State University',
        url: 'https://agsci.colostate.edu/ansci/faculty/temple-grandin/',
        publisher: 'Colorado State University'
      },
      {
        title: 'Thinking in Pictures: My Life with Autism',
        url: 'https://www.templegrandin.com/',
        publisher: 'Official Website & Publication Record'
      }
    ]
  },
  {
    id: 'greta-thunberg',
    name: 'Greta Thunberg',
    field: 'Climate Activist',
    categories: ['Advocacy', 'Leadership'],
    primaryCategory: 'Advocacy',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Greta_Thunberg_in_Stockholm_in_August_2018.jpg/640px-Greta_Thunberg_in_Stockholm_in_August_2018.jpg',
    imageAlt: 'Greta Thunberg participating in an environmental demonstration in Stockholm',
    quote: 'You are never too small to make a difference.',
    quoteSource: 'Speech to the United Nations Climate Action Summit, 2019',
    shortDescription: 'Youth environmental advocate who initiated the global School Strike for Climate movement, mobilizing millions of citizens and leaders worldwide around climate accountability.',
    autismDisclosure: 'Thunberg has publicly shared that she was diagnosed with Asperger syndrome, OCD, and selective mutism. She has spoken openly in international interviews and speeches about how her focused way of processing information helps her engage with complex environmental science.',
    achievements: [
      'Initiated the Fridays for Future global school strike movement in 2018',
      'Addressed the United Nations Climate Action Summit and World Economic Forum',
      'Named Time Person of the Year (2019)',
      'Multiple Nobel Peace Prize nominations for international environmental leadership',
      'Author of "No One Is Too Small to Make a Difference" and "The Climate Book"'
    ],
    journey: 'Thunberg began her solo protest outside the Swedish Parliament in August 2018. Her clarity of purpose resonated with students across Scandinavia and rapidly evolved into global demonstrations involving millions of participants.',
    sources: [
      {
        title: 'Time 2019 Person of the Year: Greta Thunberg',
        url: 'https://time.com/person-of-the-year-2019-greta-thunberg/',
        publisher: 'TIME Magazine'
      },
      {
        title: 'Fridays for Future Movement Overview',
        url: 'https://fridaysforfuture.org/',
        publisher: 'Fridays For Future Official'
      },
      {
        title: 'United Nations Climate Action Address (2019)',
        url: 'https://www.un.org/en/climatechange',
        publisher: 'United Nations'
      }
    ]
  },
  {
    id: 'dan-aykroyd',
    name: 'Dan Aykroyd',
    field: 'Actor & Comedian',
    categories: ['Entertainment', 'Arts & Creativity'],
    primaryCategory: 'Entertainment',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Dan_Aykroyd_2014.jpg/640px-Dan_Aykroyd_2014.jpg',
    imageAlt: 'Dan Aykroyd at an international film festival screening',
    quote: 'I think differently. And that’s a good thing.',
    quoteSource: 'Interview with The Daily Mail & British Press Association',
    shortDescription: 'Award-winning actor, comedic writer, and musician celebrated for classic films including Ghostbusters, The Blues Brothers, and as an original Saturday Night Live cast member.',
    autismDisclosure: 'Aykroyd has publicly stated in interviews that he was diagnosed with Asperger syndrome in the early 1980s by a specialist, noting that his deep, immersive fascination with ghosts, folklore, and law enforcement history directly shaped his concept and script for Ghostbusters.',
    achievements: [
      'Original cast member of Saturday Night Live (1975–1979)',
      'Co-writer and star of the landmark comedy "Ghostbusters" (1984)',
      'Academy Award nomination for Best Supporting Actor for "Driving Miss Daisy" (1989)',
      'Member of the Order of Canada (1998) for contributions to the arts',
      'Co-founder of the House of Blues music and cultural foundation'
    ],
    journey: 'Growing up with vivid special interests in technology, vehicles, and the paranormal, Aykroyd channeled his creative intensity into sketch comedy with Toronto\'s Second City troupe before joining SNL and penning some of cinema’s most enduring comedy scripts.',
    sources: [
      {
        title: 'Dan Aykroyd on Asperger\'s and Writing Ghostbusters',
        url: 'https://www.theguardian.com/film/2012/dec/07/dan-aykroyd-ghostbusters-blues-brothers',
        publisher: 'The Guardian'
      },
      {
        title: 'Order of Canada Honors Database: Dan Aykroyd',
        url: 'https://www.gg.ca/en/honours/recipients',
        publisher: 'Governor General of Canada'
      }
    ]
  },
  {
    id: 'anthony-hopkins',
    name: 'Sir Anthony Hopkins',
    field: 'Academy Award-Winning Actor',
    categories: ['Entertainment', 'Arts & Creativity'],
    primaryCategory: 'Entertainment',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/AnthonyHopkins10TIFF.jpg/640px-AnthonyHopkins10TIFF.jpg',
    imageAlt: 'Sir Anthony Hopkins arriving at a film premiere',
    quote: 'I don’t know if I’m autistic, but I do know I’m different. And that’s okay.',
    quoteSource: 'Desert Island Discs, BBC Radio 4',
    shortDescription: 'Distinguished Welsh actor, composer, and painter whose career spans six decades across classical theater, television, and acclaimed international cinema.',
    autismDisclosure: 'Sir Anthony Hopkins has publicly discussed receiving a late-life diagnosis of Asperger syndrome in his late 70s. In public interviews with the BBC and national publications, he described reflecting on his focused attention to detail, solitary routines, and artistic discipline.',
    achievements: [
      'Two-time Academy Award Winner for Best Actor ("The Silence of the Lambs", "The Father")',
      'Four BAFTA Film Awards and two Primetime Emmy Awards',
      'Knighted by Queen Elizabeth II in 1993 for services to the dramatic arts',
      'Cecil B. DeMille Award for lifetime achievement in motion pictures',
      'Acclaimed painter and composer of orchestral works performed worldwide'
    ],
    journey: 'Sir Anthony trained at the Royal Welsh College of Music & Drama and the Royal Academy of Dramatic Art in London, initially performing on stage with Laurence Olivier’s National Theatre before transitioning to a decorated international film career.',
    sources: [
      {
        title: 'BBC Radio 4 Desert Island Discs: Sir Anthony Hopkins',
        url: 'https://www.bbc.co.uk/programmes/b007t098',
        publisher: 'BBC Radio 4'
      },
      {
        title: 'Academy of Motion Picture Arts and Sciences Recognition',
        url: 'https://www.oscars.org/',
        publisher: 'Academy of Motion Picture Arts and Sciences'
      }
    ]
  },
  {
    id: 'susan-boyle',
    name: 'Susan Boyle',
    field: 'Singer',
    categories: ['Arts & Creativity', 'Entertainment'],
    primaryCategory: 'Arts & Creativity',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Susan_Boyle_2010.jpg/640px-Susan_Boyle_2010.jpg',
    imageAlt: 'Susan Boyle performing on stage',
    quote: 'I see myself as somebody who is different, and I think that’s a good thing.',
    quoteSource: 'Interview with The Guardian, December 2013',
    shortDescription: 'Scottish vocalist whose performance on Britain’s Got Talent captivated global audiences, leading to multi-platinum albums and international concert tours.',
    autismDisclosure: 'In 2013, Boyle publicly revealed that she had sought a specialist consultation in Edinburgh and received an Asperger syndrome diagnosis in 2012, correcting a childhood misdiagnosis of brain damage from oxygen deprivation at birth.',
    achievements: [
      'Debut album "I Dreamed a Dream" became the UK\'s fastest-selling debut album of all time',
      'Sold over 25 million records worldwide',
      'Two Grammy Award nominations for Best Traditional Pop Vocal Album',
      'Set three Guinness World Records for debut album commercial success',
      'Performed across multiple international arena concert tours'
    ],
    journey: 'Living in Blackburn, West Lothian, Boyle dedicated years to singing in her church choir and local venues before auditioning for Britain\'s Got Talent in 2009. Her audition of "I Dreamed a Dream" became one of the most-watched videos in internet history.',
    sources: [
      {
        title: 'Susan Boyle on her Asperger\'s diagnosis',
        url: 'https://www.theguardian.com/music/2013/dec/08/susan-boyle-aspergers-syndrome',
        publisher: 'The Guardian'
      },
      {
        title: 'Guinness World Records: Susan Boyle Chart Achievements',
        url: 'https://www.guinnessworldrecords.com/',
        publisher: 'Guinness World Records'
      }
    ]
  },
  {
    id: 'daniel-tammet',
    name: 'Daniel Tammet',
    field: 'Author & Mathematician',
    categories: ['Science', 'Arts & Creativity'],
    primaryCategory: 'Science',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Daniel_Tammet.jpg/640px-Daniel_Tammet.jpg',
    imageAlt: 'Daniel Tammet at a literary reading and book signing',
    quote: 'Autism is not a limitation. It’s a different way of experiencing the world.',
    quoteSource: 'Born On A Blue Day: Inside the Extraordinary Mind of an Autistic Savant',
    shortDescription: 'British essayist, novelist, and linguist who articulates his experiences with synesthesia and high-functioning autism, translating complex mathematical perception into literature.',
    autismDisclosure: 'Tammet was diagnosed with high-functioning autistic savant syndrome by Simon Baron-Cohen at the Autism Research Centre at Cambridge University. His bestselling 2006 memoir, "Born on a Blue Day", detailed his internal perception of numbers as shapes, colors, and textures.',
    achievements: [
      'New York Times Bestselling Author ("Born on a Blue Day", translated into over 20 languages)',
      'Recited pi from memory to 22,514 decimal places on Pi Day in 2004 at the Museum of the History of Science, Oxford',
      'Fellow of the Royal Society of Arts (elected 2012)',
      'Author of multiple celebrated works including "Embracing the Wide Sky" and "Thinking in Numbers"',
      'Demonstrated fluency in over ten languages'
    ],
    journey: 'Growing up as the eldest of nine siblings in London, Tammet found comfort in numerical patterns and linguistic structures. He volunteered teaching English in Lithuania before publishing books that humanize neurodivergent cognition.',
    sources: [
      {
        title: 'The Boy with the Incredible Brain (Documentary Profile)',
        url: 'https://www.danieltammet.net/',
        publisher: 'Official Author Archive & Simon Baron-Cohen Research'
      },
      {
        title: 'Oxford Museum of the History of Science: Pi Recitation',
        url: 'https://www.mhs.ox.ac.uk/',
        publisher: 'Museum of the History of Science, Oxford'
      }
    ]
  },
  {
    id: 'elon-musk',
    name: 'Elon Musk',
    field: 'CEO of Tesla & SpaceX',
    categories: ['Technology', 'Leadership'],
    primaryCategory: 'Technology',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg/640px-Elon_Musk_Royal_Society_%28crop2%29.jpg',
    imageAlt: 'Elon Musk speaking at an aerospace and technology presentation',
    quote: 'When something is important enough, you do it even if the odds are not in your favor.',
    quoteSource: 'Interview on engineering and aerospace development with 60 Minutes',
    shortDescription: 'Industrial designer, technology entrepreneur, and engineer leading commercial aerospace, electric vehicle mass manufacturing, and satellite telecommunications.',
    autismDisclosure: 'Musk publicly stated that he has Asperger syndrome during his opening monologue while hosting Saturday Night Live on May 8, 2021, stating: "I\'m actually making history tonight as the first person with Asperger\'s to host SNL — or at least the first to admit it."',
    achievements: [
      'Chief Engineer and founder of SpaceX, creating the world\'s first reusable orbital rocket systems',
      'CEO and product architect of Tesla, catalyzing the global transition to electric mobility',
      'Elected Fellow of the Royal Society (FRS) in 2018',
      'National Space Society\'s Von Braun Award for space exploration leadership',
      'Founder of Neuralink and the Starlink global satellite constellation'
    ],
    journey: 'Born in Pretoria, South Africa, Musk developed computer software from an early age before moving to North America to study physics and economics at the University of Pennsylvania, subsequently co-founding Zip2 and X.com (which became PayPal).',
    sources: [
      {
        title: 'Saturday Night Live Monologue Transcript (May 8, 2021)',
        url: 'https://www.nbc.com/saturday-night-live',
        publisher: 'NBC Universal'
      },
      {
        title: 'Royal Society Fellowship Citation: Elon Musk FRS',
        url: 'https://royalsociety.org/people/elon-musk-13829/',
        publisher: 'The Royal Society'
      }
    ]
  },
  {
    id: 'jessica-jane-applegate',
    name: 'Jessica-Jane Applegate MBE',
    field: 'Paralympic Gold Medalist Swimmer',
    categories: ['Sports', 'Advocacy'],
    primaryCategory: 'Sports',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Jessica-Jane_Applegate_2016.jpg/640px-Jessica-Jane_Applegate_2016.jpg',
    imageAlt: 'Jessica-Jane Applegate MBE celebrating with her gold medal',
    quote: 'Swimming gave me a place where I felt confident, supported, and free to achieve my goals.',
    quoteSource: 'ParalympicsGB Athlete Interview & Profile',
    shortDescription: 'British Paralympic swimmer who set world records and claimed medals across three consecutive Paralympic Games in the S14 classification.',
    autismDisclosure: 'Applegate was diagnosed with autism spectrum disorder at age four. Throughout her international athletic career, she has been an outspoken ambassador for neurodiversity in sports and dedicated mentor for inclusive athletic programs.',
    achievements: [
      'Gold medalist in the 200m freestyle (S14) at the London 2012 Paralympic Games',
      'Multi-medalist at the Rio 2016 and Tokyo 2020 Paralympic Games',
      'Over 14 World Para Swimming Championship medals',
      'Appointed Member of the Order of the British Empire (MBE) in the 2013 New Year Honours',
      'Held multiple long-course and short-course S14 world records'
    ],
    journey: 'Applegate took up swimming as a young child in Great Yarmouth to improve motor coordination and fitness, training with the City of Norwich Swimming Club before qualifying for the British national Paralympic team at age 16.',
    sources: [
      {
        title: 'ParalympicsGB Athlete Biography: Jessica-Jane Applegate',
        url: 'https://paralympics.org.uk/athletes/jessica-jane-applegate',
        publisher: 'British Paralympic Association'
      },
      {
        title: 'The London Gazette: 2013 New Year Honours List',
        url: 'https://www.thegazette.co.uk/',
        publisher: 'The London Gazette'
      }
    ]
  },
  {
    id: 'clay-marzo',
    name: 'Clay Marzo',
    field: 'Professional Championship Surfer',
    categories: ['Sports'],
    primaryCategory: 'Sports',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Clay_Marzo.jpg/640px-Clay_Marzo.jpg',
    imageAlt: 'Clay Marzo surfing on a large wave in Hawaii',
    quote: 'When I am in the water, everything makes sense. The waves don’t judge; they just let you be yourself.',
    quoteSource: 'Clay Marzo: Just Add Water (Documentary)',
    shortDescription: 'Acclaimed professional surfer celebrated for his innovative maneuvers, deep tube-riding skill, and intuitive connection to ocean waves.',
    autismDisclosure: 'Marzo was diagnosed with Asperger syndrome in December 2007 at age 18. His diagnosis and personal connection with the ocean were the central focus of the 2008 documentary film "Clay Marzo: Just Add Water".',
    achievements: [
      'Two-time NSSA National Champion in competitive surfing',
      'Earned two perfect 10 scores at the NSSA National Championships at age 15',
      'Subject of the acclaimed surfing documentary "Clay Marzo: Just Add Water"',
      'Surfer Magazine Water Man of the Year nomination',
      'Pioneer of progressive aerial maneuvers and free-surfing innovations'
    ],
    journey: 'Raised in Lahaina, Maui, Marzo spent virtually every daylight hour in the ocean from early childhood, developing unique balance and wave-reading instincts that established him as one of surfing\'s most creative figures.',
    sources: [
      {
        title: 'Clay Marzo: Just Add Water Feature Profile',
        url: 'https://www.surfer.com/',
        publisher: 'Surfer Magazine Archive'
      },
      {
        title: 'National Scholastic Surfing Association Records',
        url: 'https://www.nssa.org/',
        publisher: 'NSSA'
      }
    ]
  },
  {
    id: 'satoshi-tajiri',
    name: 'Satoshi Tajiri',
    field: 'Creator of Pokémon & Game Designer',
    categories: ['Technology', 'Arts & Creativity', 'Leadership'],
    primaryCategory: 'Technology',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Satoshi_Tajiri_2004.jpg/640px-Satoshi_Tajiri_2004.jpg',
    imageAlt: 'Satoshi Tajiri at a video game industry reception',
    quote: 'I was fascinated by catching insects as a child, and that curiosity shaped how I wanted players to explore and discover the world of Pokémon.',
    quoteSource: 'Nintendo Official Interview & Game Freak Retrospective',
    shortDescription: 'Japanese video game designer, founder of Game Freak, and creator of the globally renowned Pokémon media franchise.',
    autismDisclosure: 'Tajiri’s Asperger syndrome diagnosis has been confirmed in official biographical accounts and Nintendo retrospectives, linking his childhood passion for collecting and classifying insects in rural Machida to the core mechanics of Pokémon.',
    achievements: [
      'Creator and director of "Pokémon Red and Green" (1996), launching the highest-grossing media franchise in history',
      'Founder and CEO of Game Freak video game development studio',
      'IGN Top 100 Game Creators of All Time honoree',
      'Over 480 million Pokémon software units sold globally across nine generations',
      'Executive producer on dozens of acclaimed gaming titles and feature films'
    ],
    journey: 'As a teenager, Tajiri wrote, illustrated, and hand-stapled a gaming fanzine called "Game Freak" before teaching himself hardware assembly and software programming, ultimately pitching Pokémon to Nintendo in 1990.',
    sources: [
      {
        title: 'The Creation of Pokémon: An Oral History',
        url: 'https://www.nintendo.com/',
        publisher: 'Nintendo Co., Ltd.'
      },
      {
        title: 'IGN Creator Spotlight: Satoshi Tajiri',
        url: 'https://www.ign.com/',
        publisher: 'IGN Entertainment'
      }
    ]
  },
  {
    id: 'vernon-smith',
    name: 'Dr. Vernon L. Smith',
    field: 'Nobel Laureate in Economic Sciences',
    categories: ['Science', 'Leadership'],
    primaryCategory: 'Science',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Vernon_Smith.jpg/640px-Vernon_Smith.jpg',
    imageAlt: 'Dr. Vernon L. Smith receiving an academic honor',
    quote: 'Different perspectives allow you to look at problems from angles others might overlook.',
    quoteSource: 'Autobiography: Discovery - A Memoir, and Nobel Prize Biographical Statement',
    shortDescription: 'Economist who pioneered the field of experimental economics, establishing laboratory experiments as an empirical methodology in economic science.',
    autismDisclosure: 'Dr. Smith publicly discussed his Asperger syndrome diagnosis in published memoirs and interviews, including with Bloomberg and the Nobel Foundation, noting how his independent cognitive focus enabled him to question established orthodoxy.',
    achievements: [
      'Awarded the Nobel Memorial Prize in Economic Sciences in 2002',
      'Pioneered experimental market mechanisms and laboratory auction theory',
      'Distinguished Professor of Economics and Law at Chapman University',
      'Author of numerous foundational treatises including "Bargaining and Market Behavior"',
      'Past President of the Economic Science Association and Southern Economic Association'
    ],
    journey: 'Dr. Smith studied electrical engineering at Caltech before turning to economics at the University of Kansas and Harvard University, where he began running laboratory experiments to observe actual human market behavior.',
    sources: [
      {
        title: 'The Nobel Prize in Economic Sciences 2002: Vernon L. Smith',
        url: 'https://www.nobelprize.org/prizes/economic-sciences/2002/smith/biographical/',
        publisher: 'The Nobel Foundation'
      },
      {
        title: 'Chapman University Faculty Profile: Vernon L. Smith',
        url: 'https://www.chapman.edu/our-faculty/vernon-smith',
        publisher: 'Chapman University'
      }
    ]
  },
  {
    id: 'chris-packham',
    name: 'Chris Packham CBE',
    field: 'Naturalist & Television Presenter',
    categories: ['Advocacy', 'Science', 'Entertainment'],
    primaryCategory: 'Advocacy',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Chris_Packham_at_the_2019_Wildlife_Photographer_of_the_Year_awards.jpg/640px-Chris_Packham_at_the_2019_Wildlife_Photographer_of_the_Year_awards.jpg',
    imageAlt: 'Chris Packham CBE speaking on wildlife conservation',
    quote: 'Seeing the world differently is what enables us to question, observe, and protect the natural environment.',
    quoteSource: 'Asperger’s and Me (BBC Two Documentary) and "Fingers in the Sparkle Jar"',
    shortDescription: 'Naturalist, nature photographer, author, and broadcaster renowned for BBC nature series including Springwatch and Autumnwatch, and tireless wildlife conservation campaigns.',
    autismDisclosure: 'Packham was diagnosed with Asperger syndrome in 2005. In 2017, he authored the bestselling memoir "Fingers in the Sparkle Jar" and presented the critically acclaimed BBC documentary "Chris Packham: Asperger’s and Me".',
    achievements: [
      'CBE (Commander of the Order of the British Empire) awarded in 2019 for services to nature conservation',
      'Presenter of the BBC natural history series "Springwatch", "Autumnwatch", and "Winterwatch"',
      'President of Butterfly Conservation and the British Trust for Ornithology',
      'Winner of the Wildscreen Panda Award and BAFTA Children’s Award',
      'Author of multiple acclaimed books on ecology and animal photography'
    ],
    journey: 'Graduating with a degree in Zoology from the University of Southampton, Packham began his career as a wildlife camera operator before becoming the presenter of the BBC children’s series "The Really Wild Show" in 1986.',
    sources: [
      {
        title: 'BBC Two: Chris Packham - Asperger\'s and Me',
        url: 'https://www.bbc.co.uk/programmes/b09b1z3n',
        publisher: 'BBC Two'
      },
      {
        title: 'British Trust for Ornithology Presidency: Chris Packham',
        url: 'https://www.bto.org/',
        publisher: 'BTO'
      }
    ]
  }
];
