-- 12 demo vehicles for Danvice Auto of RSM.
-- images[] starts empty on purpose: VehicleImage renders the branded placeholder
-- until the Wikipedia ingest fills them, so the site is correct at every step.
insert into public.vehicles
  (slug, stock_number, vin, year, make, model, trim_level, price, previous_price, mileage,
   body_type, transmission, drivetrain, fuel_type, exterior_color, interior_color,
   doors, seats, engine, cylinders, mpg_city, mpg_highway, features, description, is_featured)
values
('2016-honda-civic-lx-dv1001','DV1001','2HGFC2F59GH512834',2016,'Honda','Civic','LX',12995,13495,78400,
 'sedan','cvt','fwd','gasoline','Modern Steel Metallic','Black',4,5,'2.0L I4',4,31,41,
 array['Backup Camera','Bluetooth','Apple CarPlay','Cruise Control','Power Windows','Alloy Wheels'],
 'A one-owner Civic with the maintenance records to back it up. The tenth-generation Civic is the car we recommend most to first-time buyers: cheap to insure, cheap to run, and famously hard to kill. Fresh oil service and four matching tires.',true),

('2015-toyota-corolla-le-dv1002','DV1002','2T1BURHE9FC298471',2015,'Toyota','Corolla','LE',10495,null,96200,
 'sedan','cvt','fwd','gasoline','Classic Silver Metallic','Ash',4,5,'1.8L I4',4,29,38,
 array['Backup Camera','Bluetooth','Cruise Control','Keyless Entry','Power Windows'],
 'If you want a car that simply starts every morning for the next decade, this is it. Clean interior, no warning lights, and a timing chain rather than a belt so there is no expensive service waiting for you at 100k.',false),

('2014-toyota-camry-se-dv1003','DV1003','4T1BF1FK8EU375192',2014,'Toyota','Camry','SE',11250,null,108300,
 'sedan','automatic','fwd','gasoline','Cosmic Gray Mica','Black',4,5,'2.5L I4',4,25,35,
 array['Backup Camera','Bluetooth','Sport Suspension','Alloy Wheels','Power Driver Seat','Cruise Control'],
 'The SE trim adds a firmer suspension and paddle shifters, so it drives noticeably better than a base Camry without costing more to own. Roomy back seat and a trunk that swallows a full grocery run.',false),

('2017-hyundai-elantra-se-dv1004','DV1004','5NPD84LF9HH018263',2017,'Hyundai','Elantra','SE',9995,null,84100,
 'sedan','automatic','fwd','gasoline','Symphony Silver','Gray',4,5,'2.0L I4',4,28,37,
 array['Backup Camera','Bluetooth','Cruise Control','Keyless Entry','USB Ports'],
 'Newest car on the lot for under ten thousand. The 2017 Elantra was a full redesign, so it feels a generation ahead of its price. Balance of the original powertrain warranty may still apply.',false),

('2016-mazda3-i-sport-dv1005','DV1005','3MZBM1U74GM294817',2016,'Mazda','Mazda3','i Sport',11900,null,71500,
 'hatchback','automatic','fwd','gasoline','Deep Crystal Blue','Black',4,5,'2.0L I4',4,29,40,
 array['Backup Camera','Bluetooth','Push Button Start','Alloy Wheels','Hatchback Cargo Cover'],
 'The enthusiast pick in this price range. Sharper steering than anything else here, plus hatchback practicality — the rear seats fold flat for moving a dorm room. Lowest mileage vehicle on our lot.',false),

('2013-honda-accord-lx-dv1006','DV1006','1HGCR2F31DA087456',2013,'Honda','Accord','LX',9450,9995,132700,
 'sedan','cvt','fwd','gasoline','Alabaster Silver','Gray',4,5,'2.4L I4',4,27,36,
 array['Backup Camera','Bluetooth','Cruise Control','Power Windows','Dual-Zone Climate'],
 'Higher miles, lower price, same Accord reliability. This is the value play for a commuter who cares more about running cost than odometer reading. Recent brake service and new front tires.',false),

('2015-toyota-prius-two-dv1007','DV1007','JTDKN3DU8F1912047',2015,'Toyota','Prius','Two',12400,null,118900,
 'hatchback','cvt','fwd','hybrid','Sea Glass Pearl','Bisque',4,5,'1.8L I4 Hybrid',4,51,48,
 array['Backup Camera','Bluetooth','Hybrid Battery Checked','Keyless Entry','Cargo Cover'],
 'Fifty-one miles per gallon in city driving. At South County gas prices that is roughly a hundred dollars a month back in your pocket versus a typical sedan. Hybrid battery tested and reported healthy.',true),

('2014-honda-cr-v-lx-dv1008','DV1008','2HKRM4H33EH629185',2014,'Honda','CR-V','LX AWD',13995,null,121400,
 'suv','automatic','awd','gasoline','Polished Metal Metallic','Gray',4,5,'2.4L I4',4,22,30,
 array['All-Wheel Drive','Backup Camera','Bluetooth','Split-Folding Rear Seat','Roof Rails','Cruise Control'],
 'The family pick. All-wheel drive for weekend trips up the mountain, a cargo area that fits a stroller and a Costco run at the same time, and Honda running costs. Timing chain, not a belt.',true),

('2016-nissan-rogue-s-dv1009','DV1009','5N1AT2MT4GC784103',2016,'Nissan','Rogue','S',12750,null,99300,
 'suv','cvt','fwd','gasoline','Glacier White','Charcoal',4,5,'2.5L I4',4,26,33,
 array['Backup Camera','Bluetooth','Divide-N-Hide Cargo System','Keyless Entry','Cruise Control'],
 'More cargo room than a CR-V for less money, and the clever Divide-N-Hide floor keeps valuables out of sight. A sensible first SUV for a growing family on a budget.',false),

('2013-ford-escape-se-dv1010','DV1010','1FMCU0GX9DUB41527',2013,'Ford','Escape','SE',8250,null,141600,
 'suv','automatic','fwd','gasoline','Ingot Silver','Charcoal Black',4,5,'1.6L EcoBoost I4',4,23,31,
 array['Backup Camera','Bluetooth','SYNC Voice Control','Alloy Wheels','Roof Rails'],
 'The most SUV you can get here for the money. Turbocharged EcoBoost engine pulls strongly on the 241 without feeling strained. Priced to reflect the mileage — inspected and ready to go.',false),

('2017-kia-forte-lx-dv1011','DV1011','3KPFL4A79HE087432',2017,'Kia','Forte','LX',9150,null,88200,
 'sedan','automatic','fwd','gasoline','Aurora Black','Gray',4,5,'2.0L I4',4,29,38,
 array['Backup Camera','Bluetooth','Cruise Control','Keyless Entry','USB Ports'],
 'An underrated first car. Kia build quality caught up years ago and the Forte gives you a newer vehicle with fewer miles than the usual suspects at this price. Clean title, no accidents reported.',false),

('2012-honda-fit-sport-dv1012','DV1012','JHMGE8H51CC017894',2012,'Honda','Fit','Sport',7495,7995,126800,
 'hatchback','automatic','fwd','gasoline','Vortex Blue Pearl','Black',4,5,'1.5L I4',4,27,33,
 array['Magic Seat','Bluetooth','Alloy Wheels','Cruise Control','Power Windows'],
 'Our most affordable car, and a genuinely clever one. The Magic Seat folds in ways no other subcompact manages — people move furniture in these. Perfect student car: tiny fuel bill, easy to park, cheap to insure.',false);
