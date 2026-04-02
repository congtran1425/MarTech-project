class productsDAO {
  constructor(connection) {
    this.connection = connection;
  }
  list(limit=null) {
    return new Promise((resolve, reject) => {
      if (limit) {
        this.connection
            .query('select * from products LIMIT ?', limit,
                (err, result) => {
                  if (err) return reject(err);
                  return resolve(result);
                }
            );
      }
      // End Queries for limits
      else {
        this.connection
            .query('select * from products',
                (err, result) => {
                  if (err) return reject(err);
                  return resolve(result);
                }
            );
      }
    });
  }
  orderedList(order=null) {
    return new Promise((resolve, reject) => {
      if (order == 'low-price') {
        this.connection.query('select * from products ORDER BY price ASC',
            (err, result) => {
              if (err) return reject(err);
              return resolve(result);
            });
      }
      this.connection.query('select * from products ORDER BY ?? DESC', order,
          (err, result) => {
            if (err) return reject(err);
            return resolve(result);
          });
    });
  }
  filteredList(filter) {
    return new Promise((resolve, reject) => {

    });
  }
  getById(ids) {
    return new Promise((resolve, reject) => {
      this.connection.query(`select * from products where id in (${ids})`,
          (err, result) => {
            if (err) return reject(err);
            return resolve(result);
          });
    });
  }

  getDetailById(id) {
    return new Promise((resolve, reject) => {
      this.connection.query(
          `select p.*, c.categoryname, g.gendername
           from products p
           left join product_categories c on p.category = c.idcategory
           left join product_genders g on p.gender_id = g.idgender
           where p.id = ?`,
          [id],
          (err, result) => {
            if (err) return reject(err);
            return resolve(result[0]);
          }
      );
    });
  }

  getVariantsByProductId(id) {
    return new Promise((resolve, reject) => {
      this.connection.query(
          `select pv.*, s.size_code, s.size_name, c.color_name, c.color_hex
           from product_variants pv
           left join sizes s on pv.size_id = s.idsize
           left join colors c on pv.color_id = c.idcolor
           where pv.product_id = ?
           order by s.idsize, c.idcolor`,
          [id],
          (err, result) => {
            if (err) return reject(err);
            return resolve(result);
          }
      );
    });
  }
}

module.exports = () => productsDAO;
