import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkFrontmatter from "remark-frontmatter";
import remarkStringify from "remark-stringify";
import remarkGfm from "remark-gfm";
import { unified } from "unified";
import { matter } from "vfile-matter";

export function processMarkdown(content: string) {
	return unified()
		.use(remarkParse)
		.use(remarkStringify)
		.use(remarkFrontmatter, ["yaml", "toml"])
		.use(() => {
			return (_, file) => {
				matter(file);
			};
		})
		.use(remarkGfm)
		.use(remarkRehype)
		.use(rehypeShiki, {
			themes: {
				light: "vitesse-light",
				dark: "vitesse-dark",
			},
		})
		.use(rehypeStringify)
		.process(content);
}
