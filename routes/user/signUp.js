module.exports = (app) => {
  app.get('/sign-up', (req, res) => {
    let success; const warning = app.helpers.msg(req);

    if (req.session['user'] || req.session['user'] != null) {
      req.session['warning'] = 'Bạn không thể truy cập khu vực này!';
      return res.redirect('/');
    }

    res.render('sign/up', {
      title: 'Đăng ký',
      success, warning,
      csrfToken: req.csrfToken(),
    });
  });

  app.post('/sign-up', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    req.checkBody('username', 'Tên người dùng không được để trống').notEmpty().isLength({min: 4});
    req.checkBody('email', 'Email không hợp lệ').notEmpty().isEmail();
    req.checkBody('password', 'Mật khẩu phải có ít nhất 4 ký tự').notEmpty();
    const errosInValidation = req.validationErrors();
    if (errosInValidation) {
      req.session['warning'] = errosInValidation[0].msg;
      return res.redirect('/sign-up');
    };

    const connection = app.dao.connectionFactory();
    const UserDao = new app.dao.userDAO(connection);

    UserDao.saveUser(username, email, password)
        .then((result) => {
          req.session['success'] = result;
          // Create Session
          req.session['user'] = {
            username: username,
            email: email,
            admin: false,
            cart: null,
          };
          res.redirect('/');
        })
        .catch((err) => {
          req.session['warning'] = err;
          res.redirect('/sign-up');
        });
  });
};
