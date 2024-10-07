
SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


--
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: postgres
--

INSERT INTO "drizzle"."__drizzle_migrations" ("id", "hash", "created_at") VALUES
	(1, '20902a7c13eaf569c5cef9a2c72a6f5cb5d6e1733783d3c39e8a111d805f7e6c', 1708454650635),
	(2, '7bdba479a5f5a70f110f66d01e037bc2174ebe55d5c9ac75ac999477abbb3a5d', 1708509613967),
	(3, 'ffaad5c36d944e5be618ad4596963aa6251ce87dd30ad9ce02cf79fa72638fc3', 1708526596202),
	(4, '68696caf897effdfd31336872001e93fb33f5358eea11e6ed7048acabbceea49', 1710692230661),
	(5, 'd71069d2896d8c97a3e50ce96dba9e3ed0b4bbb2d3469f14f5e6c30af4285680', 1710692301840),
	(6, 'c49f0ec358ab81778e4a0bcf3afc5e4ea06e5a515ce32054f7fe9dd5fe165c48', 1714928832464),
	(7, '10f826cc7a215b4710a494a39fb2a35e0fabebc9afee13d14460ac80e34ef2cc', 1714998204748);




--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."groups" ("id", "title", "uri", "order") VALUES
	(79, '╨Р╤А╤Е╨╕╤В╨╡╨║╤В╤Г╤А╨░', 'arhitektura', 1),
	(78, '╨У╤А╨░╤Д╨╕╨║╨░', 'grafika', 2);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."categories" ("group_id", "id", "title", "uri", "order", "layout") VALUES
	(79, 73, '╨Ч╨┤╨░╨╜╨╕╤П', 'zdaniya', 1, 'base'),
	(79, 79, '╨Ю╤Д╨╕╤Б╤Л', 'ofisy', 2, 'base'),
	(79, 74, '╨Ю╨▒╤Й╨╡╤Б╤В╨▓╨╡╨╜╨╜╨╛╨╡', 'obschestvennoe', 4, 'base'),
	(79, 77, '╨а╨╡╤Б╤В╨╛╤А╨░╨╜╤Л', 'restorany', 3, 'base'),
	(79, 78, '╨Ъ╨▓╨░╤А╤В╨╕╤А╤Л', 'kvartiry', 5, 'base'),
	(78, 76, '╨Ы╨╛╨│╨╛╤В╨╕╨┐╤Л', 'logotipy', 1, 'mini'),
	(78, 75, '╨н╤В╨╕╨║╨╡╤В╨║╨╕', 'etiketki', 2, 'base');


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."projects" ("category_id", "id", "title", "uri", "status", "year_start", "year_end", "location", "order", "is_minimal") VALUES
	(76, 58, '╨б╨в╨Т', 'stv', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 13, true),
	(76, 53, '╨Ю╤А╨╗╨░╨╜', 'orlan', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 4, true),
	(75, 68, '╨д╤С╨┤╨╛╤А ╤И╨░╨╗╤П╨┐╨╕╨╜', 'fedor-shalyapin', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 1, false),
	(76, 54, '╨а╨╡╤Б╤В╨╛╤А╨░╨╜ Del Mare', 'restoran-del-mare', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 7, true),
	(75, 70, '╨Ф╨╕╨║╨╕╨╣ ╨╝╤С╨┤', 'dikiy-med-etiketka', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 4, false),
	(75, 73, '╨Э╨░╨┐╨╕╤В╨║╨╕ ╨и╨╕╤Е╨░╨╜', 'napitki-shihan', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 5, false),
	(75, 72, '╨Р╨│╨╕╨┤╨╡╨╗╤М ╨С╨░╨╗╤М╨╖╨░╨╝', 'agidel-balzam', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 3, false),
	(75, 71, '╨Т╨╛╨┤╨║╨░ ╨б╤В╨░╨╗╨║', 'vodka-stalk', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 2, false),
	(76, 56, '╨Т╨░╤В╤А╤Г╤И╨║╨╕╨╜', 'vatrushkin', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 1, true),
	(76, 57, '╨и╨╕╤Е╨░╨╜', 'shihan', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 2, true),
	(73, 80, '╨Ъ╨╕╤А╨┐╨╕╤З╨╜╤Л╨╣ ╨┤╨╛╨╝', 'kirpichnyy-dom', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2015, 2015, '╨г╤Д╨░', 6, false),
	(74, 87, '╨Я╨╡╤И╨╡╤Е╨╛╨┤╨╜╨░╤П ╨╖╨╛╨╜╨░', 'peshehodnaya-zona', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2011, 2012, '╨б╤В╨╡╤А╨╗╨╕╤В╨░╨╝╨░╨║', 1, false),
	(74, 88, '╨Ф╨╡╤В╤Б╨║╨░╤П ╨│╨╛╤А╨╛╨┤╤Б╨║╨░╤П ╨▒╨╛╨╗╤М╨╜╨╕╤Ж╨░', 'detskaya-gorodskaya-bolnitsa', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2011, 2012, '╨б╨░╨╗╨░╨▓╨░╤В', 2, false),
	(74, 89, '╨Ъ╤А╨░╨╡╨▓╨╡╨┤╤З╨╡╤Б╨║╨╕╨╣ ╨╝╤Г╨╖╨╡╨╣', 'kraevedcheskiy-muzey', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2010, 2010, '╨б╤В╨╡╤А╨╗╨╕╤В╨░╨╝╨░╨║', 3, false),
	(74, 90, '╨Ы╨╕╤Ж╨╡╨╣ тДЦ1', 'litsey-1', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2010, 2011, '╨б╨░╨╗╨░╨▓╨░╤В', 4, false),
	(74, 91, '╨Ч╨░╨│╤Б', 'zags', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2008, 2009, '╨б╤В╨╡╤А╨╗╨╕╤В╨░╨╝╨░╨║', 5, false),
	(74, 92, '╨в╤А╤Ж ╨п╨╣', 'trts-yay', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2015, 2015, '╨г╤Д╨░', 6, false),
	(79, 85, '╨а╨╕╨║╨╛╨╝', 'rikom', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2015, 2015, '╨б╤В╨╡╤А╨╗╨╕╤В╨░╨╝╨░╨║', 6, false),
	(79, 83, '╨Ш╨╜╨╝╨░╨╜ Palfinger', 'inman-palfinger', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2015, 2015, '╨Ш╤И╨╕╨╝╨▒╨░╨╣', 5, false),
	(79, 84, '╨У╨░╨╖╨┐╤А╨╛╨╝', 'gazprom', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2015, 2015, '╨г╤Д╨░', 4, false),
	(79, 82, '╨У╨░╨╖╨┐╤А╨╛╨╝╨▒╨░╨╜╨║', 'gazprombank', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2019, 2020, '╨г╤Д╨░', 3, false),
	(79, 86, '╨б╨░╨╝╨╛╨╗╤С╤В', 'samolet', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2015, 2015, '╨б╤В╨╡╤А╨╗╨╕╤В╨░╨╝╨░╨║', 2, false),
	(79, 81, '╨а╨╛╤Б╨╜╨╡╤Д╤В╤М', 'rosneft', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2018, 2024, '╨г╤Д╨░', 1, false),
	(77, 93, '╨Т╨░╤В╤А╤Г╤И╨║╨╕╨╜ ╨Ы╨╛╤Д╤В', 'vatrushkin-loft', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2012, 2012, '╨б╤В╨╡╤А╨╗╨╕╤В╨░╨╝╨░╨║', 1, false),
	(76, 66, '╨д╨╛╤А╤Г╨╝ ╨┐╤А╨╡╨┤╨┐╤А╨╕╨╜╨╕╨╝╨░╤В╨╡╨╗╤М╤Б╤В╨▓╨░', 'forum-predprinimatelstva', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 5, true),
	(76, 67, '╨С╨╛╤Г╨╗╨╕╨╜╨│ ╨Ч╨░╤А╤П', 'bouling-zarya', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 6, true),
	(76, 59, '╨У╨╛╤Б╤В╨╕╨╜╨╕╤Ж╨░ ╨Р╤И╨║╨░╨┤╨░╤А', 'gostinitsa-ashkadar', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 8, true),
	(76, 65, '╨Ф╨╕╨║╨╕╨╣ ╨╝╤С╨┤', 'dikiy-med', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 9, true),
	(76, 60, '╨Ъ╤А╨░╨▓╨╡╨┤╤З╨╡╤Б╨║╨╕╨╣ ╨╝╤Г╨╖╨╡╨╣', 'kravedcheskiy-muzey', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 10, true),
	(76, 63, '╨Ъ╨░╤Д╨╡ ╨Ь╨╡╨│╨░╨┐╨╛╨╗╨╕╤Б', 'kafe-megapolis', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 12, true),
	(76, 61, '╨а╨╕╨║╨╛╨╝ ╨Я╨╗╤О╤Б', 'rikom-plyus', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 14, true),
	(76, 64, '╨Ъ╤Г╤А╤Г╨╗╤В╨░╨╣', 'kurultay', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 15, true),
	(77, 94, 'VLoft', 'vloft', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2015, 2015, '╨г╤Д╨░', 2, false),
	(76, 55, '╨б╤В╨╡╤А╤Е', 'sterh', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 3, true),
	(76, 62, '╨У╤А╨░╨╜╨┤ ╨╛╤В╨╡╨╗╤М ╨Т╨╛╤Б╤В╨╛╨║', 'grand-otel-vostok', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', NULL, NULL, NULL, 11, true),
	(77, 95, '╨Ъ╨░╨┤╤Г╤И╨║╨░', 'kadushka', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2013, 2013, '╨б╤В╨╡╤А╨╗╨╕╤В╨░╨╝╨░╨║', 3, false),
	(77, 96, 'Sterlitimatto', 'sterlitimatto', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2018, 2018, '╨б╤В╨╡╤А╨╗╨╕╤В╨░╨╝╨░╨║', 4, false),
	(77, 97, 'Del Mare', 'del-mare', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2008, 2008, '╨г╤Д╨░', 5, false),
	(77, 98, '╨д╤А╨╡╤И╨▒╨░╨╖╨░╤А', 'freshbazar', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2015, 2015, '╨б╤В╨╡╤А╨╗╨╕╤В╨░╨╝╨░╨║', 6, false),
	(78, 99, 'Msk', 'msk-flat', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2015, 2015, '╨Ь╨╛╤Б╨║╨▓╨░', 1, false),
	(78, 100, 'Ufa stone', 'ufa-stone', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2015, 2015, '╨г╤Д╨░', 2, false),
	(78, 101, 'Ufa soft', 'ufa-soft', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2014, 2014, '╨г╤Д╨░', 3, false),
	(73, 52, '╨Р╨╗╤В╨░╨╣╤Б╨║╨╕╨╣ ╨║╨╡╨┤╤А', 'altayskiy-kedr', '╤Б╤В╤А╨╛╨╕╤В╤Б╤П', 2018, NULL, '╨С╨░╤И╨║╨╛╤А╤В╨╛╤Б╤В╨░╨╜', 2, false),
	(73, 77, '╨С╨╡╤Б╨╡╨┤╨║╨░ ╤Г ╨┐╤А╤Г╨┤╨░', 'besedka-u-pruda', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2017, 2017, '╨С╨░╤И╨║╨╛╤А╤В╨╛╤Б╤В╨░╨╜', 1, false),
	(73, 79, '╨Ф╨╛╨╝ ╨▓ ╨╗╨╡╤Б╤Г', 'dom-v-lesu', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2019, 2019, '╨Ь╨╛╤Б╨║╨╛╨▓╤Б╨║╨░╤П ╨╛╨▒╨╗╨░╤Б╤В╤М', 3, false),
	(73, 76, '╨С╨░╨╜╤П ╨╕╨╖ ╨╗╨╕╤Б╤В╨▓╨╡╨╜╨╜╨╕╤Ж╤Л', 'banya-iz-listvennitsy', '╤Б╤В╤А╨╛╨╕╤В╤Б╤П', 2018, NULL, '╨С╨░╤И╨║╨╛╤А╤В╨╛╤Б╤В╨░╨╜', 4, false),
	(73, 78, '╨Ф╨╛╨╝ ╨╕╨╖ ╨▒╤А╤Г╤Б╨░', 'dom-iz-brusa', '╨╖╨░╨▓╨╡╤А╤И╤С╨╜', 2011, 2012, '╨г╤Д╨░', 5, false);


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."images" ("project_id", "id", "alt", "order", "fit") VALUES
	(52, '6fe915c4-273e-4aee-beab-a6edef651c67.jpeg', '0009.jpg', 7, 'object-cover'),
	(52, 'f59deca2-2d6d-4b10-bcc5-22fd5eced1d0.jpeg', '0013.jpg', 6, 'object-cover'),
	(81, '937ac6b8-3b30-4e47-be8a-e45a208f984f.jpeg', 'photo_10_2024-06-14_13-57-06.jpg', 16, 'object-cover'),
	(81, '21c760c6-be49-473d-a325-e0a3d42b82d6.jpeg', 'photo_13_2024-06-14_13-57-06.jpg', 17, 'object-cover'),
	(81, 'b952bf5a-5465-42b2-9d86-e0fd0a3c5c7b.jpeg', 'photo_4_2024-06-14_13-57-06.jpg', 23, 'object-cover'),
	(55, 'c8ce5e9f-34fb-4d56-944a-b19d050752ed.jpeg', '!preview.jpg', 1, 'object-cover'),
	(81, 'b2c283bd-ce34-4874-8aa4-cfc4fbe4fb62.jpeg', 'photo_12_2024-06-14_13-57-06.jpg', 18, 'object-cover'),
	(100, '47f5e176-06c3-47d2-82fb-2aafd7537bed.jpeg', '0011.jpg', 6, 'object-cover'),
	(81, '6d702792-9e32-43da-96d8-f2e7e7e0423d.jpeg', 'photo_8_2024-06-14_13-57-06.jpg', 20, 'object-cover'),
	(87, '1a003e7c-5264-463b-8f4a-7edd1df9cbf9.jpeg', '!preview.jpg', 1, 'object-cover'),
	(81, '82ca3ec7-69f5-4f2e-8af2-6b9c91f2a441.jpeg', 'photo_2_2024-06-14_13-57-06.jpg', 28, 'object-cover'),
	(95, 'a2917b8c-5c77-4480-b55b-89bc1d94f412.jpeg', '0007.jpg', 4, 'object-cover'),
	(94, 'f4cd8c32-825e-4763-8f7d-f3a3e9d89729.jpeg', '0007.jpg', 4, 'object-cover'),
	(94, 'eb5b294b-5fd1-48e8-9093-e1725f7481a5.jpeg', '9999.jpg', 14, 'object-cover'),
	(73, '394f9f7d-c0e1-4b58-9e8d-020285aa916f.jpeg', '!preview.jpg', 1, 'object-contain'),
	(70, 'dd9db16c-bce3-4f53-8ffe-97a2321041ce.jpeg', '!preview.jpg', 1, 'object-contain'),
	(72, '127f75ca-1d84-45a9-8e24-4e6f389f94c5.jpeg', '!preview.jpg', 1, 'object-contain'),
	(68, 'bd7c863f-fe9d-4cf3-bd9b-b2af6df10e8b.jpeg', '╨д╤С╨┤╨╛╤А ╤И╨░╨╗╤П╨┐╨╕╨╜', 3, 'object-contain'),
	(95, '9b4bca7a-d79e-40d6-8b24-05d832369568.jpeg', '0015.jpg', 9, 'object-cover'),
	(81, 'f8316c2f-ddd4-4688-83c8-4ed41a7ef1c7.jpeg', 'photo_11_2024-06-14_13-57-06.jpg', 19, 'object-cover'),
	(96, '1d70f148-307a-4fc8-a6ef-5712f53c6fb5.jpeg', '0007.jpg', 2, 'object-cover'),
	(81, 'a3612da8-ac10-4925-8545-819f848d81ba.jpeg', 'photo_9_2024-06-14_13-57-06.jpg', 21, 'object-cover'),
	(96, '20ed4984-1059-4384-947b-a022e954d806.jpeg', '0005.jpg', 3, 'object-cover'),
	(97, '3330dfc8-9e0e-4e8a-8d87-30b6d363f74e.jpeg', '0007.jpg', 5, 'object-cover'),
	(52, 'db9ade18-6430-446f-9857-0c5b2a455c68.jpeg', '0003.jpg', 3, 'object-cover'),
	(81, '03d99d47-a40f-42d3-92c9-ffe99caa423a.jpeg', '0010.jpg', 13, 'object-cover'),
	(81, '5dfecca8-f11e-4426-90eb-3ae4a3fab8a7.jpeg', '0008.jpg', 14, 'object-cover'),
	(84, 'aace8275-60ea-41f0-8e5a-89bcad3da0dd.jpeg', '0013.jpg', 7, 'object-cover'),
	(82, '9641ecfc-778d-4b4f-be48-5d78f7b83785.jpeg', '!preview.jpg', 1, 'object-cover'),
	(88, 'd0ed4c4c-3bce-4ff3-8761-e849ee8e5199.jpeg', '!preview.jpg', 1, 'object-cover'),
	(88, '035db4dc-fe99-4f5a-8bfe-92b2dfd69a38.jpeg', '0005.jpg', 8, 'object-cover'),
	(85, 'fbfd3cf2-3362-4463-9c16-739948abf976.jpeg', '0003.jpg', 3, 'object-cover'),
	(85, '02d15f1e-24a1-40ca-afac-1573c4481c78.jpeg', '0005.jpg', 4, 'object-cover'),
	(85, '761be4c8-f5bd-4240-9cfb-1e250f46ae57.jpeg', '0009.jpg', 5, 'object-cover'),
	(88, 'd4dcff10-a97d-4e39-8dd4-d46ce21e9332.jpeg', '0019.jpg', 13, 'object-cover'),
	(100, '0636ddc1-0db0-4c71-846b-d7470f0f384e.jpeg', '0007.jpg', 4, 'object-cover'),
	(86, 'a73805e8-84d0-4c4e-a4b5-45b36eeff002.jpeg', '0003.jpg', 7, 'object-cover'),
	(86, 'e78d491f-ed38-45f2-a9ab-57c0c4b95f55.jpeg', '0009.jpg', 5, 'object-cover'),
	(100, '282ff005-3a62-41f9-b552-82ba86fc8572.jpeg', '0000.jpg', 3, 'object-cover'),
	(86, '260fe51b-8b6b-43a1-985b-9d9634e296f4.jpeg', '0005.jpg', 4, 'object-cover'),
	(99, '4a308e7c-c625-48fa-9525-ebe91c2ab5ad.jpeg', '!preview.jpg', 1, 'object-cover'),
	(56, '63c9079d-abf6-4e07-ab3c-68ced4a55fef.jpeg', '!preview.jpg', 1, 'object-cover'),
	(58, '615e0e35-5d2a-4ba0-9d33-f3f1d395a0e4.jpeg', '!preview.jpg', 1, 'object-cover'),
	(77, 'a744639c-0bfe-4272-a746-b08121accc4d.jpeg', '0003.jpg', 5, 'object-cover'),
	(61, 'be6ec357-dd3d-47a4-a1c5-3ac24136f902.jpeg', '!preview.jpg', 1, 'object-cover'),
	(63, '23db9f7e-ce41-466c-bfa4-de2d50f17c6e.jpeg', '!preview.jpg', 1, 'object-cover'),
	(78, 'b2965365-d94f-44f8-bcc4-0133364e4252.jpeg', '!preview.jpg', 1, 'object-cover'),
	(65, 'fc9cfed6-4943-4eb4-b393-3bc40e9fb644.jpeg', '!preview.jpg', 1, 'object-cover'),
	(99, '5778a83e-477c-4938-b97e-e347313013d5.jpeg', '0003.jpg', 2, 'object-cover'),
	(99, 'b864a737-8a0d-485d-98c1-feb9f8aea50d.jpeg', '0005.jpg', 3, 'object-cover'),
	(76, '3d29d553-d6d5-449a-823c-2bf22722d611.jpeg', '0003.jpg', 3, 'object-cover'),
	(78, 'b7d75f6a-abcd-4d46-a5e2-5ecb583714f8.jpeg', '0003.jpg', 3, 'object-cover'),
	(78, '6309c892-a0d8-4142-9dc8-365a388b4caa.jpeg', '0005.jpg', 4, 'object-cover'),
	(77, 'aa899709-2597-4c19-9645-2cab8024fa6f.jpeg', '!preview.jpg', 2, 'object-cover'),
	(84, 'b655a70d-edc0-4c99-873b-81594fbd0f40.jpeg', '!preview.jpg', 1, 'object-cover'),
	(97, '2febb68e-3bf8-4626-a4e1-434204138ccb.jpeg', '0021.jpg', 11, 'object-cover'),
	(98, '4b5707a3-0e13-4786-a60f-afe348610aed.jpeg', '0003.jpg', 4, 'object-cover'),
	(98, '260c1eed-3c15-4a57-9445-d28b4be68372.jpeg', '0007.jpg', 3, 'object-cover'),
	(81, '6eb095ab-d2b4-4953-b40d-e8250713d6cc.jpeg', 'photo_3_2024-06-14_13-57-06.jpg', 24, 'object-cover'),
	(52, 'b7079447-47ba-4b2a-9531-6c2474a7abba.jpeg', '0011.jpg', 5, 'object-cover'),
	(52, '2ba08fde-5199-4f9c-9556-d3d42b4d1e60.jpeg', '0007.jpg', 4, 'object-cover'),
	(52, '4267f242-dac1-44df-83bc-8885b69da8f0.jpeg', '!preview.jpg', 1, 'object-contain'),
	(81, 'a3a51bba-76f9-44f8-9d29-2145ba1dab4e.jpeg', 'photo_7_2024-06-14_13-57-06.jpg', 22, 'object-cover'),
	(94, 'ca9e95f1-12bb-4436-ada8-1958af508d1e.jpeg', '0021.jpg', 10, 'object-cover'),
	(81, '068ee670-2c1d-4054-a261-5f70b371a724.jpeg', 'photo_1_2024-06-14_13-57-06.jpg', 26, 'object-cover'),
	(95, '7bd15bf6-af5d-43f3-8da4-30b5bfe954f6.jpeg', '0011.jpg', 5, 'object-cover'),
	(95, '23185477-e90c-4d9d-9766-2fad4a539535.jpeg', '0009.jpg', 6, 'object-cover'),
	(95, '9d37b865-9170-4c33-bacc-f15f3d7fbbe3.jpeg', '0003.jpg', 2, 'object-cover'),
	(95, '3b96996f-01b3-4c3b-8d1f-b1ec3a5746d3.jpeg', '0005.jpg', 3, 'object-cover'),
	(78, '41d1f36b-da68-4509-b9c2-022c81f37b08.jpeg', '0029.jpg', 5, 'object-cover'),
	(78, '7692478a-26ce-4322-87db-3baf8f43fbec.jpeg', '0027.jpg', 8, 'object-cover'),
	(78, '7e118072-659e-49ab-b687-9a16502cffce.jpeg', '0037.jpg', 12, 'object-cover'),
	(78, '740194a2-7125-4789-a615-5d149b82891a.jpeg', '0033.jpg', 13, 'object-cover'),
	(76, 'b53976a4-9979-48b6-b269-3649d3b88829.jpeg', '0015.jpg', 7, 'object-cover'),
	(76, 'f3d51d2a-31d7-453c-93e9-4e5c04c136e9.jpeg', '0009.jpg', 8, 'object-cover'),
	(76, '2b7948f0-cffe-46fd-9aa8-e539ede5c584.jpeg', '0011.jpg', 9, 'object-cover'),
	(82, '48273abb-e9e1-42bf-9669-b06f7de212e0.jpeg', '0005.jpg', 4, 'object-cover'),
	(82, '11a22574-2941-42b5-975b-259970eeab5c.jpeg', '0007.jpg', 5, 'object-cover'),
	(78, '229abde4-7fec-4ac4-b8c7-9a17f1ddc167.jpeg', '0013.jpg', 15, 'object-cover'),
	(78, '4afb5c02-d50a-4727-ad98-a492d749c85f.jpeg', '0021.jpg', 17, 'object-cover'),
	(78, '5acfd51a-3bff-44cf-bbcb-2b82e24572ed.jpeg', '0023.jpg', 18, 'object-cover'),
	(83, 'bcf4fc6a-ebba-4995-8a11-4141ccd453dd.jpeg', '!preview.jpg', 1, 'object-cover'),
	(99, 'd8031182-efa0-4aa0-b85c-6dd92f9b9c51.jpeg', '0011.jpg', 6, 'object-cover'),
	(87, '3366198c-5631-4bea-b7f3-2c9cde37e6fd.jpeg', '0003.jpg', 2, 'object-cover'),
	(83, '893fc1b6-1a3b-4f91-bbc1-bf8d2491a6a6.jpeg', '0009.jpg', 3, 'object-cover'),
	(83, '33838a53-485f-4bf2-889c-cfdb43cbefb4.jpeg', '0005.jpg', 6, 'object-cover'),
	(83, '9f8fdd6f-1262-49cb-9f68-8854cb6e9191.jpeg', '0003.jpg', 9, 'object-cover'),
	(83, 'faaf2d1c-be5e-42ec-abe4-ac62286e4367.jpeg', '0011.jpg', 10, 'object-cover'),
	(79, 'ff6413ff-ff96-4b60-9343-4f954a6bce5d.jpeg', '0011.jpg', 6, 'object-cover'),
	(80, '92a30482-36ea-4e72-a3df-8ece923f9b8e.jpeg', '0019.jpg', 13, 'object-cover'),
	(83, 'c512c9f4-ee57-4b66-a577-c1ca719a5b5a.jpeg', '0019.jpg', 12, 'object-cover'),
	(83, 'cb78c74c-1004-4970-87fe-4ad4e1feda95.jpeg', '0017.jpg', 13, 'object-cover'),
	(79, 'd00b2c24-938a-4451-93cc-11955d1eda32.jpeg', '0003.jpg', 2, 'object-cover'),
	(79, 'e3d98854-e8b4-4597-b366-b278f6937d2d.jpeg', '0007.jpg', 4, 'object-cover'),
	(79, 'f80a0ae5-474c-4de7-a963-7572df235b6a.jpeg', '0009.jpg', 5, 'object-cover'),
	(88, '3171a4ef-0959-4a84-8628-3cf0016e0274.jpeg', '0001.jpg', 3, 'object-cover'),
	(88, 'c7be8134-ac04-455e-b383-a1ecc3ad8ebe.jpeg', '0003.jpg', 4, 'object-cover'),
	(80, '299be832-67b4-4ecf-87e8-2852af5b0663.jpeg', '0007.jpg', 2, 'object-cover'),
	(88, 'fcebb892-bcb1-4527-a228-e91a153ae0af.jpeg', '0013.jpg', 7, 'object-cover'),
	(80, '71e95107-22a2-4cc9-9858-58062f3304ad.jpeg', '0003.jpg', 6, 'object-cover'),
	(80, '441a89a0-2de8-4107-a669-4a381b8549ee.jpeg', '0011.jpg', 7, 'object-cover'),
	(80, '2f2d1bcf-cac1-4c3d-a871-016d626a4419.jpeg', '0013.jpg', 8, 'object-cover'),
	(88, '968667e7-1864-46a8-9b16-dc58be7c48a5.jpeg', '0007.jpg', 9, 'object-cover'),
	(84, '59943ccf-e8aa-4768-b61a-dcbccc5234a1.jpeg', '0005.jpg', 2, 'object-cover'),
	(84, 'd4f5c8c9-5d78-4fdc-833b-f0893b0c084b.jpeg', '0011.jpg', 4, 'object-cover'),
	(80, 'a7ce7e6e-facb-452a-a644-85c3b7d95993.jpeg', '0025.jpg', 10, 'object-cover'),
	(80, 'cd0ad998-5332-4358-b8fb-57c8bf581d49.jpeg', '0015.jpg', 11, 'object-cover'),
	(80, '1e381b6d-47a6-443d-a09a-6a63e1b4256e.jpeg', '0021.jpg', 14, 'object-cover'),
	(84, '77e30eb4-ab0e-4d65-9942-2b2c237d8f6e.jpeg', '0000.jpg', 6, 'object-cover'),
	(84, '8ea3f968-2ee2-4438-ad8d-d401335f6274.jpeg', '0015.jpg', 8, 'object-cover'),
	(81, '2d1359ba-5655-41da-a738-87da83a65050.jpeg', '0000.jpg', 2, 'object-cover'),
	(84, '0bca6bd4-5ae0-4bc6-8aeb-825314124c31.jpeg', '0007.jpg', 9, 'object-cover'),
	(81, '217a551f-f121-495e-a342-d15021f65b24.jpeg', '0004.jpg', 4, 'object-cover'),
	(81, '638f23db-114d-44a1-b7d3-f2a2cd823c40.jpeg', '0006.jpg', 7, 'object-cover'),
	(81, 'edb66d78-17c3-4cca-b69f-2c0a6f3a971e.jpeg', '0001.jpg', 9, 'object-cover'),
	(85, '5d40cb52-28f2-4d1f-9cc3-9ac6673b29ef.jpeg', '!preview.jpg', 1, 'object-cover'),
	(88, '86c3399d-e7cd-41c1-b793-54f9a93f8e92.jpeg', '0021.jpg', 11, 'object-cover'),
	(88, '5ccc0930-3cb6-4aa5-87ba-07422dade7e7.jpeg', '0015.jpg', 12, 'object-cover'),
	(95, '78b6924b-d0c2-4c5a-bea7-998900407b56.jpeg', '0019.jpg', 10, 'object-cover'),
	(97, 'f98b63de-7895-4bd7-9e65-659e93beb448.jpeg', '!preview.jpg', 2, 'object-cover'),
	(97, 'cc600c99-665c-4291-b128-c1d9e0b26cbd.jpeg', '0023.jpg', 12, 'object-cover'),
	(98, '7ddd4a35-bd1d-48ae-a596-3370c5a08b18.jpeg', '!preview.jpg', 1, 'object-cover'),
	(81, '1eaa2652-c8a6-4bb2-b063-d2839a1c5b69.jpeg', 'photo_5_2024-06-14_13-57-06.jpg', 27, 'object-cover'),
	(81, 'c4c80123-ad31-49f4-930c-7c31fa8ed798.jpeg', '0012.jpg', 10, 'object-cover'),
	(81, 'ad1a4d94-c839-4c48-9664-52c5194bd1e9.jpeg', '0013.jpg', 11, 'object-cover'),
	(81, '2871d585-04dc-4088-9e7c-277a86359ef7.jpeg', '0011.jpg', 15, 'object-cover'),
	(85, 'f6405e48-0dd9-4c23-beb1-8cb4fd409b02.jpeg', '0001.jpg', 2, 'object-cover'),
	(85, 'da2e4ce6-86ac-4248-a81c-44c3fa6565de.jpeg', '0011.jpg', 6, 'object-cover'),
	(85, '846b71b8-926b-4581-975e-b3790d75e0b4.jpeg', '0007.jpg', 7, 'object-cover'),
	(86, 'b2c5213d-4b22-4643-a83b-7380be24ba34.jpeg', '!preview.jpg', 1, 'object-cover'),
	(86, '0668b7fd-934d-4d6d-abb0-9adc7152e924.jpeg', '0000.jpg', 6, 'object-cover'),
	(100, '3d872625-72ad-43ea-963b-6ca0e717ac42.jpeg', '0009.jpg', 5, 'object-cover'),
	(86, '6a3d1eee-aa83-4012-966d-66f07fec197a.jpeg', '0007.jpg', 2, 'object-cover'),
	(86, '4263ce7d-37ba-4845-a136-100f07f5665c.jpeg', '0011.jpg', 3, 'object-cover'),
	(100, 'ac9d7d65-4740-45c8-bca3-de2e10d8415f.jpeg', '!preview.jpg', 1, 'object-cover'),
	(100, '3c14e721-ae21-4b04-a682-700610b34afb.jpeg', '0005.jpg', 2, 'object-cover'),
	(95, 'e9fb3714-020d-4849-a5ce-2742e63accb7.jpeg', '0017.jpg', 7, 'object-cover'),
	(88, 'f1f9fc91-119c-49ec-a344-277f5e4cb831.jpeg', '0009.jpg', 2, 'object-cover'),
	(88, '2c1c5259-e9ce-4831-ae7a-545ea774f08b.jpeg', '0002.jpg', 5, 'object-cover'),
	(88, '6b44ac50-3ef5-4dbd-a1c6-0b0d7bcf097f.jpeg', '0011.jpg', 6, 'object-cover'),
	(88, '02b0f509-97a7-4795-8936-81335d792609.jpeg', '0017.jpg', 10, 'object-cover'),
	(88, '81772d46-cee5-4f87-a518-9bf86e21fcb2.jpeg', '0027.jpg', 14, 'object-cover'),
	(88, '8656eae4-423b-4e80-8fcf-e79b1050f731.jpeg', '0025.jpg', 15, 'object-cover'),
	(88, '2eeef4c5-520a-45c1-8602-e9efea8e791e.jpeg', '0023.jpg', 16, 'object-cover'),
	(96, 'a727a2ea-4743-4809-8402-133f3107e1e0.jpeg', '0000.jpg', 5, 'object-cover'),
	(97, 'a76dcdec-fc50-40ef-9a7d-4abf6a8c5b04.jpeg', '0009.jpg', 6, 'object-cover'),
	(101, '5210ff63-63d7-4f61-81dc-89d5fb539e4f.jpeg', '!preview.jpg', 1, 'object-cover'),
	(101, '3e50c7ac-e40b-49d3-a9df-3b5bc15315c4.jpeg', '0015.jpg', 9, 'object-cover'),
	(101, '7f884173-aeb1-44dc-99fb-0e40270e14d0.jpeg', '0017.jpg', 10, 'object-cover'),
	(90, 'c28dcec1-1bdf-4876-8b51-84e6a4d43e35.jpeg', '!preview.jpg', 4, 'object-cover'),
	(90, 'a541b06d-cff3-4cce-8382-dc231b7a14cd.jpeg', '0007.jpg', 5, 'object-cover'),
	(90, '857d53eb-8350-48c9-b58b-e8a3bf0ed3b9.jpeg', '9999.jpg', 12, 'object-cover'),
	(101, 'a74c5cab-22f8-4f57-94a8-282540f81662.jpeg', '0000.jpg', 2, 'object-cover'),
	(90, '1cc01416-dd0a-4b00-ba6a-0eb530247beb.jpeg', '0013.jpg', 6, 'object-cover'),
	(101, 'd4240cbb-2b65-4173-bedf-5ab3c6f596a9.jpeg', '0003.jpg', 3, 'object-cover'),
	(90, 'fb593bf4-6509-4698-833a-8375e875a249.jpeg', '0017.jpg', 7, 'object-cover'),
	(90, 'c6b9bcaf-a8bc-41d8-a93d-357c27b907d8.jpeg', '0019.jpg', 8, 'object-cover'),
	(101, '890737d6-172e-4b5c-880a-4f3fcad13eb7.jpeg', '0005.jpg', 4, 'object-cover'),
	(92, '267bb3ba-c6b7-467d-b68c-5eb75851bc5b.jpeg', '0003.jpg', 6, 'object-cover'),
	(101, 'd806b60e-9d38-49af-ba29-3d1702444095.jpeg', '0009.jpg', 6, 'object-cover'),
	(101, 'cc992e42-c207-49d6-a955-2b3bba3645eb.jpeg', '0007.jpg', 5, 'object-cover'),
	(101, 'cbe1b5cc-317d-4c75-b778-b6ee41595422.jpeg', '0013.jpg', 8, 'object-cover'),
	(101, '553144a8-5fc8-43c6-8c72-f3cd43d05651.jpeg', '0011.jpg', 7, 'object-cover'),
	(90, 'ee9c6252-f944-43c6-bc9e-9708c902c55e.jpeg', '0015.jpg', 9, 'object-cover'),
	(90, 'bb31ad8e-9567-4ce4-b8c2-8bebb62a496e.jpeg', '0011.jpg', 10, 'object-cover'),
	(90, '5f605e6a-de1e-4052-b8c3-7b677b464b5c.jpeg', '0021.jpg', 11, 'object-cover'),
	(89, '47208636-1498-4afc-9b5d-fe560aedfa91.jpeg', '!preview.jpg', 1, 'object-cover'),
	(91, '33e33231-b7f5-4ffb-909b-9371889b2cca.jpeg', '!preview.jpg', 1, 'object-cover'),
	(91, '30658bee-352e-467d-bee2-db82c6c67ee1.jpeg', '0005.jpg', 2, 'object-cover'),
	(91, '01aabae0-ed8c-40ec-8084-3cdbf9dccc8f.jpeg', '0007.jpg', 3, 'object-cover'),
	(91, '1a08dba2-b837-4e72-afca-4fd109f3365e.jpeg', '0003.jpg', 4, 'object-cover'),
	(91, '50d19318-8def-4599-8374-db62941ceba7.jpeg', '0011.jpg', 5, 'object-cover'),
	(91, 'c5b75275-89de-4bee-87bd-927dcff1c6bb.jpeg', '0000.jpg', 6, 'object-cover'),
	(91, 'fef71fd1-526d-4923-9a37-cc09a10359a2.jpeg', '0009.jpg', 7, 'object-cover'),
	(89, 'c1735e82-886a-43ab-a416-c03507324885.jpeg', '0025.jpg', 11, 'object-cover'),
	(89, '3049b052-c6fa-4a67-b024-b3e27615f8a3.jpeg', '0017.jpg', 12, 'object-cover'),
	(89, '000a792f-0fcd-4c22-981e-68a2c546dcf5.jpeg', '0019.jpg', 13, 'object-cover'),
	(89, '95afdb0c-8627-4864-a026-5e20849e2e12.jpeg', '0021.jpg', 8, 'object-cover'),
	(89, 'e2cf7f66-5620-46a9-9694-0b56c2147cb9.jpeg', '0015.jpg', 9, 'object-cover'),
	(89, 'd5109816-e8f2-4ba9-b5bf-c186df950de2.jpeg', '0023.jpg', 10, 'object-cover'),
	(89, 'be023bee-abc8-4785-a348-6bdfb3b41e94.jpeg', '0011.jpg', 6, 'object-cover'),
	(89, 'dfb730be-72f5-4ed3-b1a4-3e4a757fa04f.jpeg', '0013.jpg', 7, 'object-cover'),
	(92, 'fd556e78-4b3f-451a-ad7f-2255b21a2c99.jpeg', '0013.jpg', 7, 'object-cover'),
	(92, '88dfbea5-4796-4609-8ab4-4a4843d2a4df.jpeg', '0011.jpg', 8, 'object-cover'),
	(89, 'c3c85e4d-0167-42bb-bd6c-551c93eaeb2e.jpeg', '0003.jpg', 2, 'object-cover'),
	(89, '0abab9f6-99df-4faa-b06d-30a625fe6439.jpeg', '0007.jpg', 4, 'object-cover'),
	(89, '0dbb64c8-4b87-47b8-bea1-69664c07943a.jpeg', '0009.jpg', 5, 'object-cover'),
	(89, 'a0a633a3-ada4-471d-8cf8-654bfe7cd79c.jpeg', '0005.jpg', 3, 'object-cover'),
	(90, '396c7806-812b-43c3-855d-194b9f0f928e.jpeg', '0003.jpg', 1, 'object-cover'),
	(52, '6ead8c9f-9acb-44af-a33a-06f0dee12904.jpeg', '0005.jpg', 8, 'object-cover'),
	(77, '4fc4dcf2-7876-4caf-bc99-82b1ea418569.jpeg', '0000.jpg', 1, 'object-cover'),
	(77, '5d85cf28-f05f-4eb6-bcc3-b43c0c5699e3.jpeg', '0009.jpg', 4, 'object-cover'),
	(78, '022773cd-b7a8-4a7f-a670-c75658eb5fc7.jpeg', '0000.jpg', 2, 'object-cover'),
	(78, '3a1edb14-5a79-4c2b-b6f5-ae559a1fb5f1.jpeg', '0035.jpg', 6, 'object-cover'),
	(78, 'd57a1cb6-a8aa-4b75-833a-48954084ac4c.jpeg', '0031.jpg', 7, 'object-cover'),
	(76, 'd2c604b9-555a-49ff-a817-9b6766e65f37.jpeg', '0000.jpg', 2, 'object-cover'),
	(76, '42e084dc-ab3f-42d1-bc56-3f243c8cfc5f.jpeg', '!preview.jpg', 1, 'object-cover'),
	(99, '1252dc63-8658-4651-b650-132a42edbb50.jpeg', '0007.jpg', 4, 'object-cover'),
	(53, 'bafe70d5-898a-4e20-ad98-42d135713b97.jpeg', '!preview.jpg', 1, 'object-cover'),
	(82, 'f364efcc-a287-4617-a1d9-f2711fef8004.jpeg', '0001.jpg', 2, 'object-cover'),
	(54, 'bc6ba559-67c9-4bbf-b639-45cdf3643937.jpeg', '!preview.jpg', 1, 'object-cover'),
	(78, '5fd36b34-3cb9-44a7-873a-e5e5ba46a0c6.jpeg', '0025.jpg', 9, 'object-cover'),
	(57, '4d42aa31-ed4b-44af-9406-3c8f1818a5ff.jpeg', '!preview.jpg', 1, 'object-cover'),
	(78, 'f2ad34a4-c1cb-44ca-ad67-cb7b7714f104.jpeg', '0009.jpg', 10, 'object-cover'),
	(71, 'ef82969b-91c5-405b-9c1c-4f8760ca0638.jpeg', '!preview.jpg', 1, 'object-contain'),
	(59, '6221c4c5-4e69-4087-8963-846b2be84f99.jpeg', '!preview.jpg', 1, 'object-cover'),
	(60, 'ecf6032b-116c-4a80-8b55-e25f173422e7.jpeg', '!preview.jpg', 1, 'object-cover'),
	(78, 'e8120288-24a6-4655-8663-994b5b86815e.jpeg', '0011.jpg', 11, 'object-cover'),
	(62, '3d9d6852-bda8-45c7-b3c5-4ea6dcb892ce.jpeg', '!preview.jpg', 1, 'object-cover'),
	(52, '0bad67d1-2f8a-4dd2-82c5-c2b314307f55.jpeg', '0000.jpg', 2, 'object-contain'),
	(71, '4c9bef9e-fbf8-4d0e-9659-23466693e77f.jpeg', '!preview.jpg', 2, 'object-contain'),
	(71, '29776486-a4c7-40e3-81ca-d65267089a63.jpeg', '!preview.jpg', 3, 'object-contain'),
	(83, '45beb04d-78e8-4504-ba49-263a99801e94.jpeg', '0007.jpg', 5, 'object-cover'),
	(71, 'e2076797-7751-4deb-9284-a3d1b55c9d19.jpeg', '!preview.jpg', 4, 'object-contain'),
	(64, '8726b889-40fc-4f8a-8aa9-7d6798d89806.jpeg', '!preview.jpg', 1, 'object-cover'),
	(66, '02296bf1-ac21-4d27-86a6-157d88ecd730.jpeg', '!preview.jpg', 1, 'object-cover'),
	(67, '7d824f76-2661-46c5-b9d3-8e1dbf00ef62.jpeg', '!preview.jpg', 1, 'object-cover'),
	(76, '7fc2c29a-8b9c-42d6-b2a4-0c8ed837357c.jpeg', '0005.jpg', 4, 'object-cover'),
	(78, '3f149e55-0e77-4c73-a16a-9f2c2b2ce269.jpeg', '0017.jpg', 14, 'object-cover'),
	(78, '9f1de95e-6433-49b8-8830-706866e72e41.jpeg', '0015.jpg', 16, 'object-cover'),
	(78, 'f5e45a01-673d-44b3-89b1-b143c276929e.jpeg', '0019.jpg', 19, 'object-cover'),
	(76, 'ae78e6ef-cfc0-4f3f-9573-3ed832ac76f6.jpeg', '0013.jpg', 6, 'object-cover'),
	(76, 'cbacf947-9449-45a3-be30-7cbca64fc1e8.jpeg', '0007.jpg', 5, 'object-cover'),
	(82, 'dc6c25d9-0bb2-4b96-ba6b-6917be08a0e5.jpeg', '0003.jpg', 3, 'object-cover'),
	(82, '115951bb-5c62-43ff-9988-5152c226caf9.jpeg', '0009.jpg', 6, 'object-cover'),
	(99, 'b8b96919-a939-4dc0-8f93-c86684e00b45.jpeg', '0009.jpg', 5, 'object-cover'),
	(79, '6b573b2c-ac08-4daa-b826-3f4f167561f3.jpeg', '!preview.jpg', 1, 'object-cover'),
	(79, '9fcd0ef0-2352-4f99-ad0f-a0e11fa5e1f0.jpeg', '0005.jpg', 3, 'object-cover'),
	(80, '5525ce4b-9790-43a4-b9ef-36eca04e84fe.jpeg', '!preview.jpg', 1, 'object-cover'),
	(83, '154806e6-0b8f-480c-b9d1-5bccf5b43353.jpeg', '0001.jpg', 2, 'object-cover'),
	(99, '587dfb63-d209-4498-9a76-c6be0c04768e.jpeg', '0013.jpg', 7, 'object-cover'),
	(83, 'ab028537-08ba-4580-b380-36d09681c73e.jpeg', '0000.jpg', 4, 'object-cover'),
	(80, '8b16b717-02ec-4393-ba1b-c08b2a673c05.jpeg', '0005.jpg', 3, 'object-cover'),
	(80, 'a5b13457-f769-420a-88ae-ed0a09857982.jpeg', '0000.jpg', 4, 'object-cover'),
	(80, '86ff9858-556b-4770-8dcb-d40ab7e8d69b.jpeg', '0009.jpg', 5, 'object-cover'),
	(83, '0106c60e-1301-44e7-a785-355a55488080.jpeg', '0010.jpg', 7, 'object-cover'),
	(80, 'e46b499e-1e4a-4cb3-a738-55e120d99ed8.jpeg', '0017.jpg', 9, 'object-cover'),
	(80, '1e6f4b7c-ede7-46e0-97b1-0760c2022fde.jpeg', '0023.jpg', 12, 'object-cover'),
	(83, '8a2c60fe-f9e1-435b-8474-fcc7dff29e0f.jpeg', '0013.jpg', 8, 'object-cover'),
	(81, 'b9979a2e-8249-4eef-81b9-2d5318fa4695.jpeg', '!preview.jpg', 1, 'object-cover'),
	(83, 'b4a83652-e1e5-4b88-b081-598a7fbf1ef7.jpeg', '0015.jpg', 11, 'object-cover'),
	(81, '0c33efb0-72b5-4f55-93e2-4246b4ae4bf8.jpeg', '0002.jpg', 3, 'object-cover'),
	(87, '3c01398c-f8fd-43b5-95fa-27289e5287fe.jpeg', '0005.jpg', 3, 'object-cover'),
	(81, '0fc3bba2-b966-427f-8ad4-31db8dba78e4.jpeg', '0003.jpg', 5, 'object-cover'),
	(81, '05c9a593-2d5e-444a-ba1b-29a18b058903.jpeg', '0005.jpg', 6, 'object-cover'),
	(81, '08cbd2d6-d7d8-4b2c-a2e7-144fc7d8fb11.jpeg', '0007.jpg', 8, 'object-cover'),
	(84, 'd4176303-4bbd-419f-ada3-b788cbbb13bc.jpeg', '0003.jpg', 3, 'object-cover'),
	(84, '531feb82-bf3a-4238-a27e-61f7f21ecc17.jpeg', '0009.jpg', 5, 'object-cover'),
	(81, '35b8956a-385f-4630-838e-03e89d11e3a2.jpeg', '0009.jpg', 12, 'object-cover'),
	(73, 'f2ca0966-37d2-4e76-9435-c23eb2ff9de8.jpeg', '!preview.jpg', 2, 'object-contain'),
	(73, '03eb7ce4-107d-421d-8a15-dbe762204ecf.jpeg', '!preview.jpg', 3, 'object-contain'),
	(73, '76eb7c0d-5d03-4345-8493-752d3cbaa05b.jpeg', '!preview.jpg', 4, 'object-contain'),
	(73, 'dbd43e73-b4d6-4685-8e4d-9917337005cd.jpeg', '!preview.jpg', 5, 'object-contain'),
	(73, 'c86d7959-09dc-4454-80a9-c96c5227da38.jpeg', '!preview.jpg', 6, 'object-contain'),
	(81, '39c56d36-12b2-4c25-aadb-6d6353169a27.jpeg', 'photo_6_2024-06-14_13-57-06.jpg', 25, 'object-cover'),
	(68, '4e3ab5a3-fd05-4114-b013-c3f17445cd34.jpeg', '╨д╤С╨┤╨╛╤А ╤И╨░╨╗╤П╨┐╨╕╨╜', 1, 'object-contain'),
	(68, 'f7271c45-a5b3-4878-b940-6a925ae724d0.jpeg', '╨д╤С╨┤╨╛╤А ╤И╨░╨╗╤П╨┐╨╕╨╜', 2, 'object-contain'),
	(90, '3724cea6-bd89-4c04-9bd8-7e6e47cee153.jpeg', '0005.jpg', 2, 'object-cover'),
	(90, 'c3d59036-086e-45ed-b824-2de865e78605.jpeg', '0009.jpg', 3, 'object-cover'),
	(92, '064b06a3-3db1-48f1-95a7-ec3f660b0b01.jpeg', '0023.jpg', 9, 'object-cover'),
	(92, '64924373-3562-4a03-bd85-b72affb66813.jpeg', '0027.jpg', 10, 'object-cover'),
	(92, 'e1e5e254-091e-4dc8-925a-07d19842c2ef.jpeg', '0017.jpg', 11, 'object-cover'),
	(92, '69f8cec9-252e-4fed-b87a-8b3906f54a26.jpeg', '0025.jpg', 12, 'object-cover'),
	(92, '3a10ee5b-383d-4861-a806-27735f6e9b4c.jpeg', '!preview.jpg', 1, 'object-cover'),
	(92, '2da9ef46-4665-495e-8726-943ea6b6fd09.jpeg', '0005.jpg', 3, 'object-cover'),
	(92, '2aab5615-255d-41b6-850f-2b949703c2ce.jpeg', '0009.jpg', 4, 'object-cover'),
	(92, '10f6052d-243b-4499-adfe-c9fc156ea504.jpeg', '0007.jpg', 5, 'object-cover'),
	(92, 'ce71bd11-002b-435d-b8f2-1cb7c19f2194.jpeg', '0000.jpg', 2, 'object-cover'),
	(92, 'e2d76dfa-8765-4cd9-b317-0e331343e686.jpeg', '0029.jpg', 13, 'object-cover'),
	(92, 'da64715a-c4bc-4102-880a-3a28e886038e.jpeg', '0019.jpg', 14, 'object-cover'),
	(92, 'a851090a-8c8a-46a9-8e14-7aad16406815.jpeg', '9999.jpg', 15, 'object-cover'),
	(93, '8bc465e3-1e76-4fa2-9cb4-b219121cf6f0.jpeg', '0005.jpg', 3, 'object-cover'),
	(93, '9c8cec96-77b3-4607-9efb-9d45f61627d8.jpeg', '0003.jpg', 2, 'object-cover'),
	(93, 'ad275699-575a-41b2-bda0-98b32371ade5.jpeg', '!preview.jpg', 1, 'object-cover'),
	(94, '546a3d72-4c76-4a05-93e2-a1494b0df522.jpeg', '0005.jpg', 5, 'object-cover'),
	(94, 'c41fb22c-1d07-46cd-9669-ce5cfc801fc3.jpeg', '0009.jpg', 6, 'object-cover'),
	(94, '75239d66-de3c-4a3b-aaba-b2a19358b281.jpeg', '0011.jpg', 7, 'object-cover'),
	(94, '6eccbaef-874f-4713-9be0-acaa7ec4b542.jpeg', '0015.jpg', 8, 'object-cover'),
	(94, '144a0770-a9ac-4f3c-905b-bdcc7e60ee29.jpeg', '0019.jpg', 9, 'object-cover'),
	(94, '46f2ccf5-0b3b-43ec-92ed-969edc168128.jpeg', '!preview.jpg', 1, 'object-cover'),
	(94, 'ed3298eb-7f13-47cc-a9d6-230714f4a873.jpeg', '0003.jpg', 3, 'object-cover'),
	(94, '6f494e10-dd9d-4c16-8ba4-28bf86dc1035.jpeg', '0000.jpg', 2, 'object-cover'),
	(94, 'f6b75b1c-ba48-4922-95be-b58d9d1f0000.jpeg', '0013.jpg', 12, 'object-cover'),
	(94, 'f41c5ce5-06ea-4695-ad48-cd573feb5546.jpeg', '0017.jpg', 11, 'object-cover'),
	(77, '15c91981-92a3-4133-9796-84b2913c3bb6.jpeg', '0007.jpg', 3, 'object-cover'),
	(95, '6adfe63f-c726-4fdf-9728-13b975ab8290.jpeg', '!preview.jpg', 1, 'object-cover'),
	(95, 'a067e9c0-4347-439a-8976-c139ef448b27.jpeg', '0013.jpg', 8, 'object-cover'),
	(96, 'bedb1753-45ca-42f8-960f-bd52a89408fa.jpeg', '!preview.jpg', 1, 'object-cover'),
	(97, 'efd475c2-b233-4d66-b3d5-dc92fb428bc3.jpeg', '0003.jpg', 1, 'object-cover'),
	(97, '51101466-7526-412e-b349-f6a24ecca72e.jpeg', '0005.jpg', 4, 'object-cover'),
	(97, '24a1a69f-eb92-4dca-a93e-437dca3617af.jpeg', '0015.jpg', 7, 'object-cover'),
	(97, 'fc3f836f-2c4a-4bb6-858d-b67818a734e3.jpeg', '0025.jpg', 13, 'object-cover'),
	(97, '3f56d746-fa13-4c68-be3b-469406163872.jpeg', '0013.jpg', 8, 'object-cover'),
	(98, '25079220-a47e-4c2c-821c-197cd787a8c0.jpeg', '0000.jpg', 2, 'object-cover'),
	(94, '68c20020-98db-4a84-a215-c8820f1a6923.jpeg', '9998.jpg', 13, 'object-cover'),
	(95, 'd6e8495d-7f52-42c7-a551-fac9c830a305.jpeg', '0021.jpg', 11, 'object-cover'),
	(95, '32311d12-a4e7-44a5-813e-dd443c6dd051.jpeg', '0025.jpg', 12, 'object-cover'),
	(95, 'b94d8240-743d-4e05-99b3-40264f5f1327.jpeg', '0023.jpg', 13, 'object-cover'),
	(96, '16fb2974-3625-4a93-a366-7363bc3412f3.jpeg', '0003.jpg', 4, 'object-cover'),
	(97, '0b40f120-7a1f-43ab-83ab-7871863cf461.jpeg', '0011.jpg', 3, 'object-cover'),
	(97, '0a9ae972-d6ed-472c-9569-6a620c23dc89.jpeg', '0027.jpg', 14, 'object-cover'),
	(97, 'd077df23-c3f7-485d-9aa5-a45bbfc7d455.jpeg', '0019.jpg', 10, 'object-cover'),
	(97, '94328eff-f6ea-4b56-afce-5dee29086ea3.jpeg', '0017.jpg', 9, 'object-cover'),
	(98, 'b9bcfda4-c63d-4be0-8b5e-4cca0db2394c.jpeg', '0005.jpg', 5, 'object-cover');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "username", "password_hash") VALUES
	(3, 'admin', '$argon2id$v=19$m=19456,t=2,p=1$WgTgSblqJg3Q9A4ikDNCAw$yGxwY3y0J9DDJDbgqUQcirTNrES9eaduS6rrW7tc3z8');


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."sessions" ("id", "user_id", "expires_at") VALUES
	('2xfb7j6zu5gzq63pdp5bpyop3icnll2mjzv253lp', 3, '2024-07-09 18:52:41.135+00'),
	('ozysrmf74nhjwo7bxl3n3x6feggh2sf3wovyb4ri', 3, '2024-07-13 12:52:51.274+00'),
	('vgnqc7fdudpqspn4obwum4lhpmtxr7cn2losof6o', 3, '2024-07-14 08:00:32.517+00'),
	('ncsxam4l7p5spsca7wjjgs5kkgws44e5wfwbdlet', 3, '2024-07-17 07:05:47.1+00'),
	('r5x2nr37y7pfwvewebomgt5mpfbabjb7fsaivd2w', 3, '2024-07-17 07:06:40.014+00'),
	('fmkk62ueh7aknyrnswe6afwe4oi3ls5gm2rv3q7i', 3, '2024-07-17 07:09:08.443+00'),
	('qeongzxe6usqgslxmp42lb2qelwn634s2ibg6pw4', 3, '2024-07-31 08:47:34.883+00'),
	('d3o6hlzqqdl53nn5bdvb3chplllrim27yosvefap', 3, '2024-08-01 12:33:11.336+00'),
	('k47t2hke34jqfkswpsc2c7vkbkknl3ktl2q6alko', 3, '2024-08-15 11:43:49.113+00');



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
--
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: postgres
--

SELECT pg_catalog.setval('"drizzle"."__drizzle_migrations_id_seq"', 7, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."categories_id_seq"', 79, true);


--
-- Name: groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."groups_id_seq"', 81, true);


--
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."images_id_seq"', 222, true);


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."projects_id_seq"', 102, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."users_id_seq"', 3, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
