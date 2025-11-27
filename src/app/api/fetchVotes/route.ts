import { NextResponse } from 'next/server';
import { VoteItem } from '@/types';

import { allContestants } from '@/utils/allContestants';

export async function GET() {
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

    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }

    const data = await res.json();

    // Correct Path Analysis:
    // data[0] -> result -> data -> json -> [PollObject] -> VoteItem -> [Array of contestants]
    const pollData = data[0]?.result?.data?.json;

    if (!Array.isArray(pollData) || pollData.length === 0) {
      console.error('Unexpected API structure (Poll Data):', JSON.stringify(data, null, 2));
      return NextResponse.json({ error: 'Invalid API structure' }, { status: 500 });
    }

    // The first item in the json array is the active poll
    const voteItems = pollData[0]?.VoteItem;

    if (!Array.isArray(voteItems)) {
      console.error('Unexpected API structure (VoteItems):', JSON.stringify(pollData[0], null, 2));
      return NextResponse.json({ error: 'No vote items found' }, { status: 500 });
    }

    // Create a map for quick lookup of live data
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
    let items: VoteItem[] = allContestants.map((contestant: { name: string }) => {
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

    // Sort: Active contestants by votes (desc), then Eliminated ones (if we want them at bottom)
    // Actually, just sort by votes. Eliminated have 0, so they go to bottom.
    items.sort((a, b) => b.voteCount - a.voteCount);

    // Total votes (only from active contestants to avoid skewing %? Or all? 
    // Usually % is of total votes cast. Eliminated have 0 new votes.)
    const totalVotes = items.reduce((sum, item) => sum + item.voteCount, 0);

    // Count active contestants to determine "At Risk" threshold
    const activeContestantsCount = items.filter(i => i.status !== 'Eliminated').length;
    const atRiskThreshold = Math.max(0, activeContestantsCount - 3); // Bottom 3 active

    // Add rank + % + Status Logic
    items = items.map((item, index) => {
      const percentage = totalVotes > 0 ? ((item.voteCount / totalVotes) * 100).toFixed(2) : '0.00';
      
      let status = item.status; // 'Safe' (from merge) or 'Eliminated'
      
      if (status !== 'Eliminated') {
         // Logic: Bottom 3 active are At Risk
         // Since items are sorted by votes, the active ones are at the top (mostly).
         // Wait, if eliminated ones have 0 votes, they are at the bottom.
         // But we need to know the rank *among active contestants*.
         
         // Let's find the index of this item among active items
         // Actually, simpler: if rank (1-based) > activeContestantsCount - 3, then At Risk.
         // But 'rank' is just index + 1 in the *entire* list (including eliminated if they are mixed in).
         // Eliminated are at the bottom because 0 votes.
         // So active ones are indices 0 to activeContestantsCount - 1.
         // The bottom 3 active ones are indices: activeContestantsCount - 3, activeContestantsCount - 2, activeContestantsCount - 1.
         
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

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
}
