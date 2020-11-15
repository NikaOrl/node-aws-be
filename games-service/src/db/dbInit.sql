CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE product
(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    description text,
    price integer,
    image text
);

CREATE TABLE stock
(
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id uuid,
    count integer,
    FOREIGN KEY ("product_id") REFERENCES "product" ("id") ON DELETE CASCADE
);

INSERT INTO product
    (title, description, price, image)
VALUES
    (
        'Assassins Creed Valhalla', 
        'In Assassins Creed Valhalla, become Eivor, a legendary Viking raider on a quest for glory. Explore a dynamic and beautiful open world set against the brutal backdrop of England’s Dark Ages. Raid your enemies, grow your settlement, and build your political power in the quest to earn a place among the gods in Valhalla.', 
        25, 
        'https://store-images.s-microsoft.com/image/apps.33999.14585440003614248.9f7109bf-73f7-4bc7-ba61-1eeb006d905a.cc10ed66-57c3-44ac-bf97-61a892172f19'
    ),
    (
        'Assassin’s Creed®Odyssey', 
        'Write your own epic odyssey and become a legendary Spartan hero in Assassin’s Creed® Odyssey, an inspiring adventure where you must forge your destiny and define your own path in a world on the brink of tearing itself apart. Influence how history unfolds as you experience a rich and ever-changing world shaped by your decisions.',
        45, 
        'https://store-images.s-microsoft.com/image/apps.2894.71972716530068101.68cb6eed-71f2-4211-8ace-94c4035f8759.ba8996ce-bce7-4206-bfbf-c0934994c82a'
    ),
    (
        'Watch Dogs:® Legion',
        'Mass surveillance, private militaries controlling the streets, organized crime... Enough! Its time to end oppression. Recruit a well-rounded resistance to overthrow the opportunists ruining this once-great city. The fate of London lies with you.',
        20, 
        'https://store-images.s-microsoft.com/image/apps.18275.65664549497403424.a741b357-ecc5-4fa6-bfad-4f3a95f27506.87ae0e0d-537a-4730-a6bb-c2fbd19ae709'
    ),
    (
        'Grand Theft Auto V',
        'When a young street hustler, a retired bank robber and a terrifying psychopath land themselves in trouble, they must pull off a series of dangerous heists to survive in a city in which they can trust nobody, least of all each other.',
        10, 
        'https://store-images.s-microsoft.com/image/apps.10158.67002547918942251.8825a726-0485-4a54-b69e-dd0be97bde36.9ba73a90-51fb-4337-8bce-4b9de110dbac'
    ),
    (
        'Minecraft',
        'Minecraft is a game about placing blocks and going on adventures. Build anything you can imagine with unlimited resources in Creative mode, or go on grand expeditions in Survival, journeying across mysterious lands and into the depths of your own infinite worlds. Will you hide from monsters or craft tools, armor and weapons to fight back? No need to go alone! Share the adventure with friends in split-screen multiplayer and online.',
        10,
        'https://store-images.s-microsoft.com/image/apps.17382.13510798887677013.afcc99fc-bdcc-4b9c-8261-4b2cd93b8845.49beb011-7271-4f15-a78b-422c511871e4'
    ),
    (
        'The Dark Pictures Anthology: Little Hope',
        'The Dark Pictures Anthology is a series of intense, standalone, branching cinematic horror games featuring single and multiplayer modes. Trapped and isolated in the abandoned town of Little Hope, 4 college students and their professor must escape the nightmarish apparitions that relentlessly pursue them through an impenetrable fog.',
        15,
        'https://store-images.s-microsoft.com/image/apps.48111.13682714888089681.bcda43ae-3a99-4c59-8618-af46e694e526.dbb583b3-8471-4836-89b7-4e733048b9ac'
    ),
    (
        'Far Cry 5',
        'Welcome to Hope County, Montana. This idyllic place is home to a community of freedom-loving people - and a fanatical doomsday cult known as The Project at Eden’s Gate. Led by the charismatic prophet Joseph Seed and his devoted siblings – The Heralds - Eden’s Gate has been quietly infiltrating every aspect of daily life in this once-quiet town. When your arrival incites the cult to violently seize control of the region, you must rise up and spark the fires of resistance to liberate a besieged community.',
        20,
        'https://store-images.s-microsoft.com/image/apps.11227.69582963086497758.e1cff2e3-ddf1-42bf-930d-f380ad63f100.38d7bb7c-3e33-471b-b22d-0f0a635832ad'
    ),
    (
        'Red Dead Redemption 2',
        'America, 1899. After a robbery goes wrong in the town of Blackwater, Arthur Morgan and the Van der Linde gang are forced to flee. With federal agents and bounty hunters massing on their heels, the gang must rob, steal and fight their way across America to survive. As deepening internal divisions threaten to tear the gang apart, Arthur must choose between his own ideals and loyalty to the gang who raised him.',
        15,
        'https://store-images.s-microsoft.com/image/apps.34695.68182501197884443.ac728a87-7bc1-4a0d-8bc6-0712072da93c.25816f86-f27c-4ade-ae29-222661145f1f'
    )

INSERT INTO stock
    (product_id, count)
VALUES
    ((SELECT id
        FROM product
        WHERE title = 'Assassins Creed Valhalla'), 10),
    ((SELECT id
        FROM product
        WHERE title = 'Assassin’s Creed®Odyssey'), 5),
    ((SELECT id
        FROM product
        WHERE title = 'Watch Dogs:® Legion'), 5),
    ((SELECT id
        FROM product
        WHERE title = 'Grand Theft Auto V'), 10),
    ((SELECT id
        FROM product
        WHERE title = 'Minecraft'), 10),
    ((SELECT id
        FROM product
        WHERE title = 'The Dark Pictures Anthology: Little Hope'), 5),
    ((SELECT id
        FROM product
        WHERE title = 'Far Cry 5'), 5),
    ((SELECT id
        FROM product
        WHERE title = 'Red Dead Redemption 2'), 10)