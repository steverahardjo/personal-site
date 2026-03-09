---
title: 'Secret Detection Using Entropy Analysis'
description: 'How Shannon entropy calculation helps identify API keys and tokens in source code.'
pubDate: 2025-10-05
tags: ['Go', 'Security', 'CLI', 'GitAegis']
---

# Secret Detection Using Entropy Analysis

This article explains how Shannon entropy calculation helps identify API keys and tokens in source code, and how I built GitAegis, a Go CLI tool for detecting secrets before commit.

## Overview

GitAegis is a lightweight Go CLI tool designed to help developers maintain clean and secure repositories by scanning source code for potential API keys, tokens, or sensitive data before committing.

It uses **Shannon entropy analysis** combined with regex pattern matching and tree-sitter AST parsing to detect secrets with high accuracy and minimal false positives.

## What is Shannon Entropy?

Shannon entropy measures the randomness or unpredictability in a string. High entropy often indicates:
- API keys
- Tokens
- Passwords
- Encrypted data

### Entropy Calculation

```go
func CalculateEntropy(s string) float64 {
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
}
```

### Entropy Thresholds

- **Low entropy (0-3):** Normal text, variable names
- **Medium entropy (3-4.5):** May contain sensitive data
- **High entropy (4.5+):** Likely contains secrets

Example:
```
"password123"     → Entropy: ~3.0
"admin_user"      → Entropy: ~3.2
"sk_live_abc123"  → Entropy: ~4.1
"X7kP9mN2qR5t"    → Entropy: ~4.7 (likely a secret)
```

## Architecture

GitAegis consists of several core components:

### 1. Analyzer

Core scanning logic with goroutine-based parallel processing:

```go
type Analyzer struct {
    EntropyThreshold float64
    Patterns         []*regexp.Regexp
    Workers          int
}

func (a *Analyzer) Scan(ctx context.Context, path string) ([]Finding, error) {
    // Parallel file scanning using worker pool
}
```

### 2. Entropy Parser

Line-by-line parser with entropy threshold filtering:

```go
func (p *Parser) AnalyzeLine(line string, lineNum int) []Finding {
    findings := []Finding{}
    
    // Extract potential secrets using regex
    candidates := p.extractCandidates(line)
    
    for _, candidate := range candidates {
        entropy := CalculateEntropy(candidate)
        
        if entropy >= p.EntropyThreshold {
            findings = append(findings, Finding{
                File:     p.filename,
                Line:     lineNum,
                Secret:   candidate,
                Entropy:  entropy,
                Severity: p.calculateSeverity(entropy),
            })
        }
    }
    
    return findings
}
```

### 3. Tree-sitter AST Parser

Language-aware scanning using AST parsing:

```go
import sitter "github.com/smacker/go-tree-sitter"

func (s *Scanner) ScanAST(content []byte, language string) []Finding {
    parser := sitter.NewParser()
    parser.SetLanguage(getLanguage(language))
    
    tree := parser.Parse(content, nil)
    cursor := sitter.NewQueryCursor()
    
    // Query for string literals, assignments, etc.
    matches := cursor.Exec(secretQuery, tree.RootNode())
    
    return s.processMatches(matches, content)
}
```

### 4. File Modification

Obfuscation and gitignore management:

```go
func ObfuscateSecret(secret string) string {
    if len(secret) <= 8 {
        return strings.Repeat("*", len(secret))
    }
    return secret[:4] + strings.Repeat("*", len(secret)-8) + secret[len(secret)-4:]
}

func UpdateGitignore(path string, patterns []string) error {
    // Append patterns to .gitignore
}
```

## CLI Design with Cobra

```go
import "github.com/spf13/cobra"

var rootCmd = &cobra.Command{
    Use:   "gitaegis",
    Short: "Secret detection CLI tool",
    Long:  "GitAegis scans source code for API keys, tokens, and secrets.",
}

var scanCmd = &cobra.Command{
    Use:   "scan [path]",
    Short: "Scan directory for secrets",
    RunE: func(cmd *cobra.Command, args []string) error {
        path := args[0]
        logging, _ := cmd.Flags().Bool("logging", false, "Enable JSON logging")
        gitStaged, _ := cmd.Flags().Bool("git-staged", false, "Scan only staged files")
        
        return runScan(path, logging, gitStaged)
    },
}

var gitignoreCmd = &cobra.Command{
    Use:   "gitignore",
    Short: "Update .gitignore based on detected files",
    RunE: func(cmd *cobra.Command, args []string) error {
        return updateGitignore()
    },
}
```

## Usage

### Installation

```bash
curl -L "https://github.com/steverahardjo/gitaegis/releases/latest/download/gitaegis-linux-amd64" -o /tmp/gitaegis && \
chmod +x /tmp/gitaegis && \
sudo mv /tmp/gitaegis /usr/local/bin/gitaegis
```

### Scan Commands

```bash
# Scan entire directory with logging
gitaegis scan . --logging

# Scan only git-staged files
gitaegis scan . -g

# Update .gitignore based on detected files
gitaegis gitignore
```

### JSON Output for CI/CD

```json
{
  "timestamp": "2025-10-05T14:30:00Z",
  "path": "./src",
  "findings": [
    {
      "file": "config.js",
      "line": 42,
      "secret": "sk_live_abc***xyz",
      "entropy": 4.7,
      "severity": "high",
      "type": "api_key"
    }
  ],
  "summary": {
    "total_files": 150,
    "total_findings": 3,
    "high_severity": 1,
    "medium_severity": 2
  }
}
```

## Performance Optimization

### Goroutine Concurrency

```go
func (a *Analyzer) ScanParallel(paths []string) []Finding {
    var wg sync.WaitGroup
    findingsChan := make(chan []Finding, len(paths))
    
    for _, path := range paths {
        wg.Add(1)
        go func(p string) {
            defer wg.Done()
            findings, _ := a.Scan(context.Background(), p)
            findingsChan <- findings
        }(path)
    }
    
    go func() {
        wg.Wait()
        close(findingsChan)
    }()
    
    // Collect all findings
    var allFindings []Finding
    for findings := range findingsChan {
        allFindings = append(allFindings, findings...)
    }
    
    return allFindings
}
```

## Integration with Git Hooks

```bash
#!/bin/bash
# .git/hooks/pre-commit

echo "Running GitAegis secret scan..."
gitaegis scan . --git-staged --logging

if [ $? -ne 0 ]; then
    echo "❌ Secrets detected! Commit aborted."
    exit 1
fi

echo "✅ No secrets found."
exit 0
```

## Best Practices

1. **Set appropriate entropy thresholds** (4.0-4.5 works well)
2. **Combine entropy with regex patterns** for better accuracy
3. **Use AST parsing** to reduce false positives
4. **Run in CI/CD pipelines** as a gate
5. **Regularly update pattern definitions**

## Conclusion

Entropy analysis is a powerful technique for secret detection. Combined with pattern matching and AST parsing, it provides robust protection against accidental credential commits. GitAegis demonstrates how these techniques can be implemented in a performant Go CLI tool.
