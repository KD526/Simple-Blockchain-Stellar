const crypto = require('crypto');

/**
 * Class representing individual blocks in our blockchain.
 */
class BlockRecord {
    /**
     * Constructor for the BlockRecord class.
     * @param {number} Index - Position of block in the chain.
     * @param {number} Timestamp - Time of block creation.
     * @param {Object} Data - Data associated with the block (e.g., transaction details).
     * @param {string} priorHash - Hash of the previous block in the chain.
     */
    constructor(Index, Timestamp, Data, priorHash = '') {
        this.Index = Index;
        this.Timestamp = Timestamp;
        this.Data = Data;
        this.priorHash = priorHash;
        this.currentHash = this.computeHash();
        this.nonce = 0;  // Used to adjust the block's hash in the proof-of-work mechanism
    }

    /**
     * Computes a hash value for the block using its content.
     * @returns {string} - The hash value of the block.
     */
    computeHash() {
        return crypto.createHash('sha256').update(
            this.Index + this.priorHash + this.Timestamp + JSON.stringify(this.Data) + this.nonce
        ).digest('hex');
    }

    /**
     * Proof-of-work algorithm to secure the blockchain. Miners must solve the problem to add a block.
     * @param {number} difficulty - Determines how hard it is to mine a block.
     */
    performMining(difficulty) {
        // Keep trying different proof values until we find a hash with the required leading zeros.
        while (this.currentHash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.currentHash = this.computeHash();
        }
        console.log("Block successfully mined: " + this.currentHash);
    }
}

/**
 * Class representing a simple blockchain.
 */
class BlockChain {
    /**
     * Constructor for the BlockChain class. Initializes with a genesis block.
     */
    constructor() {
        this.blockList = [this.generateGenesisBlock()];
        this.miningDifficulty = 2; // Difficulty level for proof-of-work. Higher values increase mining time.
    }

    /**
     * Creates the first block of the blockchain.
     * @returns {BlockRecord} - The genesis block.
     */
    generateGenesisBlock() {
        return new BlockRecord(0, Date.now(), "Initial Genesis Block");
    }

    /**
     * Retrieves the latest block added to the chain.
     * @returns {BlockRecord} - The most recent block in the chain.
     */
    getMostRecentBlock() {
        return this.blockList[this.blockList.length - 1];
    }

    /**
     * Mines and then appends a new block with provided data to the blockchain.
     * @param {Object} Data - Data to be included in the block.
     */
    appendBlock(Data) {
        let freshBlock = new BlockRecord(this.blockList.length, Date.now(), Data, this.getMostRecentBlock().currentHash);
        freshBlock.performMining(this.miningDifficulty);
        this.blockList.push(freshBlock);
    }

    /**
     * Returns all blocks in the blockchain for inspection or display.
     * @returns {Array} - An array of all the blocks in the blockchain.
     */
    displayAllBlocks() {
        return this.blockList;
    }
}

// Simple simulation:

const exampleBlockchain = new BlockChain();
console.log("Mining initial block...");
exampleBlockchain.appendBlock({transactionDetail: "Davis pays AA 5 BTC"});
console.log("Mining second block...");
exampleBlockchain.appendBlock({transactionDetail: "Bukola pays Charlie 2 BTC"});

console.log(exampleBlockchain.displayAllBlocks());
