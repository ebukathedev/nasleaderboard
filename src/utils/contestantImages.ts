import astroboi from '@/images/astroboi.jpg';
import ayoBenzi from '@/images/ayo-benzi.jpg';
import daveCash from '@/images/dave-cash.jpg';
import eniolaa from '@/images/eniolaa.jpg';
import firstChoice from '@/images/first-choice.jpg';
import immansion from '@/images/immansion.jpg';
import kaeko from '@/images/kaeko!.jpg';
import luckyYay from '@/images/lucky-yay.jpg';
import psamuel from '@/images/psamuel.jpg';
import somtoOlaker from '@/images/somto-olaker.jpg';
import tunexz from '@/images/tunexz.jpg';
import yellowGirl from '@/images/yellow-girl.jpg';
import nasLogo from '@/images/image.png';

import { StaticImageData } from 'next/image';

const imageMap: Record<string, StaticImageData> = {
  'astroboi': astroboi,
  'ayo benzi': ayoBenzi,
  'dave cash': daveCash,
  'eniolaa': eniolaa,
  'first choice': firstChoice,
  'immansion': immansion,
  'kaeko': kaeko, // Assuming '!' might be stripped or handled
  'kaeko!': kaeko,
  'lucky yay': luckyYay,
  'psamuel': psamuel,
  'somto olaker': somtoOlaker,
  'tunexz': tunexz,
  'yellow girl': yellowGirl,
};

export const getContestantImage = (name: string): StaticImageData | string => {
  if (!name) return nasLogo; // Fallback
  
  const normalized = name.toLowerCase().trim();
  
  // Try exact match
  if (imageMap[normalized]) return imageMap[normalized];
  
  // Try partial match or other heuristics if needed
  // For now, return a default or the logo if not found
  // But let's try to match by removing special chars
  const cleanName = normalized.replace(/[^a-z0-9]/g, '');
  for (const key in imageMap) {
    if (key.replace(/[^a-z0-9]/g, '') === cleanName) {
      return imageMap[key];
    }
  }

  return nasLogo;
};

export const getNasLogo = () => nasLogo;
