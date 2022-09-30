# LongTermAirQualityIndex
## The dev branch is the default branch for branching/forking and merging into. 
## Contribution
- Branch or fork the dev branch.
- When ready submit a pull request to merge your branch or fork into the dev branch.
- Pull requests require 1 review to merge.
- We should never merge our individual pull requests into test or main.
- The Issues tab in GitHub includes all assigned and outstanding tasks. 
- Make sure not to upload API keys to GitHub
## Setup Local Enviorment for front-end
- Install node.js (https://nodejs.org/en/)
- Initalize React project in front-end/ltaq using: 'npm install'
- Install nx vscode extension
- run the react app with npm start inside front-end/ltaq
## Setup Local Enviorment for back-end
- Install Python (https://www.python.org/)

## File Tree
```
LongTermAirQualityIndex<br/>
├── .vscode                                                <--- Description<br/>
├── back-end                                               <--- Description<br/>
│   └── airnow.py                                          <--- Description<br/>
│   └── main.py                                            <--- Description<br/>
│   └── sampleAirNow.py                                    <--- Description<br/>
│   └── test_flask.py                                      <--- Description<br/>
│   └── WildFire.py                                        <--- Description<br/>
│   └── README.md                                          <--- Back-end README<br/>
├── front-end                                              <--- Description<br/>
│   └── ltaq                                               <--- Description<br/>
│      ├── .prettierignore                                 <--- Description<br/>
│      ├── .prettierc                                      <--- Description<br/>
│      ├── .editorconfig                                   <--- Description<br/>
│      ├── .eslintrc.json                                  <--- Description<br/>
│      ├── .vscode                                         <--- Description<br/>
│      │      └── extensions.json                          <--- Description<br/>
│      ├── babel.config.json                               <--- Description<br/>
│      ├── jest.config.ts                                  <--- Description<br/>
│      ├── jest.preset.jsx                                 <--- Description<br/>
│      ├── nx.json                                         <--- Description<br/>
│      ├── package.json                                    <--- Description<br/>
│      ├── package-lock.json                               <--- Description<br/>
│      ├── tsconfig.base.json                              <--- Description<br/>
│      ├── workspace.json                                  <--- Description<br/>
│      ├── apps                                            <--- Code for front page<br/>
│      │   ├── ltaq                                        <--- Description<br/>
│      |   │   ├── src                                     <--- Description<br/>
│      |   |   │   ├── app                                 <--- Description<br/>
│      |   |   |   │   ├── app.csc                         <--- Styling for front-end<br/>
│      |   |   |   │   ├── app.tsx                         <--- Front-end layout and order<br/>
│      |   |   |   │   ├── map.jsx                         <--- Leaflet Map API component<br/>
│      |   |   |   │   ├── michiganInitialLatitude.json    <--- Sample wildfire coordinates for testing<br/>
│      |   |   |   │   └── searchLocation.tsx              <--- User location search box component<br/>
│      |   |   │   ├── assets                              <--- Description<br/>
│      |   |   |   │   └── .gitkeep                        <--- Description<br/>
│      |   |   │   ├── environments                        <--- Description<br/>
│      |   |   |   │   ├── environment.prod.ts             <--- Description<br/>
│      |   |   |   │   └── environment.ts                  <--- Description<br/>
│      |   |   │   ├── favicon                             <--- Description<br/>
│      |   |   │   ├── index.html                          <--- Description<br/>
│      |   |   │   ├── main.tsx                            <--- Description<br/>
│      |   |   │   ├── polyfills.ts                        <--- Description<br/>
│      |   |   │   └── styles.csc                          <--- Global front-end styling<br/>
│      |   │   ├── .babelrc                                <--- Description<br/>
│      |   │   ├── .browserslistrc                         <--- Description<br/>
│      |   │   ├── .eslintrc.json                          <--- Description<br/>
│      |   │   ├── jest.config.ts                          <--- Description<br/>
│      |   │   ├── project.json                            <--- Description<br/>
│      |   │   ├── tsconfig.app.json                       <--- Description<br/>
│      |   │   ├── tsconfig.json                           <--- Description<br/>
│      |   │   └── tsconfig.spec.json                      <--- Description<br/>
│      │   ├── ltaq-e2e                                    <--- Description<br/>
│      |   │   ├── src                                     <--- Description<br/>
│      |   |   │   ├── e2e                                 <--- Description<br/>
│      |   |   |   │   └── app.cy.ts                       <--- Description<br/>
│      |   |   │   ├── fixtures                            <--- Description<br/>
│      |   |   |   │   └── example.json                    <--- Description<br/>
│      |   |   │   └── support                             <--- Description<br/>
│      |   |   |       ├── app.po.ts                       <--- Description<br/>
│      |   |   |       ├── commands.ts                     <--- Description<br/>
│      |   |   |       └── e2e.ts                          <--- Description<br/>
│      |   │   ├── .eslintrc.json                          <--- Description<br/>
│      |   │   ├── cypress.config.ts                       <--- Description<br/>
│      |   │   ├── project.json                            <--- Description<br/>
│      |   │   └── tsconfig.json                           <--- Description<br/>
│      │   └── .gitkeep                                    <--- Description<br/>
│      ├── libs\                                           <--- Description<br/>
│      ├── node_modules\                                   <--- Description<br/>
│      ├── tools\                                          <--- Description<br/>
│      |   └── generators\                                 <--- Description<br/>
│      └── README.md                                       <--- Front-end README<br/>
└── README.md                                              <--- Project README<br/>
```