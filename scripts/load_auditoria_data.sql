--
-- PostgreSQL database dump
--

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

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
-- Data for Name: auditoria_registro; Type: TABLE DATA; Schema: public; Owner: auditoria_user
--

INSERT INTO public.auditoria_registro (id, correlacion, detalle, fecha, ip, modulo, severidad, tipo, usuario, version) VALUES (1, 'USR-2025-10-24-01', 'Inicio de sesión exitoso', '2025-11-23 04:30:32.456063', '192.168.0.12', 'usuarios', 'INFO', 'LOGIN', '9876542', 0);
INSERT INTO public.auditoria_registro (id, correlacion, detalle, fecha, ip, modulo, severidad, tipo, usuario, version) VALUES (165, '1dd703cc-5186-4563-bede-677809bc81b8', 'Voto registrado. Partido=MENOS, Candidato=Fabio Polonia - David Rodriguez, Localidad=La Paz, Fecha=2025-12-18T19:20:49.857Z', '2025-12-18 19:20:58.827443', '0.0.0.0', 'Votaciones', 'INFO', 'VOTO_EMITIDO', '00000000', 0);

--
-- Name: auditoria_registro_id_seq; Type: SEQUENCE SET; Schema: public; Owner: auditoria_user
--

SELECT pg_catalog.setval('public.auditoria_registro_id_seq', 177, true);
