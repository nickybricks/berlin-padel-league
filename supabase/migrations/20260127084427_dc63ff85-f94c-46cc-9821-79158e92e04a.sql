-- Add player and logo columns to teams table
ALTER TABLE public.teams
ADD COLUMN logo_url TEXT,
ADD COLUMN captain_name TEXT,
ADD COLUMN captain_phone TEXT,
ADD COLUMN player2_name TEXT,
ADD COLUMN player2_phone TEXT;

-- Update teams with the CSV data
UPDATE public.teams SET
  logo_url = 'Teams/956ad7ef-e893-40c7-9a70-c1af323444a5.jpeg',
  captain_name = 'Cornelius Hetzler',
  captain_phone = '+4917632971143',
  player2_name = 'Constantin Weiss',
  player2_phone = '+49 175 9019262'
WHERE name = 'Solo Globos';

UPDATE public.teams SET
  logo_url = 'Teams/Gemini_Generated_Image_r8zblor8zblor8zb.png',
  captain_name = 'Kasi Friederich',
  captain_phone = '+491774996059',
  player2_name = 'Robert Stoecker',
  player2_phone = '+49 177 4427755'
WHERE name = 'KaRo Worldwide';

UPDATE public.teams SET
  logo_url = 'Teams/WhatsApp_Image_2026-01-12_at_17.09.43.jpeg',
  captain_name = 'Julius Strauss',
  captain_phone = '+491719385087',
  player2_name = 'Jonathan Spencker',
  player2_phone = '+49 176 32812800'
WHERE name = 'JS';

UPDATE public.teams SET
  logo_url = 'Teams/ChatGPT_Image_12._Jan._2026_22_11_04.png',
  captain_name = 'Stan Hafner',
  captain_phone = '+491727650836',
  player2_name = 'Jonas Peteranderl',
  player2_phone = '+49 173 2950383'
WHERE name = 'Risk Returners';

UPDATE public.teams SET
  logo_url = 'Teams/WhatsApp_Image_2026-01-13_at_12.48.12.jpeg',
  captain_name = 'Alexander Weiss',
  captain_phone = '+4915161353415',
  player2_name = 'Tom Grobien',
  player2_phone = '+49 151 50484128'
WHERE name = 'AlTo96';

UPDATE public.teams SET
  logo_url = 'Teams/WhatsApp_Image_2026-01-14_at_10.05.17.jpeg',
  captain_name = 'Nick Algner',
  captain_phone = '+49 173 6788333',
  player2_name = 'Leopold Schultzendorff',
  player2_phone = '+49 170 4642559'
WHERE name = 'Capital Clams';

UPDATE public.teams SET
  logo_url = 'Teams/MaxPaul.png',
  captain_name = 'Paul',
  captain_phone = '+4917641221281',
  player2_name = 'Max',
  player2_phone = '+4915772379261'
WHERE name = 'Los Hermanos';

UPDATE public.teams SET
  logo_url = 'Teams/Gemini_Generated_Image_te3rk5te3rk5te3r_(2).png',
  captain_name = 'Mori Fischer',
  captain_phone = '+49 15150202122',
  player2_name = 'Consti Weger',
  player2_phone = '+49 15120467797'
WHERE name = 'Deuce Bags';

UPDATE public.teams SET
  logo_url = 'Teams/ChatGPT_Image_19._Jan._2026_15_25_36.png',
  captain_name = 'Constantin Faerber',
  captain_phone = '016096867092',
  player2_name = 'Falko Brüggemann',
  player2_phone = '01724534119'
WHERE name = 'THE LOBSTARS';

UPDATE public.teams SET
  logo_url = NULL,
  captain_name = 'Barnim Kühl',
  captain_phone = '+4915775069290',
  player2_name = 'Philip Schröpel',
  player2_phone = NULL
WHERE name = 'Barry McCokiner';

UPDATE public.teams SET
  logo_url = 'Teams/68C64008-E97B-4040-8EEA-3E20066ECF56.png',
  captain_name = 'Janny Holst',
  captain_phone = '+49 15116180001',
  player2_name = 'Leo Stemmle',
  player2_phone = '+49 176 24310665'
WHERE name = 'Los Volleitos';

UPDATE public.teams SET
  logo_url = NULL,
  captain_name = 'Filip Katschker',
  captain_phone = '+491752441047',
  player2_name = 'Omar Moussa',
  player2_phone = '+49 172 6102889'
WHERE name = 'Moussaka';

UPDATE public.teams SET
  logo_url = NULL,
  captain_name = 'Frederik Müller',
  captain_phone = '017664743923',
  player2_name = 'Niclas Höppner',
  player2_phone = '+49 1516 8837193'
WHERE name = 'FN GmbH & Co KG';