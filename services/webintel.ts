/**
 * Web Intelligence Service powered by Firecrawl
 * Provides web search, scraping, and content extraction capabilities
 */

// Firecrawl API key
const FIRECRAWL_API_KEY = 'fc-a966de3f9ea84def93ed2fb941861e02';
const FIRECRAWL_BASE_URL = 'https://api.firecrawl.dev/v1';

export interface SearchResult {
    title: string;
    url: string;
    description: string;
    content?: string;
}

export interface ScrapeResult {
    url: string;
    title: string;
    content: string;
    markdown?: string;
    metadata?: Record<string, any>;
}

export const WebIntelService = {
    /**
     * Search the web using Firecrawl's search endpoint
     */
    search: async (query: string, limit: number = 5): Promise<SearchResult[]> => {
        try {
            const response = await fetch(`${FIRECRAWL_BASE_URL}/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
                },
                body: JSON.stringify({
                    query,
                    limit,
                    scrapeOptions: {
                        formats: ['markdown'],
                        onlyMainContent: true
                    }
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Firecrawl search error:', errorText);
                throw new Error(`Search failed: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success || !data.data) {
                return [];
            }

            return data.data.map((result: any) => ({
                title: result.title || result.metadata?.title || 'Untitled',
                url: result.url,
                description: result.description || result.metadata?.description || '',
                content: result.markdown || result.content || ''
            }));
        } catch (error) {
            console.error('Web search error:', error);
            return [];
        }
    },

    /**
     * Scrape a specific URL and extract content
     */
    scrape: async (url: string): Promise<ScrapeResult | null> => {
        try {
            const response = await fetch(`${FIRECRAWL_BASE_URL}/scrape`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
                },
                body: JSON.stringify({
                    url,
                    formats: ['markdown', 'html'],
                    onlyMainContent: true,
                    waitFor: 2000
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Firecrawl scrape error:', errorText);
                throw new Error(`Scrape failed: ${response.status}`);
            }

            const data = await response.json();

            if (!data.success || !data.data) {
                return null;
            }

            return {
                url: data.data.url || url,
                title: data.data.metadata?.title || 'Untitled',
                content: data.data.html || '',
                markdown: data.data.markdown || '',
                metadata: data.data.metadata
            };
        } catch (error) {
            console.error('Web scrape error:', error);
            return null;
        }
    },

    /**
     * Crawl a website and extract content from multiple pages
     */
    crawl: async (url: string, maxPages: number = 5): Promise<ScrapeResult[]> => {
        try {
            // Start crawl job
            const startResponse = await fetch(`${FIRECRAWL_BASE_URL}/crawl`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
                },
                body: JSON.stringify({
                    url,
                    limit: maxPages,
                    scrapeOptions: {
                        formats: ['markdown'],
                        onlyMainContent: true
                    }
                })
            });

            if (!startResponse.ok) {
                throw new Error(`Crawl start failed: ${startResponse.status}`);
            }

            const startData = await startResponse.json();

            if (!startData.success || !startData.id) {
                return [];
            }

            // Poll for crawl completion (with timeout)
            const crawlId = startData.id;
            let attempts = 0;
            const maxAttempts = 30; // 30 seconds max wait

            while (attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000));

                const statusResponse = await fetch(`${FIRECRAWL_BASE_URL}/crawl/${crawlId}`, {
                    headers: {
                        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
                    }
                });

                if (!statusResponse.ok) {
                    attempts++;
                    continue;
                }

                const statusData = await statusResponse.json();

                if (statusData.status === 'completed' && statusData.data) {
                    return statusData.data.map((page: any) => ({
                        url: page.url,
                        title: page.metadata?.title || 'Untitled',
                        content: page.html || '',
                        markdown: page.markdown || '',
                        metadata: page.metadata
                    }));
                }

                if (statusData.status === 'failed') {
                    throw new Error('Crawl job failed');
                }

                attempts++;
            }

            return [];
        } catch (error) {
            console.error('Web crawl error:', error);
            return [];
        }
    },

    /**
     * Extract structured data from a URL
     */
    extract: async (url: string, schema?: Record<string, any>): Promise<any> => {
        try {
            const response = await fetch(`${FIRECRAWL_BASE_URL}/scrape`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${FIRECRAWL_API_KEY}`
                },
                body: JSON.stringify({
                    url,
                    formats: ['extract'],
                    extract: schema ? { schema } : undefined
                })
            });

            if (!response.ok) {
                throw new Error(`Extract failed: ${response.status}`);
            }

            const data = await response.json();
            return data.data?.extract || null;
        } catch (error) {
            console.error('Web extract error:', error);
            return null;
        }
    },

    /**
     * Quick web research - search and summarize results
     */
    research: async (query: string): Promise<string> => {
        const results = await WebIntelService.search(query, 5);

        if (results.length === 0) {
            return `No web results found for: "${query}"`;
        }

        const summaryParts = results.map((r, i) => {
            const contentPreview = r.content
                ? r.content.substring(0, 500).replace(/\n+/g, ' ').trim()
                : r.description;
            return `[${i + 1}] ${r.title}\nURL: ${r.url}\n${contentPreview}`;
        });

        return `WEB INTELLIGENCE RESULTS for "${query}":\n\n${summaryParts.join('\n\n---\n\n')}`;
    }
};

export default WebIntelService;
