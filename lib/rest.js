function Rest() {
  this.key = 'rest';
}

Rest.prototype.supports = function(key) {
  return key === this.key;
};


Rest.prototype.load = function(routeName, route, routes) {
  var options = route[this.key]; 
  if (!options.model) {
    throw new Error('Model must be defined');
  }
  if (options.get) {
    var routeKey = routeName + '_get_all';
    routes[routeKey] = {
      pattern: route.pattern,
      controller: getAll(options.model, options.get)
    };
  }
  if (options.getOne) {
    var routeKey = routeName + '_get_one';
    routes[routeKey] = {
      pattern: route.pattern+'/:id',
      controller: getOne(options.model, options.getOne)
    };
  }
  delete routes[routeName];
};

var getAll = function(model, options) {
  return function(req, res, next) {
    var query = model.find();
    var fields = {};
    if (req.query.start) {
      query.skip(req.query.start);
    }
    if (req.query.end) {
      query.limit(req.query.end);
    }
    if (req.query.sortBy) {
      var sortOrder = req.query.sortOrder || 'asc';
      var sortSign = sortOrder === 'asc' ? '' : '-';
      query.sort(sortSign+req.query.sortBy);
    }
    if (req.query.fields) {
      req.query.fields.split(',').forEach(function(val){
        fields[val] = 1;
      });
    } else {
      fields.__v = 0;
    }
    if (options.populate) {
      query.populate(options.populate);
    }
    query.select(fields).exec(function(err, collection){
      res.json(collection);
    });
  };
};

var getOne = function(model, options) {
  return function(req, res, next) {
    model.findById(req.params.id, {'__v': 0}, function(err, document){
      res.json(document);
    });
  };
};

module.exports = Rest;
