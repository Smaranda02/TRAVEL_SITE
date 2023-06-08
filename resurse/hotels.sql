
DROP TYPE IF EXISTS food_type;
DROP TYPE IF EXISTS accomodation_type;

CREATE TYPE food_type AS ENUM( 'all inclusive', 'demipensiune', 'breakfast only', 'no food');
CREATE TYPE accomodation_type AS ENUM('hotel', 'apartment', 'villa', 'house');


CREATE TABLE IF NOT EXISTS hotels (
   id serial PRIMARY KEY,
   name VARCHAR(50) UNIQUE NOT NULL,
   price NUMERIC(8,2) NOT NULL,
   location VARCHAR(50) NOT NULL,
   food food_type NOT NULL DEFAULT 'no food',
   confort numeric(1) NOT NULL,
   home_type accomodation_type NOT NULL, 
   description TEXT,
   facilities VARCHAR[],
   free_cancelling BOOLEAN NOT NULL DEFAULT FALSE,
   image VARCHAR(300),
   add_time TIMESTAMP DEFAULT current_timestamp
);

INSERT into hotels (name, price, location, food ,confort, home_type, description,facilities, free_cancelling, image) VALUES 
('Admiral', 40 , 'Antalya', 'all inclusive', 4, 'hotel' , 'Beachfront hotel with private pool', '{"pool", "pool table", "bar", "gym", "tennis court"}', True,'admiral.jpg'),

('Belissima', 40 , 'Dubrovnik, Croatia', 'all inclusive', 2, 'apartment', ' Quiet apartment on the beach with perfect view', '{"pool", "pool table", "bar", "tennis court", "lobby"}', True, 'belissima.jpg'),

('Sunny Thailand', 35, 'Bangkok', 'breakfast only', 2, 'apartment','Try a vacation in the wildness and uniqness of Thailand, sorrounded by nature', '{ "bar", "tennis court"}', False, 'sunny thailand.jpg'),

('Tenerife breeze', 50, 'Santa Cruz de Tenerife', 'breakfast only', 3, 'villa', 'Most popular location in tenerife, with plenty of activities', '{ "bar", "tennis court"}',False, 'tenerife.jpg'),

('Sweet Home Apartment', 29, 'Barcelona', 'no food', 2,'apartment', 'Exotic and quiet, perfect for an escape','{ "bar", "tennis court"}', True, 'sweet home apartment.jpg'),

('Crystal Water', 33, 'Halkidiki', 'demipensiune', 4, 'hotel', 'This resort provides you with all the activities and enetertainement imaginable, 4 stars confort','{ "bar", "tennis court"}', False, 'crystal water.jpg'),

('Amalfi Coast', 43, 'Amalfi Coast, Italy', 'breakfast only', 5, 'villa', 'Most angelic and splendid places in europe, with perfect view of the whole city', '{ "bar", "tennis court"}',True, 'amalfi coast.jpg'),

('La Pescarie', 27, 'Delta Dunarii', 'no food', 2, 'house', 'A warm and welcoming place, with pleasant hosts and very close to port','{ "bar", "tennis court"}',False,'la pescarie.jpg'),

('Dreamy Crete', 39, 'Crete, Greece', 'all inclusive', 3, 'hotel', 'Just a few steps next to the beautiful sea','{ "bar", "tennis court"}', True,'crete.jpg'),

('Dream in the Alps', 42, 'Bavaria, Germany', 'demipensiune', 4, 'apartment','Perfect place for nature enthusiasts who like waking up with a panorama of the Alps','{ "bar", "tennis court"}', False, 'dream in the alps.jpg'),

('Into the wild ', 50, 'Oslo, Norway', 'no food', 2, 'house','You cannot miss fishing and hunting here', '{ "bar", "tennis court"}', False,'Into the wild.jpg');

('Bora bora eden', 50, 'Bora Bora', 'all inclusive', 5, 'hotel','Nature, good food, the sea, simply perfect', '{ "bar", "tennis court"}', True,'bora bora eden.jpg');

('Real Brasil', 20, 'Brasil, Brasilia', 'no food', 2, 'house','Living in the heart of Brasil is one in a lifetime experience', '{ "bar", "tennis court"}', False,'brasil.jpg');

('Dor de casa', 20, 'Bontinda', 'no food', 1, 'house','A glimpse into the simplicity of rural life into the nature', '{ "courtyard", "wood pool"}', False,'romania-village.jpg');

('On the canal', 33, 'Amsterdam, Neatherlands', 'breakfast only', 4, 'hotel','Nature, good food, the sea, simply perfect', '{ "bar", "sauna"}', True,'amsterdam.jpg');
