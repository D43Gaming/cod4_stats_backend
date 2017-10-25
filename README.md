# cod4_stats_backend

## V1
Stats to Track:
- Kills
- Deaths
- Longest Killstreak
- Longest Deathstreak
- Headshots
- Playtime

Stats should be stored per player and server

GET /statsapi/getstats/<playerid>/<serverid> returns stats as a json object
POST /statsapi/addstats/<playerid>/<serverid> updates stats of a player
