export interface VoteItem {
  id?: string;
  name: string;
  voteCount: number;
  image?: string;
  percentage?: string;
  rank?: number;
  status?: 'Safe' | 'At Risk' | 'Eliminated';
}

export interface CampaignMetadata {
  title: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface ApiResponse {
  status?: 'LIVE' | 'ARCHIVED';
  metadata?: CampaignMetadata;
  contestants: VoteItem[];
}
