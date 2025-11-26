export interface VoteItem {
  id?: string;
  name: string;
  voteCount: number;
  image?: string;
  percentage?: string;
  rank?: number;
}

export interface ApiResponse {
  result: {
    data: {
      json: {
        vote: {
          getAll: Array<{
            id: string;
            name: string;
            voteCount: number;
            image: string;
            // Add other fields if necessary based on actual API response
          }>;
        };
      };
    };
  };
}
