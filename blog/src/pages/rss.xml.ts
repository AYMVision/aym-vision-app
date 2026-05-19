import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const now = new Date();
  const posts = await getCollection('posts', ({ data }) => !data.draft && data.date <= now);
  const sorted = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Amy Surfwing Blog',
    description: 'Medienreife greifbar machen — für Eltern, die ihre Kinder durch die digitale Welt begleiten.',
    site: context.site!.toString(),
    items: sorted.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.slug}/`,
    })),
  });
}
