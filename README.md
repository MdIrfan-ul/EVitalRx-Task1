# E-Commerce Website Development Task

## Task Description

The task is to develop an E-Commerce website similar to platforms like **Amazon** or **Flipkart**. You are expected to build APIs and a database schema to support functionalities such as user signup, login, adding items to a cart, placing orders, and more.

### Task Overview:
- **Backend**: Build RESTful APIs using Node.js and Express.
- **Database**: Design database schema using PostgreSQL or another relational database.
- **Authentication**: Implement JWT-based authentication.

---

## Technologies Used
[![Languages Used](https://skillicons.dev/icons?i=js,nodejs,express,postgresql,postman,git,github)](https://skillicons.dev)

- **Backend**: Node.js, Express.js
- **DataBase**:Postgresql
- **API Testing**:Postman

## APIs to Develop

### 1. **Signup**
   - **Method**: `POST`
   - **Endpoint**: `/api/user/signup`
   - **Description**: Allows new users to sign up by providing required details.
   - **Request Body**:
     ```json
     {
       "name": "John Doe",
       "email": "johndoe@example.com",
       "password": "password123"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "message": "User registered successfully"
     }
     ```

### 2. **Login**
   - **Method**: `POST`
   - **Endpoint**: `/api/user/login`
   - **Description**: Allows existing users to log in.
   - **Request Body**:
     ```json
     {
       "email": "johndoe@example.com",
       "password": "password123"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "token": "jwt_token_here"
     }
     ```

### 3. **Add to Cart**
   - **Method**: `POST`
   - **Endpoint**: `/api/carts/add`
   - **Description**: Adds a product to the user's cart.
   - **Request Body**:
     ```json
     {
       "productId": 1,
       "quantity": 2
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "message": "Product added to cart"
     }
     ```

### 4. **Place Order**
   - **Method**: `POST`
   - **Endpoint**: `/api/orders`
   - **Description**: Places an order for all items in the cart.
   - **Request Body**:
     ```json
     {
       "userId": 1
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "orderId": 123
     }
     ```

### 5. **Get Orders**
   - **Method**: `GET`
   - **Endpoint**: `/api/orders`
   - **Description**: Retrieves all orders placed by the user.
   - **Query Parameter**:
     - `userId` (required)
   - **Response**:
     ```json
     {
       "orders": [
         {
           "orderId": 1,
           "totalPrice": 100.50,
           "status": "completed"
         }
       ]
     }
     ```

### 6. **Checkout**
   - **Method**: `POST`
   - **Endpoint**: `/api/orders/checkout`
   - **Description**: Completes the payment for the placed order and updates the stock.
   - **Request Body**:
     ```json
     {
       "orderId": 123,
       "paymentMethod": "credit_card"
     }
     ```
   - **Response**:
     ```json
     {
       "success": true,
       "message": "Payment completed successfully"
     }
     ```

### 7. **Logout**
   - **Method**: `GET`
   - **Endpoint**: `/api/user/logout`
   - **Description**: Logs out the current user.
   - **Response**:
     ```json
     {
       "success": true,
       "message": "Logged out successfully"
     }
     ```

---

## Database Schema

The following tables should be created in the database:

### 1. **Users Table**:
   - **Columns**: `user_id`, `name`, `email`, `password`

### 2. **Products Table**:
   - **Columns**: `product_id`, `name`, `description`, `price`, `stock`

### 3. **Carts Table**:
   - **Columns**: `cart_id`, `user_id`, `product_id`, `quantity`

### 4. **Orders Table**:
   - **Columns**: `order_id`, `user_id`, `total_price`, `created_at`, `status`

### 5. **Order Items Table**:
   - **Columns**: `order_item_id`, `order_id`, `product_id`, `quantity`,`price`,`totalPrice`

### 6. **Payments Table**:
   - **Columns**: `payment_id`, `order_id`, `amount`, `payment_method`, `status`

---

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/MdIrfan-ul/EVitalRx-Task1.git
```
2.Install the dependencies:
```bash
npm install
```
3.Set up environment variables in .env file:
```bash
PORT=<your_port_number eg.8000>
JWT_SECRET=<your_jwt_secret>
```
4. set up environment variables in db.env file:
```bash
DATABASE_NAME=<your_database_name eg.ecommerce>
DATABASE_USERNAME=<your_database_username>
DATABASE_HOST=<your_database_host default:localhost>
DATABASE_PASS=<your_database_pass>
DATABASE_PORT=<your_database_port default:5432>
```

5.Start the server:
```bash
npm start
```