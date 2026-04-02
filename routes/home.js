module.exports = (app) => {
  app.get('/', (req, res) => {
    let success; let warning = app.helpers.msg(req);
    let categories; let products;
    const connection = app.dao.connectionFactory();
    const categoriesDAO = new app.dao.categoriesDAO(connection);
    const productsDAO = new app.dao.productsDAO(connection);

    categoriesDAO.list()
        .then((result) => categories = result)
        .catch((err) => warning = 'Không thể tải danh mục');
    productsDAO.list(9)
        .then((result) => products = result)
        .catch((err) => warning = 'Không thể tải sản phẩm');

    setTimeout(() => {
      res.status(200).render('home/index', {
        title: 'Trang chủ',
        categories, products,
        success, warning,
        user: req.session['user'],
      });
    }, 100);
  });
};
