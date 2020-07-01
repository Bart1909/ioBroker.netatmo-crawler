![Logo](img/netatmo-logo.png)
# ioBroker.netatmo-crawler

[![NPM version](http://img.shields.io/npm/v/iobroker.netatmo-crawler.svg)](https://www.npmjs.com/package/iobroker.netatmo-crawler)
[![Downloads](https://img.shields.io/npm/dm/iobroker.netatmo-crawler.svg)](https://www.npmjs.com/package/iobroker.netatmo-crawler)
<!-- ![Number of Installations (latest)](http://iobroker.live/badges/netatmo-crawler-installed.svg)
![Number of Installations (stable)](http://iobroker.live/badges/netatmo-crawler-stable.svg) -->
[![Dependency Status](https://img.shields.io/david/Bart1909/iobroker.netatmo-crawler.svg)](https://david-dm.org/Bart1909/iobroker.netatmo-crawler)
[![Known Vulnerabilities](https://snyk.io/test/github/Bart1909/ioBroker.netatmo-crawler/badge.svg)](https://snyk.io/test/github/Bart1909/ioBroker.netatmo-crawler)
[![Build Status](https://travis-ci.org/Bart1909/ioBroker.netatmo-crawler.svg?branch=master)](https://travis-ci.org/Bart1909/ioBroker.netatmo-crawler)

[![NPM](https://nodei.co/npm/iobroker.netatmo-crawler.png?downloads=true)](https://nodei.co/npm/iobroker.netatmo-crawler/)



## netatmo-crawler adapter for ioBroker

Crawls information from public netatmo stations

## instruction 
 
To find the url of your preferred weather station, follow these steps:
1. Open the [Netatmo Weathermap](https://weathermap.netatmo.com)
2. Find your station and click the share icon

   ![Share Image](img/share.jpg)

3. Click on *copy link*

   ![Copy Link](img/copyLink.jpg)

4. Insert the link in the instance settings of the adapter

   ![Insert](img/share.jpg)

## Credits

Many thanks to [backfisch](https://github.com/backfisch88) for the initial idea and support!

## Changelog

### 0.1.2
* (Bart19) fix for station4 and introduces allowInit, so adapter will run once on config edits
### 0.1.1
* (Bart19) removes files from archive which are unnecessary
### 0.1.0
* (Bart19) implements automatic tests
### 0.0.8
* (Bart19) updates logo
### 0.0.7
* (Bart19) changes loglevel
### 0.0.6
* (Bart19) updates description
### 0.0.5
* (Bart19) bugfixes
### 0.0.4
* (Bart19) bugfixes
### 0.0.3
* (Bart19) bugfixes
### 0.0.2
* (Bart19) bugfixes
### 0.0.1
* (Bart19) initial release

## License
MIT License

Copyright (c) 2020 Bart19 <webmaster@bart19.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.