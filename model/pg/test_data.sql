DROP TABLE events;
DROP TABLE bin;

CREATE TABLE bin (
id serial PRIMARY KEY,
bin_key varchar(50) UNIQUE NOT NULL
);

CREATE TABLE events (
id serial PRIMARY KEY,
received_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
mongo_doc_id varchar,
bin_id int REFERENCES bin(id));


INSERT INTO bin(bin_key) 
VALUES ('eerWS'),
        ('eerW44S'),
        ('zerW44S'),
        ('dg4s5d');

INSERT INTO events (mongo_doc_id, bin_id)
VALUES ('g-98g7s9', 5), 
        ('f-0fdf9h0', 6), 
        ('d-f6h546', 7), 
        ('x-c5x5cb4', 8);


SELECT 
    bin.bin_key,
    events.mongo_doc_id
FROM 
    bin
LEFT JOIN 
    events 
ON 
    bin.id = events.bin_id;