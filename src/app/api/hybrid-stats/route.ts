import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

// Types for the data structures
interface WebContestant {
  id: string;
  name: string;
  voteCount: number;
  webRank: number;
}

interface AppParticipant {
  id: string;
  name: string;
  running_number: number; // Used for sorting app rank
  appRank: number;
}

interface HybridStats {
  name: string;
  webVotes: number;
  webRank: number;
  appRank: number;
  rankGap: number; // webRank - appRank
}

// Helper to save snapshot
const saveSnapshot = async (data: any) => {
  try {
    await redis.set('hybrid_stats_snapshot', JSON.stringify(data));
    console.log('Hybrid stats snapshot saved successfully.');
  } catch (error) {
    console.error('Failed to save hybrid stats snapshot:', error);
  }
};

// Helper to load snapshot
const loadSnapshot = async () => {
  try {
    const data = await redis.get('hybrid_stats_snapshot');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load hybrid stats snapshot:', error);
  }
  return null;
};

export async function GET() {
  try {
    // 1. Fetch Web Data (Official Counts)
    const webUrl = 'https://nextafrobeatsstar.com/api/trpc/vote.getAll,vote.getAnonymousStats?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%2C%221%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%7D';
    const webRes = await fetch(webUrl, { next: { revalidate: 60 } }); // Cache for 60s
    const webJson = await webRes.json();

    // Extract relevant data from TRPC response
    // The response is a batch, index 0 is usually vote.getAll
    const webPolls = webJson[0]?.result?.data?.json || [];
    const webDataRaw = (Array.isArray(webPolls) && webPolls.length > 0 && webPolls[0].VoteItem) 
      ? webPolls[0].VoteItem 
      : [];
    
    // Sort by votes descending to determine Web Rank
    const webContestants: WebContestant[] = webDataRaw
      .sort((a: any, b: any) => (Number(b.voteCount) || 0) - (Number(a.voteCount) || 0))
      .map((c: any, index: number) => ({
        id: c.id,
        name: c.name,
        voteCount: Number(c.voteCount) || 0,
        webRank: index + 1,
      }));

    if (webContestants.length === 0) {
      throw new Error('No web contestants found (External API returned empty). Triggering fallback.');
    }

    // 2. Fetch App Data (The Hidden Order)
    const appUrl = 'https://backend.choicely.com/contests/Y2hvaWNlbHktZXUvY29udGVzdHMvT2VFRW1FS2c0a3NlYmRuN0JDNmc/participants';
    const appRes = await fetch(appUrl, { next: { revalidate: 60 } });
    const appJson = await appRes.json();

    // Sort by running_number DESCENDING (Highest number = Rank #1)
    const appParticipants: AppParticipant[] = (appJson.participants || [])
      .sort((a: any, b: any) => (b.running_number || 0) - (a.running_number || 0))
      .map((p: any, index: number) => ({
        id: p.id,
        name: p.title, // App API uses 'title' for the name
        running_number: p.running_number,
        appRank: index + 1,
      }));

    // 3. The Merge
    const mergedStats: HybridStats[] = [];

    // Helper to normalize names for comparison
    const normalize = (str: string) => (str || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '');

    for (const webC of webContestants) {
      const normalizedWebName = normalize(webC.name);
      
      // Find matching App participant
      const appP = appParticipants.find(p => normalize(p.name) === normalizedWebName);

      if (appP) {
        mergedStats.push({
          name: webC.name, // Use Web Name as display name
          webVotes: webC.voteCount,
          webRank: webC.webRank,
          appRank: appP.appRank,
          rankGap: webC.webRank - appP.appRank, // Positive = Better on App (e.g. Web #5 - App #1 = 4)
        });
      } else {
        // Handle case where no match found (shouldn't happen if names match)
        // For now, we can push with appRank as null or a high number, or skip.
        // Let's include them with a special indicator if needed, but for now we'll assume matches.
        // If strict matching fails, we might miss some, but let's stick to the plan.
        console.warn(`No app match found for: ${webC.name}`);
      }
    }

    // Extract metadata
    let metadata = null;
    if (Array.isArray(webPolls) && webPolls.length > 0) {
      const activePoll = webPolls[0];
      metadata = {
        title: activePoll.title,
        startDate: activePoll.startDate,
        endDate: activePoll.endDate,
        isActive: activePoll.isActive
      };
    }

    // Save to Redis
    if (mergedStats.length > 0) {
      await saveSnapshot({ metadata, data: mergedStats });
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      metadata,
      data: mergedStats
    });

  } catch (error) {
    console.error('Error fetching hybrid stats:', error);
    
    // Try loading from snapshot
    console.log('Attempting to load hybrid stats from snapshot...');
    const snapshotData = await loadSnapshot();
    
    if (snapshotData) {
      // Handle both old (array) and new ({ metadata, data }) snapshot formats
      const data = Array.isArray(snapshotData) ? snapshotData : (snapshotData.data || []);
      const metadata = Array.isArray(snapshotData) ? null : snapshotData.metadata;

      return NextResponse.json({
        timestamp: new Date().toISOString(),
        metadata,
        data,
        source: 'snapshot'
      });
    }

    return NextResponse.json({ error: 'Failed to fetch hybrid stats' }, { status: 500 });
  }
}
