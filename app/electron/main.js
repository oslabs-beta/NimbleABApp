const {
  app,
  protocol,
  BrowserWindow,
  session,
  ipcMain,
  dialog,
  Menu,
} = require('electron');
const Store = require('electron-store');
const {
  default: installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} = require('electron-devtools-installer');
const axios = require('axios');
const prisma = require('./prisma.ts');
const reflect = require('reflect-metadata');

const Protocol = require('./protocol');
const MenuBuilder = require('./menu');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { data } = require('autoprefixer');
const isDev = process.env.NODE_ENV === 'development';
const port = 40992; // Hardcoded; needs to match webpack.development.js and package.json
const selfHost = `http://localhost:${port}`;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

//window for variant editor modal
let childWindow;

let menuBuilder;
const store = new Store({
  path: app.getPath('userData'),
});

async function createWindow() {
  //Add Autoupdating functionality here

  if (!isDev) {
    protocol.registerBufferProtocol(Protocol.scheme, Protocol.requestHandler);
  }

  win = new BrowserWindow({
    width: 1100,
    height: 800,
    minHeight: 900,
    minWidth: 600,
    icon: path.join(__dirname, '../../images/icon.png'),
    title: 'Application is starting up...',
    webPreferences: {
      devTools: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.ts'),
      // disableBlinkFeatures: "Auxclick",
    },
  });
  //set initial background color
  // win.setBackgroundColor('');

  //Loads local server in DevMode. Modal Only Loads in Dev mode if chunks are changed. Production is Ready
  if (isDev) {
    win.loadURL(selfHost);
  } else {
    win.loadURL(`${Protocol.scheme}://rse/index.html`);
  }

  win.webContents.on('did-finish-load', () => {
    win.setTitle(`Nimble Labs`);
  });

  //Loads DevTools in DevMode
  if (isDev) {
    win.webContents.once('dom-ready', async () => {
      await installExtension([REDUX_DEVTOOLS])
        .then((name) => console.log(`Added Extension ${name}`))
        .catch((err) => console.log('An error occured: ', err))
        .finally(() => {
          win.webContents.openDevTools();
        });
    });
  }

  //Emits when window is closed
  win.on('closed', () => {
    win = null;
  });

  // https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
  const ses = session;
  const partition = 'default';
  ses
    .fromPartition(
      partition
    ) /* eng-disable PERMISSION_REQUEST_HANDLER_JS_CHECK */
    .setPermissionRequestHandler((webContents, permission, permCallback) => {
      const allowedPermissions = []; // Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest

      if (allowedPermissions.includes(permission)) {
        permCallback(true); // Approve permission request
      } else {
        console.error(
          `The application tried to request permission for '${permission}'. This permission was not whitelisted and has been blocked.`
        );

        permCallback(false); // Deny
      }
    });

  //Uncomment this once menu is set up

  // menuBuilder = MenuBuilder(win, app.name);
}

//Function to create text editor modal
async function createTextEditorModal() {
  if (!isDev) {
    protocol.registerBufferProtocol(Protocol.scheme, Protocol.requestHandler);
  }
  childWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    title: 'Application is starting up...',
    parent: win,
    modal: true,
    webPreferences: {
      devTools: isDev,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.ts'),
    },
  });

  if (isDev) {
    childWindow.loadURL(selfHost);
  } else {
    childWindow.loadURL(`${Protocol.scheme}://rse/modal.html`);
  }

  childWindow.webContents.on('did-finish-load', () => {
    childWindow.setTitle(`Nimble Labs`);
  });

  //Loads Redux DevTools when in DevMode
  if (isDev) {
    childWindow.webContents.once('dom-ready', async () => {
      await installExtension([REDUX_DEVTOOLS])
        .then((name) => console.log(`Added Extension ${name}`))
        .catch((err) => console.log('An error occured: ', err))
        .finally(() => {
          childWindow.webContents.openDevTools();
        });
    });
  }

  //Emits when window is closed
  childWindow.on('closed', () => {
    childWindow = null;
  });

  // https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
  const ses = session;
  const partition = 'default';
  ses
    .fromPartition(
      partition
    ) /* eng-disable PERMISSION_REQUEST_HANDLER_JS_CHECK */
    .setPermissionRequestHandler((webContents, permission, permCallback) => {
      const allowedPermissions = []; // Full list here: https://developer.chrome.com/extensions/declare_permissions#manifest

      if (allowedPermissions.includes(permission)) {
        permCallback(true); // Approve permission request
      } else {
        console.error(
          `The application tried to request permission for '${permission}'. This permission was not whitelisted and has been blocked.`
        );

        permCallback(false); // Deny
      }
    });

  //Add Custom Menu Builder for the Modal
}

// Needs to be called before app is ready;
// gives our scheme access to load relative files,
// as well as local storage, cookies, etc.
// https://electronjs.org/docs/api/protocol#protocolregisterschemesasprivilegedcustomschemes
protocol.registerSchemesAsPrivileged([
  {
    scheme: Protocol.scheme,
    privileges: {
      standard: true,
      secure: true,
    },
  },
]);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//init o
app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// https://electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (contentsEvent, navigationUrl) => {
    /* eng-disable LIMIT_NAVIGATION_JS_CHECK  */
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [selfHost];

    // Log and prevent the app from navigating to a new page if that page's origin is not whitelisted
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to navigate to the following address: '${parsedUrl}'. This origin is not whitelisted and the attempt to navigate was blocked.`
      );

      contentsEvent.preventDefault();
    }
  });

  contents.on('will-redirect', (contentsEvent, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    const validOrigins = [];

    // Log and prevent the app from redirecting to a new page
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to redirect to the following address: '${navigationUrl}'. This attempt was blocked.`
      );

      contentsEvent.preventDefault();
    }
  });

  // https://electronjs.org/docs/tutorial/security#11-verify-webview-options-before-creation
  contents.on(
    'will-attach-webview',
    (contentsEvent, webPreferences, params) => {
      // Disable Node.js integration
      webPreferences.nodeIntegration = false;
    }
  );

  // https://electronjs.org/docs/tutorial/security#13-disable-or-limit-creation-of-new-windows
  // This code replaces the old "new-window" event handling;
  // https://github.com/electron/electron/pull/24517#issue-447670981
  contents.setWindowOpenHandler(({ url }) => {
    const parsedUrl = new URL(url);
    const validOrigins = [];

    // Log and prevent opening up a new window
    if (!validOrigins.includes(parsedUrl.origin)) {
      console.error(
        `The application tried to open a new window at the following address: '${url}'. This attempt was blocked.`
      );

      return {
        action: 'deny',
      };
    }

    return {
      action: 'allow',
    };
  });
});

//Choose Directory Functionality
async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ['openDirectory'],
  });
  if (!canceled) {
    store.set('directoryPath', filePaths[0]);
    return { basename: path.basename(filePaths[0]), fullPath: filePaths[0] };
  }
}

//Gets all paths for Next Js Directory
function handleDirectoryPaths() {
  const dirPath = store.get('directoryPath');
  console.log(dirPath);
  const pathsArr = ['/'];
  const fullPaths = [dirPath];
  const map = { app: '/' };

  //Recurses through directory only pulling acitve paths
  // Can make this more refined by looking for only directories with page.jsx in it
  function parsePaths(dirPath) {
    const dirFiles = fs.readdirSync(dirPath);
    // console.log(dirFiles);
    for (const file of dirFiles) {
      const stats = fs.statSync(path.join(dirPath, file));

      // console.log(file);
      if (stats.isDirectory()) {
        if (file[0] === '(') {
          parsePaths(path.join(dirPath, file));
        } else {
          if (map[file]) pathsArr.push(map[file]);
          else pathsArr.push('/' + file);
          fullPaths.push(dirPath + '/' + file);
          parsePaths(path.join(dirPath, file));
        }
      }
    }
  }

  parsePaths(dirPath);
  store.set('dirPaths', fullPaths);
  console.log(store.get('dirPaths'));
  return pathsArr;
}

function handleGetExperiments() {
  const experiments = store.get('experiments');
  return experiments;
}

// takes an experiment object
async function handleAddExperiment(event, experiment) {
  console.log(experiment);
  const {
    Experiment_name,
    Device_Type,
    Repo_id,
    experiment_path,
    experiment_uuid,
    directory_path,
  } = experiment;
  try {
    const newExperiment = await prisma.experiments.create({
      data: {
        Experiment_Name: Experiment_name,
        Device_Type,
        Repo_id,
        experiment_path,
        experiment_uuid,
      },
    });
    //Adds Experiment to database on supabase
    axios.post('https://nimblebackend-te9u.onrender.com/createExperiment', {
      experiment_name: Experiment_name,
      experimentId: experiment_uuid,
      experiment_path,
      device_type: Device_Type,
    });
    console.log(directory_path);

    //Creates a variants folder in the experiment path
    fs.mkdir(path.join(directory_path, experiment_path, '[variants]'), (err) =>
      console.log(err)
    );

    //initialize configuration file

    //copies middleware file into new directory
    fs.copyFile(
      path.join(__dirname, '../templates/staticMiddleware.ts'),
      path.join(directoryPath, `middleware.ts`),
      (err) => console.log(err)
    );
    console.log('New experiment created');
  } catch (error) {
    console.error(
      'Error creating experiment with name ',
      experiment,
      'error message: ',
      error
    );
  }
}

async function handleAddVariant(event, variant) {
  // destructure the variant object
  console.log(variant);
  const { filePath, weight, experimentId, directoryPath, experimentPath } =
    variant;
  console.log(filePath);
  console.log(weight);
  console.log(experimentId);
  // add to database
  try {
    const newVariant = await prisma.Variants.create({
      data: {
        filePath: filePath,
        weights: weight,
        Experiment_Id: experimentId,

        // this is on the schema but may not be needed. For now a blank array
      },
    });

    //Creates variant in variants folder
    fs.copyFile(
      path.join(directoryPath, experimentPath, `page.js`),
      path.join(directoryPath, experimentPath, '[variants]', `${filePath}.js`),
      (err) => console.log(err)
    );
    console.log('New variant added');
  } catch (error) {
    console.error(
      'Error creating variant with data: ',
      variant,
      'error message: ',
      error
    );
  }

  //Add to the configuration file
}

async function handleGetVariants(event, experimentId) {
  console.log('reached the getVariants function');
  try {
    const variants = await prisma.variants.findMany({
      where: {
        Experiment_Id: experimentId,
      },
    });
    console.log(variants);
    return JSON.stringify(variants);
  } catch (error) {
    console.error(
      'Error creating variant with experimentID ',
      experimentId,
      'error message: ',
      error
    );
  }
}

async function handleGetExperiments(event, experimentId) {
  console.log('reached the getExperiments function');
  try {
    const experiments = await prisma.experiments.findMany({
      where: {
        id: experimentId,
      },
    });
    console.log(experiments);
    return JSON.stringify(experiments);
  } catch (error) {
    console.error(
      'Error fetching experiment with experimentID ',
      experimentId,
      'error message: ',
      error
    );
  }
}
async function handleAddRepo(event, repo) {
  console.log(repo);
  try {
    const { FilePath } = repo;
    // const data = await prisma.Repos.upsert({
    //   where: { FilePath },
    //   create: { FilePath },
    //   update: { FilePath },
    // });

    const data = await prisma.Repos.create({
      data: { FilePath },
    });
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

//Creates Text Editor Modal
function handleCreateTextEditor() {
  createTextEditorModal();
  // console.log('hi');
}

//Gets the Repo from Local DB
async function handleGetRepo(event, repoId) {
  try {
    const repo = await prisma.Repos.findFirst({
      where: { id: repoId },
    });
    console.log(repo);
    return repo;
  } catch (err) {
    console.log(err);
  }
}
//Event Listeners for Client Side Actions
ipcMain.handle('dialog:openFile', handleFileOpen);
ipcMain.handle('directory:parsePaths', handleDirectoryPaths);
ipcMain.handle('experiment:getExperiments', handleGetExperiments);
ipcMain.handle('modal:createModal', handleCreateTextEditor);
// Database API
ipcMain.handle('database:addExperiment', handleAddExperiment);
ipcMain.handle('database:addVariant', handleAddVariant);
ipcMain.handle('database:getVariants', handleGetVariants);
ipcMain.handle('database:addRepo', handleAddRepo);
ipcMain.handle('database:getRepo', handleGetRepo);
//File System API
