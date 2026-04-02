module.exports = (app) => {
  const requireAuth = (req, res, next) => {
    if (!req.session['user']) {
      req.session['warning'] = 'B\u1ea1n c\u1ea7n \u0111\u0103ng nh\u1eadp \u0111\u1ec3 thanh to\u00e1n!';
      return res.redirect('/sign-in');
    }
    return next();
  };

  app.get('/checkout', requireAuth, (req, res) => {
    const rawCartIds = req.cookies['productsInCart'];
    const productsInCartIds = rawCartIds
      ? rawCartIds.toString().split(',').filter(Boolean)
      : [];

    if (productsInCartIds.length === 0) {
      req.session['warning'] = 'Gi\u1ecf h\u00e0ng c\u1ee7a b\u1ea1n \u0111ang tr\u1ed1ng!';
      return res.redirect('/cart');
    }

    return res.render('checkout/checkout', {
      title: 'Thanh toán',
      csrfToken: req.csrfToken(),
    });
  });

  app.post('/checkout', requireAuth, (req, res) => {
    const fullName = req.body.full_name;
    const phone = req.body.phone;
    const address = req.body.address;
    const note = req.body.note;

    req.checkBody('full_name', 'H\u1ecd v\u00e0 t\u00ean kh\u00f4ng \u0111\u01b0\u1ee3c \u0111\u1ec3 tr\u1ed1ng!').notEmpty();
    req.checkBody('phone', 'S\u1ed1 \u0111i\u1ec7n tho\u1ea1i kh\u00f4ng \u0111\u01b0\u1ee3c \u0111\u1ec3 tr\u1ed1ng!').notEmpty();
    req.checkBody('address', '\u0110\u1ecba ch\u1ec9 giao h\u00e0ng kh\u00f4ng \u0111\u01b0\u1ee3c \u0111\u1ec3 tr\u1ed1ng!').notEmpty();
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
            user_email: req.session['user'] ? req.session['user'].email : null,
            full_name: fullName,
            phone,
            address,
            note,
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
        });
  });
};
