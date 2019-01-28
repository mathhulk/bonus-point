# Bonus Point
Bonus Point is a desktop application that can be installed on numerous operating systems and allows teachers or other school administrators to track bonus points for their classes and students.

### Description
Emma can be installed on multiple operating systems and allows for the tracking of bonus points via a beautiful user interface. There are numerous task options that allow for a smooth experience when the application is in use and little distraction whatsoever. The desktop application has been created using [Electron](https://electronjs.org) and makes use of [electron-builder](https://www.electron.build/auto-update) for automatic update distribution and installation. New releases of the desktop application are published automatically when they are built.

The user interface can be found [here](https://share.mathhulk.me/2018-09-24_15-21-39.png) or [here](https://github.com/mathhulk/bonus-point/wiki).

### Development
* Install Node.js (v10.3.0+ suggested), npm (v6.1.0+ suggested) and Yarn (v1.7.0+ suggested)
* Clone `bonus-point` to a local workspace
* Execute `yarn` to install dependencies
* Execute `electron-builder` to build the application

Building of the desktop application is managed through [Travis CI](https://travis-ci.org/mathhulk/bonus-point) and new releases are published as the application is updated, as noted above.

[![Build Status](https://travis-ci.org/mathhulk/bonus-point.svg?branch=master)](https://travis-ci.org/mathhulk/bonus-point)
