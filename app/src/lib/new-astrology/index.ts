// src/lib/new-astrology/index.ts

import { aquarius } from './aquarius';
import { aries } from './aries';
import { cancer } from './cancer';
import { capricorn } from './capricorn';
import { gemini } from './gemini';
import { leo } from './leo';
import { libra } from './libra';
import { pisces } from './pisces';
import { sagittarius } from './sagittarius';
import { scorpio } from './scorpio';
import { taurus } from './taurus';
import { virgo } from './virgo';


interface NewAstrologySign {
  description: string;
  love: string;
  compatibilities: string;
  homeAndFamily: string;
  profession: string;
}

// This file remains for now but is no longer the primary data source
// for the Astro Insights tab.
export const NEW_ASTROLOGY_DATA: { [key: string]: NewAstrologySign } = {
  ...aries,
  ...taurus,
  ...gemini,
  ...cancer,
  ...leo,
  ...virgo,
  ...libra,
  ...scorpio,
  ...sagittarius,
  ...capricorn,
  ...aquarius,
  ...pisces,
};
