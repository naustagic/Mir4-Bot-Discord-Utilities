const axios = require('axios');

// API URLs
const characterApiUrl = 'https://api.mir4global.com:8000/api/players/profile/';
const serverRankingApiUrl = 'https://api.mir4global.com:8000/api/players/clan-ranking/';
const clanRankingApiUrl = 'https://api.mir4global.com:8000/api/players/clan-details/'; // Assuming a new endpoint for clan ranking by name
const apiKey = 'Bearer TOKEN API';

// Fetch character profile
async function fetchCharacter(name) {
    try {
        const response = await axios.post(characterApiUrl, { name }, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': apiKey,
                'Content-Type': 'application/json',
                'Origin': 'https://k.mir4global.com',
                'Referer': 'https://k.mir4global.com/',
                'Sec-Ch-Ua': '"Opera GX";v="111", "Chromium";v="125", "Not.A/Brand";v="24"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 OPR/111.0.0.0'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching character profile:', error);
        throw new Error('API request failed');
    }
}

// Fetch server ranking
async function fetchServerRanking(serverName) {
    if (!serverName) {
        throw new Error('serverName is required');
    }

    try {
        const response = await axios.post(serverRankingApiUrl, { serverName, page: 1 }, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': apiKey,
                'Content-Type': 'application/json',
                'Origin': 'https://k.mir4global.com',
                'Referer': 'https://k.mir4global.com/',
                'Sec-Ch-Ua': '"Opera GX";v="111", "Chromium";v="125", "Not.A/Brand";v="24"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 OPR/111.0.0.0'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching server ranking:', error);
        throw new Error('API request failed');
    }
}

// Fetch clan ranking by server and clan name
async function fetchClanRanking(serverName, clanName) {
    if (!serverName || !clanName) {
        throw new Error('Both serverName and clanName are required');
    }

    try {
        const response = await axios.post(clanRankingApiUrl, { serverName, clanName }, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Authorization': apiKey,
                'Content-Type': 'application/json',
                'Origin': 'https://k.mir4global.com',
                'Referer': 'https://k.mir4global.com/',
                'Sec-Ch-Ua': '"Opera GX";v="111", "Chromium";v="125", "Not.A/Brand";v="24"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-site',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 OPR/111.0.0.0'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching clan ranking:', error);
        throw new Error('API request failed');
    }
}

module.exports = { fetchCharacter, fetchServerRanking, fetchClanRanking };
