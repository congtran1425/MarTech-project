module.exports = (app) => {
  app.get('/checkout', (req, res) => {
    const rawCartIds = req.cookies['productsInCart'];
    const productsInCartIds = rawCartIds
      ? rawCartIds.toString().split(',').filter(Boolean)
      : [];

    if (productsInCartIds.length === 0) {
      req.session['warning'] = 'Gi\u1ecf h\u00e0ng c\u1ee7a b\u1ea1n \u0111ang tr\u1ed1ng!';
      return res.redirect('/cart');
    }

    return res.render('checkout/checkout', {
      title: 'Thanh to\u00e1n',
      csrfToken: req.csrfToken(),
    });
  });

  app.post('/checkout', (req, res) => {
    const email = (req.body.email || '').trim();

    req.checkBody('email', 'Email kh\u00f4ng h\u1ee3p l\u1ec7!').isEmail();
    const errors = req.validationErrors();
    if (errors) {
      req.session['warning'] = errors[0].msg;
      return res.redirect('/checkout');
    }

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
      req.session['warning'] = 'Gi\u1ecf h\u00e0ng c\u1ee7a b\u1ea1n \u0111ang tr\u1ed1ng!';
      return res.redirect('/cart');
    }

    const connection = app.dao.connectionFactory();
    const productsDao = new app.dao.productsDAO(connection);
    const orderDao = new app.dao.orderDAO(connection);

    productsDao.getById(uniqueIds.join(','))
      .then((products) => {
        const items = [];
        let total = 0;
        products.forEach((p) => {
          const qty = quantityMap[p.id] || 1;
          items.push({
            product_id: p.id,
            variant_id: null,
            quantity: qty,
            price: p.price,
          });
          total += Number(p.price) * qty;
        });

        const order = {
          customer_email: email,
          total_amount: total,
          status: 'paid_fake',
        };

        return orderDao.create(order, items);
      })
      .then((orderId) => {
        res.cookie('productsInCart', '', {httpOnly: true, path: '/', maxAge: 0});
        res.cookie('variantsInCart', '', {httpOnly: true, path: '/', maxAge: 0});
        req.session['success'] = 'Thanh to\u00e1n gi\u1ea3 l\u1eadp th\u00e0nh c\u00f4ng! M\u00e3 \u0111\u01a1n: #' + orderId;
        return res.redirect('/cart');
      })
      .catch((err) => {
        console.log(err);
        req.session['warning'] = 'Kh\u00f4ng th\u1ec3 t\u1ea1o \u0111\u01a1n h\u00e0ng. Vui l\u00f2ng th\u1eed l\u1ea1i!';
        return res.redirect('/checkout');
      })
      .finally(() => {
        connection.end();
      });
  });
};
