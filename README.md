# LongTermAirQualityIndex

## Setup Local Enviorment for front-end
- Install node.js (https://nodejs.org/en/)
- Open a terminal in vs code 
- Navigate to `front-end/ltaq`
- run `npm install`
- Install nx vscode extension (if not already downloaded)
- In the terminal inside `front-end/ltaq`, run `npm start` 
## Setup Local Enviorment for back-end
- Install Python (https://www.python.org/) (if not already downloaded)
- Install Flask `pip install flask` (if not already downloaded)
- Install Flask-Cors `pip install flask-cors` (if not already downloaded)
- Add the API key to airnow.py (ask Ryan for it)
- Open another terminal and run `python3 Wildfire.py`
- Open another terminal and run `python3 airnow.py`
- Open another terminal and run `python3 coordinates.py`

## The dev branch is the default branch for branching/forking and merging into. 
## Contribution
- Branch or fork the dev branch.
- When ready submit a pull request to merge your branch or fork into the dev branch.
- Pull requests require 1 review to merge.
- We should never merge our individual pull requests into test or main.
- The Issues tab in GitHub includes all assigned and outstanding tasks. 
- Make sure not to upload API keys to GitHub

## File Tree
```
LongTermAirQualityIndex
├── .vscode                                                <--- Description
├── back-end                                               <--- Description
│   └── airnow.py                                          <--- Description
│   └── main.py                                            <--- Description
│   └── sampleAirNow.py                                    <--- Description
│   └── test_flask.py                                      <--- Description
│   └── WildFire.py                                        <--- Description
│   └── README.md                                          <--- Back-end README
├── front-end                                              <--- Description
│   └── ltaq                                               <--- Description
│      ├── .prettierignore                                 <--- Description
│      ├── .prettierc                                      <--- Description
│      ├── .editorconfig                                   <--- Description
│      ├── .eslintrc.json                                  <--- Description
│      ├── .vscode                                         <--- Description
│      │      └── extensions.json                          <--- Description
│      ├── babel.config.json                               <--- Description
│      ├── jest.config.ts                                  <--- Description
│      ├── jest.preset.jsx                                 <--- Description
│      ├── nx.json                                         <--- Description
│      ├── package.json                                    <--- Description
│      ├── package-lock.json                               <--- Description
│      ├── tsconfig.base.json                              <--- Description
│      ├── workspace.json                                  <--- Description
│      ├── apps                                            <--- Code for front page
│      │   ├── ltaq                                        <--- Description
│      |   │   ├── src                                     <--- Description
│      |   |   │   ├── app                                 <--- Description
│      |   |   |   │   ├── app.csc                         <--- Styling for front-end
│      |   |   |   │   ├── app.tsx                         <--- Front-end layout and order
│      |   |   |   │   ├── map.jsx                         <--- Leaflet Map API component
│      |   |   |   │   ├── michiganInitialLatitude.json    <--- Sample wildfire coordinates for testing
│      |   |   |   │   └── searchLocation.tsx              <--- User location search box component
│      |   |   │   ├── assets                              <--- Description
│      |   |   |   │   └── .gitkeep                        <--- Description
│      |   |   │   ├── environments                        <--- Description
│      |   |   |   │   ├── environment.prod.ts             <--- Description
│      |   |   |   │   └── environment.ts                  <--- Description
│      |   |   │   ├── favicon                             <--- Description
│      |   |   │   ├── index.html                          <--- Description
│      |   |   │   ├── main.tsx                            <--- Description
│      |   |   │   ├── polyfills.ts                        <--- Description
│      |   |   │   └── styles.csc                          <--- Global front-end styling
│      |   │   ├── .babelrc                                <--- Description
│      |   │   ├── .browserslistrc                         <--- Description
│      |   │   ├── .eslintrc.json                          <--- Description
│      |   │   ├── jest.config.ts                          <--- Description
│      |   │   ├── project.json                            <--- Description
│      |   │   ├── tsconfig.app.json                       <--- Description
│      |   │   ├── tsconfig.json                           <--- Description
│      |   │   └── tsconfig.spec.json                      <--- Description
│      │   ├── ltaq-e2e                                    <--- Description
│      |   │   ├── src                                     <--- Description
│      |   |   │   ├── e2e                                 <--- Description
│      |   |   |   │   └── app.cy.ts                       <--- Description
│      |   |   │   ├── fixtures                            <--- Description
│      |   |   |   │   └── example.json                    <--- Description
│      |   |   │   └── support                             <--- Description
│      |   |   |       ├── app.po.ts                       <--- Description
│      |   |   |       ├── commands.ts                     <--- Description
│      |   |   |       └── e2e.ts                          <--- Description
│      |   │   ├── .eslintrc.json                          <--- Description
│      |   │   ├── cypress.config.ts                       <--- Description
│      |   │   ├── project.json                            <--- Description
│      |   │   └── tsconfig.json                           <--- Description
│      │   └── .gitkeep                                    <--- Description
│      ├── libs\                                           <--- Description
│      ├── node_modules\                                   <--- Description
│      ├── tools\                                          <--- Description
│      |   └── generators\                                 <--- Description
│      └── README.md                                       <--- Front-end README
└── README.md                                              <--- Project README
```