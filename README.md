# Bonus Point
The Bonus Point desktop application allows teachers to easily track bonus or extra credit points for their students. The Bonus Point desktop application can be installed on Windows. Support for macOS and Linux operating systems will be coming soon. More information on Bonus Point and for a direct download, please visit https://bonuspoint.org.

### Build Instructions (Electron)
Before getting started, please make sure to have the latest versions of Node.js, npm and Yarn installed.

Once you have cloned Emma to your local file system, navigate to your package and run the following command to install all modules. This command will also generate the `package-lock.json` file with the latest versions of all modules.
```
$ npm install
```

npm seems to install an old version of electron-builder. To install the latest version, run the following command.
```
$ yarn add electron-builder
```

Then, run the following command to generate the `yarn.lock` file.
```
$ yarn
```

Last, run the following command to build Emma for your operating system. The executable file for installing Emma will be located in the `dist` directory of the project.
```
$ yarn dist
```
