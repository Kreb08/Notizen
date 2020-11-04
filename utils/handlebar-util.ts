function registerHelpers(hbs) {
  return hbs.create({
    helpers: {
      if_eq: function (a, b, opts) {
        if (a === b) {
          return opts.fn(this);
        } else {
          return opts.inverse(this);
        }
      },
      setChecked: function (value, currentValue) {
        if (value === currentValue) {
          return "checked";
        } else {
          return "";
        }
      },
      // More helpers...
    },
  });
}

//export default registerHelpers;
module.exports = registerHelpers;
