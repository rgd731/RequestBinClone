DROP TABLE requests;
DROP TABLE bin;

CREATE TABLE bin (
id serial PRIMARY KEY,
bin_key varchar(50) UNIQUE NOT NULL
);

CREATE TABLE requests (
id serial PRIMARY KEY,
received_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
mongo_doc_id varchar,
bin_id int REFERENCES bin(id));

INSERT INTO bin(bin_key)
VALUES
('1'),
('2'),
('3');

INSERT INTO requests (received_at, mongo_doc_id, bin_id)
VALUES
(NOW(), '66e8ad86c7edb500123d36a4', 1),
(NOW(), '66e8d717250db54272b45b83', 1),
(NOW(), 'test3', 2);

-- SELECT 
--     bin.url,
--     requests.request
-- FROM 
--     bin
-- LEFT JOIN 
--     requests 
-- ON 
--     bin.id = requests.bin_id;