// generate-sitemap.js
// This script fetches all songs from the backend API and generates a sitemap.xml file
// Run this script before building the React app (prebuild script)

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Configuration
const API_URL = process.env.REACT_APP_API_URL;
const BASE_URL = 'https://www.cherryproduction.cc';
const OUTPUT_PATH = path.join(__dirname, 'public', 'sitemap.xml');

// Get current date in YYYY-MM-DD format for lastmod
const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
};

// Generate sitemap XML content
const generateSitemap = (songs) => {
    const currentDate = getCurrentDate();
    
    // XML header and opening urlset tag
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // ========== STATIC PAGES ==========
    // Homepage - highest priority
    xml += `
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`;
    
    // Search page - important for user navigation
    xml += `
  <url>
    <loc>${BASE_URL}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    
    // Privacy policy - low priority, rarely changes
    xml += `
  <url>
    <loc>${BASE_URL}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;
    
    // ========== DYNAMIC PAGES (Songs) ==========
    if (songs && songs.length > 0) {
        songs.forEach((song) => {
            // Validate song has an id
            if (!song.id) {
                console.warn('Skipping song without id:', song);
                return;
            }
            
            // Use release_date or created_at as lastmod, fallback to current date
            let lastmod = currentDate;
            if (song.release_date) {
                lastmod = song.release_date.split('T')[0];
            } else if (song.created_at) {
                lastmod = song.created_at.split('T')[0];
            }
            
            // Each song detail page uses the ?id= parameter in URL
            xml += `
  <url>
    <loc>${BASE_URL}/detail?id=${song.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
        });
    }
    
    // Close urlset tag
    xml += '\n</urlset>';
    
    return xml;
};

// Ensure public directory exists
const ensurePublicDir = () => {
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
        console.log('Created public directory');
    }
};

// Write sitemap file to disk
const writeSitemap = (content) => {
    fs.writeFileSync(OUTPUT_PATH, content, 'utf8');
    console.log(`Sitemap generated successfully at: ${OUTPUT_PATH}`);
    console.log(`File size: ${(content.length / 1024).toFixed(2)} KB`);
};

// Debug fetch response
const debugFetchResponse = async (response) => {
    console.log(`Response status: ${response.status} ${response.statusText}`);
    console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
    
    // Clone response to read body without consuming it
    const clonedResponse = response.clone();
    const text = await clonedResponse.text();
    console.log(`Response body preview: ${text.substring(0, 500)}`);
    
    return text;
};

// Main function to fetch songs and generate sitemap
const main = async () => {
    console.log('Starting sitemap generation...');
    console.log(`API_URL: ${API_URL}`);
    console.log(`Full API endpoint: ${API_URL}/api/songs`);
    
    // Check if API_URL is defined
    if (!API_URL) {
        console.error('ERROR: REACT_APP_API_URL is not defined in .env file');
        console.error('Please add REACT_APP_API_URL=http://localhost:5001 to your .env file');
        process.exit(1);
    }
    
    try {
        // Fetch all songs from backend API
        console.log('Fetching songs from API...');
        const response = await fetch(`${API_URL}/api/songs`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        // Debug the response
        await debugFetchResponse(response);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Parse JSON response
        let songs = [];
        try {
            songs = await response.json();
        } catch (parseError) {
            console.error('Failed to parse JSON response:', parseError.message);
            throw new Error('API response is not valid JSON');
        }
        
        // Handle different response formats
        let songsArray = [];
        if (Array.isArray(songs)) {
            songsArray = songs;
            console.log(`Successfully fetched ${songsArray.length} songs from API (direct array)`);
        } else if (songs.data && Array.isArray(songs.data)) {
            songsArray = songs.data;
            console.log(`Successfully fetched ${songsArray.length} songs from API (wrapped in data property)`);
        } else if (songs.songs && Array.isArray(songs.songs)) {
            songsArray = songs.songs;
            console.log(`Successfully fetched ${songsArray.length} songs from API (wrapped in songs property)`);
        } else {
            console.warn('API response format not recognized, treating as empty array');
            console.log('Response structure:', Object.keys(songs));
            songsArray = [];
        }
        
        if (songsArray.length === 0) {
            console.warn('No songs found in API response. Generating sitemap with static pages only.');
        } else {
            // Log first few songs for debugging
            console.log('First 3 songs received:');
            songsArray.slice(0, 3).forEach((song, idx) => {
                console.log(`  Song ${idx + 1}: id=${song.id}, title=${song.title || 'N/A'}`);
            });
        }
        
        // Generate sitemap XML with the fetched songs
        const sitemapContent = generateSitemap(songsArray);
        
        // Ensure public directory exists and write file
        ensurePublicDir();
        writeSitemap(sitemapContent);
        
        console.log('Sitemap generation completed successfully!');
        
    } catch (error) {
        console.error('Error generating sitemap:', error.message);
        console.error('Make sure your backend server is running and accessible.');
        console.error('The build will continue but sitemap may be outdated.');
        console.error('To fix this issue:');
        console.error(`  1. Check if backend is running on ${API_URL}`);
        console.error(`  2. Verify the /api/songs endpoint returns JSON data`);
        console.error(`  3. Check CORS configuration on your backend`);
        
        // Generate a basic sitemap without dynamic content as fallback
        console.log('Generating fallback sitemap with only static pages...');
        const fallbackSitemap = generateSitemap([]);
        ensurePublicDir();
        writeSitemap(fallbackSitemap);
    }
};

// Run the main function
main();