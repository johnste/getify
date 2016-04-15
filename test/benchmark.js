
suite('Array accessing', function() {
  benchmark('lodash _.get', function() {
    _.get(this.list, '[1]')
  });

  benchmark('getify', function() {
    getify(this.list)[1]()
  });

  // benchmark('native', function() {
  //   this.list[1]
  // });
}, {
  onCycle: function(event) {
    var suite = this;
    var benchmark = event.target;
  },
  setup: function() {
    this.list = [5, 4, 3];
  },
  teardown: function() {
    this.list = null;
  }
});

suite('Array accessing with variable', function() {
  benchmark('lodash _.get', function() {
    _.get(this.list, '[' + this.index + ']')
  });

  benchmark('getify', function() {
    getify(this.list)[this.index]()
  });

  // benchmark('native', function() {
  //   this.list[this.index]
  // });
}, {
  onCycle: function(event) {
    var suite = this;
    var benchmark = event.target;
  },
  setup: function() {
    this.index = 2;
    this.list = [5, 4, 3];
  },
  teardown: function() {
    this.list = null;
  }
});

suite('Array accessing with variables', function() {
  benchmark('lodash _.get', function() {
    _.get(this.list, '[' + this.index + '][' + this.index2 + ']')
  });

  benchmark('getify', function() {
    getify(this.list)[this.index][this.index2]()
  });

  // benchmark('native', function() {
  //   this.list[this.index][this.index2]
  // });
}, {
  onCycle: function(event) {
    var suite = this;
    var benchmark = event.target;
  },
  setup: function() {
    this.index = 0;
    this.index2 = 2;
    this.list = [[5, 4, 3]];
  },
  teardown: function() {
    this.list = null;
  }
});
