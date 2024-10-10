import client from "../../config/db.config.js"; // Import your PostgreSQL client
import ApplicationError from "../../errorhandlers/application.errorhandler.js";

export const newOrder = async (userId) => {
  await client.query("BEGIN"); // Start the transaction

  try {
    // 1. Get cart items of user and calculate the total amount.

    const items = await getTotalAmount(userId, client);
    if (items.length === 0) {
      throw new ApplicationError("No items found in the cart.", 404);
    }

    const finalTotalAmount = items.reduce((acc, item) => {
      const price = parseFloat(item.price);
      const quantity = parseInt(item.quantity, 10);
      return acc + price * quantity;
    }, 0);

    // 2. Create a new order record.
    const orderQuery = {
      text: "INSERT INTO orders (user_id, total_price, created_at) VALUES ($1, $2, NOW()) RETURNING order_id",
      values: [userId, finalTotalAmount],
    };
    const orderResult = await client.query(orderQuery);
    const orderId = orderResult.rows[0].order_id;

    // 3. Insert data into order_items
    for (let item of items) {
      const orderItemQuery = {
        text: "INSERT INTO order_items (order_id, product_id, quantity, price,totalPrice) VALUES ($1, $2, $3, $4,$5)",
        values: [
          orderId,
          item.product_id,
          item.quantity,
          item.price,
          item.price * item.quantity,
        ],
      };
      await client.query(orderItemQuery);
    }

    // 4. Clear cart items.
    const clearCartQuery = {
      text: "DELETE FROM carts WHERE user_id = $1",
      values: [userId],
    };
    await client.query(clearCartQuery);

    // Commit the transaction.
    await client.query("COMMIT");
    return { success: true, orderId };
  } catch (err) {
    // If an error occurs, abort the transaction.
    await client.query("ROLLBACK");
    throw new Error(err.message);
  }
};

export const fetchOrders = async (userId) => {
  try {
    const query = {
      text: `SELECT 
    u.name AS user_name, 
    u.email, 
    p.name AS product_name, 
    oi.price, 
    o.order_id, 
    o.total_price, 
    o.created_at, 
    o.status
FROM 
    orders o
JOIN 
    users u ON o.user_id = u.user_id
JOIN 
    order_items oi ON o.order_id = oi.order_id
JOIN 
    products p ON oi.product_id = p.product_id
WHERE 
    o.user_id = $1;
`,
      values: [userId],
    };
    const result = await client.query(query);
    if (result.rows.length === 0) {
      throw new ApplicationError("No orders for the User", 404);
    }
    const order = result.rows;
    return order;
  } catch (error) {
    throw error;
  }
};

export const checkoutOrder = async (orderId, userId, paymentMethod) => {
  await client.query("BEGIN"); // Start the transaction

  try {
    // 1. Fetch the order items based on the order_id.
    const orderItemsQuery = {
      text: `
                SELECT oi.product_id, oi.quantity, oi.price
                FROM order_items oi
                WHERE oi.order_id = $1 
            `,
      values: [orderId],
    };
    const orderItemsResult = await client.query(orderItemsQuery);
    const orderItems = orderItemsResult.rows;

    if (orderItems.length === 0) {
      throw new Error("No items found in the order.");
    }

    // 2. Update the stock of each product in the order.
    for (let item of orderItems) {
      const productUpdateQuery = {
        text: "UPDATE products SET stock = stock - $1 WHERE product_id = $2",
        values: [item.quantity, item.product_id],
      };
      await client.query(productUpdateQuery);
    }

    // 3. Insert payment record for the order.
    const paymentQuery = {
      text: "INSERT INTO payments (order_id,user_id,amount, payment_method, payment_status,created_at) VALUES ($1, $2, $3, $4, 'completed', NOW())",
      values: [
        orderId,
        userId,
        orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
        paymentMethod,
      ],
    };
    await client.query(paymentQuery);

    // Update the order status to 'completed'.
    const updateOrderQuery = {
      text: "UPDATE orders SET status = 'completed' WHERE order_id = $1",
      values: [orderId],
    };
    await client.query(updateOrderQuery);

    const clearOrderItem = {
        text:`DELETE FROM order_items WHERE order_id=$1`,values:[orderId]
    }
    await client.query(clearOrderItem);
    // Commit the transaction.
    await client.query("COMMIT");
    return { success: true, message: "Order checkout completed." };
  } catch (err) {
    // If an error occurs, abort the transaction.
    await client.query("ROLLBACK");
    throw new Error(err.message);
  }
};


// calculating total price of a product
async function getTotalAmount(userId, client) {
  const totalAmountQuery = {
    text: `
            SELECT ci.product_id, ci.quantity, p.price,
                   (p.price * ci.quantity) AS total_amount
            FROM carts ci
            JOIN products p ON ci.product_id = p.product_id  -- Using product_id from products table
            WHERE ci.user_id = $1
        `,
    values: [userId],
  };

  const result = await client.query(totalAmountQuery);
  return result.rows; // Return the result rows
}
