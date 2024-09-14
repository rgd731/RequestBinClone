CREATE TABLE bin (
id serial PRIMARY KEY,
url varchar(50) UNIQUE NOT NULL);

CREATE TABLE requests (
id serial PRIMARY KEY,
request varchar(30),
bin_id int REFERENCES bin(id));


INSERT INTO bin(url)
VALUES ('https://eerWS@test.com'),
        ('https://eerW44S@test.com'),
        ('https://zerW44S@test.com');

INSERT INTO requests (request, bin_id)
VALUES ('test1', 1), ('test2', 4), ('test3', 1), ('test4', 3)


SELECT 
    bin.url,
    requests.request
FROM 
    bin
LEFT JOIN 
    requests 
ON 
    bin.id = requests.bin_id;