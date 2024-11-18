import { Octokit } from "@octokit/core";
import { processMarkdown } from "./markdown";
import type { VFile } from "vfile";

const octokit = new Octokit({
	auth: import.meta.env.GITHUB_TOKEN,
});

let postsCache:
	| Array<{
			year: string;
			entries: Array<{
				path: string;
				data: VFile | undefined;
			}>;
	  }>
	| undefined = undefined;

export async function getPosts() {
	if (postsCache) return postsCache;

	const { data } = await octokit.request(
		"GET /repos/{owner}/{repo}/contents/{path}",
		{
			owner: "webuild-community",
			repo: "advent-of-sharing",
			path: "",
			headers: {
				"X-GitHub-Api-Version": "2022-11-28",
			},
		},
	);

	const folders = Array.isArray(data)
		? data.filter((entry) => entry.type === "dir" && /\d+/.test(entry.name))
		: [];

	const group = [];

	for await (const folder of folders) {
		const { data } = await octokit.request(
			"GET /repos/{owner}/{repo}/contents/{path}",
			{
				owner: "webuild-community",
				repo: "advent-of-sharing",
				path: folder.path,
				headers: {
					"X-GitHub-Api-Version": "2022-11-28",
				},
			},
		);

		const markdownFiles = Array.isArray(data)
			? data.filter(
					(entry) => entry.type === "file" && entry.path.endsWith(".md"),
				)
			: [];

		const entries = [];
		for await (const file of markdownFiles) {
			const path = file.path.replace(/\.md$/, "");
			entries.push({
				path,
				data: await getPost(path),
			});
		}

		group.push({
			year: folder.name,
			entries,
		});
	}

	postsCache = group;

	return group;
}

type Path = string;
const postCache = new Map<Path, VFile>();

export async function getPost(path: Path) {
	if (postCache.has(path)) {
		return postCache.get(path);
	}

	const request = await fetch(
		`https://raw.githubusercontent.com/webuild-community/advent-of-sharing/refs/heads/main/${path}.md`,
	);

	if (request.status >= 400) {
		throw new Error("Path not found");
	}

	const content = await request.text();
	const parsed = await processMarkdown(content);

	postCache.set(path, parsed);

	return parsed;
}
