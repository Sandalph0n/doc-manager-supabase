SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict KYMQbwNUnmJtkCVY0VKCTrn1PfucYwo1OCykK59lZOEgCowa7Nvtt7qQZB7wRmH

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', 'authenticated', 'authenticated', 'nguyenthichlaptrinh@gmail.com', '$2a$10$/lEJEHqj4l0eualxzEwHMO4qcVXqbkvLN2UQD2QwUJp3F271ZiZkW', '2026-06-28 14:33:44.812567+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-05 08:47:15.703172+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-06-28 14:33:44.790796+00', '2026-07-13 06:05:44.47739+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('4e8eb72f-3ce7-48ec-9567-b632c39bd237', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '{"sub": "4e8eb72f-3ce7-48ec-9567-b632c39bd237", "email": "nguyenthichlaptrinh@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2026-06-28 14:33:44.804828+00', '2026-06-28 14:33:44.804901+00', '2026-06-28 14:33:44.804901+00', '52156fe3-555b-4d38-926c-76104ebf0792');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id", "refresh_token_hmac_key", "refresh_token_counter", "scopes") VALUES
	('215b2bea-aa98-417e-beaf-1b07058ef9d7', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '2026-07-04 16:32:38.090875+00', '2026-07-04 16:32:38.090875+00', NULL, 'aal1', NULL, NULL, 'node', '157.211.44.102', NULL, NULL, NULL, NULL, NULL),
	('2bf0e512-465d-4182-ae4d-41e277978170', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '2026-07-05 08:47:15.705013+00', '2026-07-05 08:47:15.705013+00', NULL, 'aal1', NULL, NULL, 'node', '157.211.44.102', NULL, NULL, NULL, NULL, NULL),
	('b66d645c-5d25-4727-bc26-5084fd19224d', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '2026-07-03 17:17:20.80538+00', '2026-07-05 10:09:08.764402+00', NULL, 'aal1', NULL, '2026-07-05 10:09:08.764294', 'node', '157.211.44.102', NULL, NULL, NULL, NULL, NULL),
	('9562348c-a87b-4e30-8f4c-e279c5285430', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '2026-07-03 17:11:41.296145+00', '2026-07-13 06:05:44.491335+00', NULL, 'aal1', NULL, '2026-07-13 06:05:44.491228', 'node', '157.211.44.102', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('9562348c-a87b-4e30-8f4c-e279c5285430', '2026-07-03 17:11:41.300957+00', '2026-07-03 17:11:41.300957+00', 'password', 'b30418c5-aac2-401a-b74d-511795c4e77c'),
	('b66d645c-5d25-4727-bc26-5084fd19224d', '2026-07-03 17:17:20.823269+00', '2026-07-03 17:17:20.823269+00', 'password', '39963a32-a612-402c-914d-54fdcbd87c65'),
	('215b2bea-aa98-417e-beaf-1b07058ef9d7', '2026-07-04 16:32:38.122216+00', '2026-07-04 16:32:38.122216+00', 'password', 'ed2e181c-ea0f-4786-86e2-3e2fc1638249'),
	('2bf0e512-465d-4182-ae4d-41e277978170', '2026-07-05 08:47:15.739193+00', '2026-07-05 08:47:15.739193+00', 'password', 'cc3ffcf8-1b05-4e26-88d1-3a9082a8a904');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 40, 'ybr7gm6m57dl', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-12 17:56:46.645219+00', '2026-07-13 00:30:25.039139+00', 'cxscu3r34kx7', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 41, '42ht6pz7yri7', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-13 00:30:25.057108+00', '2026-07-13 06:05:44.454814+00', 'ybr7gm6m57dl', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 42, 'cc2lmzfv2m7t', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', false, '2026-07-13 06:05:44.469193+00', '2026-07-13 06:05:44.469193+00', '42ht6pz7yri7', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 23, 'crmmub7uqzar', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-03 17:11:41.299011+00', '2026-07-03 18:12:00.441005+00', NULL, '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 25, 'wucn5zf77wow', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-03 18:12:00.451213+00', '2026-07-04 10:45:51.207846+00', 'crmmub7uqzar', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 26, 'gqdlhrpr4xjp', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-04 10:45:51.219574+00', '2026-07-04 11:44:24.960161+00', 'wucn5zf77wow', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 27, 'qfzkcunxiw26', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-04 11:44:24.968487+00', '2026-07-04 12:42:31.644315+00', 'gqdlhrpr4xjp', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 28, 'biut32hjjsd5', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-04 12:42:31.652772+00', '2026-07-04 13:41:01.708442+00', 'qfzkcunxiw26', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 29, 'ggdnopaz4psm', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-04 13:41:01.714055+00', '2026-07-04 14:39:01.893494+00', 'biut32hjjsd5', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 30, 'kxjbj3ccw355', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-04 14:39:01.905498+00', '2026-07-04 15:39:10.566125+00', 'ggdnopaz4psm', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 32, 'pcuzfwl7io74', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', false, '2026-07-04 16:32:38.114744+00', '2026-07-04 16:32:38.114744+00', NULL, '215b2bea-aa98-417e-beaf-1b07058ef9d7'),
	('00000000-0000-0000-0000-000000000000', 31, 'hmnok5ndmdwa', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-04 15:39:10.584077+00', '2026-07-05 07:49:38.112346+00', 'kxjbj3ccw355', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 34, 'f4ibd7ct3al5', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', false, '2026-07-05 08:47:15.730602+00', '2026-07-05 08:47:15.730602+00', NULL, '2bf0e512-465d-4182-ae4d-41e277978170'),
	('00000000-0000-0000-0000-000000000000', 24, 'rwlflp34ty3l', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-03 17:17:20.818929+00', '2026-07-05 10:09:08.745783+00', NULL, 'b66d645c-5d25-4727-bc26-5084fd19224d'),
	('00000000-0000-0000-0000-000000000000', 35, 'xcup256smslu', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', false, '2026-07-05 10:09:08.75079+00', '2026-07-05 10:09:08.75079+00', 'rwlflp34ty3l', 'b66d645c-5d25-4727-bc26-5084fd19224d'),
	('00000000-0000-0000-0000-000000000000', 33, 'ldajjy25nm7l', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-05 07:49:38.132923+00', '2026-07-11 13:17:36.143534+00', 'hmnok5ndmdwa', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 36, 'xlfnakek4fmz', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-11 13:17:36.159572+00', '2026-07-12 06:27:18.382782+00', 'ldajjy25nm7l', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 37, 'eub2t6c6zozf', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-12 06:27:18.389157+00', '2026-07-12 15:44:00.322828+00', 'xlfnakek4fmz', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 38, 'wbvcky7ier3x', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-12 15:44:00.336543+00', '2026-07-12 16:56:24.586388+00', 'eub2t6c6zozf', '9562348c-a87b-4e30-8f4c-e279c5285430'),
	('00000000-0000-0000-0000-000000000000', 39, 'cxscu3r34kx7', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-12 16:56:24.595479+00', '2026-07-12 17:56:46.635803+00', 'wbvcky7ier3x', '9562348c-a87b-4e30-8f4c-e279c5285430');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 42, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict KYMQbwNUnmJtkCVY0VKCTrn1PfucYwo1OCykK59lZOEgCowa7Nvtt7qQZB7wRmH

RESET ALL;
