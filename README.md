# create-ae-contract-as

A scaffolding tool for quickly generating smart contract projects for the Archethic Public Blockchain using AssemblyScript. This tool streamlines the setup process, enabling developers to focus on building and deploying smart contracts.

## Getting Started

### Prerequisites

- Node.js
- npm

### Usage

To generate a new project, run the following command:

```bash
npm create @archethicjs/ae-contract-as

```

This will create a new folder named my-smart-contract with the necessary files and structure.


```bash
npx --yes @archethicjs/create-ae-contract-as -y --name my-contract

```


### Project structure
```
ae-contract/
├── assembly/
│   ├── index.ts         # Main contract code
│   ├── tsconfig.json    # Typescript config for AssemblyScript
├── tests
    ├── index.test.ts    # Main test file
├── asconfig.json        # AssemblyScript configuration
├── package.json         # Dependencies and project scripts
├── README.md            # Documentation for the project
└── tsconfig.json        # TypeScript configuration
```

## **Contribution**

Thank you for considering to help out with the source code. We welcome contributions from anyone and are grateful for even the smallest of improvement.

Please to follow this workflow:

1. Fork it!
2. Create your feature branch (git checkout -b my-new-feature)
3. Commit your changes (git commit -am 'Add some feature')
4. Push to the branch (git push origin my-new-feature)
5. Create new Pull Request

## **Licence**

AGPL
