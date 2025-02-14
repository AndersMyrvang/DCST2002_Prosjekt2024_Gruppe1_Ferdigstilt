-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: mysql.stud.ntnu.no
-- Generation Time: 19. Nov, 2024 18:35 PM
-- Tjener-versjon: 8.0.40-0ubuntu0.22.04.1
-- PHP Version: 7.4.3-4ubuntu2.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ivarriv_Dummy`
--

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Comments`
--

CREATE TABLE `Comments` (
  `comment_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `comment_type` varchar(255) DEFAULT NULL,
  `Page_id` int NOT NULL,
  `likes` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Comments`
--

INSERT INTO `Comments` (`comment_id`, `user_id`, `content`, `created_at`, `comment_type`, `Page_id`, `likes`) VALUES
(2, 14, 'Hei på deg', '2024-02-02 11:30:00', 'player', 1, 0),
(44, 12, 'Nydelig liga!!', '2024-11-11 08:16:36', NULL, 5, 0),
(45, 12, 'Test', '2024-11-11 08:17:17', NULL, 5, 0),
(52, 18, 'Bingo!', '2024-11-11 10:35:58', NULL, 21, 0),
(60, 13, 'THE GOAT', '2024-11-11 13:33:28', NULL, 40, 0),
(61, 13, 'OLJEKLUBB', '2024-11-11 13:34:39', NULL, 11, 0),
(63, 13, 'Turbo timo', '2024-11-11 13:56:05', NULL, 25, 0),
(69, 13, 'Halla ivaren', '2024-11-11 20:09:06', NULL, 45, 0),
(71, 15, 'Godagen', '2024-11-12 09:04:10', NULL, 32, 0),
(72, 14, 'hei', '2024-11-12 10:44:22', NULL, 189, 0),
(73, 14, 'hei eg e Kaspår', '2024-11-12 10:52:54', NULL, 45, 0),
(75, 15, 'Godagen', '2024-11-12 10:53:37', NULL, 45, 0),
(76, 15, 'Hei på du', '2024-11-13 11:09:22', NULL, 12, 0),
(79, 13, 'Kasper!!!', '2024-11-14 10:34:39', NULL, 110, 0),
(81, 15, 'teste', '2024-11-14 12:47:55', NULL, 45, 0),
(84, 13, 'Hei', '2024-11-16 14:14:29', NULL, 1, 0),
(85, 13, 'halla', '2024-11-16 17:37:57', NULL, 45, 0),
(88, 14, 'Beste laget ifølge Thomas', '2024-11-17 20:37:58', NULL, 187, 0),
(89, 14, 'hei', '2024-11-18 11:00:29', NULL, 1, 0),
(91, 13, 'Dette var et hyggelig kommentarfelt!', '2024-11-18 15:27:32', NULL, 45, 0),
(95, 13, 'Hei', '2024-11-18 22:21:51', NULL, 1, 0),
(96, 13, 'Den beste!', '2024-11-18 22:24:54', NULL, 36, 0),
(101, 13, 'De som leser denne kommentaren får god Karma!', '2024-11-19 15:50:50', NULL, 40, 0),
(103, 15, 'Elsker han spilleren!', '2024-11-19 17:07:27', NULL, 36, 0),
(104, 13, 'ELLEN ER EN TIDSVANDRER', '2024-11-19 17:33:47', NULL, 232, 0);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Countries`
--

CREATE TABLE `Countries` (
  `name` varchar(100) NOT NULL,
  `flag_image_url` varchar(255) DEFAULT NULL,
  `country_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Countries`
--

INSERT INTO `Countries` (`name`, `flag_image_url`, `country_id`) VALUES
('Denmark', 'https://flagcdn.com/16x12/dk.png', 1),
('Finland', 'https://flagcdn.com/16x12/fi.png', 2),
('France', 'https://flagcdn.com/16x12/fr.png', 3),
('Germany', 'https://flagcdn.com/16x12/de.png', 4),
('Iceland', 'https://flagcdn.com/16x12/is.png', 5),
('Italy', 'https://flagcdn.com/16x12/it.png', 6),
('Netherlands', 'https://flagcdn.com/16x12/nl.png', 7),
('Norway', 'https://flagcdn.com/16x12/no.png', 8),
('Spain', 'https://flagcdn.com/16x12/es.png', 9),
('Sweden', 'https://flagcdn.com/16x12/se.png', 10);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Leagues`
--

CREATE TABLE `Leagues` (
  `name` varchar(100) NOT NULL,
  `emblem_image_url` varchar(255) DEFAULT NULL,
  `id` int NOT NULL,
  `country` int NOT NULL DEFAULT '1',
  `content` varchar(8000) DEFAULT NULL,
  `page_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Leagues`
--

INSERT INTO `Leagues` (`name`, `emblem_image_url`, `id`, `country`, `content`, `page_id`) VALUES
('Allsvenskan', 'https://static.cdnlogo.com/logos/s/69/sweall-2.svg', 1, 10, '<div class=\"flex-shrink-0 flex flex-col relative items-end\">\n<div>\n<div class=\"pt-0\">\n<div class=\"gizmo-bot-avatar flex h-8 w-8 items-center justify-center overflow-hidden rounded-full\">&nbsp;</div>\n</div>\n</div>\n</div>\n<div class=\"group/conversation-turn relative flex w-full min-w-0 flex-col agent-turn\">\n<div class=\"flex-col gap-1 md:gap-3\">\n<div class=\"flex max-w-full flex-col flex-grow\">\n<div class=\"min-h-8 text-message flex w-full flex-col items-end gap-2 whitespace-normal break-words [.text-message+&amp;]:mt-5\" dir=\"auto\" data-message-author-role=\"assistant\" data-message-id=\"abd56308-6bd3-4f57-8329-d6475cb92688\" data-message-model-slug=\"gpt-4o\">\n<div class=\"flex w-full flex-col gap-1 empty:hidden first:pt-[3px]\">\n<div class=\"markdown prose w-full break-words dark:prose-invert dark\">\n<p>&nbsp;</p>\n<p><strong>Allsvenskan</strong> er den &oslash;verste divisjonen i svensk herrefotball og regnes som Sveriges mest prestisjefylte fotballiga. Den ble grunnlagt i 1924 og har siden v&aelig;rt den fremste arenaen for Sveriges beste fotballklubber i kampen om det nasjonale mesterskapet. Allsvenskan organiseres av Svenska Fotbollf&ouml;rbundet og f&oslash;lger et seriesystem der de beste lagene kvalifiserer seg til europeiske turneringer, mens de d&aring;rligste risikerer nedrykk til Superettan, Sveriges nest h&oslash;yeste divisjon.</p>\n<h3><strong>Format</strong></h3>\n<p>Allsvenskan best&aring;r av 16 lag som spiller mot hverandre to ganger i l&oslash;pet av sesongen, &eacute;n kamp hjemme og &eacute;n kamp borte, noe som utgj&oslash;r totalt 30 serierunder. Ligaen spilles innenfor kalender&aring;ret, vanligvis fra april til november, p&aring; grunn av klimaet i Sverige.</p>\n<ul>\n<li><strong>Poengsystem</strong>: Seier gir 3 poeng, uavgjort gir 1 poeng, og tap gir 0 poeng.</li>\n<li><strong>Plasseringer</strong>: Laget med flest poeng etter endt sesong blir seriemester, mens de to nederste lagene rykker direkte ned til Superettan. Laget som ender p&aring; 14. plass spiller kvalifisering mot tredjeplassen fra Superettan.</li>\n</ul>\n<h3><strong>Historie og statistikk</strong></h3>\n<ul>\n<li>F&oslash;rste sesong: 1924/1925</li>\n<li>Mestvinnende klubb: Malm&ouml; FF (flest titler)</li>\n<li>St&oslash;rste rivaliseringer: AIK&ndash;Djurg&aring;rden, Malm&ouml; FF&ndash;IFK G&ouml;teborg, og Hammarby&ndash;Djurg&aring;rden</li>\n<li>Rekordtilskuertall: 52 194 (HIF&ndash;Malm&ouml; FF, 1959, p&aring; Olympia, Helsingborg)</li>\n</ul>\n<h3><strong>Deltakelse i europeisk fotball</strong></h3>\n<p>Det laget som vinner Allsvenskan f&aring;r plass i kvalifiseringen til UEFA Champions League. Lagene som ender p&aring; 2. og 3. plass, samt vinneren av Svenska Cupen, kvalifiserer seg til kvalifiseringen for UEFA Europa Conference League.</p>\n<h3><strong>Popul&aelig;re klubber i Allsvenskan</strong></h3>\n<ul>\n<li><strong>Malm&ouml; FF</strong>: Liganes mestvinnende klubb og kjent for sine prestasjoner i Europa.</li>\n<li><strong>AIK</strong>: Tradisjonsrik klubb fra Stockholm med stor tilhengerskare.</li>\n<li><strong>IFK G&ouml;teborg</strong>: Ogs&aring; kjent som \"Bl&aring;vitt\", har vunnet UEFA-cupen to ganger (1982 og 1987).</li>\n<li><strong>Hammarby IF</strong>: Kjent for sin lidenskapelige supporterkultur.</li>\n</ul>\n<h3><strong>Betydning</strong></h3>\n<p>Allsvenskan har en viktig rolle i svensk idrettskultur og trekker stor interesse b&aring;de nasjonalt og internasjonalt. Ligaen er kjent for sine entusiastiske fans, intense derbykamper og sitt bidrag til utviklingen av svenske fotballtalenter.</p>\n</div>\n</div>\n</div>\n</div>\n</div>\n</div>', 232),
('Bundesliga', 'https://static.cdnlogo.com/logos/b/74/bundesliga.svg', 2, 4, '<p>Bundesliga, grunnlagt i 1963, er den &oslash;verste divisjonen i tysk fotball, med 18 lag. Den er kjent for sine h&oslash;ytscorende kamper og fan kultur, med noen av de h&oslash;yeste gjennomsnittlige tilskuerne i verden. Bundesligaen opererer med et system for opprykk og nedrykk med 2. Bundesliga. Klubber som Bayern M&uuml;nchen og Borussia Dortmund har en rik historie, der Bayern er den mest suksessrike klubben i tysk fotball. Ligaen har produsert mange verdensklasse spillere, og klubbene konkurrerer jevnlig i europeiske turneringer. Bundesligaen er ogs&aring; kjent for sitt fokus p&aring; ungdomsutvikling og &oslash;konomisk b&aelig;rekraft, med en unik 50+1-eierregel som holder klubbene fanstyrte. Hver sesong avsluttes med DFB-Pokal, en prestisjetung cupturnering. Ligaens offensive stil og taktiske innovasjoner har p&aring;virket fotball <strong>globalt.</strong></p>', 2),
('Danish Superliga', 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Superliga_2010.svg', 3, 1, 'Danish Superliga, etablert i 1991, er den øverste fotballigaen i Danmark, med 12 lag. Ligaen er kjent for sin konkurransedyktige balanse, der flere lag kan kjempe om tittelen hver sesong. Den opererer med et system for opprykk og nedrykk med 1. divisjon. FC København og Brøndby IF er to av de mest suksessrike og populære klubbene i ligaen, med en intens rivalisering kjent som \"New Firm.\" Superligaen spilles vanligvis fra juli til mai, med et splittformat etter den ordinære sesongen, der de beste lagene konkurrerer om mesterskapet, mens andre kjemper for å unngå nedrykk. Ligaen har fått anerkjennelse for å utvikle unge talenter, som ofte fører til at spillere flytter til større europeiske klubber. Den danske fotballkulturen kjennetegnes av lidenskapelige fans og et sterkt lokalsamfunn.', 3),
('Eliteserien', 'https://media.snl.no/media/158502/standard_eliteserien-brand.png', 4, 8, '<p>Eliteserien er den &oslash;verste fotballigaen i Norge, etablert i 1937. Ligaen best&aring;r av 16 lag som konkurrerer om tittelen fra april til desember. Eliteserien er kjent for sitt varierte niv&aring; av spillere og har fostret mange talenter som har n&aring;dd internasjonalt niv&aring;. De mest suksessrike klubbene inkluderer Rosenborg, som dominerte ligaen p&aring; 1990-tallet og tidlig 2000-tall. Ligaen er strukturert med opprykk og nedrykk til OBOS-ligaen, noe som gir muligheter for klubber i lavere divisjoner. Eliteserien har ogs&aring; et sterkt fokus p&aring; ungdomsutvikling, og mange klubber har akademier som utvikler lokale talenter. Atmosf&aelig;ren i ligaen er preget av engasjerte supportere, og rivaliseringene mellom lagene bidrar til spennende kamper. Hver sesong kulminerer i NM (Norgesmesterskapet), en tradisjonell cupturnering.<br><br></p>', 4),
('La Liga', 'https://static.cdnlogo.com/logos/l/23/laliga.svg', 5, 9, '<p>La Liga, offisielt kjent som Primera Divisi&oacute;n, er den &oslash;verste fotballdivisjonen i Spania, grunnlagt i 1929. Ligaen best&aring;r av 20 lag som konkurrerer fra august til mai. La Liga er kjent for sitt h&oslash;ye niv&aring; av spill og har fostret mange av verdens beste spillere, inkludert Lionel Messi og Cristiano Ronaldo. FC Barcelona og Real Madrid er de mest suksessrike klubbene og har en av de mest intense rivaliseringene i sportens historie, kjent som \"El Cl&aacute;sico.\" Ligaen har ogs&aring; en struktur for opprykk og nedrykk med Segunda Divisi&oacute;n. La Liga har et globalt publikum, og kampene sendes til millioner av seere over hele verden. Spansk fotball er kjent for sin tekniske spillestil, som har hatt stor innflytelse p&aring; internasjonal fotball. Hver sesong k&aring;rer ligaen en mester, og det er ogs&aring; prestisjefylte individuelle utmerkelser for spillerne.&nbsp;</p>', 5),
('Ligue 1', 'https://static.cdnlogo.com/logos/l/37/ligue-1.png', 6, 3, 'Ligue 1, etablert i 1933, er den øverste fotballdivisjonen i Frankrike, med 20 klubber. Ligaen er kjent for sin konkurransedyktighet og har nylig fått økt oppmerksomhet på grunn av Paris Saint-Germain (PSG), som har dominert ligaen etter oppkjøpet av Qatar Sports Investments i 2011. Ligaen opererer med et system for opprykk og nedrykk med Ligue 2. Historisk har klubber som Marseille og Saint-Étienne hatt stor suksess i Ligue 1. Ligaen er også kjent for å utvikle unge talenter, med mange spillere som har gjort seg bemerket på den internasjonale scenen. Fransk fotball har en rik kultur og historie, med mange intense rivaliseringer, spesielt mellom Marseille og PSG. Hvert år konkurrerer lagene også om Coupe de France, en av de eldste cupturneringene i verden.', 6),
('Úrvalsdeild', 'https://upload.wikimedia.org/wikipedia/tr/thumb/c/c5/Landsbankadeild.jpg/200px-Landsbankadeild.jpg', 7, 5, 'Úrvalsdeild, også kjent som Pepsi deildin av sponsorårsaker, er den øverste fotballdivisjonen i Island, etablert i 1912. Ligaen består av 12 lag som konkurrerer fra mai til september. Úrvalsdeild har en kortere sesong enn de fleste europeiske ligaer, noe som skyldes Islands kalde klima. Den mest suksessrike klubben i ligaens historie er KR Reykjavík, som har vunnet mesterskapet mange ganger. Ligaen har et system for opprykk og nedrykk med 1. deild. Úrvalsdeild har blitt mer kjent internasjonalt etter at islandsk fotball fikk oppmerksomhet under EM i 2016, der landslaget nådde kvartfinalen. Ligaen er kjent for sitt fokus på ungdomsutvikling og har mange talenter som har spilt i europeiske ligaer. Kampene har en unik atmosfære, med dedikerte fans og høy grad av engasjement fra lokalsamfunnene.', 7),
('Veikkausliiga', 'https://static.cdnlogo.com/logos/f/38/finland-veikkausliiga.svg', 8, 2, 'Veikkausliiga er den øverste fotballigaen i Finland, etablert i 1990. Ligaen består av 12 klubber som konkurrerer om tittelen fra april til oktober. Veikkausliiga er kjent for å være konkurransedyktig, med flere lag som kan utfordre for mesterskapet hvert år. De mest suksessrike klubbene inkluderer HJK Helsinki, som har vunnet ligaen flere ganger. Ligaen har et system for opprykk og nedrykk med Ykkönen, den nest øverste divisjonen. Finlands fotballkultur er preget av engasjerte supportere, selv om ligaen har færre tilskuere sammenlignet med mange andre europeiske ligaer. Veikkausliiga har et fokus på utvikling av unge spillere og har fått flere talenter til å spille i større ligaer i Europa. Den finske cupen, Suomen Cup, gir også en ekstra konkurransearena for klubbene i ligaen.', 8),
('Test League', 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg', 27, 8, '<p>This is a test league</p>', 188);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Pages`
--

CREATE TABLE `Pages` (
  `Page_id` int NOT NULL,
  `Created_by` int NOT NULL,
  `view_count` int DEFAULT '0',
  `revision_count` int DEFAULT '0',
  `Created_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Pages`
--

INSERT INTO `Pages` (`Page_id`, `Created_by`, `view_count`, `revision_count`, `Created_at`) VALUES
(1, 13, 269, 0, '2024-10-01'),
(2, 2, 74, 0, NULL),
(3, 2, 4, 0, NULL),
(4, 3, 18, 0, NULL),
(5, 1, 12, 0, NULL),
(6, 1, 4, 0, NULL),
(7, 1, 6, 0, NULL),
(8, 1, 1, 0, NULL),
(9, 1, 0, 0, NULL),
(10, 1, 6, 0, NULL),
(11, 1, 0, 0, NULL),
(12, 1, 4, 0, NULL),
(13, 1, 0, 0, NULL),
(14, 1, 0, 0, NULL),
(15, 1, 1, 0, NULL),
(16, 1, 5, 0, NULL),
(17, 1, 2, 0, NULL),
(19, 1, 10, 0, NULL),
(20, 1, 1, 0, NULL),
(21, 1, 39, 0, NULL),
(22, 1, 30, 0, NULL),
(23, 1, 42, 0, NULL),
(24, 1, 1, 0, NULL),
(25, 1, 3, 0, NULL),
(26, 1, 6, 0, NULL),
(27, 1, 0, 0, NULL),
(29, 1, 7, 0, NULL),
(30, 1, 4, 0, NULL),
(31, 1, 3, 0, NULL),
(32, 1, 72, 0, NULL),
(33, 1, 2, 0, NULL),
(34, 1, 5, 0, NULL),
(35, 1, 0, 0, NULL),
(36, 1, 13, 0, NULL),
(37, 1, 3, 0, NULL),
(38, 1, 2, 0, NULL),
(39, 1, 20, 0, NULL),
(40, 1, 68, 0, NULL),
(41, 1, 0, 0, NULL),
(42, 1, 6, 0, NULL),
(43, 1, 3, 0, NULL),
(44, 1, 5, 0, NULL),
(45, 1, 443, 0, NULL),
(110, 2, 120, 0, '2024-10-01'),
(111, 2, 0, 0, NULL),
(112, 1, 0, 0, NULL),
(113, 1, 0, 0, NULL),
(115, 1, 0, 0, NULL),
(116, 1, 0, 0, NULL),
(117, 1, 0, 0, NULL),
(118, 1, 0, 0, NULL),
(119, 1, 0, 0, NULL),
(120, 1, 0, 0, NULL),
(121, 1, 0, 0, NULL),
(122, 1, 0, 0, NULL),
(123, 1, 0, 0, NULL),
(124, 1, 0, 0, NULL),
(125, 1, 0, 0, NULL),
(127, 1, 0, 0, NULL),
(128, 1, 0, 0, NULL),
(130, 1, 0, 0, NULL),
(132, 1, 0, 0, NULL),
(133, 1, 0, 0, NULL),
(144, 1, 0, 0, NULL),
(146, 1, 100, 0, NULL),
(147, 2, 50, 0, NULL),
(148, 3, 200, 0, NULL),
(164, 1, 11, 0, NULL),
(166, 13, 5, 0, NULL),
(169, 13, 2, 0, '2024-11-11'),
(170, 13, 6, 0, '2024-11-11'),
(171, 13, 1, 0, '2024-11-11'),
(174, 13, 4, 0, '2024-11-12'),
(187, 14, 5, 0, '2024-11-12'),
(188, 14, 8, 0, '2024-11-12'),
(189, 14, 6, 0, '2024-11-12'),
(194, 1, 2, 0, '2024-11-15'),
(199, 18, 17, 0, '2024-11-18'),
(229, 15, 1, 0, '2024-11-19'),
(230, 15, 1, 0, '2024-11-19'),
(232, 18, 7, 0, '2026-02-11');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `PageTags`
--

CREATE TABLE `PageTags` (
  `page_id` int NOT NULL,
  `tag_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `PageTags`
--

INSERT INTO `PageTags` (`page_id`, `tag_id`) VALUES
(1, 5),
(24, 5),
(25, 5),
(26, 5),
(27, 5),
(29, 5),
(30, 5),
(31, 5),
(32, 5),
(33, 5),
(34, 5),
(36, 5),
(37, 5),
(38, 5),
(39, 5),
(40, 5),
(41, 5),
(42, 5),
(43, 5),
(44, 5),
(45, 5),
(110, 5),
(10, 8),
(11, 8),
(12, 8),
(13, 8),
(14, 8),
(15, 8),
(16, 8),
(17, 8),
(19, 8),
(20, 8),
(21, 8),
(22, 8),
(23, 8),
(2, 9),
(3, 9),
(4, 9),
(5, 9),
(6, 9),
(7, 9),
(8, 9),
(164, 9),
(166, 9),
(170, 9),
(174, 9);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Players`
--

CREATE TABLE `Players` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `picture_url` varchar(255) DEFAULT NULL,
  `team` int NOT NULL,
  `country` int NOT NULL DEFAULT '1',
  `content` varchar(8000) DEFAULT NULL,
  `page_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Players`
--

INSERT INTO `Players` (`id`, `name`, `birth_date`, `height`, `picture_url`, `team`, `country`, `content`, `page_id`) VALUES
(42, 'Kasper Hansen', '1997-10-01', '136.00', 'https://subjekt.no/content/uploads/2023/11/haLkUpgA-scaled.jpeg', 1, 1, '<p>Kasper Hansen. Han har spilt for flere klubber i Danmark og er kjent for sin p&aring;litelighet som keeper. Hansen begynte sin karriere i ungdomsakademiet til sin lokale klubb, f&oslash;r han debuterte for f&oslash;rstelaget i en alder av 18. Hans sterke refleksjer og evne til &aring; lese spillet har gjort ham til en viktig spiller for laget.</p>', 110),
(43, 'Alexander Sørloth', '1995-08-20', '194.00', 'https://www.lifeinnorway.net/wp-content/uploads/2024/06/alexander-sorloth-norway-footballer-image-768x432.jpg', 15, 8, '<p>Alexander S&oslash;rloth er en norsk fotballspiller som spiller som spiss for den spanske klubben Villarreal og det norske landslaget. Han startet sin profesjonelle karriere i Rosenborg, f&oslash;r han spilte for klubber som Groningen, Midtjylland, Crystal Palace, og Trabzonspor. Gjennombruddet kom spesielt i Trabzonspor, der han ble toppscorer i S&uuml;per Lig 2019/20-sesongen. S&oslash;rloth er kjent for sin fysiske styrke, h&oslash;yde (1,94 m) og avslutningsevne. Etter suksess i Tyrkia, ble han hentet til RB Leipzig, men hadde senere utl&aring;n til Real Sociedad. I 2023 signerte han for Villarreal. P&aring; landslaget debuterte han i 2016 og har bidratt som en viktig m&aring;lscorer for Norge. S&oslash;rloth er s&oslash;nn av tidligere landslagsspiller G&oslash;ran S&oslash;rloth.&nbsp;</p>', 45),
(44, 'Marcus Berg', '1986-08-16', '183.00', 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Marcus_Berg_2018.jpg', 9, 10, 'Marcus Berg. Den svenske spissen har hatt en lang karriere med flere klubber, kjent for sin målsans og erfaring på banen.', 44),
(45, 'Kasper Dolberg', '1997-10-05', '187.00', 'https://tmssl.akamaized.net//images/foto/galerie/kasper-dolberg-2024-denmark-1042853290h-1718200889-139416.jpg?lm=1718200912', 5, 1, 'Kasper Dolberg. Den danske angriperen, som har spilt for Ajax og Nice, er kjent for sine målferdigheter og tekniske evner.', 43),
(46, 'Jonas Wind', '1999-02-07', '190.00', 'https://upload.wikimedia.org/wikipedia/commons/2/24/Jonas_Older_Wind_Parken_18-04-2019_Dointsch.jpg', 5, 1, 'Jonas Wind. Den danske spissen har gjort seg bemerket i både ligaen og landslaget, kjent for sin fysiske tilstedeværelse og evne til å score mål.', 42),
(67, 'Martin Ødegaard', '1998-12-16', '178.00', 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Arsenal_v_Everton_%281%29_%28cropped%29.jpg/800px-Arsenal_v_Everton_%281%29_%28cropped%29.jpg', 4, 8, 'Martin Ødegaard. Den norske midtbanespilleren, nå kaptein for Arsenal, er kjent for sin tekniske dyktighet og evne til å styre spillet.', 41),
(68, 'Lionel Messi', '1987-06-18', '170.00', 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg', 2, 7, '<p>Lionel Messi. En av de st&oslash;rste fotballspillerne gjennom tidene, Messi er kjent for sin tekniske briljans og m&aring;lsyn. Han har tilbrakt mesteparten av sin karriere i Barcelona f&oslash;r han flyttet til PSG.&nbsp;</p>', 40),
(69, 'Erling Haaland', '2000-07-19', '194.00', 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/ManCity20240722-031_%28cropped%29.jpg/1200px-ManCity20240722-031_%28cropped%29.jpg', 13, 8, 'Erling Haaland. Den norske spissen har blitt en av de mest ettertraktede spillerne i verden, kjent for sin hastighet og evne til å score mål for både Dortmund og Manchester City.', 39),
(70, 'Robert Lewandowski', '1988-08-20', '185.00', 'https://www.fcbarcelona.com/photo-resources/2024/10/13/b666059e-1d0a-493f-a7e5-dd7a258d8165/09-Lewandowski-M.jpg?width=1200&height=750', 2, 4, 'Robert Lewandowski. Den polske spissen er kjent som en av verdens beste målscorere, med en imponerende karriere i Bayern München og nå Barcelona. Lewandowski er kjent for sin kliniske avslutning.', 38),
(71, 'Sergio Busquets', '1988-07-15', '189.00', 'https://upload.wikimedia.org/wikipedia/commons/7/71/Sergio_Busquets_2018_%28cropped%29.jpg', 2, 9, 'Sergio Busquets. Den spanske defensive midtbanespilleren har vært en sentral figur for Barcelona og det spanske landslaget, kjent for sin taktiske forståelse og posisjonering.', 37),
(72, 'Marco Reus', '1989-05-29', '180.00', 'https://upload.wikimedia.org/wikipedia/commons/c/cf/2023-08-12_TSV_Schott_Mainz_gegen_Borussia_Dortmund_%28DFB-Pokal_2023-24%29_by_Sandro_Halank%E2%80%93126.jpg', 4, 4, '<p>Marco Reus. Den tyske vingen har hatt en flott karriere med Borussia Dortmund, kjent for sin fart og evne til &aring; score m&aring;l fra kantene.</p>', 36),
(73, 'Kylian Mbappé', '1998-12-20', '178.00', 'https://pbs.twimg.com/media/GQiB1TsWMAAraHM.jpg:large', 14, 3, 'Kylian Mbappé. En fransk spiss kjent for sin fart og tekniske ferdigheter, Mbappé debuterte i Ligue 1 som tenåring og har siden blitt en av verdens beste spillere. Han er kjent for sin evne til å score mål og skape sjanser for laget.', 24),
(74, 'Victor Lindelöf', '1994-07-17', '187.00', 'https://upload.wikimedia.org/wikipedia/commons/c/c7/UEFA_EURO_qualifiers_Sweden_vs_Spain_20191015_Victor_Nilsson_Lindel%C3%B6f_2_%28cropped%29.jpg', 9, 10, 'Victor Lindelöf. Den svenske forsvarsspilleren har vært en viktig del av Manchester United. Lindelöf er kjent for sin styrke i dueller og evne til å lese spillet.', 34),
(75, 'Neymar Jr.', '1992-02-05', '175.00', 'https://dims.apnews.com/dims4/default/de89921/2147483647/strip/true/crop/4100x2891+0+0/resize/599x422!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2Fbe%2F29%2F60c0f44d1f32e90e6df23f2d3fd6%2F1a3ca0696b1f4f64aabbd95472dc5418', 14, 8, 'Neymar Jr. En brasiliansk angriper som er kjent for sin kreativitet og ferdigheter med ballen. Neymar har spilt for Barcelona og PSG, og han er en av de mest kjente spillerne i verden.', 33),
(76, 'Andrés Iniesta', '1984-05-05', '171.00', 'https://i.pinimg.com/236x/9c/33/fb/9c33fb1638eaa84e58f680154f3d0694.jpg', 2, 9, '<p>Andr&eacute;s Iniesta. Den spanske midtbanespilleren er kjent for sin tekniske briljans og evne til &aring; styre spillet. Iniesta har v&aelig;rt en del av flere storlag, inkludert FC Barcelona. Hei hei</p>', 32),
(77, 'Luka Modrić', '1985-09-09', '172.00', 'https://images2.minutemediacdn.com/image/upload/c_crop,w_3292,h_1851,x_617,y_242/c_fill,w_912,ar_16:9,f_auto,q_auto,g_auto/images/voltaxMediaLibrary/mmsport/si/01ja8g7vsyy718t4qq8r.jpg', 13, 5, 'Luka Modrić. Den kroatiske midtbanespilleren og Ballon d\'Or-vinneren, Modrić er kjent for sin tekniske ferdigheter og evne til å kontrollere midtbanen. Han har vært en sentral figur for Real Madrid.', 31),
(78, 'Thomas Müller', '1989-09-13', '186.00', 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Thomas_M%C3%BCller_2022_%28cropped%29.jpg', 3, 4, 'Thomas Müller. En tysk spiss som har spilt hele sin karriere i Bayern München. Müller er kjent for sin intelligente spillestil og evne til å score mål i viktige situasjoner.', 30),
(79, 'Joakim Mæhle', '1997-05-20', '185.00', 'https://asset.dr.dk/imagescaler/?protocol=https&server=www.dr.dk&file=%2Fimages%2Fcrop%2F2021%2F10%2F05%2F1633430024_scanpix-20210626-194943-7.jpg&scaleAfter=crop&quality=70&w=720&h=405', 6, 1, 'Joakim Mæhle. Den danske forsvarsspilleren er kjent for sin defensiv dyktighet og evne til å støtte angrepene. Han har vært en viktig del av det danske landslaget.', 29),
(81, 'Teemu Pukki', '1990-03-29', '180.00', 'https://uk1.sportal365images.com/process/smp-image-api/livescore.com/27062023/1e401426-fd56-417e-b04b-7fec0ba6fd45.jpg?operations=fit(707:)&w=707&quality=100', 8, 2, 'Teemu Pukki. Den finske spissen har vært en nøkkelspiller for Norwich City i Championship. Pukki er kjent for sin evne til å score mål og hans arbeidsetikk på banen.', 27),
(82, 'Henrikh Mkhitaryan', '1989-01-21', '178.00', 'https://e0.365dm.com/16/06/768x432/henrikh-mkhitaryan-mkhitaryan-man-utd-mkhitaryan-dortmund_3491085.jpg?20160627075722', 4, 4, 'Henrikh Mkhitaryan. Den armenske midtbanespilleren har spilt for flere toppklubber i Europa, inkludert Manchester United og Roma. Han er kjent for sin kreativitet og evne til å score fra midtbanen.', 26),
(84, 'Timo Werner', '1996-03-05', '180.00', 'https://i.ytimg.com/vi/P6n_YaYfGVA/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC4EfoJCO0-zVQhSpPW4MJ3AzEZwQ', 13, 4, '<p>Timo Werner. En tysk angriper som har spilt for b&aring;de RB Leipzig og Chelsea, Werner er kjent for sin hurtighet og evne til &aring; score m&aring;l. Han har v&aelig;rt en viktig del av det tyske landslaget.&nbsp;&nbsp;</p>', 25),
(122, 'Test Player', '2024-11-12', '1.00', 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg', 28, 8, '<p>Test player</p>', 189);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Revisions`
--

CREATE TABLE `Revisions` (
  `revision_id` int NOT NULL,
  `content` text NOT NULL,
  `revised_by` int NOT NULL,
  `revised_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `page_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Revisions`
--

INSERT INTO `Revisions` (`revision_id`, `content`, `revised_by`, `revised_at`, `page_id`) VALUES
(1, 'This is an introduction to Git. Git is a version control system...', 1, '2024-02-01 09:00:00', 1),
(2, 'This is an updated introduction to Git with more details...', 2, '2024-02-02 09:30:00', 2),
(3, 'Continuous Integration (CI) is a practice in software development...', 2, '2024-02-02 10:00:00', 3),
(4, 'Database design involves structuring your data for efficiency...', 3, '2024-02-03 11:00:00', 4),
(11, 'Git is essential for modern version control, enabling teams to collaborate effectively...', 2, '2024-02-07 09:00:00', 5),
(12, 'Branching in Git allows developers to work on multiple features simultaneously...', 1, '2024-02-07 10:00:00', 6),
(13, 'Docker is a platform for developing, shipping, and running applications inside containers...', 1, '2024-02-08 08:00:00', 7),
(14, 'Docker simplifies application deployment by packaging dependencies within containers...', 3, '2024-02-08 09:00:00', 9),
(15, 'Kubernetes is an open-source platform for automating deployment, scaling, and operations of application containers...', 3, '2024-02-09 07:30:00', 8),
(16, 'Kubernetes helps manage containerized applications across a cluster of machines, ensuring high availability and scalability...', 2, '2024-02-09 08:30:00', 10),
(17, 'This is content 1', 1, '2023-10-01 10:00:00', 1),
(18, 'This is content 2', 1, '2023-10-02 10:15:00', 1),
(19, 'This is content 3', 1, '2023-10-03 11:30:00', 1),
(20, 'This is content 4', 1, '2023-10-04 12:45:00', 1),
(21, 'This is content 5', 1, '2023-10-05 13:00:00', 1),
(22, 'This is content 6', 1, '2023-10-06 14:10:00', 1),
(23, 'This is content 7', 1, '2023-10-07 15:20:00', 1),
(24, 'This is content 8', 1, '2023-10-08 16:30:00', 1),
(25, 'This is content 9', 1, '2023-10-09 17:40:00', 1),
(26, 'This is content 10', 1, '2023-10-10 18:50:00', 1),
(27, 'This is content 11', 1, '2023-10-11 19:00:00', 1),
(28, 'This is content 12', 1, '2023-10-12 20:10:00', 1),
(29, 'This is content 13', 1, '2023-10-13 21:20:00', 1),
(30, 'This is content 14', 1, '2023-10-14 06:00:00', 1),
(31, 'This is content 15', 1, '2023-10-15 07:15:00', 1),
(32, 'BINGBONG', 18, '2024-11-13 07:59:15', 4),
(33, '<p>Bundesliga, grunnlagt i 1963, er den &oslash;verste divisjonen i tysk fotball, med 18 lag. Den er kjent for sine h&oslash;ytscorende kamper og fan kultur, med noen av de h&oslash;yeste gjennomsnittlige tilskuerne i verden. Bundesligaen opererer med et system for opprykk og nedrykk med 2. Bundesliga. Klubber som Bayern M&uuml;nchen og Borussia Dortmund har en rik historie, der Bayern er den mest suksessrike klubben i tysk fotball. Ligaen har produsert mange verdensklasse spillere, og klubbene konkurrerer jevnlig i europeiske turneringer. Bundesligaen er ogs&aring; kjent for sitt fokus p&aring; ungdomsutvikling og &oslash;konomisk b&aelig;rekraft, med en unik 50+1-eierregel som holder klubbene fanstyrte. Hver sesong avsluttes med DFB-Pokal, en prestisjetung cupturnering. Ligaens offensive stil og taktiske innovasjoner har p&aring;virket fotball globalt.</p>', 15, '2024-11-13 09:05:45', 2),
(34, '<p>Bundesliga, grunnlagt i 1963, er den &oslash;verste divisjonen i tysk fotball, med 18 lag. Den er kjent for sine h&oslash;ytscorende kamper og fan kultur, med noen av de h&oslash;yeste gjennomsnittlige tilskuerne i verden. Bundesligaen opererer med et system for opprykk og nedrykk med 2. Bundesliga. Klubber som Bayern M&uuml;nchen og Borussia Dortmund har en rik historie, der Bayern er den mest suksessrike klubben i tysk fotball. Ligaen har produsert mange verdensklasse spillere, og klubbene konkurrerer jevnlig i europeiske turneringer. Bundesligaen er ogs&aring; kjent for sitt fokus p&aring; ungdomsutvikling og &oslash;konomisk b&aelig;rekraft, med en unik 50+1-eierregel som holder klubbene fanstyrte. Hver sesong avsluttes med DFB-Pokal, en prestisjetung cupturnering. Ligaens offensive stil og taktiske innovasjoner har p&aring;virket fotball globalt. TESTING</p>', 15, '2024-11-13 09:09:39', 2),
(35, '<p>Bundesliga, grunnlagt i 1963, er den &oslash;verste divisjonen i tysk fotball, med 18 lag. Den er kjent for sine h&oslash;ytscorende kamper og fan kultur, med noen av de h&oslash;yeste gjennomsnittlige tilskuerne i verden. Bundesligaen opererer med et system for opprykk og nedrykk med 2. Bundesliga. Klubber som Bayern M&uuml;nchen og Borussia Dortmund har en rik historie, der Bayern er den mest suksessrike klubben i tysk fotball. Ligaen har produsert mange verdensklasse spillere, og klubbene konkurrerer jevnlig i europeiske turneringer. Bundesligaen er ogs&aring; kjent for sitt fokus p&aring; ungdomsutvikling og &oslash;konomisk b&aelig;rekraft, med en unik 50+1-eierregel som holder klubbene fanstyrte. Hver sesong avsluttes med DFB-Pokal, en prestisjetung cupturnering. Ligaens offensive stil og taktiske innovasjoner har p&aring;virket fotball globalt.</p>', 15, '2024-11-13 09:09:47', 2),
(36, '<p>Borussia Dortmund, grunnlagt i 1909, er en av de mest popul&aelig;re fotballklubbene i Tyskland, basert i Dortmund. Klubben spiller hjemmekampene sine p&aring; Signal Iduna Park, som har en av de st&oslash;rste tilskuerkapasitetene i Europa. Dortmund er kjent for sin offensive spillestil og har en sterk tilknytning til ungdomsutvikling, med mange talenter som har debutert p&aring; f&oslash;rstelaget. Klubben har vunnet Bundesligaen flere ganger og har ogs&aring; hatt suksess i europeiske turneringer, inkludert &aring; vinne UEFA Champions League. Rivaliseringen med Bayern M&uuml;nchen er intens, kjent som \"Der Klassiker.\" Borussia Dortmunds supportere, kjent som \"Die Schwarzgelben,\" skaper en elektrisk atmosf&aelig;re under kampene. Klubben er ogs&aring; kjent for sin sterke samfunnsforpliktelse og deltar aktivt i lokalsamfunnet. Test</p>', 15, '2024-11-13 09:12:46', 21),
(37, '<p>Borussia Dortmund, grunnlagt i 1909, er en av de mest popul&aelig;re fotballklubbene i Tyskland, basert i Dortmund. Klubben spiller hjemmekampene sine p&aring; Signal Iduna Park, som har en av de st&oslash;rste tilskuerkapasitetene i Europa. Dortmund er kjent for sin offensive spillestil og har en sterk tilknytning til ungdomsutvikling, med mange talenter som har debutert p&aring; f&oslash;rstelaget. Klubben har vunnet Bundesligaen flere ganger og har ogs&aring; hatt suksess i europeiske turneringer, inkludert &aring; vinne UEFA Champions League. Rivaliseringen med Bayern M&uuml;nchen er intens, kjent som \"Der Klassiker.\" Borussia Dortmunds supportere, kjent som \"Die Schwarzgelben,\" skaper en elektrisk atmosf&aelig;re under kampene. Klubben er ogs&aring; kjent for sin sterke samfunnsforpliktelse og deltar aktivt i lokalsamfunnet. Test</p>', 15, '2024-11-13 09:13:16', 21),
(38, '<p>Borussia Dortmund, grunnlagt i 1909, er en av de mest popul&aelig;re fotballklubbene i Tyskland, basert i Dortmund. Klubben spiller hjemmekampene sine p&aring; Signal Iduna Park, som har en av de st&oslash;rste tilskuerkapasitetene i Europa. Dortmund er kjent for sin offensive spillestil og har en sterk tilknytning til ungdomsutvikling, med mange talenter som har debutert p&aring; f&oslash;rstelaget. Klubben har vunnet Bundesligaen flere ganger og har ogs&aring; hatt suksess i europeiske turneringer, inkludert &aring; vinne UEFA Champions League. Rivaliseringen med Bayern M&uuml;nchen er intens, kjent som \"Der Klassiker.\" Borussia Dortmunds supportere, kjent som \"Die Schwarzgelben,\" skaper en elektrisk atmosf&aelig;re under kampene. Klubben er ogs&aring; kjent for sin sterke samfunnsforpliktelse og deltar aktivt i lokalsamfunnet.&nbsp;</p>', 15, '2024-11-13 09:13:39', 21),
(39, '<p>Lionel Messi. En av de st&oslash;rste fotballspillerne gjennom tidene, Messi er kjent for sin tekniske briljans og m&aring;lsyn. Han har tilbrakt mesteparten av sin karriere i Barcelona f&oslash;r han flyttet til PSG.&nbsp;</p>', 15, '2024-11-13 09:14:54', 40),
(40, '<p>Lionel Messi. En av de st&oslash;rste fotballspillerne gjennom tidene, Messi er kjent for sin tekniske briljans og m&aring;lsyn. Han har tilbrakt mesteparten av sin karriere i Barcelona f&oslash;r han flyttet til PSG. CRINGE</p>', 15, '2024-11-13 09:15:15', 40),
(41, 'test ', 1, '2023-01-02 08:00:00', 110),
(42, '<p>Lionel Messi. En av de st&oslash;rste fotballspillerne gjennom tidene, Messi er kjent for sin tekniske briljans og m&aring;lsyn. Han har tilbrakt mesteparten av sin karriere i Barcelona f&oslash;r han flyttet til PSG.&nbsp;</p>', 15, '2024-11-13 11:10:35', 40),
(43, '<p>Alexander S&oslash;rloth er en norsk fotballspiller som spiller som spiss for den spanske klubben Villarreal og det norske landslaget. Han startet sin profesjonelle karriere i Rosenborg, f&oslash;r han spilte for klubber som Groningen, Midtjylland, Crystal Palace, og Trabzonspor. Gjennombruddet kom spesielt i Trabzonspor, der han ble toppscorer i S&uuml;per Lig 2019/20-sesongen. S&oslash;rloth er kjent for sin fysiske styrke, h&oslash;yde (1,94 m) og avslutningsevne. Etter suksess i Tyrkia, ble han hentet til RB Leipzig, men hadde senere utl&aring;n til Real Sociedad. I 2023 signerte han for Villarreal. P&aring; landslaget debuterte han i 2016 og har bidratt som en viktig m&aring;lscorer for Norge. S&oslash;rloth er s&oslash;nn av tidligere landslagsspiller G&oslash;ran S&oslash;rloth.&nbsp;</p>\n<ul>\n<li><strong>Testing</strong></li>\n</ul>', 13, '2024-11-13 17:35:09', 45),
(44, '<p>Alexander S&oslash;rloth er en norsk fotballspiller som spiller som spiss for den spanske klubben Villarreal og det norske landslaget. Han startet sin profesjonelle karriere i Rosenborg, f&oslash;r han spilte for klubber som Groningen, Midtjylland, Crystal Palace, og Trabzonspor. Gjennombruddet kom spesielt i Trabzonspor, der han ble toppscorer i S&uuml;per Lig 2019/20-sesongen. S&oslash;rloth er kjent for sin fysiske styrke, h&oslash;yde (1,94 m) og avslutningsevne. Etter suksess i Tyrkia, ble han hentet til RB Leipzig, men hadde senere utl&aring;n til Real Sociedad. I 2023 signerte han for Villarreal. P&aring; landslaget debuterte han i 2016 og har bidratt som en viktig m&aring;lscorer for Norge. S&oslash;rloth er s&oslash;nn av tidligere landslagsspiller G&oslash;ran S&oslash;rloth.&nbsp;</p>\n<ul>\n<li>&nbsp;</li>\n</ul>', 15, '2024-11-13 17:35:35', 45),
(45, '<p>Alexander S&oslash;rloth er en norsk fotballspiller som spiller som spiss for den spanske klubben Villarreal og det norske landslaget. Han startet sin profesjonelle karriere i Rosenborg, f&oslash;r han spilte for klubber som Groningen, Midtjylland, Crystal Palace, og Trabzonspor. Gjennombruddet kom spesielt i Trabzonspor, der han ble toppscorer i S&uuml;per Lig 2019/20-sesongen. S&oslash;rloth er kjent for sin fysiske styrke, h&oslash;yde (1,94 m) og avslutningsevne. Etter suksess i Tyrkia, ble han hentet til RB Leipzig, men hadde senere utl&aring;n til Real Sociedad. I 2023 signerte han for Villarreal. P&aring; landslaget debuterte han i 2016 og har bidratt som en viktig m&aring;lscorer for Norge. S&oslash;rloth er s&oslash;nn av tidligere landslagsspiller G&oslash;ran S&oslash;rloth.&nbsp;</p>\n<ul>\n<li><strong>Testing</strong></li>\n</ul>', 13, '2024-11-13 17:35:48', 45),
(46, '<p>Alexander S&oslash;rloth er en norsk fotballspiller som spiller som spiss for den spanske klubben Villarreal og det norske landslaget. Han startet sin profesjonelle karriere i Rosenborg, f&oslash;r han spilte for klubber som Groningen, Midtjylland, Crystal Palace, og Trabzonspor. Gjennombruddet kom spesielt i Trabzonspor, der han ble toppscorer i S&uuml;per Lig 2019/20-sesongen. S&oslash;rloth er kjent for sin fysiske styrke, h&oslash;yde (1,94 m) og avslutningsevne. Etter suksess i Tyrkia, ble han hentet til RB Leipzig, men hadde senere utl&aring;n til Real Sociedad. I 2023 signerte han for Villarreal. P&aring; landslaget debuterte han i 2016 og har bidratt som en viktig m&aring;lscorer for Norge. S&oslash;rloth er s&oslash;nn av tidligere landslagsspiller G&oslash;ran S&oslash;rloth.&nbsp;</p>\n<ul>\n<li><strong>Testinger</strong></li>\n</ul>', 13, '2024-11-13 22:09:42', 45),
(47, '<p>Andr&eacute;s Iniesta. Den spanske midtbanespilleren er kjent for sin tekniske briljans og evne til &aring; styre spillet. Iniesta har v&aelig;rt en del av flere storlag, inkludert FC Barcelona. Hei hei</p>', 13, '2024-11-13 22:10:02', 32),
(48, '<p>Kasper Hansen. Han har spilt for flere klubber i Danmark og er kjent for sin p&aring;litelighet som keeper. Hansen begynte sin karriere i ungdomsakademiet til sin lokale klubb, f&oslash;r han debuterte for f&oslash;rstelaget i en alder av 18. Hans sterke refleksjer og evne til &aring; lese spillet har gjort ham til en viktig spiller for laget.</p>', 13, '2024-11-14 09:49:49', 110),
(49, '<p>Kasper Hansen. Han har spilt for flere klubber i Danmark og er kjent for sin p&aring;litelighet som keeper. Hansen begynte sin karriere i ungdomsakademiet til sin lokale klubb, f&oslash;r han debuterte for f&oslash;rstelaget i en alder av 18. Hans sterke refleksjer og evne til &aring; lese spillet har gjort ham til en viktig spiller for laget.</p>', 13, '2024-11-14 09:50:06', 110),
(50, '<p>Kasper Hansen. Han har spilt for flere klubber i Danmark og er kjent for sin p&aring;litelighet som keeper. Hansen begynte sin karriere i ungdomsakademiet til sin lokale klubb, f&oslash;r han debuterte for f&oslash;rstelaget i en alder av 18. Hans sterke refleksjer og evne til &aring; lese spillet har gjort ham til en viktig spiller for laget.</p>', 13, '2024-11-14 09:51:13', 110),
(51, '<p>Allsvenskan er den &oslash;verste profesjonelle fotballdivisjonen i Sverige, etablert i 1924. Ligaen best&aring;r av 16 lag som konkurrerer &aring;rlig fra april til november. Allsvenskan er kjent for sin konkurransedyktighet og har produsert mange talentfulle spillere som har spilt internasjonalt. Ligaen opererer med et system for opprykk og nedrykk til Superettan, den andre niv&aring;et i svensk fotball. Den mest suksessrike klubben i Allsvenskan-historien er Malm&ouml; FF, kjent for sine betydelige bidrag til b&aring;de svensk og europeisk fotball. Ligaen legger ogs&aring; stor vekt p&aring; ungdomsutvikling, med klubber som ofte rekrutterer og utvikler unge talenter. Fansen er lidenskapelig opptatt av lagene sine, og skaper levende atmosf&aelig;rer under kampene. Ligaens tittel er sv&aelig;rt ettertraktet, med intense rivaliseringer, spesielt mellom Malm&ouml; FF og IFK G&ouml;teborg. <strong>Dette er en ekstra test</strong></p>', 15, '2024-11-14 10:55:54', 1),
(52, '<p>Bundesliga, grunnlagt i 1963, er den &oslash;verste divisjonen i tysk fotball, med 18 lag. Den er kjent for sine h&oslash;ytscorende kamper og fan kultur, med noen av de h&oslash;yeste gjennomsnittlige tilskuerne i verden. Bundesligaen opererer med et system for opprykk og nedrykk med 2. Bundesliga. Klubber som Bayern M&uuml;nchen og Borussia Dortmund har en rik historie, der Bayern er den mest suksessrike klubben i tysk fotball. Ligaen har produsert mange verdensklasse spillere, og klubbene konkurrerer jevnlig i europeiske turneringer. Bundesligaen er ogs&aring; kjent for sitt fokus p&aring; ungdomsutvikling og &oslash;konomisk b&aelig;rekraft, med en unik 50+1-eierregel som holder klubbene fanstyrte. Hver sesong avsluttes med DFB-Pokal, en prestisjetung cupturnering. Ligaens offensive stil og taktiske innovasjoner har p&aring;virket fotball <strong>globalt.</strong></p>', 15, '2024-11-14 10:56:54', 2),
(53, '<p>Bundesliga, grunnlagt i 1963, er den &oslash;verste divisjonen i tysk fotball, med 18 lag. Den er kjent for sine h&oslash;ytscorende kamper og fan kultur, med noen av de h&oslash;yeste gjennomsnittlige tilskuerne i verden. Bundesligaen opererer med et system for opprykk og nedrykk med 2. Bundesliga. Klubber som Bayern M&uuml;nchen og Borussia Dortmund har en rik historie, der Bayern er den mest suksessrike klubben i tysk fotball. Ligaen har produsert mange verdensklasse spillere, og klubbene konkurrerer jevnlig i europeiske turneringer. Bundesligaen er ogs&aring; kjent for sitt fokus p&aring; ungdomsutvikling og &oslash;konomisk b&aelig;rekraft, med en unik 50+1-eierregel som holder klubbene fanstyrte. Hver sesong avsluttes med DFB-Pokal, en prestisjetung cupturnering. Ligaens offensive stil og taktiske innovasjoner har p&aring;virket fotball <strong>globalt.</strong></p>', 15, '2024-11-14 10:57:34', 2),
(54, '<p>Bundesliga, grunnlagt i 1963, er den &oslash;verste divisjonen i tysk fotball, med 18 lag. Den er kjent for sine h&oslash;ytscorende kamper og fan kultur, med noen av de h&oslash;yeste gjennomsnittlige tilskuerne i verden. Bundesligaen opererer med et system for opprykk og nedrykk med 2. Bundesliga. Klubber som Bayern M&uuml;nchen og Borussia Dortmund har en rik historie, der Bayern er den mest suksessrike klubben i tysk fotball. Ligaen har produsert mange verdensklasse spillere, og klubbene konkurrerer jevnlig i europeiske turneringer. Bundesligaen er ogs&aring; kjent for sitt fokus p&aring; ungdomsutvikling og &oslash;konomisk b&aelig;rekraft, med en unik 50+1-eierregel som holder klubbene fanstyrte. Hver sesong avsluttes med DFB-Pokal, en prestisjetung cupturnering. Ligaens offensive stil og taktiske innovasjoner har p&aring;virket fotball <strong>globalt.</strong></p>', 13, '2024-11-14 11:03:50', 2),
(55, '<p>Alexander S&oslash;rloth er en norsk fotballspiller som spiller som spiss for den spanske klubben Villarreal og det norske landslaget. Han startet sin profesjonelle karriere i Rosenborg, f&oslash;r han spilte for klubber som Groningen, Midtjylland, Crystal Palace, og Trabzonspor. Gjennombruddet kom spesielt i Trabzonspor, der han ble toppscorer i S&uuml;per Lig 2019/20-sesongen. S&oslash;rloth er kjent for sin fysiske styrke, h&oslash;yde (1,94 m) og avslutningsevne. Etter suksess i Tyrkia, ble han hentet til RB Leipzig, men hadde senere utl&aring;n til Real Sociedad. I 2023 signerte han for Villarreal. P&aring; landslaget debuterte han i 2016 og har bidratt som en viktig m&aring;lscorer for Norge. S&oslash;rloth er s&oslash;nn av tidligere landslagsspiller G&oslash;ran S&oslash;rloth.&nbsp;</p>\n<ul>\n<li>&nbsp;</li>\n</ul>', 15, '2024-11-14 11:06:33', 45),
(56, '<p>Alexander S&oslash;rloth er en norsk fotballspiller som spiller som spiss for den spanske klubben Villarreal og det norske landslaget. Han startet sin profesjonelle karriere i Rosenborg, f&oslash;r han spilte for klubber som Groningen, Midtjylland, Crystal Palace, og Trabzonspor. Gjennombruddet kom spesielt i Trabzonspor, der han ble toppscorer i S&uuml;per Lig 2019/20-sesongen. S&oslash;rloth er kjent for sin fysiske styrke, h&oslash;yde (1,94 m) og avslutningsevne. Etter suksess i Tyrkia, ble han hentet til RB Leipzig, men hadde senere utl&aring;n til Real Sociedad. I 2023 signerte han for Villarreal. P&aring; landslaget debuterte han i 2016 og har bidratt som en viktig m&aring;lscorer for Norge. S&oslash;rloth er s&oslash;nn av tidligere landslagsspiller G&oslash;ran S&oslash;rloth.&nbsp;</p>\n<ul>\n<li>&nbsp;</li>\n</ul>', 15, '2024-11-14 12:47:49', 45),
(57, '<p>IFK G&ouml;teborg, etablert i 1904, er en av de mest kjente fotballklubbene i Sverige, med base i G&ouml;teborg. Klubben spiller hjemmekampene sine p&aring; Gamla Ullevi, og har vunnet Allsvenskan flere ganger, med en sterk tilknytning til svensk fotballhistorie. IFK G&ouml;teborg er kjent for sin sterke ungdomsutvikling og har produsert mange talenter som har gjort seg bemerket b&aring;de nasjonalt og internasjonalt. Rivaliseringen med Malm&ouml; FF er spesielt intens, og kampene mellom disse to klubbene tiltrekker seg stor oppmerksomhet. IFK har ogs&aring; hatt suksess i europeiske turneringer, noe som har hevet klubbens profil. Klubben har en dedikert fanbase som skaper en fantastisk atmosf&aelig;re under kampene.</p>', 14, '2024-11-16 16:43:40', 16),
(58, '<p>Alexander S&oslash;rloth er en norsk fotballspiller som spiller som spiss for den spanske klubben Villarreal og det norske landslaget. Han startet sin profesjonelle karriere i Rosenborg, f&oslash;r han spilte for klubber som Groningen, Midtjylland, Crystal Palace, og Trabzonspor. Gjennombruddet kom spesielt i Trabzonspor, der han ble toppscorer i S&uuml;per Lig 2019/20-sesongen. S&oslash;rloth er kjent for sin fysiske styrke, h&oslash;yde (1,94 m) og avslutningsevne. Etter suksess i Tyrkia, ble han hentet til RB Leipzig, men hadde senere utl&aring;n til Real Sociedad. I 2023 signerte han for Villarreal. P&aring; landslaget debuterte han i 2016 og har bidratt som en viktig m&aring;lscorer for Norge. S&oslash;rloth er s&oslash;nn av tidligere landslagsspiller G&oslash;ran S&oslash;rloth.&nbsp;</p>', 14, '2024-11-16 18:06:30', 45),
(59, '<p>La Liga, offisielt kjent som Primera Divisi&oacute;n, er den &oslash;verste fotballdivisjonen i Spania, grunnlagt i 1929. Ligaen best&aring;r av 20 lag som konkurrerer fra august til mai. La Liga er kjent for sitt h&oslash;ye niv&aring; av spill og har fostret mange av verdens beste spillere, inkludert Lionel Messi og Cristiano Ronaldo. FC Barcelona og Real Madrid er de mest suksessrike klubbene og har en av de mest intense rivaliseringene i sportens historie, kjent som \"El Cl&aacute;sico.\" Ligaen har ogs&aring; en struktur for opprykk og nedrykk med Segunda Divisi&oacute;n. La Liga har et globalt publikum, og kampene sendes til millioner av seere over hele verden. Spansk fotball er kjent for sin tekniske spillestil, som har hatt stor innflytelse p&aring; internasjonal fotball. Hver sesong k&aring;rer ligaen en mester, og det er ogs&aring; prestisjefylte individuelle utmerkelser for spillerne. ..</p>', 13, '2024-11-17 06:41:49', 5),
(60, '<p>La Liga, offisielt kjent som Primera Divisi&oacute;n, er den &oslash;verste fotballdivisjonen i Spania, grunnlagt i 1929. Ligaen best&aring;r av 20 lag som konkurrerer fra august til mai. La Liga er kjent for sitt h&oslash;ye niv&aring; av spill og har fostret mange av verdens beste spillere, inkludert Lionel Messi og Cristiano Ronaldo. FC Barcelona og Real Madrid er de mest suksessrike klubbene og har en av de mest intense rivaliseringene i sportens historie, kjent som \"El Cl&aacute;sico.\" Ligaen har ogs&aring; en struktur for opprykk og nedrykk med Segunda Divisi&oacute;n. La Liga har et globalt publikum, og kampene sendes til millioner av seere over hele verden. Spansk fotball er kjent for sin tekniske spillestil, som har hatt stor innflytelse p&aring; internasjonal fotball. Hver sesong k&aring;rer ligaen en mester, og det er ogs&aring; prestisjefylte individuelle utmerkelser for spillerne.&nbsp;</p>', 13, '2024-11-17 06:41:59', 5),
(61, '<p>Alexander S&oslash;rloth er en norsk fotballspiller som spiller som spiss for den spanske klubben Villarreal og det norske landslaget. Han startet sin profesjonelle karriere i Rosenborg, f&oslash;r han spilte for klubber som Groningen, Midtjylland, Crystal Palace, og Trabzonspor. Gjennombruddet kom spesielt i Trabzonspor, der han ble toppscorer i S&uuml;per Lig 2019/20-sesongen. S&oslash;rloth er kjent for sin fysiske styrke, h&oslash;yde (1,94 m) og avslutningsevne. Etter suksess i Tyrkia, ble han hentet til RB Leipzig, men hadde senere utl&aring;n til Real Sociedad. I 2023 signerte han for Villarreal. P&aring; landslaget debuterte han i 2016 og har bidratt som en viktig m&aring;lscorer for Norge. S&oslash;rloth er s&oslash;nn av tidligere landslagsspiller G&oslash;ran S&oslash;rloth.&nbsp;</p>', 14, '2024-11-17 14:23:43', 45),
(62, '<p>Bayern M&uuml;nchen, grunnlagt i 1900, er en av de mest suksessrike klubbene i tysk og europeisk fotball. Klubben holder til i M&uuml;nchen og spiller hjemmekampene sine p&aring; Allianz Arena, som har en kapasitet p&aring; over 75 000 tilskuere. Bayern har vunnet Bundesligaen over 30 ganger, og de har ogs&aring; hatt stor suksess i UEFA Champions League, med flere titler. Klubben er kjent for &aring; utvikle og tiltrekke seg stjernespillere som Franz Beckenbauer, Gerd M&uuml;ller, og mer nylig, Robert Lewandowski. Bayern har en stor, dedikert supporterbase, og rivaliseringen med Borussia Dortmund er spesielt kjent. Klubben fokuserer p&aring; b&aring;de nasjonal og internasjonal suksess, med en sterk akademi som utvikler unge talenter for fremtiden.</p>', 14, '2024-11-17 15:04:05', 22),
(63, '<p>Bayern M&uuml;nchen, grunnlagt i 1900, er en av de mest suksessrike klubbene i tysk og europeisk fotball. Klubben holder til i M&uuml;nchen og spiller hjemmekampene sine p&aring; Allianz Arena, som har en kapasitet p&aring; over 75 000 tilskuere. Bayern har vunnet Bundesligaen over 30 ganger, og de har ogs&aring; hatt stor suksess i UEFA Champions League, med flere titler. Klubben er kjent for &aring; utvikle og tiltrekke seg stjernespillere som Franz Beckenbauer, Gerd M&uuml;ller, og mer nylig, Robert Lewandowski. Bayern har en stor, dedikert supporterbase, og rivaliseringen med Borussia Dortmund er spesielt kjent. Klubben fokuserer p&aring; b&aring;de nasjonal og internasjonal suksess, med en sterk akademi som utvikler unge talenter for fremtiden.</p>', 14, '2024-11-17 15:06:52', 22),
(64, '<p>Bayern M&uuml;nchen, grunnlagt i 1900, er en av de mest suksessrike klubbene i tysk og europeisk fotball. Klubben holder til i M&uuml;nchen og spiller hjemmekampene sine p&aring; Allianz Arena, som har en kapasitet p&aring; over 75 000 tilskuere. Bayern har vunnet Bundesligaen over 30 ganger, og de har ogs&aring; hatt stor suksess i UEFA Champions League, med flere titler. Klubben er kjent for &aring; utvikle og tiltrekke seg stjernespillere som Franz Beckenbauer, Gerd M&uuml;ller, og mer nylig, Robert Lewandowski. Bayern har en stor, dedikert supporterbase, og rivaliseringen med Borussia Dortmund er spesielt kjent. Klubben fokuserer p&aring; b&aring;de nasjonal og internasjonal suksess, med en sterk akademi som utvikler unge talenter for fremtiden.</p>', 14, '2024-11-17 15:11:12', 22),
(65, '<p>Bayern M&uuml;nchen, grunnlagt i 1900, er en av de mest suksessrike klubbene i tysk og europeisk fotball. Klubben holder til i M&uuml;nchen og spiller hjemmekampene sine p&aring; Allianz Arena, som har en kapasitet p&aring; over 75 000 tilskuere. Bayern har vunnet Bundesligaen over 30 ganger, og de har ogs&aring; hatt stor suksess i UEFA Champions League, med flere titler. Klubben er kjent for &aring; utvikle og tiltrekke seg stjernespillere som Franz Beckenbauer, Gerd M&uuml;ller, og mer nylig, Robert Lewandowski. Bayern har en stor, dedikert supporterbase, og rivaliseringen med Borussia Dortmund er spesielt kjent. Klubben fokuserer p&aring; b&aring;de nasjonal og internasjonal suksess, med en sterk akademi som utvikler unge talenter for fremtiden.</p>', 14, '2024-11-17 15:13:09', 22),
(66, '<p>Bayern M&uuml;nchen, grunnlagt i 1900, er en av de mest suksessrike klubbene i tysk og europeisk fotball. Klubben holder til i M&uuml;nchen og spiller hjemmekampene sine p&aring; Allianz Arena, som har en kapasitet p&aring; over 75 000 tilskuere. Bayern har vunnet Bundesligaen over 30 ganger, og de har ogs&aring; hatt stor suksess i UEFA Champions League, med flere titler. Klubben er kjent for &aring; utvikle og tiltrekke seg stjernespillere som Franz Beckenbauer, Gerd M&uuml;ller, og mer nylig, Robert Lewandowski. Bayern har en stor, dedikert supporterbase, og rivaliseringen med Borussia Dortmund er spesielt kjent. Klubben fokuserer p&aring; b&aring;de nasjonal og internasjonal suksess, med en sterk akademi som utvikler unge talenter for fremtiden.</p>', 14, '2024-11-17 15:14:00', 22),
(67, '<p>test</p>', 18, '2024-11-18 12:25:57', 199),
(68, '<p>test</p>', 18, '2024-11-18 12:27:35', 199),
(69, '<p>Alexander S&oslash;rloth er en norsk fotballspiller som spiller som spiss for den spanske klubben Villarreal og det norske landslaget. Han startet sin profesjonelle karriere i Rosenborg, f&oslash;r han spilte for klubber som Groningen, Midtjylland, Crystal Palace, og Trabzonspor. Gjennombruddet kom spesielt i Trabzonspor, der han ble toppscorer i S&uuml;per Lig 2019/20-sesongen. S&oslash;rloth er kjent for sin fysiske styrke, h&oslash;yde (1,94 m) og avslutningsevne. Etter suksess i Tyrkia, ble han hentet til RB Leipzig, men hadde senere utl&aring;n til Real Sociedad. I 2023 signerte han for Villarreal. P&aring; landslaget debuterte han i 2016 og har bidratt som en viktig m&aring;lscorer for Norge. S&oslash;rloth er s&oslash;nn av tidligere landslagsspiller G&oslash;ran S&oslash;rloth.&nbsp;</p>', 14, '2024-11-18 12:27:35', 45),
(70, '<p>test</p>', 13, '2024-11-18 12:33:52', 199),
(71, '<p>FC Barcelona, etablert i 1899, er en av de mest ber&oslash;mte fotballklubbene i verden, med base i Barcelona, Spania. Klubben spiller sine hjemmekamper p&aring; det ikoniske Camp Nou, som har en kapasitet p&aring; over 99 000 tilskuere. Barcelona er kjent for sin unike spillestil, kalt \"tiki-taka\", og har utviklet mange legendariske spillere, inkludert Lionel Messi, som er klubbens toppscorer. Klubben har vunnet La Liga over 25 ganger og UEFA Champions League mange ganger. Barcelona har en stor og lidenskapelig fanbase, kjent som \"culers.\" Rivaliseringen med Real Madrid, kjent som \"El Cl&aacute;sico,\" er en av de mest intense i fotballhistorien. Klubben fokuserer ogs&aring; p&aring; ungdomsutvikling gjennom sitt akademi, La Masia, som har produsert mange av klubbens st&oslash;rste talenter.</p>', 13, '2024-11-18 12:42:03', 23),
(72, '<p>AIK, eller Allm&auml;nna Idrottsklubben, er en svensk idrettsklubb basert i Solna, Stockholm. Klubben ble grunnlagt i 1891 og er en av Sveriges mest suksessfulle og historisk betydningsfulle idrettslag. AIK er best kjent for sitt fotballag, som spiller i Allsvenskan, den &oslash;verste divisjonen i svensk fotball. Klubben har vunnet flere nasjonale mesterskap og har en stor tilhengerskare. I tillegg til fotball, har AIK aktiviteter innenfor flere andre idretter, som ishockey, bandy og h&aring;ndball. Klubbens hjemmearena for fotball er Friends Arena, som ligger i Solna. AIK har tradisjonelt hatt et sterkt lokalt engasjement og har rivaler som Djurg&aring;rdens IF og Hammarby IF, med kampene mot disse lagene kjent som Stockholmsderbyene. AIK er ogs&aring; kjent for sitt sterke supporterfellesskap, med supportergrupper som AIK Solna Support och Black Army, som spiller en viktig rolle i klubbens identitet og atmosf&aelig;re p&aring; kampene.<strong> Test</strong></p>', 14, '2024-11-18 13:00:49', 1),
(83, '<p>Allsvenskan er den &oslash;verste profesjonelle fotballdivisjonen i Sverige, etablert i 1924. Ligaen best&aring;r av 16 lag som konkurrerer &aring;rlig fra april til november. Allsvenskan er kjent for sin konkurransedyktighet og har produsert mange talentfulle spillere som har spilt internasjonalt. Ligaen opererer med et system for opprykk og nedrykk til Superettan, den andre niv&aring;et i svensk fotball. Den mest suksessrike klubben i Allsvenskan-historien er Malm&ouml; FF, kjent for sine betydelige bidrag til b&aring;de svensk og europeisk fotball. Ligaen legger ogs&aring; stor vekt p&aring; ungdomsutvikling, med klubber som ofte rekrutterer og utvikler unge talenter. Fansen er lidenskapelig opptatt av lagene sine, og skaper levende atmosf&aelig;rer under kampene. Ligaens tittel er sv&aelig;rt ettertraktet, med intense rivaliseringer, spesielt mellom Malm&ouml; FF og IFK G&ouml;teborg. <strong>Dette er en ekstra test<br><br>ehubfirewsbuewbvoeboesbesbosev</strong></p>', 13, '2024-11-18 22:22:50', 1),
(84, '<p>AIK, eller Allm&auml;nna Idrottsklubben, er en svensk idrettsklubb basert i Solna, Stockholm. Klubben ble grunnlagt i 1891 og er en av Sveriges mest suksessfulle og historisk betydningsfulle idrettslag. AIK er best kjent for sitt fotballag, som spiller i Allsvenskan, den &oslash;verste divisjonen i svensk fotball. Klubben har vunnet flere nasjonale mesterskap og har en stor tilhengerskare. I tillegg til fotball, har AIK aktiviteter innenfor flere andre idretter, som ishockey, bandy og h&aring;ndball. Klubbens hjemmearena for fotball er Friends Arena, som ligger i Solna. AIK har tradisjonelt hatt et sterkt lokalt engasjement og har rivaler som Djurg&aring;rdens IF og Hammarby IF, med kampene mot disse lagene kjent som Stockholmsderbyene. AIK er ogs&aring; kjent for sitt sterke supporterfellesskap, med supportergrupper som AIK Solna Support och Black Army, som spiller en viktig rolle i klubbens identitet og atmosf&aelig;re p&aring; kampene.<strong> Test</strong></p>', 13, '2024-11-18 22:22:59', 1),
(85, '<p>Eliteserien er den &oslash;verste fotballigaen i Norge, etablert i 1937. Ligaen best&aring;r av 16 lag som konkurrerer om tittelen fra april til desember. Eliteserien er kjent for sitt varierte niv&aring; av spillere og har fostret mange talenter som har n&aring;dd internasjonalt niv&aring;. De mest suksessrike klubbene inkluderer Rosenborg, som dominerte ligaen p&aring; 1990-tallet og tidlig 2000-tall. Ligaen er strukturert med opprykk og nedrykk til OBOS-ligaen, noe som gir muligheter for klubber i lavere divisjoner. Eliteserien har ogs&aring; et sterkt fokus p&aring; ungdomsutvikling, og mange klubber har akademier som utvikler lokale talenter. Atmosf&aelig;ren i ligaen er preget av engasjerte supportere, og rivaliseringene mellom lagene bidrar til spennende kamper. Hver sesong kulminerer i NM (Norgesmesterskapet), en tradisjonell cupturnering.<br>Test</p>', 15, '2024-11-19 12:31:54', 4),
(86, '<p>Eliteserien er den &oslash;verste fotballigaen i Norge, etablert i 1937. Ligaen best&aring;r av 16 lag som konkurrerer om tittelen fra april til desember. Eliteserien er kjent for sitt varierte niv&aring; av spillere og har fostret mange talenter som har n&aring;dd internasjonalt niv&aring;. De mest suksessrike klubbene inkluderer Rosenborg, som dominerte ligaen p&aring; 1990-tallet og tidlig 2000-tall. Ligaen er strukturert med opprykk og nedrykk til OBOS-ligaen, noe som gir muligheter for klubber i lavere divisjoner. Eliteserien har ogs&aring; et sterkt fokus p&aring; ungdomsutvikling, og mange klubber har akademier som utvikler lokale talenter. Atmosf&aelig;ren i ligaen er preget av engasjerte supportere, og rivaliseringene mellom lagene bidrar til spennende kamper. Hver sesong kulminerer i NM (Norgesmesterskapet), en tradisjonell cupturnering.<br>Test</p>', 15, '2024-11-19 12:32:01', 4),
(87, '<p>Eliteserien er den &oslash;verste fotballigaen i Norge, etablert i 1937. Ligaen best&aring;r av 16 lag som konkurrerer om tittelen fra april til desember. Eliteserien er kjent for sitt varierte niv&aring; av spillere og har fostret mange talenter som har n&aring;dd internasjonalt niv&aring;. De mest suksessrike klubbene inkluderer Rosenborg, som dominerte ligaen p&aring; 1990-tallet og tidlig 2000-tall. Ligaen er strukturert med opprykk og nedrykk til OBOS-ligaen, noe som gir muligheter for klubber i lavere divisjoner. Eliteserien har ogs&aring; et sterkt fokus p&aring; ungdomsutvikling, og mange klubber har akademier som utvikler lokale talenter. Atmosf&aelig;ren i ligaen er preget av engasjerte supportere, og rivaliseringene mellom lagene bidrar til spennende kamper. Hver sesong kulminerer i NM (Norgesmesterskapet), en tradisjonell cupturnering.<br><br></p>', 15, '2024-11-19 12:32:18', 4),
(88, '<p>FC Barcelona, etablert i 1899, er en av de mest ber&oslash;mte fotballklubbene i verden, med base i Barcelona, Spania. Klubben spiller sine hjemmekamper p&aring; det ikoniske Camp Nou, som har en kapasitet p&aring; over 99 000 tilskuere. Barcelona er kjent for sin unike spillestil, kalt \"tiki-taka\", og har utviklet mange legendariske spillere, inkludert Lionel Messi, som er klubbens toppscorer. Klubben har vunnet La Liga over 25 ganger og UEFA Champions League mange ganger. Barcelona har en stor og lidenskapelig fanbase, kjent som \"culers.\" Rivaliseringen med Real Madrid, kjent som \"El Cl&aacute;sico,\" er en av de mest intense i fotballhistorien. Klubben fokuserer ogs&aring; p&aring; ungdomsutvikling gjennom sitt akademi, La Masia, som har produsert mange av klubbens st&oslash;rste talenter.</p>', 15, '2024-11-19 12:32:53', 23),
(95, '<p>Marco Reus. Den tyske vingen har hatt en flott karriere med Borussia Dortmund, kjent for sin fart og evne til &aring; score m&aring;l fra kantene.</p>', 15, '2024-11-19 17:07:33', 36),
(96, '<p>AIK, eller Allm&auml;nna Idrottsklubben, er en svensk idrettsklubb basert i Solna, Stockholm. Klubben ble grunnlagt i 1891 og er en av Sveriges mest suksessfulle og historisk betydningsfulle idrettslag. AIK er best kjent for sitt fotballag, som spiller i Allsvenskan, den &oslash;verste divisjonen i svensk fotball. Klubben har vunnet flere nasjonale mesterskap og har en stor tilhengerskare. I tillegg til fotball, har AIK aktiviteter innenfor flere andre idretter, som ishockey, bandy og h&aring;ndball. Klubbens hjemmearena for fotball er Friends Arena, som ligger i Solna. AIK har tradisjonelt hatt et sterkt lokalt engasjement og har rivaler som Djurg&aring;rdens IF og Hammarby IF, med kampene mot disse lagene kjent som Stockholmsderbyene. AIK er ogs&aring; kjent for sitt sterke supporterfellesskap, med supportergrupper som AIK Solna Support och Black Army, som spiller en viktig rolle i klubbens identitet og atmosf&aelig;re p&aring; kampene.<strong> Test</strong></p>', 15, '2024-11-19 17:07:55', 1),
(97, '<p>AIK, eller Allm&auml;nna Idrottsklubben, er en svensk idrettsklubb basert i Solna, Stockholm. Klubben ble grunnlagt i 1891 og er en av Sveriges mest suksessfulle og historisk betydningsfulle idrettslag. AIK er best kjent for sitt fotballag, som spiller i Allsvenskan, den &oslash;verste divisjonen i svensk fotball. Klubben har vunnet flere nasjonale mesterskap og har en stor tilhengerskare. I tillegg til fotball, har AIK aktiviteter innenfor flere andre idretter, som ishockey, bandy og h&aring;ndball. Klubbens hjemmearena for fotball er Friends Arena, som ligger i Solna. AIK har tradisjonelt hatt et sterkt lokalt engasjement og har rivaler som Djurg&aring;rdens IF og Hammarby IF, med kampene mot disse lagene kjent som Stockholmsderbyene. AIK er ogs&aring; kjent for sitt sterke supporterfellesskap, med supportergrupper som AIK Solna Support och Black Army, som spiller en viktig rolle i klubbens identitet og atmosf&aelig;re p&aring; kampene.<strong> Test</strong></p>', 15, '2024-11-19 17:08:06', 1),
(98, '<p>Bayern M&uuml;nchen, grunnlagt i 1900, er en av de mest suksessrike klubbene i tysk og europeisk fotball. Klubben holder til i M&uuml;nchen og spiller hjemmekampene sine p&aring; Allianz Arena, som har en kapasitet p&aring; over 75 000 tilskuere. Bayern har vunnet Bundesligaen over 30 ganger, og de har ogs&aring; hatt stor suksess i UEFA Champions League, med flere titler. Klubben er kjent for &aring; utvikle og tiltrekke seg stjernespillere som Franz Beckenbauer, Gerd M&uuml;ller, og mer nylig, Robert Lewandowski. Bayern har en stor, dedikert supporterbase, og rivaliseringen med Borussia Dortmund er spesielt kjent. Klubben fokuserer p&aring; b&aring;de nasjonal og internasjonal suksess, med en sterk akademi som utvikler unge talenter for fremtiden.</p>', 15, '2024-11-19 17:08:16', 22),
(99, '<p>hhshb</p>', 15, '2024-11-19 17:10:24', 229),
(100, '<p>&aring;&aring;</p>', 15, '2024-11-19 17:15:34', 230),
(101, '<p>&aring;&aring;</p>', 15, '2024-11-19 17:15:49', 230),
(102, '<p>AIK, eller Allm&auml;nna Idrottsklubben, er en svensk idrettsklubb basert i Solna, Stockholm. Klubben ble grunnlagt i 1891 og er en av Sveriges mest suksessfulle og historisk betydningsfulle idrettslag. AIK er best kjent for sitt fotballag, som spiller i Allsvenskan, den &oslash;verste divisjonen i svensk fotball. Klubben har vunnet flere nasjonale mesterskap og har en stor tilhengerskare. I tillegg til fotball, har AIK aktiviteter innenfor flere andre idretter, som ishockey, bandy og h&aring;ndball. Klubbens hjemmearena for fotball er Friends Arena, som ligger i Solna. AIK har tradisjonelt hatt et sterkt lokalt engasjement og har rivaler som Djurg&aring;rdens IF og Hammarby IF, med kampene mot disse lagene kjent som Stockholmsderbyene. AIK er ogs&aring; kjent for sitt sterke supporterfellesskap, med supportergrupper som AIK Solna Support och Black Army, som spiller en viktig rolle i klubbens identitet og atmosf&aelig;re p&aring; kampene.<strong> Test</strong></p>', 15, '2024-11-19 17:17:53', 1),
(107, '<p>FC Barcelona, etablert i 1899, er en av de mest ber&oslash;mte fotballklubbene i verden, med base i Barcelona, Spania. Klubben spiller sine hjemmekamper p&aring; det ikoniske Camp Nou, som har en kapasitet p&aring; over 99 000 tilskuere. Barcelona er kjent for sin unike spillestil, kalt \"tiki-taka\", og har utviklet mange legendariske spillere, inkludert Lionel Messi, som er klubbens toppscorer. Klubben har vunnet La Liga over 25 ganger og UEFA Champions League mange ganger. Barcelona har en stor og lidenskapelig fanbase, kjent som \"culers.\" Rivaliseringen med Real Madrid, kjent som \"El Cl&aacute;sico,\" er en av de mest intense i fotballhistorien. Klubben fokuserer ogs&aring; p&aring; ungdomsutvikling gjennom sitt akademi, La Masia, som har produsert mange av klubbens st&oslash;rste talenter.</p>', 13, '2024-11-19 17:23:31', 23),
(108, '<p>Bayern M&uuml;nchen, grunnlagt i 1900, er en av de mest suksessrike klubbene i tysk og europeisk fotball. Klubben holder til i M&uuml;nchen og spiller hjemmekampene sine p&aring; Allianz Arena, som har en kapasitet p&aring; over 75 000 tilskuere. Bayern har vunnet Bundesligaen over 30 ganger, og de har ogs&aring; hatt stor suksess i UEFA Champions League, med flere titler. Klubben er kjent for &aring; utvikle og tiltrekke seg stjernespillere som Franz Beckenbauer, Gerd M&uuml;ller, og mer nylig, Robert Lewandowski. Bayern har en stor, dedikert supporterbase, og rivaliseringen med Borussia Dortmund er spesielt kjent. Klubben fokuserer p&aring; b&aring;de nasjonal og internasjonal suksess, med en sterk akademi som utvikler unge talenter for fremtiden.</p>', 13, '2024-11-19 17:24:02', 22),
(111, '<p>Marco Reus. Den tyske vingen har hatt en flott karriere med Borussia Dortmund, kjent for sin fart og evne til &aring; score m&aring;l fra kantene.</p>', 13, '2024-11-19 17:26:27', 36),
(112, '<p>Alexander S&oslash;rloth er en norsk fotballspiller som spiller som spiss for den spanske klubben Villarreal og det norske landslaget. Han startet sin profesjonelle karriere i Rosenborg, f&oslash;r han spilte for klubber som Groningen, Midtjylland, Crystal Palace, og Trabzonspor. Gjennombruddet kom spesielt i Trabzonspor, der han ble toppscorer i S&uuml;per Lig 2019/20-sesongen. S&oslash;rloth er kjent for sin fysiske styrke, h&oslash;yde (1,94 m) og avslutningsevne. Etter suksess i Tyrkia, ble han hentet til RB Leipzig, men hadde senere utl&aring;n til Real Sociedad. I 2023 signerte han for Villarreal. P&aring; landslaget debuterte han i 2016 og har bidratt som en viktig m&aring;lscorer for Norge. S&oslash;rloth er s&oslash;nn av tidligere landslagsspiller G&oslash;ran S&oslash;rloth.&nbsp;</p>', 13, '2024-11-19 17:26:59', 45),
(113, '<p>Alexander S&oslash;rloth er en norsk fotballspiller som spiller som spiss for den spanske klubben Villarreal og det norske landslaget. Han startet sin profesjonelle karriere i Rosenborg, f&oslash;r han spilte for klubber som Groningen, Midtjylland, Crystal Palace, og Trabzonspor. Gjennombruddet kom spesielt i Trabzonspor, der han ble toppscorer i S&uuml;per Lig 2019/20-sesongen. S&oslash;rloth er kjent for sin fysiske styrke, h&oslash;yde (1,94 m) og avslutningsevne. Etter suksess i Tyrkia, ble han hentet til RB Leipzig, men hadde senere utl&aring;n til Real Sociedad. I 2023 signerte han for Villarreal. P&aring; landslaget debuterte han i 2016 og har bidratt som en viktig m&aring;lscorer for Norge. S&oslash;rloth er s&oslash;nn av tidligere landslagsspiller G&oslash;ran S&oslash;rloth.&nbsp;</p>', 13, '2024-11-19 17:27:10', 45),
(114, '<p>Bayern M&uuml;nchen, grunnlagt i 1900, er en av de mest suksessrike klubbene i tysk og europeisk fotball. Klubben holder til i M&uuml;nchen og spiller hjemmekampene sine p&aring; Allianz Arena, som har en kapasitet p&aring; over 75 000 tilskuere. Bayern har vunnet Bundesligaen over 30 ganger, og de har ogs&aring; hatt stor suksess i UEFA Champions League, med flere titler. Klubben er kjent for &aring; utvikle og tiltrekke seg stjernespillere som Franz Beckenbauer, Gerd M&uuml;ller, og mer nylig, Robert Lewandowski. Bayern har en stor, dedikert supporterbase, og rivaliseringen med Borussia Dortmund er spesielt kjent. Klubben fokuserer p&aring; b&aring;de nasjonal og internasjonal suksess, med en sterk akademi som utvikler unge talenter for fremtiden.</p>', 13, '2024-11-19 17:31:40', 22),
(115, '<p>Bayern M&uuml;nchen, grunnlagt i 1900, er en av de mest suksessrike klubbene i tysk og europeisk fotball. Klubben holder til i M&uuml;nchen og spiller hjemmekampene sine p&aring; Allianz Arena, som har en kapasitet p&aring; over 75 000 tilskuere. Bayern har vunnet Bundesligaen over 30 ganger, og de har ogs&aring; hatt stor suksess i UEFA Champions League, med flere titler. Klubben er kjent for &aring; utvikle og tiltrekke seg stjernespillere som Franz Beckenbauer, Gerd M&uuml;ller, og mer nylig, Robert Lewandowski. Bayern har en stor, dedikert supporterbase, og rivaliseringen med Borussia Dortmund er spesielt kjent. Klubben fokuserer p&aring; b&aring;de nasjonal og internasjonal suksess, med en sterk akademi som utvikler unge talenter for fremtiden.</p>', 13, '2024-11-19 17:31:54', 22),
(116, '<p>AIK, eller Allm&auml;nna Idrottsklubben, er en svensk idrettsklubb basert i Solna, Stockholm. Klubben ble grunnlagt i 1891 og er en av Sveriges mest suksessfulle og historisk betydningsfulle idrettslag. AIK er best kjent for sitt fotballag, som spiller i Allsvenskan, den &oslash;verste divisjonen i svensk fotball. Klubben har vunnet flere nasjonale mesterskap og har en stor tilhengerskare. I tillegg til fotball, har AIK aktiviteter innenfor flere andre idretter, som ishockey, bandy og h&aring;ndball. Klubbens hjemmearena for fotball er Friends Arena, som ligger i Solna. AIK har tradisjonelt hatt et sterkt lokalt engasjement og har rivaler som Djurg&aring;rdens IF og Hammarby IF, med kampene mot disse lagene kjent som Stockholmsderbyene. AIK er ogs&aring; kjent for sitt sterke supporterfellesskap, med supportergrupper som AIK Solna Support och Black Army, som spiller en viktig rolle i klubbens identitet og atmosf&aelig;re p&aring; kampene.<strong> Test</strong></p>', 13, '2024-11-19 17:33:12', 232);
INSERT INTO `Revisions` (`revision_id`, `content`, `revised_by`, `revised_at`, `page_id`) VALUES
(117, '<div class=\"flex-shrink-0 flex flex-col relative items-end\">\n<div>\n<div class=\"pt-0\">\n<div class=\"gizmo-bot-avatar flex h-8 w-8 items-center justify-center overflow-hidden rounded-full\">\n<div class=\"relative p-1 rounded-sm flex items-center justify-center bg-token-main-surface-primary text-token-text-primary h-8 w-8\">&nbsp;</div>\n</div>\n</div>\n</div>\n</div>\n<div class=\"group/conversation-turn relative flex w-full min-w-0 flex-col agent-turn\">\n<div class=\"flex-col gap-1 md:gap-3\">\n<div class=\"flex max-w-full flex-col flex-grow\">\n<div class=\"min-h-8 text-message flex w-full flex-col items-end gap-2 whitespace-normal break-words [.text-message+&amp;]:mt-5\" dir=\"auto\" data-message-author-role=\"assistant\" data-message-id=\"abd56308-6bd3-4f57-8329-d6475cb92688\" data-message-model-slug=\"gpt-4o\">\n<div class=\"flex w-full flex-col gap-1 empty:hidden first:pt-[3px]\">\n<div class=\"markdown prose w-full break-words dark:prose-invert dark\">\n<p><strong>Allsvenskan</strong></p>\n<p><strong>Allsvenskan</strong> er den &oslash;verste divisjonen i svensk herrefotball og regnes som Sveriges mest prestisjefylte fotballiga. Den ble grunnlagt i 1924 og har siden v&aelig;rt den fremste arenaen for Sveriges beste fotballklubber i kampen om det nasjonale mesterskapet. Allsvenskan organiseres av Svenska Fotbollf&ouml;rbundet og f&oslash;lger et seriesystem der de beste lagene kvalifiserer seg til europeiske turneringer, mens de d&aring;rligste risikerer nedrykk til Superettan, Sveriges nest h&oslash;yeste divisjon.</p>\n<h3><strong>Format</strong></h3>\n<p>Allsvenskan best&aring;r av 16 lag som spiller mot hverandre to ganger i l&oslash;pet av sesongen, &eacute;n kamp hjemme og &eacute;n kamp borte, noe som utgj&oslash;r totalt 30 serierunder. Ligaen spilles innenfor kalender&aring;ret, vanligvis fra april til november, p&aring; grunn av klimaet i Sverige.</p>\n<ul>\n<li><strong>Poengsystem</strong>: Seier gir 3 poeng, uavgjort gir 1 poeng, og tap gir 0 poeng.</li>\n<li><strong>Plasseringer</strong>: Laget med flest poeng etter endt sesong blir seriemester, mens de to nederste lagene rykker direkte ned til Superettan. Laget som ender p&aring; 14. plass spiller kvalifisering mot tredjeplassen fra Superettan.</li>\n</ul>\n<h3><strong>Historie og statistikk</strong></h3>\n<ul>\n<li>F&oslash;rste sesong: 1924/1925</li>\n<li>Mestvinnende klubb: Malm&ouml; FF (flest titler)</li>\n<li>St&oslash;rste rivaliseringer: AIK&ndash;Djurg&aring;rden, Malm&ouml; FF&ndash;IFK G&ouml;teborg, og Hammarby&ndash;Djurg&aring;rden</li>\n<li>Rekordtilskuertall: 52 194 (HIF&ndash;Malm&ouml; FF, 1959, p&aring; Olympia, Helsingborg)</li>\n</ul>\n<h3><strong>Deltakelse i europeisk fotball</strong></h3>\n<p>Det laget som vinner Allsvenskan f&aring;r plass i kvalifiseringen til UEFA Champions League. Lagene som ender p&aring; 2. og 3. plass, samt vinneren av Svenska Cupen, kvalifiserer seg til kvalifiseringen for UEFA Europa Conference League.</p>\n<h3><strong>Popul&aelig;re klubber i Allsvenskan</strong></h3>\n<ul>\n<li><strong>Malm&ouml; FF</strong>: Liganes mestvinnende klubb og kjent for sine prestasjoner i Europa.</li>\n<li><strong>AIK</strong>: Tradisjonsrik klubb fra Stockholm med stor tilhengerskare.</li>\n<li><strong>IFK G&ouml;teborg</strong>: Ogs&aring; kjent som \"Bl&aring;vitt\", har vunnet UEFA-cupen to ganger (1982 og 1987).</li>\n<li><strong>Hammarby IF</strong>: Kjent for sin lidenskapelige supporterkultur.</li>\n</ul>\n<h3><strong>Betydning</strong></h3>\n<p>Allsvenskan har en viktig rolle i svensk idrettskultur og trekker stor interesse b&aring;de nasjonalt og internasjonalt. Ligaen er kjent for sine entusiastiske fans, intense derbykamper og sitt bidrag til utviklingen av svenske fotballtalenter.</p>\n</div>\n</div>\n</div>\n</div>\n</div>\n</div>', 13, '2024-11-19 17:34:26', 232),
(118, '<div class=\"flex-shrink-0 flex flex-col relative items-end\">\n<div>\n<div class=\"pt-0\">\n<div class=\"gizmo-bot-avatar flex h-8 w-8 items-center justify-center overflow-hidden rounded-full\">&nbsp;</div>\n</div>\n</div>\n</div>\n<div class=\"group/conversation-turn relative flex w-full min-w-0 flex-col agent-turn\">\n<div class=\"flex-col gap-1 md:gap-3\">\n<div class=\"flex max-w-full flex-col flex-grow\">\n<div class=\"min-h-8 text-message flex w-full flex-col items-end gap-2 whitespace-normal break-words [.text-message+&amp;]:mt-5\" dir=\"auto\" data-message-author-role=\"assistant\" data-message-id=\"abd56308-6bd3-4f57-8329-d6475cb92688\" data-message-model-slug=\"gpt-4o\">\n<div class=\"flex w-full flex-col gap-1 empty:hidden first:pt-[3px]\">\n<div class=\"markdown prose w-full break-words dark:prose-invert dark\">\n<p>&nbsp;</p>\n<p><strong>Allsvenskan</strong> er den &oslash;verste divisjonen i svensk herrefotball og regnes som Sveriges mest prestisjefylte fotballiga. Den ble grunnlagt i 1924 og har siden v&aelig;rt den fremste arenaen for Sveriges beste fotballklubber i kampen om det nasjonale mesterskapet. Allsvenskan organiseres av Svenska Fotbollf&ouml;rbundet og f&oslash;lger et seriesystem der de beste lagene kvalifiserer seg til europeiske turneringer, mens de d&aring;rligste risikerer nedrykk til Superettan, Sveriges nest h&oslash;yeste divisjon.</p>\n<h3><strong>Format</strong></h3>\n<p>Allsvenskan best&aring;r av 16 lag som spiller mot hverandre to ganger i l&oslash;pet av sesongen, &eacute;n kamp hjemme og &eacute;n kamp borte, noe som utgj&oslash;r totalt 30 serierunder. Ligaen spilles innenfor kalender&aring;ret, vanligvis fra april til november, p&aring; grunn av klimaet i Sverige.</p>\n<ul>\n<li><strong>Poengsystem</strong>: Seier gir 3 poeng, uavgjort gir 1 poeng, og tap gir 0 poeng.</li>\n<li><strong>Plasseringer</strong>: Laget med flest poeng etter endt sesong blir seriemester, mens de to nederste lagene rykker direkte ned til Superettan. Laget som ender p&aring; 14. plass spiller kvalifisering mot tredjeplassen fra Superettan.</li>\n</ul>\n<h3><strong>Historie og statistikk</strong></h3>\n<ul>\n<li>F&oslash;rste sesong: 1924/1925</li>\n<li>Mestvinnende klubb: Malm&ouml; FF (flest titler)</li>\n<li>St&oslash;rste rivaliseringer: AIK&ndash;Djurg&aring;rden, Malm&ouml; FF&ndash;IFK G&ouml;teborg, og Hammarby&ndash;Djurg&aring;rden</li>\n<li>Rekordtilskuertall: 52 194 (HIF&ndash;Malm&ouml; FF, 1959, p&aring; Olympia, Helsingborg)</li>\n</ul>\n<h3><strong>Deltakelse i europeisk fotball</strong></h3>\n<p>Det laget som vinner Allsvenskan f&aring;r plass i kvalifiseringen til UEFA Champions League. Lagene som ender p&aring; 2. og 3. plass, samt vinneren av Svenska Cupen, kvalifiserer seg til kvalifiseringen for UEFA Europa Conference League.</p>\n<h3><strong>Popul&aelig;re klubber i Allsvenskan</strong></h3>\n<ul>\n<li><strong>Malm&ouml; FF</strong>: Liganes mestvinnende klubb og kjent for sine prestasjoner i Europa.</li>\n<li><strong>AIK</strong>: Tradisjonsrik klubb fra Stockholm med stor tilhengerskare.</li>\n<li><strong>IFK G&ouml;teborg</strong>: Ogs&aring; kjent som \"Bl&aring;vitt\", har vunnet UEFA-cupen to ganger (1982 og 1987).</li>\n<li><strong>Hammarby IF</strong>: Kjent for sin lidenskapelige supporterkultur.</li>\n</ul>\n<h3><strong>Betydning</strong></h3>\n<p>Allsvenskan har en viktig rolle i svensk idrettskultur og trekker stor interesse b&aring;de nasjonalt og internasjonalt. Ligaen er kjent for sine entusiastiske fans, intense derbykamper og sitt bidrag til utviklingen av svenske fotballtalenter.</p>\n</div>\n</div>\n</div>\n</div>\n</div>\n</div>', 13, '2024-11-19 17:34:47', 232);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Tags`
--

CREATE TABLE `Tags` (
  `tag_id` int NOT NULL,
  `tag_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Tags`
--

INSERT INTO `Tags` (`tag_id`, `tag_name`) VALUES
(9, 'Leagues'),
(5, 'Players'),
(8, 'Teams');

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Teams`
--

CREATE TABLE `Teams` (
  `name` varchar(100) NOT NULL,
  `coach` varchar(100) DEFAULT NULL,
  `emblem_image_url` varchar(255) DEFAULT NULL,
  `id` int NOT NULL,
  `league` int NOT NULL,
  `country` int NOT NULL DEFAULT '1',
  `content` varchar(8000) DEFAULT NULL,
  `page_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Teams`
--

INSERT INTO `Teams` (`name`, `coach`, `emblem_image_url`, `id`, `league`, `country`, `content`, `page_id`) VALUES
('AIK', 'Per-Erik Johnsson', 'https://upload.wikimedia.org/wikipedia/en/5/5f/AIK_logo.svg', 1, 1, 10, '<p>AIK, eller Allm&auml;nna Idrottsklubben, er en svensk idrettsklubb basert i Solna, Stockholm. Klubben ble grunnlagt i 1891 og er en av Sveriges mest suksessfulle og historisk betydningsfulle idrettslag. AIK er best kjent for sitt fotballag, som spiller i Allsvenskan, den &oslash;verste divisjonen i svensk fotball. Klubben har vunnet flere nasjonale mesterskap og har en stor tilhengerskare. I tillegg til fotball, har AIK aktiviteter innenfor flere andre idretter, som ishockey, bandy og h&aring;ndball. Klubbens hjemmearena for fotball er Friends Arena, som ligger i Solna. AIK har tradisjonelt hatt et sterkt lokalt engasjement og har rivaler som Djurg&aring;rdens IF og Hammarby IF, med kampene mot disse lagene kjent som Stockholmsderbyene. AIK er ogs&aring; kjent for sitt sterke supporterfellesskap, med supportergrupper som AIK Solna Support och Black Army, som spiller en viktig rolle i klubbens identitet og atmosf&aelig;re p&aring; kampene.<strong> Test</strong></p>', 1),
('Barcelona', 'Xavi Hernandez', 'https://static.cdnlogo.com/logos/f/14/fc-barcelona.svg', 2, 5, 9, '<p>FC Barcelona, etablert i 1899, er en av de mest ber&oslash;mte fotballklubbene i verden, med base i Barcelona, Spania. Klubben spiller sine hjemmekamper p&aring; det ikoniske Camp Nou, som har en kapasitet p&aring; over 99 000 tilskuere. Barcelona er kjent for sin unike spillestil, kalt \"tiki-taka\", og har utviklet mange legendariske spillere, inkludert Lionel Messi, som er klubbens toppscorer. Klubben har vunnet La Liga over 25 ganger og UEFA Champions League mange ganger. Barcelona har en stor og lidenskapelig fanbase, kjent som \"culers.\" Rivaliseringen med Real Madrid, kjent som \"El Cl&aacute;sico,\" er en av de mest intense i fotballhistorien. Klubben fokuserer ogs&aring; p&aring; ungdomsutvikling gjennom sitt akademi, La Masia, som har produsert mange av klubbens st&oslash;rste talenter.</p>', 23),
('Bayern Munich', 'Thomas Tuchel', 'https://static.cdnlogo.com/logos/b/81/bayern.svg', 3, 2, 4, '<p>Bayern M&uuml;nchen, grunnlagt i 1900, er en av de mest suksessrike klubbene i tysk og europeisk fotball. Klubben holder til i M&uuml;nchen og spiller hjemmekampene sine p&aring; Allianz Arena, som har en kapasitet p&aring; over 75 000 tilskuere. Bayern har vunnet Bundesligaen over 30 ganger, og de har ogs&aring; hatt stor suksess i UEFA Champions League, med flere titler. Klubben er kjent for &aring; utvikle og tiltrekke seg stjernespillere som Franz Beckenbauer, Gerd M&uuml;ller, og mer nylig, Robert Lewandowski. Bayern har en stor, dedikert supporterbase, og rivaliseringen med Borussia Dortmund er spesielt kjent. Klubben fokuserer p&aring; b&aring;de nasjonal og internasjonal suksess, med en sterk akademi som utvikler unge talenter for fremtiden.</p>', 22),
('Borussia Dortmund', 'Edin Terzić', 'https://static.cdnlogo.com/logos/b/29/borussia-dortmund.svg', 4, 2, 4, '<p>Borussia Dortmund, grunnlagt i 1909, er en av de mest popul&aelig;re fotballklubbene i Tyskland, basert i Dortmund. Klubben spiller hjemmekampene sine p&aring; Signal Iduna Park, som har en av de st&oslash;rste tilskuerkapasitetene i Europa. Dortmund er kjent for sin offensive spillestil og har en sterk tilknytning til ungdomsutvikling, med mange talenter som har debutert p&aring; f&oslash;rstelaget. Klubben har vunnet Bundesligaen flere ganger og har ogs&aring; hatt suksess i europeiske turneringer, inkludert &aring; vinne UEFA Champions League. Rivaliseringen med Bayern M&uuml;nchen er intens, kjent som \"Der Klassiker.\" Borussia Dortmunds supportere, kjent som \"Die Schwarzgelben,\" skaper en elektrisk atmosf&aelig;re under kampene. Klubben er ogs&aring; kjent for sin sterke samfunnsforpliktelse og deltar aktivt i lokalsamfunnet.&nbsp;</p>', 21),
('Brøndby IF', 'Jesper Sørensen', 'https://static.cdnlogo.com/logos/b/14/brondby-new.svg', 5, 3, 1, 'Brøndby IF, grunnlagt i 1964, er en av Danmarks mest suksessrike fotballklubber, med base i Brøndbyvester. Klubben spiller hjemmekampene sine på Brøndby Stadion, kjent for sin dedikerte fanbase. Brøndby har vunnet den danske Superligaen mange ganger og er kjent for sin intense rivalisering med FC København, kjent som \"New Firm.\" Klubben har et sterkt fokus på ungdomsutvikling og har produsert mange talentfulle spillere som har nådd internasjonalt nivå. Brøndby IF har også hatt suksess i europeiske turneringer, selv om det er utfordrende å konkurrere mot de største klubbene. Fansen skaper en livlig atmosfære under kampene, og klubbens historie er fylt med både triumfer og utfordringer.', 20),
('FC Copenhagen', 'Jacob Neestrup', 'https://static.cdnlogo.com/logos/f/84/fckobe-1.svg', 6, 3, 1, 'FC København, etablert i 1992, er en av de mest fremtredende klubbene i dansk fotball. Klubben holder til i København og spiller hjemmekampene sine på Parken Stadium. FC København har vunnet Superligaen mange ganger og er kjent for sin sterke prestasjon i europeiske turneringer. Klubben har en stor og lidenskapelig supporterbase, som er kjent for å skape en intens atmosfære på kampdagene. Rivaliseringen med Brøndby IF gir ekstra spenning til ligaen. FC København legger også stor vekt på ungdomsutvikling, og har et talentfullt akademi. Klubben har hatt mange spillere som har gjort seg bemerket internasjonalt, og har som mål å konkurrere om titler både nasjonalt og internasjonalt.', 19),
('HJK Helsinki', 'Toni Koskela', 'https://static.cdnlogo.com/logos/h/10/hjkhel-1.svg', 8, 8, 2, 'HJK Helsinki, etablert i 1907, er den mest suksessrike fotballklubben i Finland, basert i Helsingfors. Klubben spiller sine hjemmekamper på Telia 5G Areena. HJK har vunnet Veikkausliiga flere ganger, og har også gjort seg bemerket i europeiske turneringer. Klubben har et sterkt fokus på ungdomsutvikling, og mange spillere har kommet opp gjennom akademiet. HJK er kjent for sin sterke supporterbase, og kampene deres har en livlig atmosfære. Klubben har også en viktig rolle i det finske fotballmiljøet og bidrar til utviklingen av sporten i landet. HJK har også rivaliseringer med andre finske klubber, som helserett på finnenes hjerter.', 17),
('IFK Göteborg', 'Jens Askou', 'https://static.cdnlogo.com/logos/i/97/ifkgot-1.svg', 9, 1, 10, 'IFK Göteborg, etablert i 1904, er en av de mest kjente fotballklubbene i Sverige, med base i Göteborg. Klubben spiller hjemmekampene sine på Gamla Ullevi, og har vunnet Allsvenskan flere ganger, med en sterk tilknytning til svensk fotballhistorie. IFK Göteborg er kjent for sin sterke ungdomsutvikling og har produsert mange talenter som har gjort seg bemerket både nasjonalt og internasjonalt. Rivaliseringen med Malmö FF er spesielt intens, og kampene mellom disse to klubbene tiltrekker seg stor oppmerksomhet. IFK har også hatt suksess i europeiske turneringer, noe som har hevet klubbens profil. Klubben har en dedikert fanbase som skaper en fantastisk atmosfære under kampene.', 16),
('KR Reykjavík', 'Rúnar Kristinsson', 'https://cdn.resfu.com/img_data/equipos/5759.png?size=340c&lossy=1&ext=jpeg&v=1', 10, 7, 5, 'KR Reykjavík, grunnlagt i 1899, er den eldste fotballklubben i Island, med base i Reykjavik. Klubben spiller hjemmekampene sine på KR-völlur. KR har vunnet Úrvalsdeild flere ganger og har en rik tradisjon innen islandsk fotball. Klubben har en sterk tilknytning til lokalsamfunnet og er kjent for sin dedikasjon til ungdomsutvikling. KR har hatt flere spillere som har nådd landslagstatus, og er kjent for å dyrke talenter. Klubben har også en stor og lidenskapelig supporterbase, som støtter laget på kampdagene. Rivaliseringene med andre klubber i Reykjavik, spesielt Valur, gir ekstra spenning til kampene.', 15),
('KuPS', 'Jani Honkavaara', 'https://static.cdnlogo.com/logos/k/27/kups.svg', 11, 8, 2, 'KuPS, eller Kuopion Palloseura, er en finsk fotballklubb grunnlagt i 1923 og basert i Kuopio. Klubben spiller hjemmekampene sine på Savon Sanomat Areena. KuPS har en stolt historie og har vunnet Veikkausliiga flere ganger. Klubben har en sterk tilknytning til lokalsamfunnet og engasjerer seg i ungdomsutvikling, med et talentfullt akademi. KuPS har også hatt suksess i europeiske turneringer, som har bidratt til klubbens profil i internasjonal fotball. Klubbens supportere er kjent for å skape en fantastisk atmosfære på kampene, og rivaliseringen med andre klubber i Finland gir ekstra spenning. KuPS har som mål å fortsette å være en ledende klubb i finsk fotball.', 14),
('Marseille', 'Marcelino García Toral', 'https://static.cdnlogo.com/logos/o/74/olympique-de-marseille.png', 12, 6, 3, 'Marseille, grunnlagt i 1899, er en av de mest berømte fotballklubbene i Frankrike, basert i Marseille. Klubben spiller hjemmekampene sine på Stade Vélodrome, som har en kapasitet på over 67 000 tilskuere. Marseille har vunnet Ligue 1 flere ganger og er kjent for sin intense rivalisering med Paris Saint-Germain, kjent som \"Le Classique.\" Klubben har en stor og lidenskapelig fanbase, kjent som \"Les Ultras.\" Marseille har også hatt suksess i europeiske turneringer, og var den første klubben til å vinne UEFA Champions League i 1993. Klubben har et sterkt fokus på ungdomsutvikling, med akademiet som dyrker nye talenter for fremtiden. Marseille har en rik historie og er en viktig del av fransk fotball.', 13),
('Molde FK', 'Erling Moe', 'https://static.cdnlogo.com/logos/m/58/molde-fotball.svg', 13, 4, 8, 'Molde FK, etablert i 1911, er en av Norges mest kjente fotballklubber, basert i Molde. Klubben spiller hjemmekampene sine på Aker Stadion og har vunnet Eliteserien flere ganger. Molde er kjent for sin sterke ungdomsutvikling, og klubben har produsert mange talenter som har gjort seg bemerket på både nasjonalt og internasjonalt nivå. Rivaliseringen med Rosenborg BK er intens, og kampene mellom disse lagene tiltrekker seg stor oppmerksomhet. Molde har også hatt suksess i europeiske turneringer, og har en dedikert fanbase som støtter laget helhjertet. Klubben har en rik historie og en ambisjon om å fortsette å være en ledende klubb i norsk fotball.', 12),
('Paris Saint-Germain', 'Luis Enrique', 'https://static.cdnlogo.com/logos/p/28/psg-paris-saint-germain.png', 14, 6, 3, 'Paris Saint-Germain, etablert i 1970, er en av de mest suksessrike og kjente fotballklubbene i verden, med base i Paris, Frankrike. Klubben spiller sine hjemmekamper på Parc des Princes. PSG har vunnet Ligue 1 flere ganger og har hatt stor suksess på internasjonalt nivå, inkludert UEFA Champions League. Klubben er kjent for å tiltrekke seg stjernespillere som Neymar, Kylian Mbappé og Lionel Messi. PSG har en stor og lidenskapelig fanbase, og rivaliseringen med Marseille er intens. Klubben har investert mye i ungdomsutvikling og har et akademi som utvikler fremtidige talenter. PSGs ambisjoner er å dominere både nasjonalt og internasjonalt.', 11),
('Rosenborg BK', 'Svein Maalen', 'https://static.cdnlogo.com/logos/r/27/rosenborg.svg', 15, 4, 8, 'Rosenborg BK, grunnlagt i 1917, er en av de mest suksessrike fotballklubbene i Norge, med base i Trondheim. Klubben spiller hjemmekampene sine på Lerkendal Stadion. Rosenborg har vunnet Eliteserien over 20 ganger og har vært en viktig aktør i norsk fotball. Klubben har hatt suksess i europeiske turneringer, og er kjent for sin sterke ungdomsutvikling. Rivaliseringen med Molde FK er spesielt intens. Rosenborgs supportere er kjente for sin dedikasjon og skaper en fantastisk atmosfære på kampene. Klubben har en stolt historie og har som mål å fortsette å være en ledende klubb i norsk fotball.', 10),
('FFK', 'Test Testesen', 'https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg', 28, 4, 8, '<p>This is a test team</p>', 187);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Users`
--

CREATE TABLE `Users` (
  `user_id` int NOT NULL,
  `google_id` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `profile_image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `first_login` date NOT NULL DEFAULT '2024-01-01',
  `last_login` timestamp NULL DEFAULT NULL,
  `last_logout` timestamp NULL DEFAULT NULL,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dataark for tabell `Users`
--

INSERT INTO `Users` (`user_id`, `google_id`, `username`, `email`, `profile_image_url`, `created_at`, `first_login`, `last_login`, `last_logout`, `is_admin`) VALUES
(1, 'google123', 'alice', 'alice@example.com', 'https://example.com/img/alice.png', '2024-01-01 09:00:00', '2024-01-01', NULL, '2024-11-08 23:03:55', 0),
(2, 'google456', 'bob', 'bob@example.com', 'https://example.com/img/bob.png', '2024-01-02 10:00:00', '2024-01-01', NULL, '2024-11-08 23:03:55', 0),
(3, 'google789', 'charlie', 'charlie@example.com', 'https://example.com/img/charlie.png', '2024-01-03 11:00:00', '2024-01-01', NULL, '2024-11-08 23:03:55', 0),
(12, '101886104197826761935', 'Larissa Vajenina', 'laratij@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocLZRr6BslRIqRj9hjsUu5JN57bKPXiYApex0t-mbPWvQrg6NsJd=s96-c', '2024-11-06 19:20:20', '2024-11-06', '2024-11-14 15:31:20', '2024-11-14 15:24:02', 0),
(13, '113469480898904280426', 'Anders Myrvang', 'anders.myrvang@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocL7tIli1Au6YADXY1iTYM0__BPiObHXeORc41e4yllRDij_pSdN=s96-c', '2024-11-06 22:23:15', '2024-11-06', '2024-11-19 17:30:30', '2024-11-19 17:29:25', 1),
(14, '105872336279658822116', 'Kasper Hansen', 'kasper.gjesdal.hansen@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocIDXvwQRnvhQHa3beDWhPAWDpIOWSdKpQgoqxMMePOHXltGPw=s96-c', '2024-11-07 13:00:07', '2024-11-07', '2024-11-18 12:44:30', '2024-11-14 11:56:08', 1),
(15, '114289230088996263685', 'Ivar Rivertz', 'ivarrivertz@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocIGT_2--X5cEZJTH8KDlgTIuapUZRAWfEkR0l8I0vY2dHssOm7x=s96-c', '2024-11-07 14:22:36', '2024-11-07', '2024-11-19 17:06:00', '2024-11-14 13:46:33', 1),
(17, '108382705258339969405', 'Larissa Vajenina', 'larissa.vajenina@ntnu.no', 'https://lh3.googleusercontent.com/a/ACg8ocK6cyFxxGMhuHWmnGoU12AoXwW4CZlmdlbdKcncDP8uvkKILw=s96-c', '2024-11-08 21:18:32', '2024-11-08', '2024-11-08 23:01:57', '2024-11-08 23:02:07', 0),
(18, '105692123453505242912', 'Ellen Urdal', 'urdal.ellen@gmail.com', 'https://lh3.googleusercontent.com/a/ACg8ocIvjjkFoorp9b5sZ4rtt3lUgYiuShPdL4nmJ_cFAghkQtPccQ=s96-c', '2024-11-11 07:19:38', '2024-11-11', '2024-11-18 14:29:51', '2024-11-18 14:29:43', 1);

-- --------------------------------------------------------

--
-- Tabellstruktur for tabell `Users_like_dislike`
--

CREATE TABLE `Users_like_dislike` (
  `comment_id` int NOT NULL,
  `user_id` int NOT NULL,
  `liked` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Comments`
--
ALTER TABLE `Comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `Page_id` (`Page_id`);

--
-- Indexes for table `Countries`
--
ALTER TABLE `Countries`
  ADD PRIMARY KEY (`country_id`);

--
-- Indexes for table `Leagues`
--
ALTER TABLE `Leagues`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_country_league` (`country`),
  ADD KEY `page_id` (`page_id`);

--
-- Indexes for table `Pages`
--
ALTER TABLE `Pages`
  ADD PRIMARY KEY (`Page_id`),
  ADD KEY `Created_by` (`Created_by`);

--
-- Indexes for table `PageTags`
--
ALTER TABLE `PageTags`
  ADD PRIMARY KEY (`page_id`,`tag_id`),
  ADD KEY `tag_id` (`tag_id`);

--
-- Indexes for table `Players`
--
ALTER TABLE `Players`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_country_player` (`country`),
  ADD KEY `page_id` (`page_id`),
  ADD KEY `fk_team_id` (`team`);

--
-- Indexes for table `Revisions`
--
ALTER TABLE `Revisions`
  ADD PRIMARY KEY (`revision_id`),
  ADD KEY `revised_by` (`revised_by`),
  ADD KEY `Revisions_ibfk_3` (`page_id`);

--
-- Indexes for table `Tags`
--
ALTER TABLE `Tags`
  ADD PRIMARY KEY (`tag_id`),
  ADD UNIQUE KEY `tag_name` (`tag_name`);

--
-- Indexes for table `Teams`
--
ALTER TABLE `Teams`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_league_id` (`league`),
  ADD KEY `fk_country_team` (`country`),
  ADD KEY `page_id` (`page_id`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `google_id` (`google_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `Users_like_dislike`
--
ALTER TABLE `Users_like_dislike`
  ADD PRIMARY KEY (`comment_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Comments`
--
ALTER TABLE `Comments`
  MODIFY `comment_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `Leagues`
--
ALTER TABLE `Leagues`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `Pages`
--
ALTER TABLE `Pages`
  MODIFY `Page_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=233;

--
-- AUTO_INCREMENT for table `Players`
--
ALTER TABLE `Players`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=140;

--
-- AUTO_INCREMENT for table `Revisions`
--
ALTER TABLE `Revisions`
  MODIFY `revision_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=119;

--
-- AUTO_INCREMENT for table `Tags`
--
ALTER TABLE `Tags`
  MODIFY `tag_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `Teams`
--
ALTER TABLE `Teams`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Begrensninger for dumpede tabeller
--

--
-- Begrensninger for tabell `Comments`
--
ALTER TABLE `Comments`
  ADD CONSTRAINT `Comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`),
  ADD CONSTRAINT `Comments_ibfk_3` FOREIGN KEY (`Page_id`) REFERENCES `Pages` (`Page_id`) ON DELETE CASCADE;

--
-- Begrensninger for tabell `Leagues`
--
ALTER TABLE `Leagues`
  ADD CONSTRAINT `Leagues_ibfk_1` FOREIGN KEY (`country`) REFERENCES `Countries` (`country_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Leagues_ibfk_2` FOREIGN KEY (`page_id`) REFERENCES `Pages` (`Page_id`) ON DELETE CASCADE;

--
-- Begrensninger for tabell `Pages`
--
ALTER TABLE `Pages`
  ADD CONSTRAINT `Pages_ibfk_1` FOREIGN KEY (`Created_by`) REFERENCES `Users` (`user_id`);

--
-- Begrensninger for tabell `PageTags`
--
ALTER TABLE `PageTags`
  ADD CONSTRAINT `PageTags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `Tags` (`tag_id`),
  ADD CONSTRAINT `PageTags_ibfk_3` FOREIGN KEY (`page_id`) REFERENCES `Pages` (`Page_id`);

--
-- Begrensninger for tabell `Players`
--
ALTER TABLE `Players`
  ADD CONSTRAINT `fk_team_id` FOREIGN KEY (`team`) REFERENCES `Teams` (`id`),
  ADD CONSTRAINT `Players_ibfk_1` FOREIGN KEY (`country`) REFERENCES `Countries` (`country_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Players_ibfk_2` FOREIGN KEY (`page_id`) REFERENCES `Pages` (`Page_id`) ON DELETE CASCADE;

--
-- Begrensninger for tabell `Revisions`
--
ALTER TABLE `Revisions`
  ADD CONSTRAINT `Revisions_ibfk_2` FOREIGN KEY (`revised_by`) REFERENCES `Users` (`user_id`),
  ADD CONSTRAINT `Revisions_ibfk_3` FOREIGN KEY (`page_id`) REFERENCES `Pages` (`Page_id`) ON DELETE CASCADE;

--
-- Begrensninger for tabell `Teams`
--
ALTER TABLE `Teams`
  ADD CONSTRAINT `fk_league_id` FOREIGN KEY (`league`) REFERENCES `Leagues` (`id`),
  ADD CONSTRAINT `Teams_ibfk_1` FOREIGN KEY (`country`) REFERENCES `Countries` (`country_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Teams_ibfk_2` FOREIGN KEY (`page_id`) REFERENCES `Pages` (`Page_id`) ON DELETE CASCADE;

--
-- Begrensninger for tabell `Users_like_dislike`
--
ALTER TABLE `Users_like_dislike`
  ADD CONSTRAINT `Users_like_dislike_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `Comments` (`comment_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `Users_like_dislike_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`user_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
