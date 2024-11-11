<script>
  import { onMount } from 'svelte';
  import { transactions } from './stores.js';
  import Transaction from './transaction.svelte';

  let fileInput;
  let visibleTransactions = [];
  let currentIndex = 0;
  let selectedTransaction = null;

  const pocketbaseUrl = "https://pocketbase.home.nl/api/collections/transactions/records?filter=VERWERKT=false&perPage=9999";

  // Load JSON file and parse data
  const loadFile = () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result;
        if (typeof result === 'string') {
          try {
            const data = JSON.parse(result);
            console.log("Parsed Data:", data); // Debugging: Verify parsed data
            transactions.set(data); // Set parsed data to Svelte store
            currentIndex = 0; // Reset index for new data
            visibleTransactions = []; // Clear visible transactions
            loadMore(); // Load initial batch of transactions
          } catch (error) {
            console.error("Error parsing JSON:", error); // Log parsing errors
          }
        }
      };
      reader.readAsText(file);
    }
  };

  // Load transactions from PocketBase API
  const loadFromAPI = async () => {
    try {
      const response = await fetch(pocketbaseUrl);
      if (!response.ok) throw new Error("Failed to fetch data from PocketBase API");
      const data = await response.json();
      console.log("Fetched Data from API:", data); // Debugging: Verify fetched data

      // Set the records (transactions) to the Svelte store
      transactions.set(data.items || []); // Assume `items` holds the transaction array
      currentIndex = 0; // Reset index for new data
      visibleTransactions = []; // Clear visible transactions
      loadMore(); // Load initial batch of transactions
    } catch (error) {
      console.error("Error fetching from PocketBase API:", error);
    }
  };

  // Load more transactions into visibleTransactions for display
  const loadMore = () => {
    transactions.subscribe(($transactions) => {
      if ($transactions.length > 0) {
        visibleTransactions = [...visibleTransactions, ...$transactions.slice(currentIndex, currentIndex + 20000)];
        currentIndex += 20000;
        console.log("Visible Transactions:", visibleTransactions); // Debug: Check loaded transactions
      } else {
        console.log("No transactions to display"); // Confirm if data is empty
      }
    });
  };

  // Handle scroll event to load more transactions when reaching the bottom
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadMore();
    }
  };

  // Set selected transaction to display full details
  const selectTransaction = (transaction) => {
    selectedTransaction = transaction;
  };

  // Save transactions back to a JSON file
  const saveFile = () => {
    transactions.subscribe(($transactions) => {
      const blob = new Blob([JSON.stringify($transactions, null, 2)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'transactions.json';
      link.click();
    });
  };
</script>

<div class="app-container">
  <div class="sidebar">
    <!-- File Upload -->
    <input type="file" accept=".json" bind:this={fileInput} on:change={loadFile} />
    <button on:click={loadFile}>Load from File</button>

    <!-- Load from PocketBase API -->
    <button on:click={loadFromAPI}>Load from PocketBase</button>

    <!-- Save Transactions -->
    <button on:click={saveFile}>Save Transactions</button>

    <!-- Transaction List with Scroll Load -->
    <div class="transaction-list" on:scroll={handleScroll}>
      {#each visibleTransactions as transaction}
        <button type="button" class="transaction-summary" on:click={() => selectTransaction(transaction)}>
          <p><strong>Entity:</strong> {transaction.ENTITY || "N/A"}</p>
          <p><strong>Description:</strong> {transaction.DESCRIPTION || "N/A"}</p>
          <p><strong>Value Date:</strong> {transaction.VALUEDATE || "N/A"}</p>
          <p><strong>Amount:</strong> {transaction.AMOUNT || "N/A"}</p>
          <p><strong>Type:</strong> {transaction.TRANSACTION_TYPE || "N/A"}</p>
        </button>
      {/each}
    </div>
  </div>

  <!-- Render details pane only if a transaction is selected -->
  {#if selectedTransaction}
    <div class="details-pane">
      <Transaction transaction={selectedTransaction} />
    </div>
  {/if}
</div>

<style>
  /* Global reset and app container setup */
  :global(html, body) {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #f4f4f9;
  }

  .app-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    background-color: #f4f4f9;
    color: #333;
  }

  /* Sidebar styling */
  .sidebar {
    width: 40%;
    padding: 1rem;
    border-right: 1px solid #ccc;
    overflow-y: auto;
    background-color: #f7f7f9;
  }

  .transaction-list {
    margin-top: 1rem;
  }

  /* Transaction Summary styling */
  .transaction-summary {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #bbb;
    border-radius: 5px;
    background-color: #ffffff;
    cursor: pointer;
    text-align: left;
    color: #333;
    width: 100%;
  }

  .transaction-summary:hover {
    background-color: #e9e9f0;
  }

  /* Details Pane styling */
  .details-pane {
    width: 60%;
    padding: 1rem;
    overflow-y: auto;
    background-color: #fafafa;
    color: #222;
  }

  /* Button and Input Styling */
  input[type="file"],
  button {
    background-color: #e0e0e0;
    color: #333;
    border: 1px solid #bbb;
    padding: 0.5rem;
    margin: 0.5rem 0;
    cursor: pointer;
    border-radius: 3px;
  }

  button:hover {
    background-color: #d0d0d0;
  }
</style>
