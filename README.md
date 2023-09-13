

<br />
  <div align="left">
    <img src="./images/icon.png" alt="Logo" width="200" height="auto">
  </div>
<br />

## NimbleAB
## About
Nimble AB is a lightweight NextJS AB testing platform designed to streamline AB testing on NextJS apps that want to take advantage of SSG load times in UX experiments. The platform's goal is to make the developer experience of configuring and implementing AB tests on static sites fast and painless so that businesses can optimize load times on AB tests without sacrificing the dynamicism required for high-impact testing.

For more info visit our [website](https://nimbleab.io/) or read our [Medium article](https://nimblelabs.medium.com/6b54e84e473) 

## Tech Stack
<div align="center" width="100%">
            
[![Typescript][TS.js]][TS-url] [![JavaScript][JavaScript]][JavaScript-url] [![React][React.js]][React-url] [![React Router][React Router]][React-Router-url] [![Node.js][Node.js]][Node-url] 
[![Prisma][Prisma.js]][Prisma-url] [![Jest][Jest]][Jest-url] [![Tailwind][Tailwind]][Tailwind-url] [![DaisyUI][DaisyUI]][DaisyUI-url][![Electron.js][Electron.js]][Electron-url] [![AWS][AWS]][AWS-url] [![Next][Next.js]][Next-url] [![Supabase][Supabase]][Supabase-url] [![Express][Express.js]][Express-url]
</div>

## Download
[Windows](https://nimbleab-production-build.s3.us-east-2.amazonaws.com/NimbleAB+Setup.exe)
[Mac]()

## Usage
Nimble AB offers an NPM package for SSG decisioning that can be installed here (placeholder)

Our Desktop app can be used for full end to end test construction and variant creation. Download link is above. Create experiments, build and edit variants, and use config files generated to your local repo on your CDN to serve pages. 

**NPM Package Usage**  

Install the package below

`npm install nimbleab`

The package expects a config object in the following format: 

```json
  {
    "experiment_path": "/pages",
    "experiment_name": "Blog test 2",
    "experiment_id": "57056b01-39bd-43c5-85e1-fba6611bb2b2",
    "device_type": "desktop",
    "variants": [
      {
        "id": "333896e0-09e7-4b29-9398-e250b60941c4",
        "fileName": "testa",
        "weight": 25
      },
      {
        "id": "05e1af45-b7a2-417c-a43d-d1b29d6a4b15",
        "fileName": "testb",
        "weight": 25
      },
      {
        "id": "b6205652-b885-47b6-968b-1635d2e6dc48",
        "fileName": "testc",
        "weight": 50
      }
    ]
  }
```

A user can either configure a static test independent of our underlying experiment platform by adjusting weights and URLs on the static config deployed on an edge function that can run Javascript. The package will not function properly without weights summing to 100 so be sure to validate this. Verbose erroring in this case is a future roadmap feature.

A user can also call our API to return variants using their experiment Id. This can be found in the nimble.config.json file on your local repo after experiment creation in the Electron app. 

**Desktop app usage**  

Nimble Labs is proud to offer our open source Desktop app for public use. Download link is above. To use:

- Dowload the desktop app (links above)  
- Create an experiment  
   - Press the Open Directory button  
   - Select the repo's parent directory  
   - Once the parent directory is selected, then select the folder where a page.js file should contain the test's base page source  
   - Press create experiment to be taken to the variants config  
- Configure variants  
   - Add variants using the inputs at the top of the page. The file path will be the name of the file storing the variant, so naming in a semantically useful way is recommended.  
   - Create the weight for the variant. Many tests will be 50/50 or 33/33/34 but customize the weights as needed to achieve the randomness desired to meet business requirements.  
   - Once all variants have been configured, hit edit to make adjustments as needed  
- Edit variant code  
   - Hit edit on the variants table to make changes to the variants. Ensure to save when finished; these changes will save down to your local.  
- Deploy  
   - Once all edits are complete, the necessary middleware will be automatically saved down into the nimble.config.json file and the variants folder inside your local repo. Just deploy the new pages to your hosting infrastructure, and the middleware will perform decisioning according to the weights previously configured.

**
## Features Roadmap
Open issues for any issues encountered and the team will investigate and implement fixes as able. 

Our longer term features roadmap is as follows:

Highest priority
* Backwards compatibility to older versions of NextJs (<13.0)
* Github deploys from the UI
* Support for Typescript projects
* Validation improvements on our Front End (weights validation doesn't take place currently and is on the user)
* Project validation (provide user feedback if their project isn't NextJs validated)

Future facing
* Adding file tree into the editor 
* CLI support for experiment maintenance
* Verbose error handling on client

Contributions are appreciated and will be reviewed as fast as we are able. Merged contributions will be credited as authors.

## Authors
| Developed By |                                                                     Github                                                                      |                                                                   LinkedIn                                                                    |
| :----------: | :---------------------------------------------------------------------------------------------------------------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------------------------: |
|  Andrew Kraus  |    [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ajkraus04)    | [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/andrewjkraus/) |
| Zhenwei Liu | [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lzwaaron) |  [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/zhenwei--liu/)  |
|  James Boswell  |  [![Github](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/jamesboswell1994)   |   [![LinkedIn](https://img.shields.io/badge/LinkedIn-%230077B5.svg?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/james-boswell/)    |



[React.js]: https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://reactjs.org/
[TS.js]: https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white
[TS-url]: https://www.typescriptlang.org/
[D3.js]: https://img.shields.io/badge/d3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white
[D3-url]: https://d3js.org/
[React Router]: https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white
[React-Router-url]: https://reactrouter.com/en/main
[JavaScript]: https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E
[JavaScript-url]: https://www.javascript.com/
[Node.js]: https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[Kubernetes]: https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white
[Kubernetes-url]: https://kubernetes.io/
[Jest]: https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white
[Jest-url]: https://jestjs.io/
[AWS]: https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white
[AWS-url]: https://aws.amazon.com/
[DaisyUI]: https://img.shields.io/badge/daisyui-5A0EF8?style=for-the-badge&logo=daisyui&logoColor=white
[DaisyUI-url]: https://daisyui.com/
[Tailwind]: https://img.shields.io/badge/Tailwind-%231DA1F2.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[MUI]: https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white
[MUI-url]: https://mui.com/
[SocketIO]: https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101
[SocketIO-url]: https://socket.io/
[Electron.js]: https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white
[Electron-url]: https://www.electronjs.org/
[Prisma.js]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[Next.js]: https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white
[Next-url]: https://nextjs.org/
[Supabase]: https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white
[Supabase-url]: https://supabase.com/
[Express.js]: https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB
[Express-url]: https://expressjs.com/
