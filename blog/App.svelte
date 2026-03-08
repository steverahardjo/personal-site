<script>
  import BlogLayout from './BlogLayout.svelte';
  import CodeSnippet from './CodeSnippet.svelte';

  const posts = [
    {
      slug: 'entropy-secret-detection',
      title: 'Understanding Entropy in Secret Detection',
      date: 'March 2026',
      readTime: '5 min read',
      excerpt: 'How Shannon entropy helps identify potential API keys and tokens in source code.',
      content: `
        <p>When building GitAegis, one of the key challenges was detecting secrets without relying solely on regex patterns. This is where Shannon entropy comes in.</p>
        
        <h2>What is Shannon Entropy?</h2>
        <p>Shannon entropy measures the randomness or unpredictability in a string. High entropy strings are often secrets, API keys, or tokens.</p>
        
        <p>The formula for Shannon entropy is:</p>
        
        ${CodeSnippet({ language: 'math', code: 'H(X) = -Σ p(x) log₂ p(x)' })}
        
        <h2>Implementation in Go</h2>
        <p>Here's how I calculate entropy in GitAegis:</p>
      `,
      code: {
        language: 'go',
        code: `func calcEntropy(s string) float64 {
    if len(s) == 0 {
        return 0
    }
    
    freq := make(map[rune]int)
    for _, c := range s {
        freq[c]++
    }
    
    var entropy float64
    length := float64(len(s))
    
    for _, count := range freq {
        p := float64(count) / length
        entropy -= p * math.Log2(p)
    }
    
    return entropy
}`
      }
    },
    {
      slug: 'go-cli-tools',
      title: 'Building CLI Tools with Go',
      date: 'February 2026',
      readTime: '8 min read',
      excerpt: 'A deep dive into creating efficient command-line interfaces using Go\'s standard library.',
      content: `<p>Go's standard library provides everything you need to build powerful CLI tools...</p>`
    }
  ];

  let currentPost = null;
</script>

<BlogLayout>
  {#if currentPost}
    <div class="blog-page">
      <header class="blog-page-header">
        <a href="/" class="cv-link">
          <span class="cv-text">← Back to Blog</span>
        </a>
        <h1 class="blog-page-title">{currentPost.title}</h1>
        <p class="blog-page-meta">{currentPost.date} · {currentPost.readTime}</p>
        <div class="separator"></div>
      </header>
      
      <article class="blog-content">
        {@html currentPost.content}
        
        {#if currentPost.code}
          <CodeSnippet language={currentPost.code.language} code={currentPost.code.code} />
        {/if}
      </article>
    </div>
  {:else}
    <div class="blog-page">
      <header class="blog-page-header">
        <a href="../index.html" class="cv-link">
          <span class="cv-text">← Back to Home</span>
        </a>
        <h1 class="blog-page-title">Blog</h1>
        <p class="blog-page-meta">Thoughts on software engineering, AI, and everything in between</p>
        <div class="separator"></div>
      </header>

      <div class="blog-list">
        {#each posts as post}
          <article class="blog-post-preview">
            <h3 class="blog-post-title">
              <button 
                class="blog-post-link-button" 
                on:click={() => currentPost = post}>
                {post.title}
              </button>
            </h3>
            <p class="blog-post-meta">{post.date} · {post.readTime}</p>
            <p class="blog-post-excerpt">{post.excerpt}</p>
          </article>
        {/each}
      </div>
    </div>
  {/if}
</BlogLayout>

<style>
  :global(.blog-post-link-button) {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
    text-align: left;
    width: 100%;
  }
  
  :global(.blog-post-link-button:hover) {
    color: var(--color-text-muted);
  }
</style>
