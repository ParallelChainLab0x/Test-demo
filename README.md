# Signalra

This repository is a dApp demonstration prepared for a technical skill assessment. It is intended for evaluation of implementation, setup, and contract workflows.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 17, React Router v6, SCSS, Material-UI |
| Backend | Express.js, SQLite (via Sequelize), Firebase Realtime Database |
| Blockchain | Solidity 0.8.20, Hardhat, OpenZeppelin, ethers.js v5 |
| Wallet | MetaMask, Phantom, Rabby |
| Networks | EVM (Ethereum Mainnet, BSC) and Solana (configurable) |

## Project Structure

```
Signalra/
  contracts/           Solidity smart contracts
    Signalra.sol         Credit system (buy credits, tiers, withdraw)
    VotingManager.sol    On-chain voting (vote, daily limits, fee forwarding)
  test/                Hardhat tests (53 tests)
  scripts/             Deployment & ABI sync scripts
  deployments/         Deployment records per network
  src/                 React frontend
    pages/               Page components (Default, Treasury, Details, etc.)
    components/          Shared UI components (NavBar, Footer, Filter, etc.)
    helpers/             Wallet, contract, Firebase, and config utilities
      abis/              Contract ABIs (synced from Hardhat artifacts)
    assets/              Images and fonts
  app/                 Express backend
    controllers/         Mempool scanning, DEX trading controllers
    routes/              API routes
    config/              Database configuration
  hardhat.config.js    Hardhat configuration
  package.json         Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js >= 18.19.0
- npm >= 8.0.0
- A supported wallet extension (MetaMask, Phantom, or Rabby)

### Install and run

```sh
npm install
```

When install finishes, the demo starts on its own. The React app is at `http://localhost:3000`.

### Environment

Create a `.env` file in the project root:

```
OPENAI_KEY=your_openai_key
OPENAI_MODEL=gpt-4
```

## Smart Contracts

### Compile

```sh
npm run compile
```

### Run Tests

```sh
npm run test:contracts
```

The 53 tests cover credit purchases (9 tiers), spending, tier buying, on-chain voting, daily limits, admin functions, pause/unpause, access control, and reentrancy protection.

### Build Contracts and Sync ABIs

```sh
npm run build:contracts
```

Compiles contracts and copies ABIs to `src/helpers/abis/` for the React frontend.

### Deploy

```sh
# Local Hardhat network
npm run deploy:local

# Sepolia testnet (configure in hardhat.config.js)
npm run deploy:sepolia

# Ethereum mainnet (configure in hardhat.config.js)
npm run deploy:mainnet
```

Deployment records are saved to `deployments/<network>.json`.

### Contracts

**Signalra.sol** — platform credit system
- `buyCredits()` — purchase credits with ETH (9 price tiers)
- `spendCredits(amount, reason)` — spend credits for platform actions
- `buyRubyTier()` / `buyDiamondTier()` — tier upgrades
- `withdraw()` — owner withdraws ETH to treasury
- `pause()` / `unpause()` — emergency circuit breaker

**VotingManager.sol** — on-chain voting
- `vote(coinId)` — vote for a token listing (0.0035 ETH fee)
- `votesRemainingToday(address)` — check daily allowance
- `getVotes(coinId)` — read total votes for a listing
- Fees forwarded to treasury on each vote

Both contracts use OpenZeppelin's `Ownable`, `ReentrancyGuard`, and `Pausable`.

## Available Scripts

| Command | Description |
|---|---|
| `npm install` | Install dependencies and start the demo |
| `npm run compile` | Compile Solidity contracts |
| `npm run test:contracts` | Run all 53 smart contract tests |
| `npm run build:contracts` | Compile contracts and sync ABIs to the frontend |
| `npm run deploy:local` | Deploy to the local Hardhat network |
| `npm run deploy:sepolia` | Deploy to Sepolia testnet |
| `npm run deploy:mainnet` | Deploy to Ethereum mainnet |
| `npm run sync-abi` | Copy compiled ABIs to the frontend |
| `npm test` | Run React unit tests |

## Configuration

Contract addresses and fee settings are in `src/helpers/configurations/index.js`:

```js
ENVS = {
  CONTRACT_ADDRESS: "0x...",        // Signalra contract
  VOTING_CONTRACT_ADDRESS: "",      // VotingManager (set after deployment)
  CHAIN_ID: "0x1",                  // Ethereum Mainnet
  NORMAL_VOTE_FEE: "0.0035",       // ETH per vote
  RUBY_TIRE_FEE: "0.5",            // Ruby tier price
  DIAMOND_TIRE_FEE: "1",           // Diamond tier price
  CHARITY_ADDR: "0x...",            // Fee recipient
  TREASURY_ADDR: "0x...",           // Treasury address
}
```

Network configuration for deployments is in `hardhat.config.js`.

## License

MIT
