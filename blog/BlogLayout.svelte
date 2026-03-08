<script>
  import { onMount } from 'svelte';
  
  export let children;
  
  onMount(() => {
    // Theme initialization
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle?.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  });
</script>

<div class="theme-toggle-container">
  <button class="theme-toggle" id="themeToggle" aria-label="Toggle dark mode">
    <span class="toggle-icon light-icon">☀️</span>
    <span class="toggle-icon dark-icon">🌙</span>
  </button>
</div>

<div class="container">
  <slot />
</div>

<footer class="footer">
  <div class="separator"></div>
  <p class="copyright">&copy; 2026 Holy Knight. All rights reserved.</p>
</footer>

<style>
  @import '../styles.css';
</style>
