'use strict';

//Load dependencies
const testUtils = require('./test-utils');
const chaiAsPromised = require('chai-as-promised');

global.StellarThreshSig = require("../");
global.testUtils = testUtils;
global.chai = require('chai');
global.chai.should();
global.chai.use(chaiAsPromised);
global.expect = global.chai.expect;
