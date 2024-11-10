<script>
    import { transactions } from './stores.js';
    export let transaction;
  
    let newKey = "";
    let newValue = "";
  
    // Update an existing key-value pair in the transaction
    const updateTransaction = (key, value) => {
      transaction[key] = value;
      transactions.update(($transactions) => $transactions);
    };
  
    // Add a new key-value pair to the transaction
    const addMetadata = () => {
      if (newKey && newValue) {
        transaction[newKey] = newValue;
        newKey = "";
        newValue = "";
        transactions.update(($transactions) => $transactions);
      }
    };
  </script>
  
  <div class="transaction">
    <h3>Transaction Details</h3>
    {#each Object.entries(transaction) as [key, value]}
      <div class="field">
        <label>
          {key}:
          <input
            type="text"
            bind:value={transaction[key]}
            on:change={() => updateTransaction(key, transaction[key])}
          />
        </label>
      </div>
    {/each}
  
    <div class="add-metadata">
      <h4>Add New Metadata</h4>
      <input type="text" bind:value={newKey} placeholder="New key" />
      <input type="text" bind:value={newValue} placeholder="New value" />
      <button on:click={addMetadata}>Add</button>
    </div>
  </div>
  
  <style>
    .transaction {
      padding: 1rem;
      border: 1px solid #ddd;
      border-radius: 5px;
      margin-bottom: 1rem;
      background-color: white;
    }
    .field {
      margin-bottom: 0.5rem;
    }
    .field label {
      display: flex;
      flex-direction: column;
      font-weight: bold;
    }
    .add-metadata {
      margin-top: 1rem;
    }
  </style>
  