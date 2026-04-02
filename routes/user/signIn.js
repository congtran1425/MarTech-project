module.exports = (app) => {
  app.get('/sign-in', (req, res) => {
    let success; const warning = app.helpers.msg(req);

    if (req.session['user'] || req.session['user'] != null) {
      req.session['warning'] = 'Bạn không thể truy cập khu vực này!';
      return res.redirect('/');
    }

    res.render('sign/in', {
      title: 'Đăng nhập',
      success, warning,
      csrfToken: req.csrfToken(),
    });
  });

  app.post('/sign-in', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    req.checkBody('email', 'Email không hợp lệ!').notEmpty().isEmail();
    req.checkBody('password', 'Mật khẩu phải có ít nhất 4 ký tự!')
        .notEmpty().isLength({min: 4});
    const errorsInValidation = req.validationErrors();
    if (errorsInValidation) {
      req.session['warning'] = errorsInValidation[0].msg;
      return res.redirect('/sign-in');
    }

    const connection = app.dao.connectionFactory();
    const userDao = new app.dao.userDAO(connection);

    userDao.login(email, password)
        .then((result) => {
          req.session['success'] = result;
          // Create Session
          req.session['user'] = {
            username: 'username',
            email: email,
            admin: false,
            cart: null,
          };

          res.redirect('/');
        })
        .catch((err) => {
          req.session['warning'] = err;
          res.redirect('/sign-in');
        });
  });
};
