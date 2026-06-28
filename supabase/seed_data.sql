-- Seed Data: Sample Products for SogAfrika
-- Run this after creating the schema and categories

-- Get category IDs (adjust as needed based on your insert)
DO $$
DECLARE
  cat_cctv UUID;
  cat_fire UUID;
  cat_network UUID;
  cat_biometric UUID;
  cat_alarm UUID;
  cat_surveillance UUID;
BEGIN
  SELECT id INTO cat_cctv FROM categories WHERE slug = 'cctv-cameras';
  SELECT id INTO cat_fire FROM categories WHERE slug = 'fire-safety';
  SELECT id INTO cat_network FROM categories WHERE slug = 'networking';
  SELECT id INTO cat_biometric FROM categories WHERE slug = 'biometric-access';
  SELECT id INTO cat_alarm FROM categories WHERE slug = 'alarm-systems';
  SELECT id INTO cat_surveillance FROM categories WHERE slug = 'surveillance';

  -- CCTV Cameras
  INSERT INTO products (name, slug, description, specifications, price, compare_at_price, currency, category_id, images, stock_quantity, low_stock_threshold, is_active, featured) VALUES
  ('Hikvision 4MP Dome Camera', 'hikvision-4mp-dome-camera', 'Professional 4MP indoor dome camera with IR night vision up to 30m. Features H.265+ compression and WDR for clear footage in challenging lighting conditions.', '{"Resolution": "4MP (2560x1440)", "Lens": "2.8mm fixed", "Night Vision": "30m IR", "Compression": "H.265+", "Protection": "IP67", "Power": "PoE (802.3af)"}', 89.99, 119.99, 'USD', cat_cctv, ARRAY['/images/products/hikvision-dome.jpg'], 45, 5, true, true),
  ('Dahua 8MP Bullet Camera', 'dahua-8mp-bullet-camera', '8MP 4K resolution outdoor bullet camera with motorized varifocal lens. Smart motion detection and real-time alerts.', '{"Resolution": "8MP (3840x2160)", "Lens": "2.7-13.5mm motorized", "Night Vision": "60m IR", "Compression": "H.265+/H.264", "Protection": "IP67/IK10", "Features": "Smart Motion Detection"}', 169.99, NULL, 'USD', cat_cctv, ARRAY['/images/products/dahua-bullet.jpg'], 30, 5, true, true),
  ('PTZ Speed Dome 25x Zoom', 'ptz-speed-dome-25x', 'High-speed PTZ dome camera with 25x optical zoom. 360-degree continuous pan and 90-degree tilt for complete coverage.', '{"Resolution": "2MP (1920x1080)", "Zoom": "25x Optical", "Pan Range": "360° continuous", "Tilt Range": "0°~90°", "Speed": "240°/s pan", "Protection": "IP66"}', 349.99, 399.99, 'USD', cat_cctv, ARRAY['/images/products/ptz-dome.jpg'], 12, 3, true, true),
  ('Mini WiFi Camera Indoor', 'mini-wifi-camera-indoor', 'Compact WiFi security camera with two-way audio. Easy mobile app setup and cloud storage support.', '{"Resolution": "2MP (1080p)", "Connectivity": "WiFi 2.4GHz", "Storage": "MicroSD up to 256GB", "Audio": "Two-way", "Features": "Motion detection, Night vision", "App": "iOS & Android"}', 39.99, NULL, 'USD', cat_cctv, ARRAY['/images/products/mini-wifi-cam.jpg'], 100, 10, true, false);

  -- Fire Safety
  INSERT INTO products (name, slug, description, specifications, price, compare_at_price, currency, category_id, images, stock_quantity, low_stock_threshold, is_active, featured) VALUES
  ('Conventional Fire Alarm Panel 8-Zone', 'fire-alarm-panel-8-zone', 'Professional 8-zone conventional fire alarm control panel. Suitable for small to medium commercial buildings.', '{"Zones": "8", "Type": "Conventional", "Display": "LED indicators", "Battery Backup": "Yes (24h)", "Outputs": "2 sounder circuits", "Certification": "EN54"}', 199.99, NULL, 'USD', cat_fire, ARRAY['/images/products/fire-panel.jpg'], 20, 5, true, true),
  ('Addressable Smoke Detector', 'addressable-smoke-detector', 'Intelligent addressable photoelectric smoke detector with drift compensation and built-in isolator.', '{"Type": "Photoelectric", "Protocol": "Addressable", "Sensitivity": "Auto-adjusting", "LED": "360° visibility", "Operating Temp": "-10°C to +55°C", "Standards": "EN54-7"}', 45.99, NULL, 'USD', cat_fire, ARRAY['/images/products/smoke-detector.jpg'], 200, 20, true, false),
  ('Fire Extinguisher CO2 5kg', 'fire-extinguisher-co2-5kg', 'Professional CO2 fire extinguisher suitable for electrical fires and flammable liquids. Ideal for server rooms and offices.', '{"Capacity": "5kg CO2", "Rating": "34B", "Range": "2-3 meters", "Duration": "15 seconds", "Suitable For": "Class B & Electrical fires", "Certification": "BSI Kitemarked"}', 79.99, 99.99, 'USD', cat_fire, ARRAY['/images/products/fire-extinguisher.jpg'], 50, 10, true, false);

  -- Networking
  INSERT INTO products (name, slug, description, specifications, price, compare_at_price, currency, category_id, images, stock_quantity, low_stock_threshold, is_active, featured) VALUES
  ('Managed PoE Switch 24-Port', 'managed-poe-switch-24-port', '24-port Gigabit managed PoE+ switch with 4 SFP uplinks. 370W total PoE budget for IP cameras and access points.', '{"Ports": "24x Gigabit PoE+", "Uplinks": "4x SFP", "PoE Budget": "370W", "Switching Capacity": "56 Gbps", "Management": "Web/CLI/SNMP", "Rack Mount": "1U 19-inch"}', 299.99, NULL, 'USD', cat_network, ARRAY['/images/products/poe-switch.jpg'], 25, 5, true, true),
  ('Enterprise WiFi 6 Access Point', 'enterprise-wifi6-access-point', 'High-performance WiFi 6 (802.11ax) access point supporting up to 150 concurrent clients. Ideal for high-density environments.', '{"Standard": "WiFi 6 (802.11ax)", "Bands": "Dual-band 2.4/5GHz", "Speed": "Up to 3.6 Gbps", "Clients": "150+ concurrent", "PoE": "802.3at", "Mounting": "Ceiling/Wall"}', 189.99, 229.99, 'USD', cat_network, ARRAY['/images/products/wifi6-ap.jpg'], 40, 5, true, false),
  ('Cat6A Ethernet Cable 305m Box', 'cat6a-ethernet-cable-305m', 'Professional grade Cat6A shielded ethernet cable. 10Gbps support with full 305m box for installations.', '{"Category": "Cat6A F/UTP", "Length": "305m (1000ft)", "Speed": "10 Gbps", "Bandwidth": "500 MHz", "Conductor": "23AWG solid copper", "Jacket": "LSZH"}', 149.99, NULL, 'USD', cat_network, ARRAY['/images/products/cat6a-cable.jpg'], 30, 5, true, false);

  -- Biometric Access
  INSERT INTO products (name, slug, description, specifications, price, compare_at_price, currency, category_id, images, stock_quantity, low_stock_threshold, is_active, featured) VALUES
  ('Face Recognition Terminal', 'face-recognition-terminal', 'AI-powered face recognition access control terminal with temperature screening. Touchless entry for up to 50,000 faces.', '{"Technology": "Deep Learning AI", "Capacity": "50,000 faces", "Recognition Speed": "<0.2s", "Display": "7-inch touchscreen", "Temperature": "±0.3°C accuracy", "Interface": "TCP/IP, RS485, Wiegand"}', 499.99, 599.99, 'USD', cat_biometric, ARRAY['/images/products/face-terminal.jpg'], 15, 3, true, true),
  ('Fingerprint Access Controller', 'fingerprint-access-controller', 'Multi-mode access controller supporting fingerprint, RFID card, and PIN code. Waterproof outdoor design.', '{"Capacity": "3,000 fingerprints", "Card": "125kHz EM + 13.56MHz IC", "Display": "2.4-inch TFT", "Protection": "IP65", "Communication": "TCP/IP, USB", "Door Control": "Electric lock, exit button"}', 159.99, NULL, 'USD', cat_biometric, ARRAY['/images/products/fingerprint-controller.jpg'], 35, 5, true, false);

  -- Alarm Systems
  INSERT INTO products (name, slug, description, specifications, price, compare_at_price, currency, category_id, images, stock_quantity, low_stock_threshold, is_active, featured) VALUES
  ('Wireless Alarm System Kit', 'wireless-alarm-system-kit', 'Complete wireless alarm kit with GSM/WiFi hub, 4 door sensors, 2 motion detectors, 2 remotes, and indoor siren.', '{"Hub": "GSM + WiFi dual network", "Sensors": "4x door/window + 2x PIR motion", "Remotes": "2x key fobs", "Siren": "110dB indoor siren", "Zones": "Up to 100 wireless zones", "App": "iOS & Android remote control"}', 249.99, 329.99, 'USD', cat_alarm, ARRAY['/images/products/alarm-kit.jpg'], 20, 5, true, true),
  ('Outdoor Motion Sensor PIR', 'outdoor-motion-sensor-pir', 'Weatherproof outdoor PIR motion sensor with pet immunity up to 25kg. Anti-masking and tamper protection.', '{"Detection Range": "12m x 90°", "Mounting Height": "1.8-2.4m", "Pet Immunity": "Up to 25kg", "Protection": "IP55", "Anti-masking": "Yes", "Power": "3V lithium battery (3 years)"}', 34.99, NULL, 'USD', cat_alarm, ARRAY['/images/products/pir-sensor.jpg'], 75, 10, true, false);

  -- Surveillance
  INSERT INTO products (name, slug, description, specifications, price, compare_at_price, currency, category_id, images, stock_quantity, low_stock_threshold, is_active, featured) VALUES
  ('16-Channel NVR 4K', '16-channel-nvr-4k', 'Professional 16-channel network video recorder supporting up to 4K resolution. 4 SATA HDD bays for up to 40TB storage.', '{"Channels": "16ch IP cameras", "Resolution": "Up to 12MP", "Recording": "4K @ 30fps", "Storage": "4x SATA (up to 10TB each)", "Output": "HDMI + VGA", "Network": "2x Gigabit Ethernet"}', 449.99, NULL, 'USD', cat_surveillance, ARRAY['/images/products/nvr-16ch.jpg'], 18, 3, true, true),
  ('4TB Surveillance Hard Drive', '4tb-surveillance-hard-drive', 'Purpose-built surveillance-class hard drive optimized for 24/7 recording. Supports up to 64 cameras.', '{"Capacity": "4TB", "Interface": "SATA 6Gb/s", "RPM": "5400", "Cache": "256MB", "Workload": "180TB/year", "Warranty": "3 years"}', 109.99, 129.99, 'USD', cat_surveillance, ARRAY['/images/products/hdd-4tb.jpg'], 60, 10, true, false);

END $$;
