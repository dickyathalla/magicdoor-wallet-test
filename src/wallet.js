class WalletConnector {
    constructor() {
        this.isConnected = false;
        this.account = null;
        this.balance = null;
        this.button = null;
        this.balanceDisplay = null;
        this.statusDisplay = null;
    }

    async init() {
        this.button = document.getElementById('connect-wallet-btn');
        this.balanceDisplay = document.getElementById('wallet-balance');
        this.statusDisplay = document.getElementById('wallet-status');
        
        this.button.addEventListener('click', () => this.handleConnect());
        
        await this.waitForMetaMask();
        
        if (this.isMetaMaskAvailable() && window.ethereum.selectedAddress) {
            await this.connectWallet();
        }
    }

    async waitForMetaMask() {
        return new Promise((resolve) => {
            if (this.isMetaMaskAvailable()) {
                resolve();
                return;
            }

            let attempts = 0;
            const maxAttempts = 50; // 5 seconds max wait
            
            const checkMetaMask = () => {
                attempts++;
                
                if (this.isMetaMaskAvailable()) {
                    this.updateStatus('MetaMask detected', 'success');
                    resolve();
                } else if (attempts >= maxAttempts) {
                    this.updateStatus('MetaMask not found. Please install MetaMask extension.', 'error');
                    resolve();
                } else {
                    setTimeout(checkMetaMask, 100);
                }
            };
            
            checkMetaMask();
        });
    }

    isMetaMaskAvailable() {
        return typeof window.ethereum !== 'undefined' && 
               window.ethereum.isMetaMask === true;
    }

    async handleConnect() {
        if (this.isConnected) {
            this.disconnect();
        } else {
            await this.connectWallet();
        }
    }

    async connectWallet() {
        if (!this.isMetaMaskAvailable()) {
            this.updateStatus('Please install MetaMask extension', 'error');
            return;
        }

        try {
            this.updateStatus('Connecting...', 'pending');
            
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });
            
            if (accounts.length === 0) {
                this.updateStatus('No accounts found', 'error');
                return;
            }
            
            this.account = accounts[0];
            this.isConnected = true;
            
            await this.updateBalance();
            this.updateUI();
            this.setupEventListeners();
            
        } catch (error) {
            console.error('Connection failed:', error);
            
            if (error.code === 4001) {
                this.updateStatus('Connection rejected', 'error');
            } else if (error.code === -32002) {
                this.updateStatus('Connection request pending. Check MetaMask.', 'pending');
            } else {
                this.updateStatus('Connection failed', 'error');
            }
        }
    }

    setupEventListeners() {
        if (!window.ethereum) return;
        
        window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length === 0) {
                this.disconnect();
            } else {
                this.account = accounts[0];
                this.updateBalance();
                this.updateUI();
            }
        });

        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });
    }

    async updateBalance() {
        try {
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [this.account, 'latest']
            });
            
            this.balance = (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
        } catch (error) {
            console.error('Failed to get balance:', error);
            this.balance = '0.0000';
        }
    }

    updateUI() {
        if (this.isConnected && this.account) {
            const shortAddress = `${this.account.slice(0, 6)}...${this.account.slice(-4)}`;
            this.button.textContent = shortAddress;
            this.button.classList.add('connected');
            this.balanceDisplay.textContent = `Balance: ${this.balance} ETH`;
            this.balanceDisplay.style.display = 'block';
            this.updateStatus('Wallet connected', 'success');
        } else {
            this.button.textContent = 'Connect Wallet';
            this.button.classList.remove('connected');
            this.balanceDisplay.style.display = 'none';
            this.updateStatus('', '');
        }
    }

    updateStatus(message, type) {
        this.statusDisplay.textContent = message;
        this.statusDisplay.className = `status-message ${type}`;
    }

    disconnect() {
        this.isConnected = false;
        this.account = null;
        this.balance = null;
        this.updateUI();
    }
}

export default WalletConnector;