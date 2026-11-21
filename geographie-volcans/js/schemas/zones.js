// Schémas du chapitre 4 (cours/03, page 13 et « Retenons ») :
//   - le planisphère « Les grandes zones de volcanisme » (croquis simplifié, centré sur l'océan Pacifique comme la carte du
//     cours), en trois versions à légender : les zones, les océans, TOLES ;
//   - la grande coupe du « Retenons », en deux versions : les emplacements et les couches, puis les cinq cases du bas.
// SCHEMAS[id] = { titre, labels: [...dans l'ordre des numéros], svg }.
// La géographie (GEO) est partagée avec l'animation sims/zones-globe.js : mêmes formes, mêmes couleurs.
import { ENCRE, TXT, wrap } from './outils.js';

/* =====================================================================================================================
   1. Géographie très simplifiée, en [longitude, latitude] (degrés ; ouest et sud négatifs).
   ===================================================================================================================== */

/** Couleurs de la légende de l'élève (surligneurs). */
export const ZONES = {
  cfp: { nom: 'Ceinture de feu du Pacifique', abr: 'CFP', couleur: '#ff7fb2' },
  pm: { nom: 'Pourtour méditerranéen', abr: 'PM', couleur: '#b57be6' },
  dma: { nom: 'Dorsale médio-Atlantique', abr: 'DMA', couleur: '#f79a6a' },
  ra: { nom: 'Rift africain', abr: 'RA', couleur: '#fde21c' },
};

const TERRES = {
  asie: [[75, 73], [80, 73.5], [87, 75], [98, 76.5], [105, 77.5], [113, 73.8], [122, 73], [130, 71], [140, 72.5], [150, 71.5], [160, 69.7], [170, 70], [180, 69], [187, 66.5], [190, 65.8], [186, 64.4], [180, 62.5], [175, 62], [171, 60], [164, 59.8], [163, 57.8], [162, 56], [160, 54], [157, 51], [156, 52.5], [155.5, 56], [156.5, 57.7], [154, 59.2], [149, 59.6], [143, 59.3], [140, 58], [137, 54.5], [141, 52.5], [140.3, 48.5], [137.5, 45.5], [135, 43.3], [132, 43], [130, 42.2], [129.4, 40.6], [128, 38.5], [129.4, 36], [129, 35], [126.5, 34.4], [126.2, 36.8], [124.7, 38], [125.2, 39.6], [121.6, 40], [121.5, 39], [122.5, 37.4], [120.5, 36], [119.3, 34.8], [120.8, 32.5], [121.9, 30.8], [121.5, 28.5], [120, 26.5], [118.5, 24.6], [116.5, 23], [113.5, 22.2], [111, 21.4], [108, 21.6], [106.7, 20.5], [105.7, 18.9], [106.6, 17.5], [108.5, 15.4], [109.3, 13], [109.2, 11.6], [107.5, 10.5], [106.5, 9.5], [104.8, 8.6], [105, 10], [103.5, 10.6], [102.9, 11.7], [101, 12.6], [100.5, 13.5], [99.5, 12], [99.2, 10], [100, 8.5], [100.6, 7], [101.5, 6.8], [102.5, 6], [103.4, 4.5], [103.5, 2.8], [104.2, 1.4], [103, 1.6], [101.3, 2.8], [100.3, 4.5], [100.4, 6], [99, 7.6], [98.3, 8.5], [98.6, 10], [98.5, 12.5], [98, 14.5], [97.6, 16.5], [96.2, 16.8], [94.4, 16], [94.2, 18.8], [92.4, 20.8], [91.6, 22.6], [90.4, 22], [88.8, 21.6], [87, 21], [86.5, 20], [85, 19.3], [84.2, 18.3], [82.3, 16.6], [80.3, 15.5], [80.2, 13], [79.8, 11.5], [79.3, 10.3], [78.2, 8.9], [77.5, 8.1], [76.6, 8.9], [75.8, 11], [75, 12]],
  ouest: [[-8.9, 37], [-9.5, 38.8], [-8.9, 41.9], [-9.3, 43], [-7.8, 43.7], [-4, 43.5], [-1.6, 43.4], [-1.2, 46.2], [-2.3, 47.2], [-4.5, 47.9], [-4.4, 48.7], [-1.6, 48.7], [-1.3, 49.7], [0.2, 49.5], [1.6, 50.9], [3.2, 51.4], [4.5, 52.6], [5, 53.4], [8.6, 53.9], [8.1, 56.9], [10.5, 57.6], [10.8, 54.5], [12.5, 54.4], [14.3, 53.9], [18, 54.8], [21, 55.5], [21.2, 57.2], [24, 59.3], [28, 59.6], [26, 60.4], [22.6, 60], [21.4, 61.5], [21.5, 63.2], [25, 65], [22.5, 65.8], [19.5, 63.5], [17.5, 62.3], [17.2, 60.7], [18.8, 60], [18, 59], [16.6, 57.2], [16.2, 56.2], [14.2, 55.4], [12.9, 55.5], [11.8, 58], [10.6, 59.9], [9, 58.7], [7, 58], [5.6, 58.6], [5.1, 60.3], [5, 62], [8.5, 63.6], [10.5, 64.5], [12.5, 66], [14, 67.5], [16.2, 68.5], [18, 69.6], [21.5, 70.3], [25.5, 71.1], [28.5, 70.9], [31, 70.2], [33, 69.4], [36, 69], [40.5, 67.7], [44, 68.4], [46, 68], [53.5, 68.7], [58, 68.8], [60.5, 69.8], [66.5, 69.6], [69, 70.5], [73, 71.8], [74.9, 72.8], [74.9, 12.5], [74.4, 14.4], [73.4, 16.5], [72.8, 19.2], [72.6, 21.3], [70.7, 20.8], [69, 22.3], [70.3, 22.9], [68.5, 23.6], [67.3, 24.7], [66.6, 25.4], [64.3, 25.3], [61.6, 25.2], [57.3, 25.8], [56.4, 27.1], [54.7, 26.5], [52, 27.8], [50.7, 29.2], [49.5, 30], [48, 29.9], [48.4, 28.5], [49.7, 26.8], [50.8, 24.8], [51.6, 24.2], [53.6, 24.1], [55.8, 25.3], [56.4, 26.2], [56.5, 24.4], [58.6, 23.6], [59.8, 22.4], [58.5, 20.4], [57.7, 19], [55.4, 17.6], [52.2, 15.9], [49.5, 14.6], [45.4, 13], [43.5, 12.7], [43.2, 13.3], [42.6, 15.4], [41.2, 18.2], [39.2, 21.5], [37.4, 24.6], [35.7, 27.4], [34.9, 29.4], [34.2, 31.3], [34.9, 32.7], [35.6, 34.5], [35.9, 35.9], [34.7, 36.8], [32.4, 36.1], [30.4, 36.3], [28.4, 36.8], [27.3, 37.4], [26.3, 38.5], [26.6, 39.9], [26.2, 40.6], [24.4, 40.9], [23.7, 40.2], [22.9, 40.6], [23.2, 38.2], [22.9, 36.5], [21.7, 36.8], [21.1, 38.3], [20.2, 39.6], [19.4, 41], [19.4, 42], [17.5, 43], [15.9, 43.6], [14.9, 44.6], [13.7, 45.6], [12.4, 45.4], [12.3, 44.5], [13.6, 43.5], [14.7, 42.1], [16.1, 41.6], [18.5, 40.1], [17, 40.5], [16.5, 39.7], [17.1, 38.9], [16.1, 37.9], [15.6, 38.2], [15.8, 39.3], [15.2, 40.2], [14.3, 40.8], [12.4, 41.7], [11, 42.4], [10.2, 43.9], [8.9, 44.4], [7.5, 43.8], [6.5, 43.1], [4.8, 43.4], [3.1, 43.1], [3.2, 41.9], [2.1, 41.3], [0.8, 40.7], [-0.2, 39.5], [0.2, 38.8], [-0.7, 37.6], [-2.1, 36.7], [-4.4, 36.7], [-5.6, 36], [-6.4, 36.8], [-7.4, 37.2]],
  afrique: [[-17, 21], [-16.4, 19.5], [-16.2, 16.6], [-17.4, 14.7], [-16.7, 12.4], [-15, 10.9], [-13.2, 8.9], [-11.4, 6.8], [-7.6, 4.4], [-4, 5.2], [-1.9, 4.8], [1, 5.9], [4.5, 6.2], [6.2, 4.3], [8.5, 4.5], [9.8, 3], [9.5, 0.6], [9.2, -1.3], [11.8, -4], [12.3, -6.1], [13.4, -9], [13.6, -11.7], [12.2, -14.4], [11.8, -17.8], [13.4, -20.9], [14.5, -22.9], [15.2, -27], [16.5, -28.6], [18.3, -32.6], [18.4, -34.2], [20, -34.8], [22.6, -33.9], [25.7, -34], [28.2, -32.7], [30.4, -30.8], [32.5, -28.5], [32.6, -26], [35.5, -24.1], [35.4, -21.8], [34.6, -19.8], [36.8, -17.9], [40.6, -15.5], [40.6, -10.6], [39.3, -8], [39.2, -4.7], [41, -1.7], [43.2, 0.9], [46, 2.4], [48.9, 5.4], [51.1, 10.5], [51.2, 11.9], [48.9, 11.3], [45, 10.4], [43.3, 11.9], [42.7, 13.7], [41.2, 14.5], [39.8, 15.4], [38.5, 18], [37.4, 18.6], [37.1, 21.2], [35.6, 23.2], [34.1, 26.2], [32.7, 29], [32.3, 31.3], [29.7, 31.1], [25.2, 31.6], [22, 32.9], [20.1, 32.2], [19.6, 30.5], [15.7, 31.5], [11.6, 33.2], [10.1, 34.3], [11.1, 35.2], [10.2, 37.2], [7.7, 37], [3.2, 36.8], [-0.1, 35.8], [-2.2, 35.1], [-5.9, 35.8], [-6.9, 34.2], [-9.6, 30.7], [-9.8, 29.4], [-13, 27.7], [-14.4, 26.3], [-16.4, 23.6]],
  amnord: [[-166, 68.8], [-163, 70.3], [-156.6, 71.3], [-151, 70.4], [-141, 69.6], [-133, 69.5], [-128, 70.2], [-120, 69], [-114, 68.3], [-108, 68.6], [-101, 67.8], [-95, 68.2], [-94, 69.3], [-89, 68.8], [-85.5, 69.8], [-81.5, 68.5], [-82, 66.5], [-86.5, 64.8], [-90.5, 63.8], [-93.5, 61.7], [-94.6, 59], [-92.8, 57], [-88.5, 56.4], [-85, 55.3], [-82.3, 55.1], [-82.3, 52.9], [-79.3, 51.4], [-78.6, 52.7], [-79.2, 54.5], [-77, 57.8], [-78.3, 58.9], [-77.4, 60.8], [-78.2, 62.3], [-74, 62.3], [-71, 61.2], [-69.5, 59.2], [-67.6, 58.2], [-64.5, 60.3], [-61.5, 56.3], [-59, 55], [-55.7, 52], [-60, 50.2], [-65, 49.2], [-64.6, 46.6], [-61, 45.6], [-63.5, 44.6], [-66, 44], [-67, 45], [-70.2, 43.7], [-70.7, 42], [-73.7, 40.6], [-74, 39.8], [-75.5, 38.4], [-76.3, 37], [-75.6, 35.3], [-77, 34.5], [-79, 33.4], [-81, 31.6], [-81.4, 30.3], [-80.1, 26.6], [-80.4, 25.2], [-81.2, 25.4], [-82.7, 27.6], [-82.8, 29.2], [-84.3, 30], [-86.5, 30.4], [-89.6, 30.2], [-89.4, 29], [-91.5, 29.5], [-94, 29.6], [-97, 27.6], [-97.6, 24.5], [-97.6, 22], [-96.3, 19.5], [-94.5, 18.2], [-92, 18.6], [-90.7, 19.6], [-90.4, 21], [-87, 21.5], [-87.6, 19.6], [-88.3, 18.5], [-88.2, 16], [-86, 15.9], [-83.4, 15.2], [-83.6, 11.5], [-82.2, 9], [-79.5, 9.5], [-77.4, 8.6], [-77.9, 7.2], [-80.5, 7.4], [-82, 8.2], [-85.7, 10.2], [-85.8, 11.2], [-87.6, 13.1], [-91.4, 13.9], [-94.4, 16.1], [-96.6, 15.7], [-99.6, 16.8], [-103.5, 18.3], [-105.4, 20.4], [-105.6, 22.8], [-108.2, 25.3], [-111.1, 27.8], [-112.6, 29.8], [-114.8, 31.8], [-113.6, 29.5], [-112.2, 27.7], [-111, 25.8], [-109.5, 23.2], [-110.3, 23.6], [-112, 24.8], [-112.3, 26.6], [-114.3, 27.8], [-115.6, 29.7], [-117.1, 32.5], [-118.5, 34], [-120.6, 34.6], [-121.9, 36.6], [-123, 38], [-123.8, 39.8], [-124.3, 42], [-124, 46.2], [-124.7, 48.4], [-125, 50], [-127.9, 51.6], [-130.2, 54.6], [-133, 57], [-136, 58.6], [-139.6, 59.7], [-143.9, 60.1], [-146.5, 60.7], [-149.5, 59.8], [-151.8, 59.2], [-154, 57.2], [-156, 57], [-158.5, 55.7], [-162, 54.9], [-163.8, 54.6], [-160.6, 56.3], [-157.6, 57.8], [-157.6, 58.7], [-161.9, 58.6], [-162.4, 60], [-164.9, 60.6], [-165.3, 62.4], [-164.5, 63.2], [-161.4, 64.4], [-166.2, 64.6], [-168, 65.6], [-164.4, 66.6], [-163.7, 67.8]],
  amsud: [[-77.3, 8.6], [-75.6, 10.6], [-74, 11.3], [-71.3, 12.4], [-71, 11], [-68.7, 10.5], [-65, 10.1], [-62, 10.7], [-60.7, 8.5], [-58, 6.8], [-55, 5.9], [-52, 4.9], [-50.5, 1.8], [-50, 0], [-48.5, -1], [-44.5, -2.3], [-41.5, -2.9], [-38.5, -3.7], [-35.2, -5.4], [-34.9, -8], [-36.2, -10.2], [-38.9, -13.5], [-39.1, -17.6], [-40.9, -21.7], [-43, -23], [-45.5, -23.8], [-48.6, -26.5], [-48.8, -28.6], [-51.2, -31.5], [-53.4, -33.8], [-55.3, -34.9], [-57.2, -35.4], [-56.8, -36.6], [-57.8, -38.2], [-62.2, -38.8], [-62.4, -40.6], [-65, -41.1], [-63.8, -42.2], [-65.3, -45], [-67.6, -46.4], [-65.8, -47.8], [-68.3, -50.2], [-69.1, -52.2], [-68.6, -54.8], [-71, -55], [-74.6, -52.6], [-75.4, -48.5], [-74, -46], [-73.6, -41.7], [-73.4, -37.1], [-71.7, -33], [-71.4, -28], [-70.5, -23.5], [-70.2, -18.4], [-72.4, -17], [-76.2, -13.9], [-78.9, -8.4], [-81.2, -5.8], [-80.3, -3.4], [-80.9, -1], [-80, 0.9], [-78.9, 1.6], [-77.4, 4], [-77.5, 6.6], [-77.9, 7.2]],
  groenland: [[-72, 78.2], [-62, 81.5], [-40, 83.5], [-22, 82], [-17, 79.5], [-19, 76], [-21.5, 72.5], [-24, 70], [-31, 68.2], [-37.5, 65.7], [-41, 63], [-43.5, 60], [-48.3, 61], [-51, 63.5], [-53.5, 66.5], [-53, 69.5], [-55.5, 71.5], [-58.5, 75.6], [-66, 76.4]],
  baffin: [[-80, 73.7], [-72, 71.2], [-67, 69.5], [-62, 66.6], [-64, 63.5], [-68, 62.6], [-73, 64.5], [-78, 64.6], [-77, 66.8], [-81.5, 69.2], [-88, 71]],
  arctique: [[-125, 72], [-121, 75], [-110, 76.2], [-97, 76.5], [-90, 76.2], [-80, 76.2], [-90, 74.5], [-98, 73.4], [-102, 70.5], [-108, 69], [-117, 69.2], [-123, 70.6]],
  islande: [[-22.5, 64], [-21.5, 65.4], [-24, 65.5], [-22.3, 66.4], [-16.5, 66.5], [-13.5, 65.3], [-14.5, 64.4], [-18.8, 63.4]],
  grandeBretagne: [[-5.7, 50], [1.4, 51.2], [1.7, 52.7], [0.1, 53.5], [-1.6, 55.5], [-2, 57.6], [-3.8, 58.6], [-5, 58.6], [-6.2, 57], [-5.6, 55.4], [-3, 54.9], [-3, 53.4], [-4.6, 53], [-4.3, 51.7]],
  irlande: [[-6, 52.1], [-6.2, 54.5], [-8.3, 55.2], [-10, 54], [-10.3, 51.8], [-8, 51.6]],
  sicile: [[12.4, 37.8], [15.6, 38.3], [15.1, 36.7], [12.4, 37.6]],
  sardaigne: [[8.4, 39], [9.6, 39.1], [9.7, 41], [9.4, 43], [8.6, 42.4], [8.2, 40]],
  cuba: [[-85, 21.9], [-82, 23.2], [-77, 22], [-74.2, 20.2], [-77.6, 19.9], [-80.5, 21.7]],
  hispaniola: [[-74.5, 19.9], [-72.8, 19.9], [-70, 19.7], [-68.4, 18.6], [-71, 17.8], [-74.3, 18.3]],
  madagascar: [[49.3, -12], [50.4, -15.5], [49.5, -17.5], [47.2, -24.8], [45.2, -25.5], [43.7, -23.5], [44, -20], [44.2, -16.3], [46.4, -15.7], [48, -13.6]],
  srilanka: [[79.9, 6.9], [80.1, 9.8], [81.4, 8.5], [81.9, 7.4], [81.2, 6.2], [80.1, 6]],
  japon: [[129.8, 33], [131, 31.3], [132, 33.8], [135.2, 33.6], [137, 34.6], [139.8, 35], [140.9, 36.9], [141.9, 39.5], [141.5, 41.4], [143, 42], [145.5, 43.3], [144.5, 44], [141.7, 45.4], [140, 42.5], [140.2, 41], [139.8, 39.8], [139.5, 38.4], [138.5, 37.4], [136.7, 37.1], [136, 35.6], [133, 35.5], [131.2, 34.4]],
  sakhaline: [[142, 46], [143.5, 49.5], [144.7, 49], [143.2, 52], [143, 54.3], [142.2, 54.2], [141.7, 52], [142.2, 48]],
  taiwan: [[120.5, 22.5], [121.9, 25], [121, 25.2], [120, 23.3]],
  philippines: [[120.6, 18.5], [122.3, 18.4], [122.2, 16.3], [121.6, 15.5], [122, 14.1], [124, 13.8], [124.3, 12.5], [125.5, 11], [125.6, 9.8], [126.5, 7.5], [126.2, 6.3], [125.4, 5.6], [124, 6.6], [122.1, 6.9], [122.5, 8], [123.8, 8.3], [123.2, 9.9], [122.5, 10.7], [121.9, 11.9], [121.2, 13.3], [120.6, 14.4], [120, 16], [120.4, 17.6]],
  borneo: [[109, 1.5], [110, -1], [111, -3], [114.5, -4], [116.5, -2.5], [118, 1], [119, 5], [117, 7], [115.5, 5], [113, 3.2], [111, 1.8], [109.5, 2]],
  sumatra: [[95.3, 5.6], [98.3, 4.1], [103.7, -1], [106, -3.2], [105.7, -5.8], [104.5, -5.9], [102, -4], [100.3, -1], [98.5, 1.8], [95.2, 4]],
  java: [[105.2, -6.8], [106, -6], [108.3, -6.3], [111, -6.4], [114.5, -7.6], [114.4, -8.7], [111, -8.2], [108, -7.8], [106.5, -7.4]],
  celebes: [[119.4, -5.5], [118.9, -2.8], [119.8, 0.2], [121, 1.2], [124.9, 1.4], [121.2, -0.6], [123.3, -1], [121.5, -1.9], [123.2, -4.8], [121, -4], [120.4, -5.6]],
  nouvelleGuinee: [[131, -1], [134.2, -1], [137.8, -1.5], [141, -2.6], [145.5, -4.5], [147.5, -6], [147.5, -8], [150, -10.5], [146.5, -8.8], [144, -7.7], [141, -9.2], [138, -8.4], [138.8, -6.8], [136, -4.5], [132, -3.5], [131.5, -2.6]],
  australie: [[113.4, -22], [114, -26.5], [115, -33.5], [117.7, -35], [123.5, -33.9], [129, -31.6], [132, -32], [135.5, -34.8], [138, -35.6], [139.6, -37.4], [143, -38.7], [146.3, -39.1], [150, -37.5], [151.3, -33.5], [153.6, -28.2], [153, -25], [150.8, -22.5], [146.3, -19], [145.4, -15], [143.6, -14], [142.5, -10.7], [141.6, -12.8], [141.5, -15.5], [140.5, -17.6], [137.8, -16.2], [135.8, -15], [136.7, -12.2], [132.6, -11.5], [130, -13], [129.3, -15], [126.8, -13.8], [124.3, -16.4], [122.2, -18], [121, -19.6], [117, -20.6], [114.6, -21.8]],
  tasmanie: [[144.6, -40.7], [148.3, -40.9], [148, -43.2], [146, -43.6], [145, -42]],
  nzNord: [[172.7, -34.4], [174.8, -36.8], [178.5, -37.7], [177, -39.6], [176.2, -41.3], [174.7, -41.3], [175, -39.2], [173.8, -39.2], [174.5, -36.8]],
  nzSud: [[172.7, -40.5], [174.3, -41.7], [172.8, -43.8], [171.2, -44.5], [170.3, -46], [168.3, -46.6], [166.5, -46], [167, -45], [168.3, -44], [170.8, -42.7], [172.1, -41]],
};
/** Mers fermées, dessinées par-dessus les terres. */
const MERS = {
  noire: [[27.5, 42.5], [28, 41.2], [31, 41.1], [35, 42], [38.5, 40.9], [41.5, 41.5], [41.7, 42.6], [39.5, 44], [37.5, 44.7], [38.2, 46.8], [35, 45.3], [33.5, 44.5], [32.5, 45.4], [30.8, 46.5], [29.7, 45.3], [28.6, 44.2]],
  caspienne: [[47, 44.5], [49, 46.5], [53, 47], [53, 45], [51.3, 44.5], [53, 42], [54, 40.5], [53.9, 37.3], [51.5, 36.8], [49, 37.6], [49.5, 40.5], [47.5, 42.8]],
};

/** Les quatre zones, comme des traits de surligneur le long des limites de plaques. */
const TRACES = {
  cfp: [
    // côte ouest des Amériques, Aléoutiennes, Kamtchatka, Japon, Philippines, Indonésie
    [[-75.5, -52], [-75.8, -46], [-74.8, -40], [-73.8, -35], [-72.4, -30], [-71.8, -24], [-71.6, -19.5], [-74, -16.3], [-77.5, -12.5], [-80.2, -8], [-82, -4], [-81, 0], [-79.5, 3.5], [-78.6, 6.5], [-81.5, 7.4], [-85.2, 9.2], [-87.6, 11.8], [-91.5, 13.2], [-95, 14.9], [-99, 15.9], [-103.5, 17.5], [-106, 20.3], [-110, 23], [-113.5, 26.5], [-116.5, 30.5], [-119.5, 33.8], [-122.6, 36.8], [-124.6, 40.5], [-125.2, 44.5], [-126, 48.5], [-129, 51.5], [-132.5, 54.5], [-136.5, 57.3], [-142, 59.2], [-148, 59.2], [-153, 57], [-158, 54.6], [-163, 53.3], [-168, 52.3], [-174, 51.5], [-180, 51.4], [176, 51.8], [171, 52.8], [167, 54.5], [163.5, 55.5], [161, 53.5], [158.2, 51.5], [155.5, 49], [152, 46.6], [148.5, 44.4], [145.8, 42.8], [143.6, 40.5], [142.8, 37.5], [141.7, 35], [139.5, 33.8], [136.5, 33], [133.5, 31.8], [131.5, 30.5], [129.4, 28.5], [127, 26], [124.2, 24], [122, 21.5], [121, 18], [120.2, 15], [120.6, 12.5], [122.5, 10.5], [124.5, 8.3], [126.8, 6.5], [127.4, 3.5], [126.8, 0.8], [125.2, -2], [127.5, -4], [129.8, -6.4], [127.5, -8.4], [123.5, -10], [119, -10.4], [115, -10], [110.5, -9.4], [106, -8.4], [102.2, -6], [99.6, -3], [97, 0], [95, 3], [93.7, 6.5], [92.8, 10], [93, 13.5], [94, 16]],
    // du Japon vers le sud (Mariannes)
    [[141.7, 35], [142, 30], [142.3, 26], [143.5, 21.5], [145.8, 17.5], [146.8, 14], [145.8, 12], [143.5, 11.2]],
    // nord de la Nouvelle-Guinée, Salomon, Vanuatu, Tonga, Nouvelle-Zélande
    [[136, -0.3], [140, -1.6], [144, -3.2], [147.5, -5.2], [151, -6.2], [154.5, -6.8], [157.5, -8.6], [161, -10.6], [164.8, -12.3], [166.6, -15.5], [168.5, -19], [169, -21], [173, -18.6], [176.5, -17], [-174, -16], [-173.5, -18.5], [-174.5, -22], [-176, -26], [-177.5, -30], [-178.6, -34], [179.5, -37.2], [177.5, -39.6], [175.5, -41.5], [172.5, -42.6], [169.8, -44.2], [167.5, -45.8], [165.5, -47.8], [164, -50]],
  ],
  pm: [
    [[-5.5, 36], [0, 36.3], [5, 36.9], [10, 37.4], [13, 37.6], [15.3, 38.2], [17.5, 38.6], [20, 38], [22, 36.4], [25, 35.6], [28, 36], [31, 36.3], [34, 36.2], [37, 37.5], [40, 38.5], [43, 39]],
    [[15.3, 38.2], [14.4, 40.8], [12.5, 41.8], [11.5, 42.7]],
  ],
  dma: [
    [[8, 76], [5, 73.5], [-2, 71.5], [-8, 70.8], [-13, 68.6], [-17, 66.8], [-18, 65.5], [-21, 64], [-25, 62.2], [-29, 59], [-33, 55.5], [-31.5, 52.5], [-29.5, 49], [-28.5, 44.5], [-29, 40.5], [-31.5, 37], [-35.5, 34], [-39.5, 30.5], [-43.5, 26], [-45.3, 21.5], [-46, 17], [-44.5, 13], [-40.5, 10], [-36, 8], [-30, 4.5], [-24, 1], [-17, -0.5], [-13.5, -4], [-13.2, -9], [-14, -14], [-13.8, -20], [-13, -26], [-13.3, -32], [-14, -38], [-16, -44], [-15, -49], [-11, -53], [-4, -54.5], [2, -54.5]],
  ],
  ra: [
    [[42.5, 12.8], [40.6, 10.5], [39.3, 8.6], [38, 6], [37, 3.5], [36.3, 1], [36, -2], [35.5, -5], [34.8, -8], [34.2, -11], [34.8, -14.5]],
  ],
};

/** Les autres limites de plaques (trait fin). */
const LIMITES = [
  [[-29, 39.5], [-20, 37.2], [-12, 36.4], [-6, 36]],
  [[-108, 22], [-106, 17], [-104.5, 12], [-103, 7], [-102.5, 2], [-103.5, -3], [-106, -9], [-109, -15], [-112, -21], [-113, -27], [-112.5, -33], [-114, -38], [-116, -43], [-116, -49], [-117, -55], [-121, -57.5], [-130, -59.5], [-140, -60.5], [-150, -62], [-160, -63], [-170, -63], [180, -62], [170, -61], [160, -60], [158, -57], [160, -55], [162, -53], [164, -50]],
  [[-85, 2], [-90, 2], [-95, 2.2], [-102.5, 2]],
  [[-75.5, -46.5], [-82, -44], [-90, -40], [-98, -37], [-105, -35], [-112.5, -33]],
  [[-88, 15.8], [-84, 17], [-78, 18.6], [-72, 19.5], [-66, 19.2], [-62, 17], [-61, 15], [-61.2, 12.5], [-61.5, 11], [-66, 11.4], [-71, 12], [-75, 11], [-78, 9.5]],
  [[-68, -55.5], [-55, -54.5], [-40, -54.5], [-27, -56.5]],
  [[33.5, 28.5], [36.5, 23], [39, 19], [41.5, 15], [43.2, 12.6], [46, 12], [50, 13.2], [54, 14.2], [57.5, 14.5], [60, 13]],
  [[2, -54.5], [10, -53], [20, -50.5], [28, -46], [35, -42], [42, -38], [50, -34], [57, -30], [62, -27]],
  [[75.5, -28.5], [77, -33], [82, -39], [90, -42], [100, -46], [110, -49], [120, -50], [130, -50.5], [140, -51], [147, -53], [155, -57], [158, -57]],
  [[75, 35], [80, 31], [85, 28.5], [90, 28], [95, 27.5], [97, 25], [95.5, 20], [94, 16]],
  [[43, 39], [46, 36], [48, 33], [51, 30], [55, 27.5], [58, 26.5], [60, 26]],
];

/** Volcans (points rouges) : le long des zones, plus l'Islande et Hawaï (au milieu de la plaque Pacifique). */
const VOLCANS = [
  ...TRACES.cfp.flat().filter((_, i) => i % 2 === 0),
  ...TRACES.pm[0].filter((_, i) => i % 2 === 1), [14.4, 40.8], [12.5, 41.8],
  [-19, 64.6], [-17, 66.4], [-28.5, 38.5],
  ...TRACES.ra[0].filter((_, i) => i % 2 === 0),
  [-155.5, 19.6],
];
const HAWAI = [-155.5, 19.6];

/** Flèches « mouvement des plaques ». */
const FLECHES = [
  [[-140, -6], [-150, -1]], [[-97, -24], [-87, -24]], [[-96, 50], [-106, 47]], [[-52, -14], [-61, -15]],
  [[16, 2], [20, 9]], [[100, 53], [107, 48]], [[130, -26], [134, -19]],
];

/** Les océans, en abréviation, aux places où l'élève les a écrits (OI deux fois : la carte coupe l'océan Indien en deux). */
const OCEANS = { op: [-163, 22], oa: [-42, 29], oi1: [88, -27], oi2: [52, -36], oga: [22, 74.2] };

export const GEO = { TERRES, MERS, TRACES, LIMITES, VOLCANS, HAWAI, OCEANS };

/* =====================================================================================================================
   2. Le planisphère : projection de Miller, centrée sur l'océan Pacifique (de 75° E à 60° E en passant par 180°).
   ===================================================================================================================== */
const W = 680, MX = 10, MY = 42, MW = 660, L0 = 75, L1 = 420, KX = MW / (L1 - L0);
const NORD = 76, SUD = -60;
const miller = (lat) => 1.25 * Math.log(Math.tan(Math.PI / 4 + 0.4 * lat * Math.PI / 180)) * 180 / Math.PI;
const MH = (miller(NORD) - miller(SUD)) * KX;
const H = Math.round(MY + MH + 74);
/** Longitude « dépliée » : tout ce qui est à l'ouest de 75° E passe à droite de la carte. */
export const deplie = (lon) => (lon < L0 ? lon + 360 : lon);
const P = ([lon, lat]) => [MX + (deplie(lon) - L0) * KX, MY + (miller(NORD) - miller(lat)) * KX];
const pts = (l) => l.map((p) => P(p).map((v) => v.toFixed(1)).join(',')).join(' ');
const FOND = '#fff', MER = '#c7e3f4', TERRE = '#dce9c6', STYLO = '#2a55c8';

/** Pastille numérotée, un peu plus grande que pin() : ces schémas sont larges, elle reste lisible sur téléphone. */
const gpin = (n, x, y, tx, ty) =>
  `<line x1="${x}" y1="${y}" x2="${tx}" y2="${ty}" stroke="${ENCRE}" stroke-width="2.2"/><circle cx="${tx}" cy="${ty}" r="4" fill="${ENCRE}"/>` +
  `<circle cx="${x}" cy="${y}" r="20" fill="#ff5a36" stroke="#fff" stroke-width="2.5"/><text x="${x}" y="${y + 8}" text-anchor="middle" font-size="23" font-weight="800" fill="#fff" font-family="sans-serif">${n}</text>`;
/** Pastille posée sur un lieu de la carte, décalée de (dx, dy) pixels. */
const zpin = (n, lonlat, dx = 0, dy = 0) => { const [x, y] = P(lonlat); return gpin(n, x + dx, y + dy, x, y); };

const bande = (ligne, couleur) => `<polyline points="${pts(ligne)}" fill="none" stroke="${ENCRE}" stroke-opacity=".45" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<polyline points="${pts(ligne)}" fill="none" stroke="${couleur}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`;
const fleche = ([a, b]) => { const [x1, y1] = P(a), [x2, y2] = P(b); return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#8b3f8f" stroke-width="2.6" marker-end="url(#zfl)"/>`; };

const ROSE_X = 636, ROSE_Y = Math.round(MY + MH + 36);
const rose = `<g transform="translate(${ROSE_X},${ROSE_Y})">
  <path d="M0 -24 L6 -6 L24 0 L6 6 L0 24 L-6 6 L-24 0 L-6 -6Z" fill="${STYLO}" stroke="${ENCRE}" stroke-width="1.2" stroke-linejoin="round"/>
  <circle r="4" fill="#fff" stroke="${ENCRE}" stroke-width="1.2"/>
  <text x="0" y="-28" text-anchor="middle" font-size="12" fill="${ENCRE}" ${TXT}>N</text><text x="30" y="4.5" text-anchor="middle" font-size="12" fill="${ENCRE}" ${TXT}>E</text>
  <text x="0" y="38" text-anchor="middle" font-size="12" fill="${ENCRE}" ${TXT}>S</text><text x="-31" y="4.5" text-anchor="middle" font-size="12" fill="${ENCRE}" ${TXT}>O</text></g>`;

/**
 * Le planisphère. opts :
 *   zones : 'num' (cases de légende numérotées 1 à 4) | 'abr' (cases avec CFP, PM, DMA, RA)
 *   oceans : true = les abréviations écrites au stylo bleu, comme sur la carte de l'élève
 *   titre : true = le titre écrit en haut
 *   epingles : les pastilles numérotées
 */
function planisphere({ zones = 'abr', oceans = true, titre = true, epingles = '' } = {}) {
  const terres = Object.values(TERRES).map((t) => `<polygon points="${pts(t)}" fill="${TERRE}" stroke="${ENCRE}" stroke-width="1" stroke-linejoin="round"/>`).join('');
  const mers = Object.values(MERS).map((t) => `<polygon points="${pts(t)}" fill="${MER}" stroke="${ENCRE}" stroke-width=".8"/>`).join('');
  const limites = [...LIMITES, ...Object.values(TRACES).flat()].map((l) => `<polyline points="${pts(l)}" fill="none" stroke="${ENCRE}" stroke-width="1.3" stroke-linejoin="round"/>`).join('');
  const bandes = Object.entries(TRACES).map(([k, ls]) => ls.map((l) => bande(l, ZONES[k].couleur)).join('')).join('');
  const volcans = VOLCANS.map((v) => { const [x, y] = P(v); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" fill="#c0261b" stroke="#fff" stroke-width=".6"/>`; }).join('');
  const ecrits = oceans ? Object.entries(OCEANS).map(([k, p]) => { const [x, y] = P(p); return `<text x="${x.toFixed(1)}" y="${(y + 6).toFixed(1)}" text-anchor="middle" font-size="17" font-style="italic" fill="${STYLO}" font-family="sans-serif" font-weight="700">${k.replace(/\d/, '').toUpperCase()}</text>`; }).join('') : '';
  const yL = MY + MH;
  const cases = Object.values(ZONES).map((z, i) => {
    const x = 16 + i * 92;
    return `<rect x="${x}" y="${yL + 12}" width="30" height="20" rx="3" fill="${z.couleur}" stroke="${ENCRE}" stroke-width="1.4"/>` +
      `<text x="${x + 36}" y="${yL + 28}" font-size="15" fill="${ENCRE}" ${TXT}>${zones === 'num' ? i + 1 : z.abr}</text>`;
  }).join('');
  const imprime = `<g font-size="12.5" fill="${ENCRE}" font-family="sans-serif">
    <line x1="16" y1="${yL + 52}" x2="40" y2="${yL + 52}" stroke="#8b3f8f" stroke-width="2.6" marker-end="url(#zfl)"/><text x="46" y="${yL + 56.5}">mouvement des plaques</text>
    <line x1="196" y1="${yL + 52}" x2="222" y2="${yL + 52}" stroke="${ENCRE}" stroke-width="1.6"/><text x="228" y="${yL + 56.5}">limite de plaques</text>
    <circle cx="354" cy="${yL + 52}" r="3.4" fill="#c0261b"/><text x="363" y="${yL + 56.5}">volcans</text>
    <text x="16" y="${yL + 70}" font-size="11" font-style="italic" fill="#5b556f">croquis simplifié</text></g>`;
  return wrap(W, H, `<defs><marker id="zfl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#8b3f8f"/></marker></defs>
    <rect x="${MX}" y="${MY}" width="${MW}" height="${MH.toFixed(1)}" fill="${MER}"/>
    ${terres}${mers}${limites}${bandes}${limites}${volcans}${FLECHES.map(fleche).join('')}${ecrits}
    <rect x="-60" y="-60" width="${MX + 60}" height="${H + 120}" fill="${FOND}"/><rect x="${MX + MW}" y="-60" width="80" height="${H + 120}" fill="${FOND}"/>
    <rect x="-60" y="-60" width="${W + 120}" height="${MY + 60}" fill="${FOND}"/><rect x="-60" y="${(MY + MH).toFixed(1)}" width="${W + 120}" height="200" fill="${FOND}"/>
    <rect x="${MX}" y="${MY}" width="${MW}" height="${MH.toFixed(1)}" fill="none" stroke="${ENCRE}" stroke-width="2"/>
    ${titre ? `<text x="${W / 2}" y="28" text-anchor="middle" font-size="20" fill="${STYLO}" font-style="italic" ${TXT}>Les grandes zones de volcanisme</text>` : ''}
    ${cases}${imprime}${rose}${epingles}`);
}

/* =====================================================================================================================
   3. La grande coupe du « Retenons » (de gauche à droite : fosse océanique, île de point chaud, dorsale océanique,
      cordillère volcanique, rift continental).
   ===================================================================================================================== */
const CW = 760;
const MAGMA = '#d7261e';
const LITHO = '#a9bba2';
const volcan = (x, base, sommet, larg, couleur = '#8a5a33') =>
  `<path d="M${x - larg} ${base} L${x - 8} ${sommet + 6} Q${x} ${sommet} ${x + 8} ${sommet + 6} L${x + larg} ${base} Z" fill="${couleur}" stroke="${ENCRE}" stroke-width="1.8" stroke-linejoin="round"/>` +
  `<path d="M${x - 8} ${sommet + 6} Q${x} ${sommet} ${x + 8} ${sommet + 6} L${x + 4} ${sommet + 14} L${x - 4} ${sommet + 14} Z" fill="${MAGMA}"/>` +
  `<circle cx="${x + 3}" cy="${sommet - 12}" r="7" fill="#9b95a6" opacity=".75"/><circle cx="${x + 11}" cy="${sommet - 24}" r="9" fill="#9b95a6" opacity=".55"/>`;
const remontee = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2 + 6} ${(y1 + y2) / 2} ${x2} ${y2}" fill="none" stroke="${MAGMA}" stroke-width="5" stroke-linecap="round"/>`;
const fl = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ENCRE}" stroke-width="3" marker-end="url(#fl)"/>`;
/** x des cinq volcans, de gauche à droite (les cinq cases du bas). */
const VX = [78, 265, 390, 560, 690];

/** mode : 'emplacements' (pastilles 1 à 6 : quatre emplacements et deux couches) | 'cases' (noms écrits, cinq cases numérotées)
 *  | 'video' (noms écrits, sans les cases : la capsule vidéo dessine ses cases elle-même). */
export function coupe(mode) {
  const cases = mode === 'cases' || mode === 'video';
  const h = mode === 'cases' ? 430 : 378;
  const dessin = `
    <rect x="0" y="56" width="${CW}" height="306" fill="#eaf5fc"/>
    <rect x="0" y="200" width="${CW}" height="62" fill="#e5482c"/><rect x="0" y="262" width="${CW}" height="52" fill="#f2862f"/><rect x="0" y="314" width="${CW}" height="48" fill="#f8c44c"/>
    <polygon points="0,140 508,140 505,150 498,232 492,214 470,198 410,183 394,178 386,178 370,183 300,195 200,207 175,226 166,234 160,228 140,188 0,186" fill="#7fc3ec"/>
    <line x1="0" y1="140" x2="506" y2="140" stroke="#3f8fc4" stroke-width="2"/>
    <!-- lithosphère : plaque de gauche, plaque océanique qui plonge à la fosse, plaque océanique qui plonge sous le continent, continent coupé par le rift -->
    <polygon points="0,186 140,188 160,228 0,230" fill="${LITHO}" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="48,362 166,234 175,226 200,207 300,195 370,183 386,178 386,212 300,229 215,243 191,257 94,362" fill="${LITHO}" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="394,178 410,183 470,198 492,214 498,232 600,362 556,362 471,253 410,214 394,212" fill="${LITHO}" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="498,232 505,150 512,132 676,128 682,150 680,216 540,216" fill="${LITHO}" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
    <polygon points="698,150 704,128 ${CW},128 ${CW},216 700,216" fill="${LITHO}" stroke="${ENCRE}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M509 138 L512 132 L676 128 L679 138 Z M701 138 L704 128 L${CW} 128 L${CW} 138 Z" fill="#e2c48a"/>
    <!-- magma qui monte sous chaque volcan -->
    ${remontee(95, 311, 79, 124)}
    <line x1="265" y1="362" x2="265" y2="128" stroke="${MAGMA}" stroke-width="6"/><circle cx="265" cy="352" r="11" fill="${MAGMA}"/>
    <line x1="390" y1="362" x2="390" y2="182" stroke="${MAGMA}" stroke-width="6"/><path d="M381 214 L390 172 L399 214 Z" fill="${MAGMA}"/>
    ${remontee(566, 318, 560, 82)}
    <line x1="690" y1="362" x2="690" y2="142" stroke="${MAGMA}" stroke-width="6"/>
    <!-- la cordillère et les volcans -->
    <path d="M518 130 L534 104 L546 120 L556 96 L566 108 L588 92 L604 122 L618 104 L636 129 Z" fill="#b39368" stroke="${ENCRE}" stroke-width="1.6" stroke-linejoin="round"/>
    ${volcan(VX[0], 188, 114, 40)}${volcan(VX[1], 200, 118, 42)}${volcan(VX[3], 128, 68, 26)}${volcan(VX[4], 152, 132, 16, '#a9753f')}
    <!-- flèches : le mouvement des plaques -->
    ${fl(12, 208, 52, 208)}${fl(384, 198, 352, 198)}${fl(408, 204, 452, 204)}${fl(514, 268, 538, 298)}${fl(670, 182, 636, 182)}${fl(712, 182, 748, 182)}
    <!-- la convection, comme sur le schéma du cours -->
    <path d="M428 326 C404 312 410 278 440 276 C470 274 488 294 478 318" fill="none" stroke="#b0151b" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M471 314 L481 330 L486 312 Z" fill="#b0151b"/>
    <text x="456" y="346" text-anchor="middle" font-size="15" font-style="italic" fill="#b0151b" ${TXT}>convection</text>
    <text x="196" y="176" text-anchor="middle" font-size="21" fill="${STYLO}" font-style="italic" ${TXT}>72 %</text>
    <text x="722" y="116" text-anchor="middle" font-size="21" fill="${STYLO}" font-style="italic" ${TXT}>28 %</text>`;
  const ecrits = (x, l1, l2, tx, ty) => `<line x1="${x}" y1="${48}" x2="${tx}" y2="${ty}" stroke="${ENCRE}" stroke-width="1.6" marker-end="url(#fl)"/>` +
    `<text x="${x}" y="20" text-anchor="middle" font-size="15" fill="${ENCRE}" ${TXT}>${l1}</text><text x="${x}" y="38" text-anchor="middle" font-size="15" fill="${ENCRE}" ${TXT}>${l2}</text>`;
  const haut = cases
    ? `<rect x="0" y="0" width="${CW}" height="56" fill="#fff"/>${ecrits(165, 'Fosse', 'océanique', 166, 226)}${ecrits(386, 'Dorsale', 'océanique', 390, 168)}${ecrits(580, 'Cordillère volcanique', '(chaîne de volcans)', 572, 90)}${ecrits(704, 'Rift', 'continental', 692, 134)}
       <text x="312" y="224" text-anchor="middle" font-size="13" fill="${ENCRE}" ${TXT}>Lithosphère</text>
       <text x="330" y="326" text-anchor="middle" font-size="15" fill="${ENCRE}" ${TXT}>Asthénosphère</text>`
    : `${gpin(1, 165, 26, 166, 230)}${gpin(2, 390, 26, 390, 176)}${gpin(3, 590, 26, 592, 98)}${gpin(4, 712, 26, 692, 142)}${gpin(5, 330, 158, 330, 204)}${gpin(6, 205, 338, 214, 312)}`;
  const bas = mode === 'cases' ? VX.map((x, i) => `<path d="M${x - 9} 372 L${x} 362 L${x + 9} 372 Z" fill="${ENCRE}"/>
       <rect x="${x - 46}" y="372" width="92" height="46" rx="9" fill="#fff" stroke="${ENCRE}" stroke-width="2.2"/>
       <circle cx="${x}" cy="395" r="19" fill="#ff5a36"/><text x="${x}" y="403" text-anchor="middle" font-size="23" font-weight="800" fill="#fff" font-family="sans-serif">${i + 1}</text>`).join('') : '';
  return wrap(CW, h, `${dessin}${haut}${bas}<rect x="1" y="56" width="${CW - 2}" height="306" fill="none" stroke="${ENCRE}" stroke-width="2"/>`);
}

/** Pour la capsule vidéo (video/src/c/zones/) : la carte en morceaux, déjà projetée dans le cadre de 680 × H. */
export function carteVideo() {
  const long = (l) => l.map(P).reduce((s, p, i, a) => (i ? s + Math.hypot(p[0] - a[i - 1][0], p[1] - a[i - 1][1]) : 0), 0);
  return {
    W, H, MX, MY, MW, MH: +MH.toFixed(1),
    terres: Object.values(TERRES).map(pts), mers: Object.values(MERS).map(pts),
    limites: LIMITES.map(pts),
    bandes: Object.fromEntries(Object.entries(TRACES).map(([k, ls]) => [k, ls.map((l) => ({ points: pts(l), long: +long(l).toFixed(1) }))])),
    volcans: VOLCANS.map((v) => P(v).map((x) => +x.toFixed(1))), hawai: P(HAWAI).map((x) => +x.toFixed(1)),
    oceans: Object.fromEntries(Object.entries(OCEANS).map(([k, v]) => [k, P(v).map((x) => +x.toFixed(1))])),
    fleches: FLECHES.map(([a, b]) => [...P(a), ...P(b)].map((x) => +x.toFixed(1))),
    couleurs: Object.fromEntries(Object.entries(ZONES).map(([k, z]) => [k, z.couleur])),
    coupe: coupe('video'), VX,
    volcansCoupe: { haut: [114, 118, 172, 68, 132], bas: [188, 200, 214, 128, 152] },
  };
}

/* =====================================================================================================================
   4. Les schémas du chapitre.
   ===================================================================================================================== */
export const SCHEMAS = {
  'zones-planisphere': {
    titre: 'Les grandes zones de volcanisme (planisphère)',
    labels: ['Ceinture de feu du Pacifique (CFP)', 'Pourtour méditerranéen (PM)', 'Dorsale médio-Atlantique (DMA)', 'Rift africain (RA)'],
    svg: planisphere({ zones: 'num', epingles: zpin(1, [-176, 51.4], 0, 46) + zpin(2, [22, 36.4], -26, -46) + zpin(3, [-29, 44], -44, 10) + zpin(4, [36.3, 1], -44, 16) }),
  },
  'zones-oceans': {
    titre: 'Les océans sur le planisphère',
    labels: ['l\'océan Pacifique (OP)', 'l\'océan Atlantique (OA)', 'l\'océan Indien (OI)', 'l\'océan Glacial Arctique (OGA)'],
    svg: planisphere({ zones: 'abr', oceans: false, epingles: zpin(1, OCEANS.op) + zpin(2, OCEANS.oa) + zpin(3, OCEANS.oi1) + zpin(3, OCEANS.oi2) + zpin(4, OCEANS.oga) }),
  },
  'zones-toles': {
    titre: 'TOLES : ce qui accompagne la carte',
    labels: ['le titre', 'l\'orientation (la rose des vents)', 'la légende'],
    svg: planisphere({ zones: 'abr', epingles: gpin(1, 92, 22, 140, 22) + gpin(2, ROSE_X - 66, ROSE_Y - 4, ROSE_X - 30, ROSE_Y) + gpin(3, 400, Math.round(MY + MH + 22), 372, Math.round(MY + MH + 22)) }),
  },
  'zones-coupe': {
    titre: 'La grande coupe du « Retenons » : les emplacements et les couches',
    labels: ['fosse océanique', 'dorsale océanique', 'cordillère volcanique (chaîne de volcans)', 'rift continental', 'lithosphère (la croûte)', 'asthénosphère (le manteau)'],
    svg: coupe('emplacements'),
  },
  'zones-cases': {
    titre: 'La grande coupe du « Retenons » : les cinq cases du bas',
    labels: ['volcan de subduction', 'volcan de point chaud', 'volcan d\'accrétion', 'volcan de subduction', 'volcan d\'accrétion'],
    svg: coupe('cases'),
  },
};
