import client from "../../config/db.config.js";
import ApplicationError from "../../errorhandlers/application.errorhandler.js";

export const addCart = async (userId, productId, quantity) => {
    try {
        // Check if the product is already in the cart
        const checkQuery = {
            text: 'SELECT * FROM carts WHERE user_id = $1 AND product_id = $2',
            values: [userId, productId],
        };
        
        const checkResult = await client.query(checkQuery);

        if (checkResult.rows.length > 0) {
            // If product exists, update the quantity
            const updateQuery = {
                text: 'UPDATE carts SET quantity = quantity + $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
                values: [quantity, userId, productId],
            };
            const updateResult = await client.query(updateQuery);
            const updatedItem = updateResult.rows[0];
            return updatedItem;
        } else {
            // If product does not exist, insert the new product into the cart
            const insertQuery = {
                text: 'INSERT INTO carts(user_id, product_id, quantity, created_at) VALUES($1, $2, $3, NOW()) RETURNING *',
                values: [userId, productId, quantity],
            };
            const insertResult = await client.query(insertQuery);
            const newItem = insertResult.rows[0];
            return newItem;
        }
    } catch (error) {
        console.log(error);
        throw new ApplicationError("Failed to add or update cart", 500);
    }
};
