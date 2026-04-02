module.exports = (app) => {
  app.get('/', async (req, res) => {
    let success;
    let warning = app.helpers.msg(req);
    const connection = app.dao.connectionFactory();
    const categoriesDAO = new app.dao.categoriesDAO(connection);
    const productsDAO = new app.dao.productsDAO(connection);

    try {
      const [categories, products] = await Promise.all([
        categoriesDAO.list(),
        productsDAO.list(9),
      ]);

      return res.status(200).render('home/index', {
        title: '\u0054\u0072\u0061\u006e\u0067\u0020\u0063\u0068\u1ee7',
        categories,
        products,
        success,
        warning,
        user: req.session['user'],
      });
    } catch (err) {
      console.error(err);
      const errCode =
        (err && (err.code || err.errno)) ? String(err.code || err.errno) : 'UNKNOWN';
      warning = '\u004b\u0068\u00f4\u006e\u0067\u0020\u0074\u1ea3\u0069\u0020\u0111\u01b0\u1ee3\u0063\u0020\u0064\u1eef\u0020\u006c\u0069\u1ec7\u0075\u0020\u0028\u0044\u0042\u003a\u0020' +
        errCode +
        '\u0029';
      return res.status(200).render('home/index', {
        title: '\u0054\u0072\u0061\u006e\u0067\u0020\u0063\u0068\u1ee7',
        categories: [],
        products: [],
        success,
        warning,
        user: req.session['user'],
      });
    } finally {
      connection.end();
    }
  });
};
