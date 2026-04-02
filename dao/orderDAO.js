class OrderDAO {
  constructor(connection) {
    this.connection = connection;
  }

  create(order, items) {
    return new Promise((resolve, reject) => {
      this.connection.beginTransaction((err) => {
        if (err) return reject(err);

        this.connection.query(
            'INSERT INTO orders (user_email, full_name, phone, address, note, total_amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
              order.user_email,
              order.full_name,
              order.phone,
              order.address,
              order.note || null,
              order.total_amount,
              order.status || 'pending',
            ],
            (err, result) => {
              if (err) {
                return this.connection.rollback(() => reject(err));
              }

              const orderId = result.insertId;
              if (!items || items.length === 0) {
                return this.connection.commit((err) => {
                  if (err) return reject(err);
                  return resolve(orderId);
                });
              }

              const values = items.map((item) => ([
                orderId,
                item.product_id,
                item.variant_id || null,
                item.quantity,
                item.price,
              ]));

              this.connection.query(
                  'INSERT INTO order_items (order_id, product_id, variant_id, quantity, price) VALUES ?',
                  [values],
                  (err) => {
                    if (err) {
                      return this.connection.rollback(() => reject(err));
                    }
                    return this.connection.commit((err) => {
                      if (err) return reject(err);
                      return resolve(orderId);
                    });
                  }
              );
            }
        );
      });
    });
  }
}

module.exports = () => OrderDAO;
