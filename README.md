# Wallet Connection - Vite Project

## Setup & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Integration into Existing Project

### 1. Copy Files
Copy these files to your existing Vite project:
- `src/wallet.js` - Main wallet connector class
- `src/style.css` - Wallet styles (merge with your CSS)

### 2. Import in Your Main JS
```javascript
import WalletConnector from './wallet.js';

const wallet = new WalletConnector();
wallet.init();
```

### 3. HTML Structure
```html
<div id="wallet-balance" class="balance-display"></div>
<button id="connect-wallet-btn" class="wallet-btn">
    Connect Wallet
</button>
<div id="wallet-status" class="status-message"></div>
```

## Features

✅ **Proper MetaMask Detection** - Waits for MetaMask injection  
✅ **Connection Status** - Shows real-time connection status  
✅ **Balance Display** - Shows ETH balance above button  
✅ **Address Display** - Shows shortened wallet address  
✅ **Auto-reconnect** - Remembers connection on reload  
✅ **Error Handling** - Handles all connection scenarios  

## Troubleshooting

If MetaMask still not detected:
1. Refresh the page after installing MetaMask
2. Make sure MetaMask is unlocked
3. Try in incognito mode
4. Check browser console for errors

## Browser Requirements

- Chrome/Edge with MetaMask extension
- Firefox with MetaMask extension
- Brave browser (built-in wallet support)