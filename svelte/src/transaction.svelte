<script>
  import { onMount } from 'svelte';

  export let transaction;

  // PocketBase API base URL
  const pocketbaseUrl = "https://pocketbase.home.nl/api/collections/transactions/records";

  // Track whether any changes have been made
  let hasChanges = false;

  // Store a copy of the original transaction to compare changes
  let originalTransaction = {};

  // Notification state
  let showNotification = false;
  let notificationTimeout;

  // Clone the transaction when the component is mounted
  onMount(() => {
    originalTransaction = { ...transaction };
  });

  // Update the transaction on the server
  const saveTransaction = async () => {
    if (!hasChanges) return; // Prevent saving if no changes

    try {
      const response = await fetch(`${pocketbaseUrl}/${transaction.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(transaction)
      });

      if (!response.ok) {
        throw new Error("Failed to save changes.");
      }

      const updatedTransaction = await response.json();
      console.log("Transaction updated successfully:", updatedTransaction);

      // Update originalTransaction and reset hasChanges after saving
      originalTransaction = { ...transaction };
      hasChanges = false;

      // Show success notification
      showNotification = true;
      if (notificationTimeout) clearTimeout(notificationTimeout);
      notificationTimeout = setTimeout(() => {
        showNotification = false;
      }, 5000);
    } catch (error) {
      console.error("Error saving transaction:", error);
      alert("Failed to save transaction.");
    }
  }; 

  // Close notification manually
  const closeNotification = () => {
    showNotification = false;
    clearTimeout(notificationTimeout);
  };

  // Update an existing key-value pair in the transaction and track changes
  const updateTransaction = (key, value) => {
    transaction[key] = value;
    checkForChanges();
  };

  // Check if the transaction differs from the original
  const checkForChanges = () => {
    hasChanges = Object.keys(transaction).some(
      key => transaction[key] !== originalTransaction[key]
    );
  };
</script>

<div class="transaction-details">
  <div class="header">
    <h3>Transaction Details</h3>
    <button class="save-button" on:click={saveTransaction} disabled={!hasChanges}>Save</button>
  </div>

  {#each Object.entries(transaction) as [key, value]}
    <div class="field">
      <label for={key}>{key}:</label>
      {#if typeof value === 'boolean'}
        <!-- Boolean fields use a toggle switch (checkbox) -->
        <input
          id={key}
          type="checkbox"
          bind:checked={transaction[key]}
          on:change={() => updateTransaction(key, transaction[key])}
        />
      {:else}
        <!-- Other fields use a text input -->
        <input
          id={key}
          type="text"
          bind:value={transaction[key]}
          on:change={() => updateTransaction(key, transaction[key])}
        />
      {/if}
    </div>
  {/each}
</div>

<!-- Notification component -->
{#if showNotification}
  <div class="notification">
    <span>Saved successfully</span>
    <button on:click={closeNotification} class="close-button">&times;</button>
  </div>
{/if}

<style>
  .transaction-details {
    border-radius: 5px;
    margin-right: 2rem;
    background-color: white;
    position: relative;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .save-button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 3px;
    background-color: #4caf50;
    color: white;
    cursor: pointer;
    transition: background 0.3s;
  }

  .save-button:disabled {
    background-color: #ccc; /* Gray out when disabled */
    color: #888;
    cursor: not-allowed;
  }

  .field {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .field label {
    font-weight: bold;
    color: #555;
    margin-right: 1rem;
    min-width: 150px;
    text-align: left;
  }

  .field input[type="text"] {
    flex-grow: 1;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 3px;
    background-color: #ffffff;
    color: #333;
  }

  .field input[type="text"]:focus {
    border-color: #888;
    outline: none;
  }

  .field input[type="checkbox"] {
    position: relative;
    width: 50px;
    height: 24px;
    appearance: none;
    background: #ddd;
    outline: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background 0.3s;
    margin-left: 0;
  }

  .field input[type="checkbox"]:checked {
    background: #4caf50;
  }

  .field input[type="checkbox"]::before {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    transition: 0.3s;
  }

  .field input[type="checkbox"]:checked::before {
    left: 26px;
  }

  /* Notification styling */
  .notification {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    background-color: #4caf50;
    color: white;
    padding: 0.75rem 1rem;
    border-radius: 5px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 200px;
  }

  .close-button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    margin-left: 1rem;
  }

  .close-button:hover {
    color: #ddd;
  }
</style>
