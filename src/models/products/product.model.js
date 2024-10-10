import client from "../../config/db.config.js";
import ApplicationError from "../../errorhandlers/application.errorhandler.js";


// fetching products

export const fetchProducts = async () => {
    try {
        // Prepare the query to fetch all products
        const query = { text: 'SELECT * FROM products', values: [] };

        // Execute the query
        const result = await client.query(query);

        // Return the rows from the result
        return result.rows;
    } catch (error) {
        // Throw a custom error if the query fails
        throw new ApplicationError('Failed to fetch products', 500, error);
    }
};