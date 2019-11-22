'use strict';

const fs = require('fs-extra')
const es = require('./es');
const lib = require('./lib');
const { series, parallel } = require('gulp');
const path = require('path')

exports.default = series(parallel(es, lib));
