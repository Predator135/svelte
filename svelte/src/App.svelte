<script>
  import { onMount } from 'svelte';
  import { transactions } from './stores.js';
  import Transaction from './Transaction.svelte';

  let fileInput; // Reference to the file input element
  let visibleTransactions = [];
  let currentIndex = 0;

  // Load JSON file and parse data
  const loadFile = () => {
    const file = fileInput.files[0]; // Access the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target.result;

        // Check if the result is a string and parse it
        if (typeof result === 'string') {
          try {
            const data = JSON.parse(result);
            console.log("Parsed Data:", data); // Debugging log to inspect parsed data
            transactions.set(data);
            loadMore(); // Load initial batch of transactions
          } catch (error) {
            console.error("Error parsing JSON:", error); // Log parsing errors
          }
        } else {
          console.error("File content is not a string"); // Log if file content isn't a string
        }
      };
      reader.readAsText(file);
    }
  };

  // Load more transactions for infinite scroll
  const loadMore = () => {
    transactions.subscribe(($transactions) => {
      if ($transactions.length > 0) {
        visibleTransactions = [...visibleTransactions, ...$transactions.slice(currentIndex, currentIndex + 20)];
        currentIndex += 20;
      } else {
        console.log("No transactions to display"); // Debugging log
      }
    });
  };

  // Detect scroll to bottom and load more
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 5) loadMore();
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

<div>
  <input type="file" accept=".json" bind:this={fileInput} on:change={loadFile} />
  <button on:click={saveFile}>Save Transactions</button>
</div>

<div class="transaction-list" on:scroll={handleScroll}>
  {#each visibleTransactions as transaction}
    <Transaction {transaction} />
  {/each}
</div>

<style>
  /* Force light theme on the body */
  :global(body) {
    background-color: white;
    color: black;
    font-family: Arial, sans-serif;
  }

  .transaction-list {
    max-height: 80vh;
    overflow-y: auto;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 1rem;
    background-color: #f9f9f9; /* Light background for the list */
  }

  input[type="file"],
  button {
    background-color: #f0f0f0;
    color: #333;
    border: 1px solid #ccc;
    padding: 0.5rem;
    margin: 0.25rem 0;
    cursor: pointer;
  }

  button:hover {
    background-color: #ddd;
  }
</style>

