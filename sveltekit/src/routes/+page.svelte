<script>
    // Add your JavaScript here if needed
  </script>
  
  <style>
    /* Full-page styling */
    .container {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(135deg, #1a73e8, #ff5722);
      color: white;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-align: center;
    }
  
    /* Centered title styling */
    .title {
      font-size: 3rem;
      font-weight: bold;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      margin-bottom: 1rem;
      transition: transform 0.3s ease;
    }
  
    /* Hover effect */
    .title:hover {
      transform: scale(1.1);
    }
  
    /* Navigation menu styling */
    .menu {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }
  
    .menu-item {
      padding: 0.5rem 1.5rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      font-size: 1.1rem;
      text-decoration: none;
      font-weight: bold;
      transition: background 0.3s ease, transform 0.3s ease;
    }
  
    /* Hover effect for menu items */
    .menu-item:hover {
      background: rgba(255, 255, 255, 0.4);
      transform: scale(1.05);
    }
  </style>
  
  <div class="container">
    <h1 class="title">Financial Tracker Application</h1>
  
    <!-- Navigation menu -->
    <nav class="menu">
      <a href="/open-transactions" class="menu-item">Open Transactions</a>
    </nav>
  </div>
  