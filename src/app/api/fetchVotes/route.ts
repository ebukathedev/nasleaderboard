import { NextResponse } from 'next/server';
import { VoteItem } from '@/types';

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

    let items: VoteItem[] = voteItems.map((item: any) => ({
      id: item.id,
      name: item.name,
      voteCount: Number(item.voteCount) || 0,
      image: item.image,
    }));

    // Sort
    items.sort((a, b) => b.voteCount - a.voteCount);

    // Total votes
    const totalVotes = items.reduce((sum, item) => sum + item.voteCount, 0);

    // Add rank + %
    items = items.map((item, index) => ({
      ...item,
      rank: index + 1,
      percentage: totalVotes > 0 ? ((item.voteCount / totalVotes) * 100).toFixed(2) : '0.00',
    }));

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
}
