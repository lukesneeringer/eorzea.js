'use strict';

var expect = require('chai').expect;
var sinon = require('sinon');

var Time = require('../src/time');


describe('Time', function() {
  describe('.constructor', function() {
    it('constructs a time from integers passed to it', function() {
      var t = new Time(11, 30, 45);
      expect(t).instanceOf(Time);
      expect(t.hour).equal(11);
      expect(t.minute).equal(30);
      expect(t.second).equal(45);
    });

    it('treats all arguments as optional', function() {
      var t = new Time();
      expect(t.hour).equal(0);
      expect(t.minute).equal(0);
      expect(t.second).equal(0);
    });

    it('converts a too-high second value into minutes', function() {
      var t = new Time(11, 30, 75);
      expect(t).instanceOf(Time);
      expect(t.hour).equal(11);
      expect(t.minute).equal(31);
      expect(t.second).equal(15);
    });

    it('converts a too-high minute value into hours', function() {
      var t = new Time(11, 75);
      expect(t).instanceOf(Time);
      expect(t.hour).equal(12);
      expect(t.minute).equal(15);
    });

    it('converts a too-high hour by throwing away above 24', function() {
      var t = new Time(35, 30);
      expect(t).instanceOf(Time);
      expect(t.hour).equal(11);
      expect(t.minute).equal(30);
    });
  });

  describe('._coerce', function() {
    it('converts hours and minutes to a Time', function() {
      var t = Time._coerce(11, 30);
      expect(t).instanceOf(Time);
      expect(t.hour).equal(11);
      expect(t.minute).equal(30);
    });

    it('passes through Time objects unmolested', function() {
      var t = new Time();
      expect(Time._coerce(t)).equal(t);
    });
  });

  describe('.eq', function() {
    it('considers times with equal hour and minute to be equal', function() {
      var t1 = new Time(11, 30);
      var t2 = new Time(11, 30);
      expect(t1.eq(t2)).true;
    });

    it('considers times with different hours to be unequal', function() {
      var t1 = new Time(11, 30);
      var t2 = new Time(12, 30);
      expect(t1.eq(t2)).false;
    });

    it('considers times with different minutes to be unequal', function () {
      var t1 = new Time(11, 30);
      var t2 = new Time(11, 40);
      expect(t1.eq(t2)).false;
    });

    it('ignores seconds on equality checks', function() {
      var t1 = new Time(11, 30, 30);
      var t2 = new Time(11, 30, 45);
      expect(t1.eq(t2)).true;
    });
  });

  describe('.now', function() {
    beforeEach(function() {
      this.clock = sinon.useFakeTimers();
    });

    it('returns the current Eorzea time', function() {
      this.clock.tick(1335024000 * 1000);
      var now = Time.now();
      expect(now.hour).equal(20);
      expect(now.minute).equal(34);
    });

    it('returns a 0 timestamp at the epoch', function() {
      var now = Time.now();
      expect(now.hour).equal(0);
      expect(now.minute).equal(0);
      expect(now.second).equal(0);
    });

    it('delivers a different result as actual time moves', function() {
      expect(Time.now().hour).equal(0);
      expect(Time.now().minute).equal(0);

      // Tick the real world clock by just over one Eorzean minute.
      this.clock.tick(3000);
      expect(Time.now().hour).equal(0);
      expect(Time.now().minute).equal(1);
    });

    afterEach(function() {
      this.clock.restore();
    });
  });

  describe('.strftime', function() {
    it('returns an appropriate time string', function() {
      var t = new Time(15, 30);
      expect(t.strftime('%H:%M')).equal('15:30');
      expect(t.strftime('%H:%M:%S')).equal('15:30:00');
      expect(t.strftime('%I:%M %P').toUpperCase()).equal('03:30 PM');
    });

    it('complains on date-y (invalid) input', function() {
      expect(function() {
        var t = new Time(15, 30);
        t.strftime('%Y-%m-%d %H:%M:%S');
      }).throw(TypeError);
    });
  });

  describe('.toString', function() {
    it('returns an appropriate string', function() {
      var t = new Time(11, 30);
      expect(t.toString()).equal('11:30:00 Eorzea Time');
    });
  });
});
