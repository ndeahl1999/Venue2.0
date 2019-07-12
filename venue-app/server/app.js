'use strict';

import express from 'express';
import mongoose from 'mongoose';
import http from 'http';

var app = express();
var fs = require('fs');
var morgan = require('morgan');