var Rest = require('../lib/rest');
require('should');

describe('Rest', function(){
  var Product = function(){};
  var rest = new Rest({});
  var routes = {
    products: {
      pattern: '/products',
      rest: {
        model: Product,
        get: true,
        getOne: true,
      }
    }
  };
  describe('load', function(){
    rest.load('products', routes['products'], routes);
    it('should parse the route', function(){
      routes.should.have.property('products_get_all');
      routes.should.have.property('products_get_one');
      routes.should.not.have.property('products_post');
      routes['products_get_one'].pattern.should.equal('/products/:id');
    });
  });
  
});
