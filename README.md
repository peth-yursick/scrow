# sCrow

sCrow is an easy-to-use tool that empowers web3 freelancers with secure cryptocurrency invoicing, escrow services, and arbitration. Designed to streamline the payment process, sCrow ensures that freelancers and clients can transact with confidence, knowing that funds are securely held in escrow until work is completed to satisfaction.

## Features

- **Cryptocurrency Invoicing:** Generate and send invoices directly in cryptocurrency, simplifying payments across borders.
- **Escrow Services:** Funds are held securely in a smart contract until the agreed-upon work is completed.
- **Arbitration:** In case of disputes, sCrow provides an arbitration mechanism to ensure fair resolution.

## Repository Structure

This project is organized as a pnpm monorepo, containing several packages and apps to handle different aspects of the sCrow protocol. Below is an overview:

### Packages

- **constants:** Unified source for configs and constants used across the sCrow protocol. [npm package](https://www.npmjs.com/package/@scrow/constants)
- **docs:** Documentation for the sCrow protocol, including guides, API references, and usage instructions.
- **forms:** Reusable form components for collecting and validating user input in the sCrow dapp. [npm package](https://www.npmjs.com/package/@scrow/forms)
- **graphql:** GraphQL helpers and schema for querying and interacting with sCrow data. [npm package](https://www.npmjs.com/package/@scrow/graphql)
- **hooks:** A collection of React hooks for accessing and manipulating sCrow states and effects. [npm package](https://www.npmjs.com/package/@scrow/hooks)
- **shared:** Common utilities and components shared across multiple packages in the sCrow ecosystem. [npm package](https://www.npmjs.com/package/@scrow/shared)
- **types:** TypeScript types and interfaces used across the sCrow monorepo for type safety and consistency. [npm package](https://www.npmjs.com/package/@scrow/types)
- **ui:** Reusable UI components for integrating sCrow functionalities into web applications. [npm package](https://www.npmjs.com/package/@scrow/ui)
- **utils:** A set of utility functions and helpers used throughout the sCrow codebase. [npm package](https://www.npmjs.com/package/@scrow/utils)

### Apps

- **contracts:** Contains the smart contracts and contract interaction utilities that power sCrow.
- **dapp:** The decentralized application that provides the user interface for interacting with sCrow protocol.
- **website:** The website for the sCrow protocol.
- **subgraph:** Subgraph for indexing and querying sCrow events and data from the blockchain.

## Installation

To get started with sCrow, install the necessary dependencies using `pnpm`:

```bash
pnpm install
```

## Using sCrow Packages

Several packages in the sCrow monorepo are published on npm and can be used directly in your project. Below are the installation commands for these packages:

- **constants:** Install the constants package:

  ```bash
  pnpm add @scrow/constants
  ```

- **graphql:** Install the GraphQL package:

  ```bash
  pnpm add @scrow/graphql
  ```

- **hooks:** Install the React hooks package:

  ```bash
  pnpm add @scrow/hooks
  ```

- **utils:** Install the utilities package:

  ```bash
  pnpm add @scrow/utils
  ```

- **types:** Install the TypeScript types package:

  ```bash
  pnpm add @scrow/types
  ```

- **forms:** Install the forms package:

  ```bash
  pnpm add @scrow/forms
  ```

- **ui:** Install the ui package:

  ```bash
  pnpm add @scrow/ui
  ```

- **shared:** Install the shared utilities and components package:
  ```bash
  pnpm add @scrow/shared
  ```

These packages can be integrated into your own projects to leverage the core functionalities of the sCrow protocol.

## Versioning

We follow [Semantic Versioning](https://semver.org/) for all packages in the sCrow monorepo. To keep versions synchronized across packages, we use `syncpack`. After making changes and updating versions in `package.json`, you can ensure consistency by running:

```bash
pnpx syncpack fix-mismatches
```

This command checks for version mismatches and updates them across the monorepo to maintain alignment.

## Managing Changes and Publishing with Changeset

sCrow uses [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing for the monorepo. Changesets provide a simple way to track changes to the various packages and ensure that proper versioning is applied before publishing updates.

### Creating a Changeset

Whenever you make changes to any of the packages in the monorepo, you need to create a changeset to document those modifications. Use the following command to create a new changeset:

```bash
pnpm changeset
```

You will be prompted to select which packages are affected by the change, and what kind of version bump (major, minor, patch) is required.

After completing the prompt, a markdown file will be created in the `.changeset` folder, which details the changes made.

### Committing and Reviewing Changesets

Once you've created a changeset, you can commit it to version control along with your code changes. Review the generated changeset markdown to ensure it correctly reflects the changes and intended version bumps.

### Releasing New Versions

When you're ready to release new versions of your packages, run the following command to bump the versions in `package.json` files based on the changesets:

```bash
pnpm changeset version
```

This will update the package versions according to the changes you made in the `.changeset` folder.

### Publishing to npm

Once the versions are bumped, you can publish the updated packages to npm using:

```bash
pnpm changeset publish
```

This command will publish all packages in the monorepo that have had changes, using the version bumps defined in the changeset.

### Verifying Version Consistency

To ensure all package versions are synchronized and consistent across the monorepo, you can use `syncpack` as described in the [Versioning](#versioning) section.

## Metadata Schema Standard

All metadata uploaded to IPFS and saved as details in a sCrow contract must adhere to the following schema:

```json
{
  "version": "1.0",
  "id": "invoice-123",
  "title": "Web Development Services",
  "description": "Invoice for web development services provided in September.",
  "image": {
    "id": "image-001",
    "src": "https://example.com/image.png",
    "type": "https",
    "mimeType": "image/png",
    "createdAt": 1696800000
  },
  "documents": [
    {
      "id": "doc-001",
      "src": "ipfs://QmSomeHash",
      "type": "ipfs",
      "mimeType": "application/pdf",
      "createdAt": 1696800000
    },
    {
      "id": "doc-002",
      "src": "ar://arSomeHash",
      "type": "arweave",
      "mimeType": "application/pdf",
      "createdAt": 1696800500
    }
  ],
  "createdAt": 1696799600,
  "startDate": 1696540800,
  "endDate": 1699129200,
  "resolverType": "kleros",
  "klerosCourt": 1,
  "milestones": [
    {
      "id": "milestone-001",
      "title": "Phase 1 Completion",
      "description": "Completion of initial design phase.",
      "image": {
        "id": "image-001",
        "src": "https://example.com/image.png",
        "type": "https",
        "mimeType": "image/png",
        "createdAt": 1696800000
      },
      "documents": [
        {
          "id": "doc-003",
          "src": "https://example.com/phase1.pdf",
          "type": "https",
          "mimeType": "application/pdf",
          "createdAt": 1696800700
        }
      ],
      "createdAt": 1696800600,
      "endDate": 1697055600
    }
  ]
}
```

## Community

Join our community on [Discord](https://discord.com/invite/Rws3gEu8W7) for support, discussions, and updates about sCrow.
