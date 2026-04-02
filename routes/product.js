module.exports = (app) => {
  app.get('/product/:id', (req, res) => {
    let success; let warning = app.helpers.msg(req);
    const productId = req.params.id;

    const connection = app.dao.connectionFactory();
    const productsDao = new app.dao.productsDAO(connection);

    Promise.all([
      productsDao.getDetailById(productId),
      productsDao.getVariantsByProductId(productId),
    ])
        .then(([product, variants]) => {
          if (!product) {
            return res.status(404).render('errors/404', {
              title: 'Không tìm thấy sản phẩm',
            });
          }

          return res.render('product/detail', {
            title: product.name,
            product,
            variants,
            success,
            warning,
            user: req.session['user'],
            csrfToken: req.csrfToken(),
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).render('errors/500', {
            title: 'Lỗi máy chủ',
          });
        });
  });
};
