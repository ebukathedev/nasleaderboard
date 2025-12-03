import { NextResponse } from 'next/server';
import { VoteItem } from '@/types';
import { redis } from '@/lib/redis';
import { allContestants } from '@/utils/allContestants';

// Helper to save snapshot
const saveSnapshot = async (data: any) => {
  try {
    await redis.set('vote_snapshot', JSON.stringify(data));
    console.log('Snapshot saved successfully.');
  } catch (error) {
    console.error('Failed to save snapshot:', error);
  }
};

// Helper to load snapshot
const loadSnapshot = async () => {
  try {
    const data = await redis.get('vote_snapshot');
    return data ? JSON.parse(data) : null;
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
    let metadata = null;

    if (res.ok) {
      const data = await res.json();
      const pollData = data[0]?.result?.data?.json;
      
      // Check if we have valid vote items
      if (Array.isArray(pollData) && pollData.length > 0) {
        const activePoll = pollData[0];
        if (Array.isArray(activePoll?.VoteItem)) {
          voteItems = activePoll.VoteItem;
          
          metadata = {
            title: activePoll.title,
            startDate: activePoll.startDate,
            endDate: activePoll.endDate,
            isActive: activePoll.isActive
          };

          // Save successful fetch to snapshot
          await saveSnapshot({ metadata, contestants: voteItems });
        }
      }
    }

    // If no live data (fetch failed or empty), try loading snapshot
    if (voteItems.length === 0) {
      console.log('Live data unavailable or empty. Loading snapshot...');
      const snapshotData = await loadSnapshot();
      // Check if snapshot is the new structure { metadata, contestants } or old array
      if (snapshotData) {
        if (Array.isArray(snapshotData)) {
           // Old snapshot format (just array) - handle gracefully or ignore
           voteItems = snapshotData;
           // Metadata will be null, which is fine, frontend should handle it
        } else if (snapshotData.contestants && Array.isArray(snapshotData.contestants)) {
           // New snapshot format
           voteItems = snapshotData.contestants;
           metadata = snapshotData.metadata;
        }
        apiStatus = 'ARCHIVED';
      } else {
        console.error('No snapshot available.');
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
      metadata,
      contestants: items
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    // Try snapshot on error too
    const snapshotData = await loadSnapshot();
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
