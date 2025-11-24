import WalletConnector from './wallet.js';

document.addEventListener('DOMContentLoaded', async () => {
    const wallet = new WalletConnector();
    await wallet.init();
});

if (document.readyState === 'loading') {
} else {
    const wallet = new WalletConnector();
    wallet.init();
}