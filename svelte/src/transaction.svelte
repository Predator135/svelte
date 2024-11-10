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
        <input
          id={key}
          type="text"
          bind:value={transaction[key]}
          on:change={() => updateTransaction(key, transaction[key])}
        />
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
    .transaction-details {
      padding: 4rem;
      margin-right: 1.2rem;
      border-radius: 5px;
      background-color: #f2f2f2; /* Light gray background for better contrast */
      border: 1px solid #bbb;    /* Darker border for definition */
      color: #222;               /* Dark text for better readability */
    }
  
    h3 {
      color: #333;
    }
  
    .field {
      margin-bottom: 0.75rem;
      display: flex;
      flex-direction: column;
    }
  
    .field label {
      font-weight: bold;
      color: #555;             /* Darker color for label text */
      margin-bottom: 0.25rem;
    }
  
    .field input {
      padding: 0.5rem;
      border: 1px solid #888;   /* Darker border for input */
      border-radius: 3px;
      background-color: #ffffff; /* White background for inputs */
      color: #222;               /* Dark text color */
    }
  
    .field input:focus {
      border-color: #555;        /* Darker border color on focus */
      outline: none;
    }
  
    .add-metadata {
      margin-top: 1rem;
      padding: 1rem;
      border-radius: 5px;
      background-color: #e6e6e6; /* Slightly darker gray background */
      border: 1px solid #bbb;
    }
  
    .add-metadata h4 {
      margin-bottom: 0.5rem;
      color: #333;               /* Dark heading color */
    }
  
    .add-metadata input {
      padding: 0.5rem;
      border: 1px solid #888;
      border-radius: 3px;
      background-color: #ffffff; /* White input background */
      color: #222;               /* Dark text color */
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
    }
  
    .add-metadata button {
      padding: 0.5rem 1rem;
      border: 1px solid #888;
      border-radius: 3px;
      background-color: #dcdcdc; /* Light gray button background */
      color: #333;               /* Dark text for button */
      cursor: pointer;
    }
  
    .add-metadata button:hover {
      background-color: #c4c4c4; /* Darker gray on hover */
    }
  </style>
  