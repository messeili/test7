DROP TABLE test7;
CREATE TABLE IF NOT EXISTS test7(
    id SERIAL PRIMARY KEY,
    jokeid VARCHAR(255),
    type VARCHAR(255),
    setup VARCHAR(255),
    punchline VARCHAR(255)
);