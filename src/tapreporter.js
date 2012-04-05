(function() {
  'use strict';  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __slice = Array.prototype.slice;
  (function(define) {
    return define([], function() {
      var TAPReporter;
      TAPReporter = (function() {
        var retrieveTodoDirective;
        __extends(TAPReporter, jasmine.Reporter);
        function TAPReporter(print, color) {
          this.print = print;
          this.color = color != null ? color : false;
          this.results_ = [];
          this.count = 0;
        }
        TAPReporter.prototype.getResults = function() {
          return this.results_;
        };
        TAPReporter.prototype.putResult = function(result) {
          this.results_.push(result);
          return typeof this.print === "function" ? this.print(result) : void 0;
        };
        TAPReporter.prototype.reportRunnerStarting = function(runner) {};
        TAPReporter.prototype.reportRunnerResults = function(runner) {
          if (runner.queue.abort) {
            return this.putResult("Bail out! " + (runner.__bailOut_reason || ''));
          } else {
            return this.putResult("1.." + this.count);
          }
        };
        TAPReporter.prototype.reportSuiteResults = function(suite) {};
        TAPReporter.prototype.reportSpecStarting = function(spec) {
          var parent, _results;
          parent = {
            parentSuite: spec.suite
          };
          _results = [];
          while ((parent = parent.parentSuite) != null) {
            _results.push(parent.__skip_reason ? (spec.results_.skipped = true, spec.__skip_reason = parent.__skip_reason) : void 0);
          }
          return _results;
        };
        retrieveTodoDirective = function(spec) {
          var parent;
          if (spec.__todo_directive) {
            return spec.__todo_directive;
          }
          parent = {
            parentSuite: spec.suite
          };
          while ((parent = parent.parentSuite) != null) {
            if (parent.__todo_directive) {
              return parent.__todo_directive;
            }
          }
          return '';
        };
        TAPReporter.prototype.reportSpecResults = function(spec) {
          var directive, item, items, msg, results, status, _i, _j, _k, _len, _len2, _len3, _ref, _results;
          if (spec.__bailOut) {
            return;
          }
          directive = retrieveTodoDirective(spec);
          results = spec.results();
          items = results.getItems();
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            if (item.type === 'log') {
              _ref = item.values[0].split(/\r\n|\r|\n/);
              for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
                msg = _ref[_j];
                this.putResult("# " + msg);
              }
            }
          }
          if (results.skipped) {
            status = this.color ? '\u001b[33mok\u001b[0m' : 'ok';
            return this.putResult("" + status + " " + (++this.count) + " - # SKIP " + (spec.__skip_reason || ''));
          } else if (results.passed()) {
            status = this.color ? '\u001b[36mok\u001b[0m' : 'ok';
            return this.putResult("" + status + " " + (++this.count) + " - " + (spec.getFullName()) + directive);
          } else {
            status = this.color ? '\u001b[31mnot ok\u001b[0m' : 'ok';
            this.putResult("" + status + " " + (++this.count) + " - " + (spec.getFullName()) + directive);
            _results = [];
            for (_k = 0, _len3 = items.length; _k < _len3; _k++) {
              item = items[_k];
              if (item.type === 'expect' && !item.passed()) {
                _results.push((function() {
                  var _l, _len4, _ref2, _results2;
                  _ref2 = item.message.split(/\r\n|\r|\n/);
                  _results2 = [];
                  for (_l = 0, _len4 = _ref2.length; _l < _len4; _l++) {
                    msg = _ref2[_l];
                    _results2.push(this.putResult("# " + msg));
                  }
                  return _results2;
                }).call(this));
              }
            }
            return _results;
          }
        };
        TAPReporter.prototype.log = function() {
          var messages, msg, str, _i, _len, _ref, _results;
          str = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          messages = str.join("\n");
          _ref = messages.split(/\r\n|\r|\n/);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            msg = _ref[_i];
            _results.push(this.putResult("# " + msg));
          }
          return _results;
        };
        TAPReporter.diag = function() {
          var env, messages, msg, _i, _j, _len, _len2, _ref, _results, _results2;
          env = arguments[0], messages = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (env != null ? (_ref = env.reporter) != null ? _ref.log : void 0 : void 0) {
            _results = [];
            for (_i = 0, _len = messages.length; _i < _len; _i++) {
              msg = messages[_i];
              _results.push(env.reporter.log(msg));
            }
            return _results;
          } else {
            messages.unshift(env);
            _results2 = [];
            for (_j = 0, _len2 = messages.length; _j < _len2; _j++) {
              msg = messages[_j];
              _results2.push(jasmine.getEnv().reporter.log(msg));
            }
            return _results2;
          }
        };
        TAPReporter.todo = function(target, reason) {
          return target != null ? target.__todo_directive = " # TODO " + reason : void 0;
        };
        TAPReporter.skip = function(target, reason) {
          var _ref;
          if (target != null) {
            if ((_ref = target.results_) != null) {
              _ref.skipped = true;
            }
          }
          return target != null ? target.__skip_reason = reason : void 0;
        };
        TAPReporter.bailOut = function(env, reason) {
          var runner, spec, suite, _i, _j, _len, _len2, _ref, _ref2, _ref3;
          if (reason == null) {
            _ref = [jasmine.getEnv(), env], env = _ref[0], reason = _ref[1];
          }
          runner = env.currentRunner();
          runner.__bailOut_reason = reason;
          runner.queue.abort = true;
          _ref2 = runner.suites();
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            suite = _ref2[_i];
            suite.queue.abort = true;
            _ref3 = suite.specs();
            for (_j = 0, _len2 = _ref3.length; _j < _len2; _j++) {
              spec = _ref3[_j];
              spec.queue.abort = true;
            }
          }
          return env.currentSpec.__bailOut = true;
        };
        TAPReporter.TAPReporter = TAPReporter;
        return TAPReporter;
      })();
      return TAPReporter;
    });
  })(typeof define !== 'undefined' ? define : typeof module !== 'undefined' ? function(deps, factory) {
    return module.exports = factory();
  } : function(deps, factory) {
    return this['TAPReporter'] = factory();
  });
}).call(this);
