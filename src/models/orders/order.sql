CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(10) CHECK (status IN ('pending', 'completed')) DEFAULT 'pending'
);
