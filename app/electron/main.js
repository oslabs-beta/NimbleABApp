const {
  app,
  protocol,
  BrowserWindow,
  session,
  ipcMain,
  dialog,
  Menu,
  MenuItem,
} = require("electron");
const Store = require("electron-store");
const {
  default: installExtension,
  REDUX_DEVTOOLS,
  REACT_DEVELOPER_TOOLS,
} = require("electron-devtools-installer");
const axios = require("axios");
const prisma = require("./prisma.ts");
const reflect = require("reflect-metadata");

const Protocol = require("./protocol");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const { data } = require("autoprefixer");
const isDev = process.env.NODE_ENV === "development";
const port = 40992; // Hardcoded; needs to match webpack.development.js and package.json
const selfHost = `http://localhost:${port}`;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

//window for variant editor modal
let childWindow;

let menuBuilder;
const store = new Store({
  path: app.getPath("userData"),
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
    icon: path.join(__dirname, "../../images/icon.png"),
    title: "Application is starting up...",
    webPreferences: {
      devTools: true,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.ts"),
      // disableBlinkFeatures: "Auxclick",
    },
  });
  //set initial background color
  win.setBackgroundColor("#3b19fc");

  //Loads local server in DevMode. Modal Only Loads in Dev mode if chunks are changed. Production is Ready
  if (isDev) {
    win.loadURL(selfHost);
  } else {
    win.loadURL(`${Protocol.scheme}://rse/index.html`);
  }

  win.webContents.on("did-finish-load", () => {
    win.setTitle(`Nimble Labs`);
  });

  //Loads DevTools in DevMode
  if (isDev) {
    win.webContents.once("dom-ready", async () => {
      await installExtension([REDUX_DEVTOOLS])
        .then((name) => console.log(`Added Extension ${name}`))
        .catch((err) => console.log("An error occured: ", err))
        .finally(() => {
          win.webContents.openDevTools();
        });
    });
  }

  //Emits when window is closed
  win.on("closed", () => {
    win = null;
  });

  // https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
  const ses = session;
  const partition = "default";
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
async function createTextEditorModal(filePath) {
  // the filepath argument is to be used to place the user into whatever path contains their variants that way they don't need to
  // traverse the whole file tree to get there
  if (!isDev) {
    protocol.registerBufferProtocol(Protocol.scheme, Protocol.requestHandler);
  }
  childWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    title: "Application is starting up...",
    parent: win,
    modal: false,
    webPreferences: {
      devTools: isDev,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      nodeIntegrationInSubFrames: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.ts"),
    },
  });

  if (isDev) {
    childWindow.loadURL(selfHost + "/modal.html");
  } else {
    childWindow.loadURL(`${Protocol.scheme}://rse/modal.html`);
  }

  childWindow.webContents.on("did-finish-load", () => {
    childWindow.setTitle(`Nimble Labs`);

    //make sure not modifying files in this project directory
    if (!filePath.includes(__dirname)) {
      const data = fs.readFileSync(filePath);
      childWindow.webContents.send("file-path", { data, filePath });
    }
  });

  //Loads Redux DevTools when in DevMode
  if (isDev) {
    childWindow.webContents.once("dom-ready", async () => {
      await installExtension([REDUX_DEVTOOLS])
        .then((name) => console.log(`Added Extension ${name}`))
        .catch((err) => console.log("An error occured: ", err))
        .finally(() => {
          childWindow.webContents.openDevTools();
        });
    });
  }

  //Emits when window is closed
  childWindow.on("closed", () => {
    childWindow = null;
  });

  // https://electronjs.org/docs/tutorial/security#4-handle-session-permission-requests-from-remote-content
  const ses = session;
  const partition = "default";
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
  //Add save button to menu
  const menu = new Menu();
  menu.append(
    new MenuItem({
      label: "File",
      submenu: [
        {
          click: () => childWindow.webContents.send("save-file"),
          label: "Save",
          accelerator: process.platform === "darwin" ? "Cmd+s" : "Ctrl+s",
        },
      ],
    })
  );
  console.log(menu);
  childWindow.setMenu(menu);
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

//Set App Name
app.setName("Nimble AB");
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
//init o
app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// https://electronjs.org/docs/tutorial/security#12-disable-or-limit-navigation
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (contentsEvent, navigationUrl) => {
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

  contents.on("will-redirect", (contentsEvent, navigationUrl) => {
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
    "will-attach-webview",
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
        action: "deny",
      };
    }

    return {
      action: "allow",
    };
  });
});

//Choose Directory Functionality
async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, {
    properties: ["openDirectory"],
  });
  if (!canceled) {
    store.set("directoryPath", filePaths[0]);
    return { basename: path.basename(filePaths[0]), fullPath: filePaths[0] };
  } else {
    return;
  }
}

//Gets all paths for Next Js Directory
function handleDirectoryPaths() {
  const dirPath = store.get("directoryPath");
  console.log(dirPath);
  const pathsArr = [];
  const fullPaths = [dirPath];
  const map = { app: "/" };
  if (path.basename(dirPath) === "app") pathsArr.push("/");
  //Recurses through directory only pulling acitve paths
  // Can make this more refined by looking for only directories with page.jsx in it
  function parsePaths(dirPath) {
    const dirFiles = fs.readdirSync(dirPath);
    // console.log(dirFiles);
    for (const file of dirFiles) {
      const stats = fs.statSync(path.join(dirPath, file));

      // console.log(file);
      if (stats.isDirectory()) {
        if (file[0] === "(") {
          parsePaths(path.join(dirPath, file));
        } else {
          if (map[file]) pathsArr.push(map[file]);
          else pathsArr.push("/" + file);
          fullPaths.push(dirPath + "/" + file);
          parsePaths(path.join(dirPath, file));
        }
      }
    }
  }

  parsePaths(dirPath);
  store.set("dirPaths", fullPaths);
  console.log(store.get("dirPaths"));
  return pathsArr;
}

function handleGetExperiments() {
  const experiments = store.get("experiments");
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
  let new_directory_path = directory_path;
  console.log("basename", path.basename(directory_path));
  if (path.basename(directory_path) === "src") new_directory_path += "/app";
  try {
    //Creates a variants folder in the experiment path
    fs.mkdir(
      path.join(new_directory_path, experiment_path, "variants"),
      (err) => console.log(err)
    );

    //copies middleware file into new directory
    fs.copyFile(
      path.join(__dirname, "../templates/middleware.ts"),
      path.join(directory_path, `middleware.ts`),
      fs.constants.COPYFILE_EXCL,
      (err) => console.log(err)
    );

    fs.copyFile(
      path.join(__dirname, "../templates/nimble.config.json"),
      path.join(directory_path, "nimble.config.json"),
      fs.constants.COPYFILE_EXCL,
      (err) => console.log(err)
    );

    console.log("reached this ");
    const data = fs.readFileSync(
      path.join(directory_path, "nimble.config.json")
    );

    const parsed_data = JSON.parse(data);

    const paths = parsed_data.map((el) => el.experiment_path);
    console.log(paths);
    if (!paths.includes(experiment_path)) {
      parsed_data.push({
        experiment_path: experiment_path,
        experiment_name: Experiment_name,
        experiment_id: experiment_uuid,
        device_type: Device_Type,
        variants: [],
      });
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
      axios.post("https://nimblebackend-te9u.onrender.com/createExperiment", {
        experiment_name: Experiment_name,
        experimentId: experiment_uuid,
        experiment_path,
        device_type: Device_Type,
      });
      console.log(directory_path);
    } else {
      const msg = "Experiment Already Created";
      return msg;
    }

    fs.writeFileSync(
      path.join(directory_path, "nimble.config.json"),
      JSON.stringify(parsed_data)
    );

    console.log("New experiment created");
  } catch (error) {
    console.error(
      "Error creating experiment with name ",
      experiment,
      "error message: ",
      error
    );
  }
}

async function handleAddVariant(event, variant) {
  // destructure the variant object
  console.log(variant);
  const {
    filePath,
    weight,
    directoryPath,
    experimentPath,
    variantUuid,
    experiment_uuid,
  } = variant;
  let new_directory_path = directoryPath;
  console.log("basename", path.basename(directoryPath));
  if (path.basename(directoryPath) === "src") new_directory_path += "/app";

  // front end doesn't have access to the integer ID. Use the uuid to get the integer to use for the local

  const experimentObj = await prisma.Experiments.findFirst({
    where: {
      experiment_uuid: experiment_uuid,
    },
  });

  const experimentId = experimentObj.id;

  try {
    const newVariant = await prisma.Variants.create({
      data: {
        filePath: filePath,
        weights: weight,
        Experiment_Id: experimentId,

        // this is on the schema but may not be needed. For now a blank array
      },
    });
    console.log(variantUuid);
    //Add variants to supabase
    axios.post("https://nimblebackend-te9u.onrender.com/createVariant", {
      variant_id: variantUuid,
      experimentId: experiment_uuid,
      variant_weight: weight,
      variant_name: filePath,
    });

    fs.mkdirSync(
      path.join(new_directory_path, experimentPath, "variants", filePath)
    );
    //Creates variant in variants folder
    fs.copyFile(
      path.join(new_directory_path, experimentPath, `page.js`),
      path.join(
        new_directory_path,
        experimentPath,
        "variants",
        `${filePath}`,
        "page.js"
      ),
      (err) => console.log(err)
    );

    const data = fs.readFileSync(
      path.join(directoryPath, "nimble.config.json")
    );
    const parsed_data = JSON.parse(data);
    //Adds variant to corresponding experiment
    for (let i = 0; i < parsed_data.length; i++) {
      if (parsed_data[i].experiment_path === experimentPath) {
        parsed_data[i].variants.push({
          id: variantUuid,
          fileName: filePath,
          weight: weight,
        });
      }
    }
    fs.writeFileSync(
      path.join(directoryPath, "nimble.config.json"),
      JSON.stringify(parsed_data)
    );
    console.log("New variant added");
  } catch (error) {
    console.error(
      "Error creating variant with data: ",
      variant,
      "error message: ",
      error
    );
  }
}

async function handleGetVariants(event, experimentId) {
  console.log("reached the getVariants function");
  try {
    const expVariants = await prisma.experiments.findMany({
      where: {
        experiment_uuid: experimentId,
      },
      select: {
        Variants: true,
      },
    });
    // console.log(variants);
    return JSON.stringify(expVariants);
  } catch (error) {
    console.error(
      "Error retrieving variant with experimentID ",
      experimentId,
      "error message: ",
      error
    );
  }
}

async function handleGetExperiments(event, experimentId) {
  console.log("reached the getExperiments function");
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
      "Error fetching experiment with experimentID ",
      experimentId,
      "error message: ",
      error
    );
  }
}
async function handleAddRepo(event, repo) {
  // console.log(repo);
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
async function handleCreateTextEditor(event, value) {
  console.log(value);
  console.log(Object.keys(value) + " are keys passed down");

  const { filePath, experimentPath, directoryPath } = value;
  let newDirectoryPath = directoryPath;
  if (path.basename(directoryPath) === "src") newDirectoryPath += "/app";
  await createTextEditorModal(
    newDirectoryPath +
      experimentPath +
      "/variants" +
      "/" +
      filePath +
      "/page.js"
  );

  // const data = fs.readFileSync(filePath)

  console.log("hi");
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

async function handleCloseModal(event, value) {
  try {
    const { data, filePath } = value;
    console.log(data);
    fs.writeFile(filePath, data, (err) => console.log(err));
    childWindow.close();
  } catch (err) {
    console.log(err);
  }
}

async function handleRemoveVariant(event, value) {
  const { filePath } = value;
  console.log("reached removeVariant. Variant path to remove " + filePath);
  try {
    const { data, filePath } = value;
    console.log(data);
    // query the database to get all IDs for a given filepath
    const variantObj = await prisma.variants.findMany({
      where: {
        filePath: filePath,
      },
    });

    await prisma.variants.delete({
      where: {
        id: variantObj[0].id,
      },
    });

    // remove from database
    axios.delete("https://nimblebackend-te9u.onrender.com/deleteVariant", {
      variant_id: variantObj[0].variantUuid,
    });
  } catch (err) {
    console.log(err);
  }
}
//Event Listeners for Client Side Actions
ipcMain.handle("dialog:openFile", handleFileOpen);
ipcMain.handle("directory:parsePaths", handleDirectoryPaths);
ipcMain.handle("experiment:getExperiments", handleGetExperiments);
ipcMain.handle("modal:createModal", handleCreateTextEditor);
ipcMain.handle("modal:closeModal", handleCloseModal);
// Database API
ipcMain.handle("database:addExperiment", handleAddExperiment);
ipcMain.handle("database:addVariant", handleAddVariant);
ipcMain.handle("database:getVariants", handleGetVariants);
ipcMain.handle("database:addRepo", handleAddRepo);
ipcMain.handle("database:getRepo", handleGetRepo);
ipcMain.handle("database:removeVariant", handleRemoveVariant);

//File System API
ipcMain.on("save-file", async (_event, value) => {
  try {
    const { data, filePath } = value;
    if (filePath.includes(__dirname)) return;

    console.log(data);
    fs.writeFile(filePath, data, (err) => {
      if (err) console.log(err);
    });
  } catch (err) {
    console.log(err);
  }
});

const isMac = process.platform === "darwin";

const template = [
  // { role: 'appMenu' }
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: "about" },
            { type: "separator" },
            { role: "services" },
            { type: "separator" },
            { role: "hide" },
            { role: "hideOthers" },
            { role: "unhide" },
            { type: "separator" },
            { role: "quit" },
          ],
        },
      ]
    : []),
  // { role: 'fileMenu' }
  {
    label: "File",
    submenu: [
      isMac ? { role: "close" } : { role: "quit" },
      {
        click: () => childWindow.webContents.send("save-file"),
        label: "Save",
        accelerator: process.platform === isMac ? "Cmd+s" : "Ctrl+s",
      },
    ],
  },
  // { role: 'editMenu' }
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      ...(isMac
        ? [
            { role: "pasteAndMatchStyle" },
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [{ role: "delete" }, { type: "separator" }, { role: "selectAll" }]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forceReload" },
      { role: "toggleDevTools" },
      { type: "separator" },
      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },
      { role: "togglefullscreen" },
    ],
  },
  // { role: 'windowMenu' }
  {
    label: "Window",
    submenu: [
      { role: "minimize" },
      { role: "zoom" },
      ...(isMac
        ? [
            { type: "separator" },
            { role: "front" },
            { type: "separator" },
            { role: "window" },
          ]
        : [{ role: "close" }]),
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: async () => {
          const { shell } = require("electron");
          await shell.openExternal("https://nimbleab.io");
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
