# Bonus Point
The Bonus Point desktop application allows teachers to easily track bonus or extra credit points for their students. The Bonus Point desktop application can be installed on Windows. Support for macOS and Linux operating systems will be coming soon. More information on Bonus Point and for a direct download, please visit https://bonuspoint.org.

### Build Instructions (Electron)
Before getting started, please make sure to have the latest versions of Node.js, npm and Yarn installed.

Once you have cloned Emma to a local folder, you can run the following command to add electron-builder as a dependency.
```
$ yarn add electron-builder --dev
```

In order to update the `package-lock.json` file, you must first delete the current `package-lock.json` and run the following command.
```
$ npm install
```

Then, run the following command to make sure that the `yarn.lock` file is up-to-date.
```
$ yarn
```

After completing all of these steps, you can run the following command to build Emma for your operating system.
```
$ yarn dist
```
