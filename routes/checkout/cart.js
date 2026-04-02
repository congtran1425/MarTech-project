module.exports = (app) => {
  const requireAuth = (req, res, next) => {
    if (!req.session['user']) {
      req.session['warning'] = 'B\u1ea1n c\u1ea7n \u0111\u0103ng nh\u1eadp \u0111\u1ec3 th\u00eam s\u1ea3n ph\u1ea9m v\u00e0o gi\u1ecf h\u00e0ng!';
      return res.redirect('/sign-in');
    }
    return next();
  };

  app.get('/cart', (req, res) => {
    let success; const warning = app.helpers.msg(req);
    const connection = app.dao.connectionFactory();
    const productsDao = new app.dao.productsDAO(connection);

    // Get list of ID of product in cart
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
          res.render('checkout/cart', {
            title: 'Giỏ hàng',
            success, warning,
            products: productsWithQty,
            csrfToken: req.csrfToken(),
          });
        })
        .catch((err) => console.log(err));
  });
  app.get('/add-to-cart/:id', requireAuth, (req, res) => {
    const id = req.params.id;
    const redirectTo = req.header('Referer') || '/';
    const current = req.cookies['productsInCart'];
    const list = current ? current.toString().split(',').filter(Boolean) : [];
    list.push(id);
    res.cookie('productsInCart', list.join(','), {httpOnly: true, path: '/'});
    return res.redirect(redirectTo);
  });

  app.post('/add-to-cart', requireAuth, (req, res) => {
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

  app.post('/cart/update', requireAuth, (req, res) => {
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
