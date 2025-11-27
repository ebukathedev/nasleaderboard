import { NextResponse } from 'next/server';
import { VoteItem } from '@/types';
import fs from 'fs';
import path from 'path';
import { allContestants } from '@/utils/allContestants';

const SNAPSHOT_FILE = path.join(process.cwd(), 'src', 'data', 'vote_snapshot.json');

// Helper to save snapshot
const saveSnapshot = (data: any) => {
  try {
    const dir = path.dirname(SNAPSHOT_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(SNAPSHOT_FILE, JSON.stringify(data, null, 2));
    console.log('Snapshot saved successfully.');
  } catch (error) {
    console.error('Failed to save snapshot:', error);
  }
};

// Helper to load snapshot
const loadSnapshot = () => {
  try {
    if (fs.existsSync(SNAPSHOT_FILE)) {
      const data = fs.readFileSync(SNAPSHOT_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load snapshot:', error);
  }
  return null;
};

export async function GET() {
  let apiStatus: 'LIVE' | 'ARCHIVED' = 'LIVE';
  let items: VoteItem[] = [];

  try {
    // Use the payload that we know works (from the user's latest request)
    const inputParam =
      '%7B%220%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%2C%221%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%7D';

    const url = `https://nextafrobeatsstar.com/api/trpc/vote.getAll,vote.getAnonymousStats?batch=1&input=${inputParam}`;

    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://nextafrobeatsstar.com/',
        'Origin': 'https://nextafrobeatsstar.com',
      },
      next: { revalidate: 0 },
    });

    let voteItems = [];

    if (res.ok) {
      const data = await res.json();
      const pollData = data[0]?.result?.data?.json;
      
      // Check if we have valid vote items
      if (Array.isArray(pollData) && pollData.length > 0 && Array.isArray(pollData[0]?.VoteItem)) {
        voteItems = pollData[0].VoteItem;
        
        // Save successful fetch to snapshot
        saveSnapshot(voteItems);
      }
    }

    // If no live data (fetch failed or empty), try loading snapshot
    if (voteItems.length === 0) {
      console.log('Live data unavailable or empty. Loading snapshot...');
      const snapshotData = loadSnapshot();
      if (snapshotData && Array.isArray(snapshotData)) {
        voteItems = snapshotData;
        apiStatus = 'ARCHIVED';
      } else {
        console.error('No snapshot available.');
        // If no snapshot, we still return empty array (or maybe static data?)
        // For now, let it fall through to static merge which handles 0 votes
      }
    }

    // Create a map for quick lookup of live (or snapshot) data
    const liveDataMap = new Map();
    voteItems.forEach((item: any) => {
      // Normalize name for matching: lowercase, trim
      const normalizedName = item.name.toLowerCase().trim();
      liveDataMap.set(normalizedName, {
        id: item.id,
        voteCount: Number(item.voteCount) || 0,
        image: item.image,
        originalName: item.name
      });
    });

    // Merge with static list
    items = allContestants.map((contestant: { name: string }) => {
      const normalizedStaticName = contestant.name.toLowerCase().trim();
      const liveData = liveDataMap.get(normalizedStaticName);

      if (liveData) {
        return {
          id: liveData.id,
          name: liveData.originalName, // Use name from API to be safe, or static
          voteCount: liveData.voteCount,
          image: liveData.image,
          status: 'Safe', // Default, will be updated by rank
        };
      } else {
        // Eliminated contestant
        return {
          id: `eliminated-${normalizedStaticName}`, // Generate a stable ID
          name: contestant.name,
          voteCount: 0,
          image: undefined, // Will be handled by getContestantImage in frontend
          status: 'Eliminated',
        };
      }
    });

    // Sort: Active contestants by votes (desc)
    items.sort((a, b) => b.voteCount - a.voteCount);

    // Total votes
    const totalVotes = items.reduce((sum, item) => sum + item.voteCount, 0);

    // Count active contestants to determine "At Risk" threshold
    const activeContestantsCount = items.filter(i => i.status !== 'Eliminated').length;

    // Add rank + % + Status Logic
    items = items.map((item, index) => {
      const percentage = totalVotes > 0 ? ((item.voteCount / totalVotes) * 100).toFixed(2) : '0.00';
      
      let status = item.status; // 'Safe' (from merge) or 'Eliminated'
      
      if (status !== 'Eliminated') {
         if (index >= activeContestantsCount - 3) {
             status = 'At Risk';
         } else {
             status = 'Safe';
         }
      }

      return {
        ...item,
        rank: index + 1,
        percentage,
        status, 
      };
    });

    return NextResponse.json({
      status: apiStatus,
      contestants: items
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    // Try snapshot on error too
    const snapshotData = loadSnapshot();
    if (snapshotData && Array.isArray(snapshotData)) {
       // Logic to process snapshot data would be duplicated here. 
       // Ideally refactor processing into a function, but for now let's just return error
       // or we could structure the code to fall through.
       // Given the structure, let's just return error for now to be safe, 
       // but the 'voteItems.length === 0' check above handles the "empty response" case which is the main goal.
       // A full fetch error is less likely to be "voting closed" and more "server down".
    }
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
}
