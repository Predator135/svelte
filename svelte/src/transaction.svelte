<script>
    export let transaction;
  
    let newKey = "";
    let newValue = "";
  
    // Update an existing key-value pair in the transaction
    const updateTransaction = (key, value) => {
      transaction[key] = value;
    };
  
    // Add a new key-value pair to the transaction
    const addMetadata = () => {
      if (newKey && newValue) {
        transaction[newKey] = newValue;
        newKey = "";
        newValue = "";
      }
    };
  </script>
  
  <div class="transaction-details">
    <h3>Transaction Details</h3>
    {#each Object.entries(transaction) as [key, value]}
      <div class="field">
        <label for={key}>{key}:</label>
        {#if typeof value === 'boolean'}
          <!-- Wrap the checkbox switch for left alignment -->
          <div class="checkbox-container">
            <input
              id={key}
              type="checkbox"
              bind:checked={transaction[key]}
              on:change={() => updateTransaction(key, transaction[key])}
            />
          </div>
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
  
    <div class="add-metadata">
      <!-- <p>Add New Metadata</p> -->
      <input type="text" bind:value={newKey} placeholder="New key" />
      <input type="text" bind:value={newValue} placeholder="New value" />
      <button on:click={addMetadata}>Add</button>
    </div>
  </div>
  
  <style>
    .transaction-details {
      padding: 1rem;
      border-radius: 5px;
      background-color: white;
    }
  
    .field {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
      flex-wrap: wrap; /* Allow wrapping if necessary */
    }
  
    .field label {
      font-weight: bold;
      color: #555;
      margin-right: 1rem;
      flex: 1 0 150px; /* Allows the label to take at least 150px but grow */
      text-align: left;
    }
  
    .field input[type="text"] {
      flex: 2 1 200px; /* Allows input to take more space but remain flexible */
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
  
    /* Align checkbox to the left by wrapping in a container */
    .checkbox-container {
      flex: 1 0 auto;
      display: flex;
      align-items: center;
      margin-left: 0; /* Aligns it close to the label */
    }
  
    /* Toggle switch styling */
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
  
    .add-metadata {
      margin-top: 1rem;
    }
  
    .add-metadata input {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 3px;
      background-color: #ffffff;
      color: #333;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
    }
  
    .add-metadata button {
      padding: 0.5rem 1rem;
      border: 1px solid #ccc;
      border-radius: 3px;
      background-color: #e0e0e0;
      color: #333;
      cursor: pointer;
    }
  
    .add-metadata button:hover {
      background-color: #d0d0d0;
    }
  </style>
  