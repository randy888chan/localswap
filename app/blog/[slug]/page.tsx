import { compileMDX } from 'next-mdx-remote/rsc';
import fs from 'fs/promises';
import path from 'path';

const SITE_NAME = "Unified Crypto Exchange";

export async function generateStaticParams() {
  const files = await fs.readdir(path.join(process.cwd(), 'articles'));
  return files
    .filter(f => f.endsWith('.mdx'))
    .map(f => ({ slug: f.replace(/\.mdx$/, '') }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const source = await fs.readFile(
    path.join(process.cwd(), 'articles', `${params.slug}.mdx`), 
    'utf-8'
  );
  
  const { frontmatter } = await compileMDX<{ 
    title: string;
    summary: string; 
  }>({
    source,
    options: { parseFrontmatter: true }
  });

  return {
    title: `${frontmatter.title} | ${SITE_NAME} Blog`,
    description: frontmatter.summary,
  };
}

export default async function BlogPage({ params }) {
  const source = await fs.readFile(
    path.join(process.cwd(), 'articles', `${params.slug}.mdx`), 
    'utf-8'
  );

  const { content, frontmatter } = await compileMDX({ 
    source,
    components: { /* Custom MDX components */ } 
  });

  return (
    <article className="prose dark:prose-invert max-w-4xl mx-auto py-12">
      <h1 className="text-4xl font-bold">{frontmatter.title}</h1>
      <div className="mt-8">{content}</div>
    </article>
  );
}
