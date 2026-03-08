<script>
  export let language = '';
  export let code = '';
  
  let copied = false;
  
  function copyCode() {
    navigator.clipboard.writeText(code).then(() => {
      copied = true;
      setTimeout(() => copied = false, 2000);
    });
  }
</script>

<div class="code-snippet">
  <div class="code-header">
    <span class="code-language">{language}</span>
    <button class="code-copy-btn" on:click={copyCode}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  </div>
  <div class="code-content">
    <pre><code>{code}</code></pre>
  </div>
</div>

<style>
  .code-snippet {
    background: var(--color-code-bg);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    margin: 1.5rem 0;
    overflow: hidden;
  }
  
  .code-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    background: var(--color-bg-secondary);
    border-bottom: 1px solid var(--color-border);
  }
  
  .code-language {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .code-copy-btn {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    background: transparent;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    color: var(--color-text-muted);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .code-copy-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-text);
  }
  
  .code-content {
    padding: 1rem;
    overflow-x: auto;
  }
  
  .code-content pre {
    margin: 0;
    font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
    font-size: 0.85rem;
    line-height: 1.6;
    color: var(--color-text);
  }
</style>
