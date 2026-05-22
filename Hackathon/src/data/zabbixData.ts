// Raw CSV data parsed from Zabbix problem.view
export const rawZabbixCSV = `"Severity","Time","Recovery time","Status","Host","Problem","Duration","Ack","Actions","Tags"
"Warning","2026-05-21 08:04:17 PM","2026-05-21 08:05:17 PM","RESOLVED","FTX2529D0H2 CGR Pozo de Agua 236537","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","1m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 08:02:19 PM","","PROBLEM","FTX2447D0NP CGR Bahia Gigante 220111","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","3m 50s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 08:01:17 PM","2026-05-21 08:05:17 PM","RESOLVED","FTX2245G041 CGR Playas del Coco 182800","Cisco IOS: CGR1000 AC power supply: Power supply is in warning state","4m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 08:00:13 PM","2026-05-21 08:05:13 PM","RESOLVED","FTX2245G06X CGR Quebrada Honda 210670","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","5m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 07:57:02 PM","","PROBLEM","FTX2507D00R CGR 27 de Abril 210671","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","9m 7s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 07:56:22 PM","2026-05-21 08:01:19 PM","RESOLVED","FTX2447D0NP CGR Bahia Gigante 220111","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","4m 57s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 07:47:57 PM","","PROBLEM","FTX2609D011 CGR Zapotal 246753","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","18m 12s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 07:41:08 PM","","PROBLEM","FTX2245G079 CGR Corralillo de Nicoya 198902","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","25m 1s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 07:34:15 PM","","PROBLEM","FTX2245G06U CGR Huacas Matapalo 208672","Cisco IOS: CGR1000 AC power supply: Power supply is in warning state","31m 54s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 07:32:22 PM","","PROBLEM","FTX2245G05Z CGR Pilas de Canjel 212860","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","33m 47s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 07:03:46 PM","","PROBLEM","FTX2509D08A CGR Quiriman 210674","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","1h 2m 23s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 06:47:09 PM","","PROBLEM","FTX2326G00U CGR Portegolpe 208144","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","1h 19m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 06:35:55 PM","","PROBLEM","FTX2245G034 CGR Nandayure 212947","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","1h 30m 14s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 06:08:56 PM","","PROBLEM","FTX2245G044 CGR Santa Barbara 198900","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","1h 57m 13s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 06:08:24 PM","","PROBLEM","FTX2245G03Z CGR Ortega 208669","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","1h 57m 45s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 06:04:15 PM","","PROBLEM","FTX2420G00X  CGR San Juanillo 246757","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","2h 1m 54s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 06:02:26 PM","","PROBLEM","FTX2245G03V CGR Nicoya Florida 198904","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","2h 3m 43s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2026-05-21 05:34:44 PM","","PROBLEM","FTX2503D04M CGR Dominicas 216499","Cisco IOS: Unavailable by ICMP ping","2h 31m 25s","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-21 05:34:44 PM","","PROBLEM","FTX2245G079 CGR Corralillo de Nicoya 198902","Cisco IOS: Unavailable by ICMP ping","2h 31m 25s","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-21 05:34:44 PM","","PROBLEM","Controller-UFN","Unavailable by ICMP ping","2h 31m 25s","No","","class: network, component: health, component: network, scope: availability, target: hp, target: hp-enterprise"
"High","2026-05-21 05:34:41 PM","","PROBLEM","FTX2245G077 CGR San Antonio 198901","Cisco IOS: Unavailable by ICMP ping","2h 31m 28s","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Warning","2026-05-21 05:06:15 PM","","PROBLEM","FTX2326G010 CGR Marbella 206695","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","2h 59m 54s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 04:42:17 PM","","PROBLEM","FTX2503D015 CGR Avellanas 210673","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","3h 23m 52s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 02:03:02 PM","","PROBLEM","FTX2507D00P CGR Sardinal 208148","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","6h 3m 7s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 12:08:04 PM","","PROBLEM","FTX2509D098 CGR Playa Hermosa 198897","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","7h 58m 5s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 11:52:59 AM","","PROBLEM","FTX2503D00Y CGR Filadelfia 181518","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","8h 13m 10s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-21 10:45:26 AM","","PROBLEM","FTX2245G06S CGR Tamarindo 208676","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","9h 20m 43s","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Average","2026-05-20 07:47:53 PM","","PROBLEM","FTX2245G05Z CGR Pilas de Canjel 212860","Cisco IOS: Processor: High memory utilization (>90% for 5m)","1d 18m","No","","class: network, component: memory, scope: capacity, scope: performance, target: cisco, target: cisco-ios"
"High","2026-05-20 04:57:23 PM","","PROBLEM","FTX2447D0NP CGR Bahia Gigante 220111","Cisco IOS: Unavailable by ICMP ping","1d 3h 8m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-20 04:57:23 PM","","PROBLEM","FTX2245G044 CGR Santa Barbara 198900","Cisco IOS: Unavailable by ICMP ping","1d 3h 8m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-20 04:57:20 PM","","PROBLEM","FTX2326G013 CGR Cabo Blanco 218513","Cisco IOS: Unavailable by ICMP ping","1d 3h 8m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-19 09:12:03 PM","","PROBLEM","FTX2326G00Q CGR Ocotal 231329","Cisco IOS: Unavailable by ICMP ping","1d 22h 54m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-19 09:12:03 PM","","PROBLEM","FTX2529D0GR CGR Rio Seco 207511","Cisco IOS: Unavailable by ICMP ping","1d 22h 54m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-19 09:11:59 PM","","PROBLEM","FTX2326G00P CGR Rio Canas 208147","Cisco IOS: Unavailable by ICMP ping","1d 22h 54m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-19 09:11:59 PM","","PROBLEM","FTX2509D0AJ CGR Arado 219882","Cisco IOS: Unavailable by ICMP ping","1d 22h 54m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-19 09:11:59 PM","","PROBLEM","FTX2245G02R CGR San Blas 235051","Cisco IOS: Unavailable by ICMP ping","1d 22h 54m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-19 09:11:59 PM","","PROBLEM","FTX2245G02R CGR San Blas 235051","Cisco UCS: Unavailable by ICMP ping","1d 22h 54m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-18 08:18:43 PM","","PROBLEM","FTX2503D028 CGR Artola 230996","Cisco IOS: Unavailable by ICMP ping","2d 23h 47m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-18 08:18:39 PM","","PROBLEM","FTX2245G074 CGR Vigia 212943","Cisco IOS: Unavailable by ICMP ping","2d 23h 47m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Warning","2026-05-17 10:15:10 PM","","PROBLEM","FTX2245G07B CGR Paquera 218515","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","3d 21h 50m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-17 10:15:02 PM","","PROBLEM","FTX2245G069 CGR San Pablo 212942","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","3d 21h 51m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-17 10:14:39 PM","","PROBLEM","FTX2503D04M CGR Dominicas 216499","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","3d 21h 51m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-16 05:13:32 AM","","PROBLEM","FTX2245G02R CGR San Blas 235051","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","5d 14h 52m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2026-05-14 05:17:56 PM","","PROBLEM","SW-ACC-HDN 3","Juniper: Unavailable by ICMP ping","7d 2h 48m","No","","class: network, component: health, component: network, scope: availability, target: juniper"
"High","2026-05-14 05:17:53 PM","","PROBLEM","FTX2509D08J CGR Potrero 219881","Cisco IOS: Unavailable by ICMP ping","7d 2h 48m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-14 05:17:53 PM","","PROBLEM","FTX2246G02Q CGR Curime 210668","Cisco IOS: Unavailable by ICMP ping","7d 2h 48m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Warning","2026-05-13 11:09:13 AM","","PROBLEM","FTX2447D0NV CGR Lagunilla 207509","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","8d 8h 56m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-11 04:51:06 AM","","PROBLEM","FTX2245G033 CGR San Lazaro 198903","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","10d 15h 15m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2026-05-10 02:07:04 PM","","PROBLEM","FTX2326G00S CGR Brasilito 230995","Cisco IOS: Unavailable by ICMP ping","11d 5h 59m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-10 02:07:04 PM","","PROBLEM","FTX2529D0GS CGR Copal 208675","Cisco IOS: Unavailable by ICMP ping","11d 5h 59m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-10 02:07:01 PM","","PROBLEM","FTX2245G033 CGR San Lazaro 198903","Cisco IOS: Unavailable by ICMP ping","11d 5h 59m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-09 01:13:56 PM","","PROBLEM","FTX2509D098 CGR Playa Hermosa 198897","Cisco IOS: Unavailable by ICMP ping","12d 6h 52m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-09 01:13:56 PM","","PROBLEM","FTX2326G00N CGR Belen 218143","Cisco IOS: Unavailable by ICMP ping","12d 6h 52m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-08 12:30:50 PM","","PROBLEM","FTX2507D00R CGR 27 de Abril 210671","Cisco IOS: Unavailable by ICMP ping","13d 7h 35m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-08 12:30:47 PM","","PROBLEM","FTX2507D00P CGR Sardinal 208148","Cisco IOS: Unavailable by ICMP ping","13d 7h 35m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-08 12:30:47 PM","","PROBLEM","FTX2246G00E CGR Cartagena 210666","Cisco IOS: Unavailable by ICMP ping","13d 7h 35m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-08 12:30:47 PM","","PROBLEM","Controller-UFN-2","Unavailable by ICMP ping","13d 7h 35m","No","","class: network, component: health, component: network, scope: availability, target: hp, target: hp-enterprise"
"High","2026-05-08 12:30:47 PM","","PROBLEM","CG-Controller-2","Unavailable by ICMP ping","13d 7h 35m","No","","class: network, component: health, component: network, scope: availability, target: hp, target: hp-enterprise"
"Warning","2026-05-07 01:26:28 PM","","PROBLEM","FTX2326G00P CGR Rio Canas 208147","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","14d 6h 39m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2026-05-07 11:57:19 AM","","PROBLEM","FTX2245G043 CGR Liceo Nicoya 219883","Cisco IOS: Unavailable by ICMP ping","14d 8h 8m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Warning","2026-05-04 09:58:34 PM","","PROBLEM","FTX2245G06M CGR Hojancha 212946","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","16d 22h 7m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2026-05-04 02:53:51 PM","","PROBLEM","FTX2246G00M CGR Puerto Humo 236538","Cisco IOS: Unavailable by ICMP ping","17d 5h 12m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Warning","2026-05-03 03:03:30 PM","","PROBLEM","FTX2326G00W CGR Tempate 211674","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","18d 5h 2m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2026-05-03 02:01:07 PM","","PROBLEM","FTX2326G00U CGR Portegolpe 208144","Cisco IOS: Unavailable by ICMP ping","18d 6h 5m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-03 02:01:07 PM","","PROBLEM","FTX2609D011 CGR Zapotal 246753","Cisco IOS: Unavailable by ICMP ping","18d 6h 5m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-03 02:01:07 PM","","PROBLEM","FTX2245G03W CGR Barrio Limon 172558","Cisco IOS: Unavailable by ICMP ping","18d 6h 5m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-03 02:01:04 PM","","PROBLEM","FTX2326G00T CGR Paso Tempisque 211708","Cisco IOS: Unavailable by ICMP ping","18d 6h 5m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-03 02:01:04 PM","","PROBLEM","FTX2529D0H2 CGR Pozo de Agua 236537","Cisco IOS: Unavailable by ICMP ping","18d 6h 5m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-03 02:01:04 PM","","PROBLEM","FTX2245G034 CGR Nandayure 212947","Cisco IOS: Unavailable by ICMP ping","18d 6h 5m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-02 01:08:20 PM","","PROBLEM","FTX2326G012 CGR Villareal 211675","Cisco IOS: Unavailable by ICMP ping","19d 6h 57m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-05-02 01:08:17 PM","","PROBLEM","FTX2245G041 CGR Playas del Coco 182800","Cisco IOS: Unavailable by ICMP ping","19d 6h 57m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Warning","2026-05-01 02:50:33 PM","","PROBLEM","FTX2509D08J CGR Potrero 219881","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","20d 5h 15m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2026-05-01 11:36:18 AM","","PROBLEM","FTX2245G06U CGR Huacas Matapalo 208672","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","20d 8h 29m","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2026-04-29 03:03:33 PM","","PROBLEM","FTX2447D0NV CGR Lagunilla 207509","Cisco IOS: Unavailable by ICMP ping","22d 5h 2m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-04-29 03:03:33 PM","","PROBLEM","FTX2245G06M CGR Hojancha 212946","Cisco IOS: Unavailable by ICMP ping","22d 5h 2m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-04-29 03:03:33 PM","","PROBLEM","CG-Controller","Unavailable by ICMP ping","22d 5h 2m","No","","class: network, component: health, component: network, scope: availability, target: hp, target: hp-enterprise"
"High","2026-04-29 03:03:29 PM","","PROBLEM","FTX2245G06F CGR San Joaquin 212944","Cisco IOS: Unavailable by ICMP ping","22d 5h 2m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Warning","2026-04-28 02:46:37 AM","","PROBLEM","Zabbix server","Linux: FS [/]: Space is low (used > 80%, total 97.9GB)","23d 17h 19m","No","","class: os, component: storage, filesystem: /, fstype: ext4, scope: availability, scope: capacity, target: linux"
"High","2026-04-25 11:47:30 AM","","PROBLEM","FTX2503D00Y CGR Filadelfia 181518","Cisco IOS: Unavailable by ICMP ping","26d 8h 18m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-04-25 11:47:30 AM","","PROBLEM","FTX2245G069 CGR San Pablo 212942","Cisco IOS: Unavailable by ICMP ping","26d 8h 18m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-04-25 11:47:27 AM","","PROBLEM","FTX2448D0DB CGR Barra Honda 206217","Cisco IOS: Unavailable by ICMP ping","26d 8h 18m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-04-23 10:33:47 AM","","PROBLEM","LESCA-Controller","Unavailable by ICMP ping","28d 9h 32m","No","","class: network, component: health, component: network, scope: availability, target: hp, target: hp-enterprise"
"High","2026-04-22 09:40:09 AM","","PROBLEM","FTX2245G03R CGR San Martin 219884","Cisco IOS: Unavailable by ICMP ping","29d 10h 26m","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Warning","2020-04-18 01:59:56 AM","","PROBLEM","Zabbix server","Linux: High swap space usage (less than 50% free)","1M 3d 18h","No","","class: os, component: memory, component: storage, scope: capacity, target: linux"
"Warning","2026-04-17 10:32:13 PM","","PROBLEM","FTX2503D016 CGR Venado 206218","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","1M 3d 21h","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2026-04-16 02:04:25 PM","","PROBLEM","FTX2245G05Z CGR Pilas de Canjel 212860","Cisco IOS: Unavailable by ICMP ping","1M 5d 6h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-04-16 02:04:25 PM","","PROBLEM","FTX2245G045 CGR Caimital 207515","Cisco IOS: Unavailable by ICMP ping","1M 5d 6h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-04-10 10:00:47 AM","","PROBLEM","FTX2245G07B CGR Paquera 218515","Cisco IOS: Unavailable by ICMP ping","1M 11d 10h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Average","2026-04-09 05:36:40 AM","","PROBLEM","Zabbix server","Zabbix server: Utilization of icmp pinger processes over 75%","1M 12d 14h","No","","class: software, component: gathering-process, scope: performance, target: server, target: zabbix"
"Warning","2026-04-08 02:31:43 PM","","PROBLEM","FTX2245G074 CGR Vigia 212943","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","1M 13d 5h","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2026-04-06 05:17:57 PM","","PROBLEM","FTX2509D08P CGR Paraiso 207512","Cisco IOS: Unavailable by ICMP ping","1M 15d 2h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-04-05 04:22:34 PM","","PROBLEM","FTX2503D012 CGR Las Catalinas 219885","Cisco IOS: Unavailable by ICMP ping","1M 16d 3h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-04-05 04:22:34 PM","","PROBLEM","FTX2245G06S CGR Tamarindo 208676","Cisco IOS: Unavailable by ICMP ping","1M 16d 3h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-04-04 03:28:50 PM","","PROBLEM","FTX2246G00H CGR Santa Cruz AyA 175545","Cisco IOS: Unavailable by ICMP ping","1M 17d 4h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-04-03 02:51:39 PM","","PROBLEM","FTX2503D016 CGR Venado 206218","Cisco IOS: Unavailable by ICMP ping","1M 18d 5h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-04-03 02:51:39 PM","","PROBLEM","FTX2245G06X CGR Quebrada Honda 210670","Cisco IOS: Unavailable by ICMP ping","1M 18d 5h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-04-03 02:51:35 PM","","PROBLEM","FTX2245G06U CGR Huacas Matapalo 208672","Cisco IOS: Unavailable by ICMP ping","1M 18d 5h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Warning","2026-03-23 11:00:50 PM","","PROBLEM","FTX2242G006 CGR Bernabela 198899","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","1M 28d 21h","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2026-03-09 06:58:18 AM","","PROBLEM","FTX2326G011 CGR Jicaral 212945","Cisco IOS: Unavailable by ICMP ping","2M 13d 13h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-03-09 06:58:15 AM","","PROBLEM","FTX2420G00X  CGR San Juanillo 246757","Cisco IOS: Unavailable by ICMP ping","2M 13d 13h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-03-09 06:58:15 AM","","PROBLEM","FTX2326G010 CGR Marbella 206695","Cisco IOS: Unavailable by ICMP ping","2M 13d 13h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-03-09 06:58:15 AM","","PROBLEM","FTX2245G040 CGR San Juan 210669","Cisco IOS: Unavailable by ICMP ping","2M 13d 13h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-03-06 04:28:13 AM","","PROBLEM","FTX2326G00W CGR Tempate 211674","Cisco IOS: Unavailable by ICMP ping","2M 16d 15h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-03-06 04:28:13 AM","","PROBLEM","FTX2245G065 CGR Ostional 239086","Cisco IOS: Unavailable by ICMP ping","2M 16d 15h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-03-06 04:28:13 AM","","PROBLEM","FTX2245G035 CGR Corozal 208671","Cisco IOS: Unavailable by ICMP ping","2M 16d 15h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-03-06 04:28:09 AM","","PROBLEM","FTX2245G03V CGR Nicoya Florida 198904","Cisco IOS: Unavailable by ICMP ping","2M 16d 15h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-02-16 11:51:15 PM","","PROBLEM","FTX2326G00Z CGR Coyolito 208142","Cisco IOS: Unavailable by ICMP ping","3M 3d 20h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-02-16 11:51:15 PM","","PROBLEM","FTX2245G047 CGR Corralillo de Filadelfia 244794","Cisco IOS: Unavailable by ICMP ping","3M 3d 20h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-02-16 11:51:15 PM","","PROBLEM","FTX2245G03Z CGR Ortega 208669","Cisco IOS: Unavailable by ICMP ping","3M 3d 20h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Warning","2026-02-13 03:49:18 PM","","PROBLEM","FTX2326G00M CGR Pinilla 239070","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","3M 7d 4h","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2026-01-23 02:20:51 PM","","PROBLEM","FTX2509D08A CGR Quiriman 210674","Cisco IOS: Unavailable by ICMP ping","3M 28d 5h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2026-01-01 05:56:39 AM","","PROBLEM","FTX2503D026 CGR Comunidad 208673","Cisco IOS: Unavailable by ICMP ping","4M 20d 14h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Warning","2025-12-19 02:07:36 AM","","PROBLEM","FTX2245G047 CGR Corralillo de Filadelfia 244794","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","5M 3d 17h","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2025-12-02 04:04:35 PM","","PROBLEM","FTX2503D015 CGR Avellanas 210673","Cisco IOS: Unavailable by ICMP ping","5M 20d 4h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2025-11-21 07:24:25 AM","","PROBLEM","FTX2447D0NZ CGR Lepanto 217241","Cisco IOS: Unavailable by ICMP ping","6M 1d 12h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2025-11-19 06:16:56 AM","","PROBLEM","FTX2326G00M CGR Pinilla 239070","Cisco IOS: Unavailable by ICMP ping","6M 3d 13h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2025-11-05 04:08:08 PM","","PROBLEM","FTX2326G00V CGR Pueblo Viejo 216500","Cisco IOS: Unavailable by ICMP ping","6M 17d 3h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2025-09-07 03:53:08 AM","","PROBLEM","FTX2245G03W CGR Hatillo 246755","Cisco IOS: Unavailable by ICMP ping","8M 16d 16h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Average","2025-09-06 09:56:43 AM","","PROBLEM","PLANTA DC CMTL","Perdida de flujo eléctrico en la fuente AC","8M 17d 10h","No","","Device: OLT CAIMITAL, Sensor: ModoBateria, Tipo: PlantaEmerson"
"Warning","2025-08-07 04:29:17 AM","","PROBLEM","FTX2245G032 CGR Sabana Grande 211673","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","9M 17d 15h","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2025-07-10 11:34:56 PM","","PROBLEM","FTX2242G006 CGR Bernabela 198899","Cisco IOS: Unavailable by ICMP ping","10M 14d 20h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Warning","2025-06-27 11:00:38 PM","","PROBLEM","FTX2245G03W CGR Hatillo 246755","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","10M 27d 21h","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2025-06-27 10:51:45 PM","","PROBLEM","FTX2503D04P CGR Rio Grande Paquera 218516","Cisco IOS: Unavailable by ICMP ping","10M 27d 21h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"Average","2025-06-27 10:29:53 PM","","PROBLEM","Zabbix server","Zabbix server: More than 75% used in the configuration cache","10M 27d 21h","No","","class: software, component: system, scope: capacity, scope: performance, target: server, target: zabbix"
"Warning","2025-06-27 10:09:30 PM","","PROBLEM","FTX2246G02Q CGR Curime 210668","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","10M 27d 21h","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2025-06-27 09:59:46 PM","","PROBLEM","FTX2246G00E CGR Cartagena 210666","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","10M 27d 22h","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"Warning","2025-06-27 09:40:28 PM","","PROBLEM","FTX2245G035 CGR Corozal 208671","Cisco IOS: CGR1000 DC power supply: Power supply is in warning state","10M 27d 22h","No","","class: network, component: power, scope: availability, scope: performance, target: cisco, target: cisco-ios"
"High","2025-06-27 09:09:01 PM","","PROBLEM","FTX2245G032 CGR Sabana Grande 211673","Cisco IOS: Unavailable by ICMP ping","10M 27d 22h","No","","class: network, component: health, component: network, scope: availability, target: cisco, target: cisco-ios"
"High","2025-05-20 07:57:46 AM","","PROBLEM","CAR-Controller","Unavailable by ICMP ping","1y 1d","No","","class: network, component: health, component: network, scope: availability, target: hp, target: hp-enterprise"`;

// TypeScript interfaces for our parsed Zabbix Problem
export interface ZabbixProblem {
  id: string; // Unique generated ID or derived
  severity: 'Warning' | 'Average' | 'High' | 'Disaster' | 'Information' | 'Not classified';
  time: string;
  recoveryTime: string;
  status: 'PROBLEM' | 'RESOLVED';
  host: string;
  problem: string;
  duration: string;
  ack: 'Yes' | 'No';
  actions: string;
  tags: string[];
  zone: string;
  hostId: string;
}

// Function to extract zone based on host naming patterns in Guanacaste, Costa Rica
export function getZoneFromHost(host: string): string {
  if (host.includes("CGR")) {
    // Extract the substring after CGR up to any trailing numeric identifier of 6 digits or similar
    const match = host.match(/CGR\s+([A-Za-z0-9\sñáéíóúÁÉÍÓÚüÜ]+?)(?:\s+\d+|\s*$)/);
    if (match && match[1]) {
      return match[1].trim();
    }
    // Fallback split
    const parts = host.split("CGR");
    if (parts.length > 1) {
      return parts[1].replace(/\d+/g, "").trim();
    }
  }
  if (host.includes("Controller") || host.includes("SW-ACC") || host.includes("CG-Controller")) {
    return "Infraestructura Central";
  }
  if (host.includes("PLANTA")) {
    return "Planta de Energía";
  }
  if (host.includes("Zabbix")) {
    return "Monitoreo Core";
  }
  return "Generales / Otros";
}

// Custom parser that splits CSV rows taking into account quoted text
export function parseZabbixCSV(csvData: string = rawZabbixCSV): ZabbixProblem[] {
  const lines = csvData.trim().split("\n");
  if (lines.length <= 1) return [];

  // Parse headers to know indices
  const list: ZabbixProblem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Correctly split quoted CSV values
    const regex = /"([^"]*)"|([^,\s]+)/g;
    const fields: string[] = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match[1] !== undefined) {
        fields.push(match[1]);
      } else {
        fields.push(match[2]);
      }
    }

    if (fields.length < 6) continue;

    const severity = (fields[0] || 'Warning') as ZabbixProblem['severity'];
    const time = fields[1] || '';
    const recoveryTime = fields[2] || '';
    const status = (fields[3] || 'PROBLEM') as ZabbixProblem['status'];
    const host = fields[4] || '';
    const problem = fields[5] || '';
    const duration = fields[6] || '';
    const ack = (fields[7] || 'No') as ZabbixProblem['ack'];
    const actions = fields[8] || '';
    const tagsString = fields[9] || '';

    // Split tags by comma
    const tags = tagsString
      ? tagsString.split(",").map(t => t.trim()).filter(Boolean)
      : [];

    const zone = getZoneFromHost(host);
    
    // Generate simple ID based on host and time
    const cleanHostPart = host.split(" ")[0] || "HST";
    const cleanTimePart = time.replace(/[^a-zA-Z0-9]/g, "");
    const id = `zb-${cleanHostPart}-${cleanTimePart}-${i}`;

    list.push({
      id,
      severity,
      time,
      recoveryTime,
      status,
      host,
      problem,
      duration,
      ack,
      actions,
      tags,
      zone,
      hostId: cleanHostPart
    });
  }

  return list;
}

// Statically parsed data
export const parsedProblems = parseZabbixCSV();
