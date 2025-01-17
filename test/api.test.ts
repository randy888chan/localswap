import { describe, it, expect } from 'vitest';

describe('API', () => {
  it('returns a message', async () => {
    const response = await fetch('http://localhost:3000/api/hello');
    const data = await response.json();

    expect(data.message).toBe('Hello from the API!');
  });
});
````

**Task 1.1.6: Set up a GitHub Action to run tests on every push.**

We need to create a `.github/workflows` directory and a YAML file for the workflow.

.github/workflows/test.yml
````yaml
<<<<<<< SEARCH
