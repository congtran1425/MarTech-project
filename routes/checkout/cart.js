module.exports = (app) => {
  app.get('/cart', (req, res) => {
    let success;
    let warning = app.helpers.msg(req);
    const connection = app.dao.connectionFactory();
    const productsDao = new app.dao.productsDAO(connection);

    const rawCartIds = req.cookies['productsInCart'];
    const productsInCartIds = rawCartIds
      ? rawCartIds.toString().split(',').filter(Boolean)
      : [];

    const quantityMap = productsInCartIds.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});
    const uniqueIds = Object.keys(quantityMap);

    if (uniqueIds.length === 0) {
      connection.end();
      return res.render('checkout/cart', {
        title: 'Gi\u1ecf h\u00e0ng',
        warning: 'Gi\u1ecf h\u00e0ng c\u1ee7a b\u1ea1n \u0111ang tr\u1ed1ng!',
        csrfToken: req.csrfToken(),
      });
    }

    productsDao.getById(uniqueIds.join(','))
      .then((products) => {
        const productsWithQty = products.map((p) => ({
          ...p,
          quantity: quantityMap[p.id] || 1,
        }));
        return res.render('checkout/cart', {
          title: 'Gi\u1ecf h\u00e0ng',
          success,
          warning,
          products: productsWithQty,
          csrfToken: req.csrfToken(),
        });
      })
      .catch((err) => {
        console.error(err);
        warning = '\u004b\u0068\u00f4\u006e\u0067\u0020\u0074\u1ea3\u0069\u0020\u0111\u01b0\u1ee3\u0063\u0020\u0064\u1eef\u0020\u006c\u0069\u1ec7\u0075';
        return res.render('checkout/cart', {
          title: 'Gi\u1ecf h\u00e0ng',
          warning,
          csrfToken: req.csrfToken(),
        });
      })
      .finally(() => {
        connection.end();
      });
  });

  app.get('/add-to-cart/:id', (req, res) => {
    const id = req.params.id;
    const redirectTo = req.header('Referer') || '/';
    const current = req.cookies['productsInCart'];
    const list = current ? current.toString().split(',').filter(Boolean) : [];
    list.push(id);
    res.cookie('productsInCart', list.join(','), {httpOnly: true, path: '/'});
    return res.redirect(redirectTo);
  });

  app.post('/add-to-cart', (req, res) => {
    const productId = req.body.product_id;
    const variantId = req.body.variant_id;
    const redirect = req.body.redirect === 'cart' ? '/cart' : (req.header('Referer') || '/');
    const quantity = Math.max(1, Math.min(parseInt(req.body.quantity || '1', 10) || 1, 99));

    const currentProducts = req.cookies['productsInCart'];
    const productList = currentProducts ? currentProducts.toString().split(',').filter(Boolean) : [];
    if (productId) {
      for (let i = 0; i < quantity; i++) productList.push(productId);
    }
    res.cookie('productsInCart', productList.join(','), {httpOnly: true, path: '/'});

    if (variantId) {
      const currentVariants = req.cookies['variantsInCart'];
      const variantList = currentVariants ? currentVariants.toString().split(',').filter(Boolean) : [];
      for (let i = 0; i < quantity; i++) variantList.push(variantId);
      res.cookie('variantsInCart', variantList.join(','), {httpOnly: true, path: '/'});
    }

    return res.redirect(redirect);
  });

  app.post('/cart/update', (req, res) => {
    const productId = req.body.product_id;
    const quantity = Math.max(0, Math.min(parseInt(req.body.quantity || '0', 10) || 0, 99));
    const redirectTo = req.header('Referer') || '/cart';

    const current = req.cookies['productsInCart'];
    const list = current ? current.toString().split(',').filter(Boolean) : [];
    const filtered = list.filter((id) => id !== productId);
    for (let i = 0; i < quantity; i++) filtered.push(productId);
    res.cookie('productsInCart', filtered.join(','), {httpOnly: true, path: '/'});

    return res.redirect(redirectTo);
  });
};
