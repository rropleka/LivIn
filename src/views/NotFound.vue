<template>
    <div class="not-found">
      <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFound'
  }
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 50px;
  }
  
  .not-found h1 {
    font-size: 2.5rem;
    color: #333;
  }
  
  .not-found p {
    font-size: 1.2rem;
    color: #666;
  }
  </style>
  