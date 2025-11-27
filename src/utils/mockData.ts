import { StaticImageData } from 'next/image';

export interface Contestant {
  id: string;
  name: string;
  image: string | StaticImageData;
  votes: number;
  percentage: string;
  status: 'Safe' | 'At Risk' | 'Eliminated';
}


