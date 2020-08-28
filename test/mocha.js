'use strict';

//Load dependencies
const StellarSdk = require('stellar-sdk');
const chaiAsPromised = require('chai-as-promised');
const testUtils = require('./test-utils');

global.StellarThreshSig = require("../");
global.StellarSdk = StellarSdk;
global.testUtils = testUtils;
global.chai = require('chai');
global.chai.should();
global.chai.use(chaiAsPromised);
global.expect = global.chai.expect;
