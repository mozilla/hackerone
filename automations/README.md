# HackerOne Automations

A collection of automation scripts for HackerOne programs.

## Automations

### severity-assessment.js

Uses HAI (HackerOne AI) to automatically assess the severity of incoming security reports based on the program's severity definitions.

Configuration:
- `dryRun`: Set to `true` for testing (logs only), `false` for production
- `debug`: Set to `true` to enable debug logging

## Development

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

```bash
npm install
```

### Running Tests

```bash
npm test
```

This runs all tests using Jest. Tests are co-located with their corresponding automation files in the `automations/` directory.

### Adding a New Automation

1. Create a new file in `automations/` (e.g., `automations/my-automation.js`)
2. Export a `run` function that accepts the HackerOne automation context:
   ```javascript
   exports.run = async ({data, config, apiGet, apiPost, apiPut, promptHai}) => {
     // Your automation logic here
   };
   ```
3. Create a corresponding test file (e.g., `automations/my-automation.test.js`)
4. Add any test fixtures to `fixtures/`

See [HackerOne Automations Documentation](https://docs.hackerone.com/en/articles/9653528-creating-and-running-automations) for more details.
