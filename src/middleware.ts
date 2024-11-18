import type { MiddlewareHandler } from "astro";

type Path = string;
interface CachedResponse {
	response: Response;
	expires: number;
}

const cache = new Map<Path, CachedResponse>();

export const onRequest: MiddlewareHandler = async (req, next) => {
	let ttl: number | undefined;
	// Add a `cache` method to the `req.locals` object
	// that will allow us to set the cache duration for each page.
	req.locals.cache = (seconds = 60) => {
		ttl = seconds;
	};

	const cached = cache.get(req.url.pathname);

	if (cached && cached.expires > Date.now()) {
		// If the cached response is still valid, return it.
		return cached.response.clone();
	}

	if (cached) {
		// If the cached response has expired, delete it from the cache.
		cache.delete(req.url.pathname);
	}

	const response = await next();
	if (ttl !== undefined) {
		cache.set(req.url.pathname, {
			response: response.clone(),
			expires: Date.now() + ttl * 1000,
		});
	}

	return response;
};
