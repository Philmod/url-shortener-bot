module.exports = app => {

  var cs = {};
  var controllers = [
    'webhooks',
  ];

  controllers.forEach(controller => {
    cs[controller] = require(`${__dirname}/${controller}`)(app);
  });

  return cs;

};
