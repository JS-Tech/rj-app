var config = require("../../../../../config");

var page;

exports.loaded = function(args) {
  page = args.object;

  var url = config.rootUrl + "connect/edit?remember_token=" + Session.getKey("rememberToken");

  page.bindingContext = {
    url: url
  };

  page.actionBar.title = "Editer";

};
