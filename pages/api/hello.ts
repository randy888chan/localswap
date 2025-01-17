import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ message: 'Hello from the API!' });
}
````

**Task 1.1.5: Write a unit test for the landing page component and the API route using `Vitest`.**

We'll create a simple test file for now.

test/index.test.tsx
````typescript
<<<<<<< SEARCH
