import { StaticImageData } from 'next/image';

export interface Contestant {
  id: string;
  name: string;
  image: string | StaticImageData;
  votes: number;
  percentage: string;
  status: 'Safe' | 'At Risk' | 'Eliminated';
}

export const contestants: Contestant[] = [
  { id: '1', name: 'Aria Vance', image: 'https://i.pravatar.cc/150?u=1', votes: 12500, percentage: '10.5', status: 'Safe' },
  { id: '2', name: 'Jax Thorne', image: 'https://i.pravatar.cc/150?u=2', votes: 11800, percentage: '9.8', status: 'Safe' },
  { id: '3', name: 'Lyra Cole', image: 'https://i.pravatar.cc/150?u=3', votes: 11200, percentage: '9.3', status: 'Safe' },
  { id: '4', name: 'Kaelen Moss', image: 'https://i.pravatar.cc/150?u=4', votes: 10500, percentage: '8.8', status: 'Safe' },
  { id: '5', name: 'Sienna West', image: 'https://i.pravatar.cc/150?u=5', votes: 9800, percentage: '8.2', status: 'Safe' },
  { id: '6', name: 'Ronan Park', image: 'https://i.pravatar.cc/150?u=6', votes: 9200, percentage: '7.7', status: 'Safe' },
  { id: '7', name: 'Elara Moon', image: 'https://i.pravatar.cc/150?u=7', votes: 8900, percentage: '7.4', status: 'Safe' },
  { id: '8', name: 'Dorian Grey', image: 'https://i.pravatar.cc/150?u=8', votes: 8500, percentage: '7.1', status: 'Safe' },
  { id: '9', name: 'Mira Sol', image: 'https://i.pravatar.cc/150?u=9', votes: 8100, percentage: '6.8', status: 'Safe' },
  { id: '10', name: 'Tyrell Fox', image: 'https://i.pravatar.cc/150?u=10', votes: 7600, percentage: '6.3', status: 'At Risk' },
  { id: '11', name: 'Nia Reed', image: 'https://i.pravatar.cc/150?u=11', votes: 7400, percentage: '6.2', status: 'At Risk' },
  { id: '12', name: 'Orion Black', image: 'https://i.pravatar.cc/150?u=12', votes: 7200, percentage: '6.0', status: 'At Risk' },
  { id: '13', name: 'Zara Quinn', image: 'https://i.pravatar.cc/150?u=13', votes: 6500, percentage: '5.4', status: 'Eliminated' },
  { id: '14', name: 'Vane Cross', image: 'https://i.pravatar.cc/150?u=14', votes: 5800, percentage: '4.8', status: 'Eliminated' },
  { id: '15', name: 'Ivy Lane', image: 'https://i.pravatar.cc/150?u=15', votes: 4200, percentage: '3.5', status: 'Eliminated' },
];

export const getTotalVotes = () => contestants.reduce((acc, curr) => acc + curr.votes, 0);

export const getVotePercentage = (votes: number) => {
  const total = getTotalVotes();
  if (total === 0) return 0;
  return ((votes / total) * 100).toFixed(1);
};
