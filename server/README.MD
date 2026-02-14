database for this project in postgres SQL

CREATE TABLE tokens (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    token_number VARCHAR(20) 
        GENERATED ALWAYS AS ('TKN-' || id::text) STORED,
    status VARCHAR(10) CHECK (status IN ('WAITING', 'ONGOING', 'COMPLETED')) 
        DEFAULT 'WAITING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/.env
PORT = 3000

CONNECTION_STRING="connection string of postgres db"
