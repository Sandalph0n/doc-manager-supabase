SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict jI6qyitunoRNSTWIHDvnZJVZ2xE5u3XFozdeKIejlnf7q512mQA1OGHjFn85LhS

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

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'a66369ba-b846-4bd6-9a6b-f3aa9b685275', '{"action":"login","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-15 13:54:25.253776+00', ''),
	('00000000-0000-0000-0000-000000000000', '2820f756-a44f-43c1-a2bb-ea06c0688754', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-15 15:00:26.618355+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef1cf2c0-3113-4211-b8e8-0565fd5a466a', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-15 15:00:26.619245+00', ''),
	('00000000-0000-0000-0000-000000000000', '0e31c300-fb36-438a-8d07-d8f0f0b7e839', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-15 16:01:36.12072+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd830aea0-f56f-4b84-93cc-085a660c1108', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-15 16:01:36.121443+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f8c950c-ec68-41b8-bb37-e1e5c6c5aaf2', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-16 06:33:15.716492+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6f3c6f6-cb9f-4182-ac29-09a051f69a0c', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-16 06:33:15.717949+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a8810598-62e6-473a-afbb-f12c94ca05a7', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-16 12:34:44.602702+00', ''),
	('00000000-0000-0000-0000-000000000000', '6ed60b46-2d2e-414a-a1d0-dad3e213aff4', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-16 12:34:44.60342+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fcadb7f1-b8d1-4c44-811f-cc5eae515fe4', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-16 13:42:45.558874+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d5cc609-4ae9-4285-bc23-a6058e4e4e59', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-16 13:42:45.561015+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b3b8a04f-f3d6-4fb9-962e-4c2979a1b2d6', '{"action":"logout","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"account"}', '2026-07-16 14:03:25.406767+00', ''),
	('00000000-0000-0000-0000-000000000000', '98648f66-5464-41cb-99c2-223a516c26c9', '{"action":"login","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2026-07-16 14:03:29.02057+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f76a2667-29ee-42a5-9fb5-94572e11823d', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-16 15:02:05.28923+00', ''),
	('00000000-0000-0000-0000-000000000000', '907110be-1888-4aec-b9cc-30a77d991a6d', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-16 15:02:05.290487+00', ''),
	('00000000-0000-0000-0000-000000000000', '5c55dbff-599f-48d9-9f51-2b1e714d0823', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-16 15:02:05.341714+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f17209d-0366-4874-b1f9-dd7e772d95fe', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-17 00:06:09.341995+00', ''),
	('00000000-0000-0000-0000-000000000000', '1712b2cd-7e7b-4dea-9614-e7d189dff579', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-17 00:06:09.342636+00', ''),
	('00000000-0000-0000-0000-000000000000', '9cc69ee8-9d44-4fbf-845d-25542f46ccbe', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-17 00:06:09.377391+00', ''),
	('00000000-0000-0000-0000-000000000000', '54f325ff-8a8c-471f-b233-a767c7bce224', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-20 06:12:53.897176+00', ''),
	('00000000-0000-0000-0000-000000000000', '83ad8c29-c70c-40e7-843d-438fe52772fd', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-20 06:12:53.897765+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b0b2c9d6-285f-4765-b83a-32386e9329bd', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-20 06:12:54.059047+00', ''),
	('00000000-0000-0000-0000-000000000000', '62218fc0-e07e-4458-8149-12d9f617325a', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-20 07:16:31.654571+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f2f6c8d-bf52-4b73-8709-4d4effaee2e7', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-20 07:16:31.655022+00', ''),
	('00000000-0000-0000-0000-000000000000', '30d75eb6-acf1-4f52-aff7-ce7612ead9a0', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-20 13:39:39.262762+00', ''),
	('00000000-0000-0000-0000-000000000000', '9205416e-6bff-4f80-955b-dc27b06f07ff', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-20 13:39:39.263316+00', ''),
	('00000000-0000-0000-0000-000000000000', 'df7f1a73-da1b-42d9-ad62-3d7fa2734a30', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-20 16:23:14.798582+00', ''),
	('00000000-0000-0000-0000-000000000000', '2be6c28f-0dc3-4d55-b259-cb5c87f26418', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-20 16:23:14.799184+00', ''),
	('00000000-0000-0000-0000-000000000000', '47526f4a-ce3e-481b-a37f-39c460da6e0f', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-20 21:50:46.093448+00', ''),
	('00000000-0000-0000-0000-000000000000', '4320adae-be06-4084-a543-96db0d641c9d', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-20 21:50:46.094001+00', ''),
	('00000000-0000-0000-0000-000000000000', '791ccd18-84cc-4da9-8334-500625970645', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-21 05:10:12.069111+00', ''),
	('00000000-0000-0000-0000-000000000000', '7456b5e4-b3a6-4284-a128-44aa0ed66355', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-21 05:10:12.069543+00', ''),
	('00000000-0000-0000-0000-000000000000', '43a94085-36eb-4598-a825-dc4a2e82f59f', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-21 06:51:34.983166+00', ''),
	('00000000-0000-0000-0000-000000000000', '589d4935-657f-4440-8adb-6fd24dc31fd9', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-21 06:51:34.984408+00', ''),
	('00000000-0000-0000-0000-000000000000', '87be7ac2-45e1-4d02-851d-362e8a4aee9b', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-21 15:00:58.309598+00', ''),
	('00000000-0000-0000-0000-000000000000', '1c018207-9554-42aa-bf4a-534d05a56564', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-21 15:00:58.310229+00', ''),
	('00000000-0000-0000-0000-000000000000', '669a430d-b24e-400d-ac57-b191f01e8f32', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-21 15:59:02.548289+00', ''),
	('00000000-0000-0000-0000-000000000000', '9b3b08e6-c91f-4b86-8a3d-885d79d6780a', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-21 15:59:02.548847+00', ''),
	('00000000-0000-0000-0000-000000000000', '212c2d62-202f-4e39-adcf-fb2b461a290d', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-22 00:11:53.666728+00', ''),
	('00000000-0000-0000-0000-000000000000', '52798625-e079-41c5-b3f1-3ee2e146af91', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-22 00:11:53.667313+00', ''),
	('00000000-0000-0000-0000-000000000000', '83493dea-f43e-471a-b0ae-88a6322e533d', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-22 07:15:12.75961+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f26e3c1-af6d-421b-9fff-1b38e9a6321c', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-22 07:15:12.760717+00', ''),
	('00000000-0000-0000-0000-000000000000', '31ada6cf-94d0-4573-934d-257c290f8411', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-22 14:25:04.946942+00', ''),
	('00000000-0000-0000-0000-000000000000', '4dfd78ab-c7b4-4648-a9d0-18509e6f96be', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-22 14:25:04.9475+00', ''),
	('00000000-0000-0000-0000-000000000000', '02a10a36-bc6a-454a-96af-538dc3c0c979', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 04:48:57.60038+00', ''),
	('00000000-0000-0000-0000-000000000000', '5dfdaaf3-2377-4933-bd99-8e9ef43af074', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 04:48:57.601006+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f2b1c0e8-073b-4c58-9238-e7af817381e6', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 05:47:10.70854+00', ''),
	('00000000-0000-0000-0000-000000000000', '6aa9baef-7c81-4777-9c95-a6f71b66d0db', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 05:47:10.709215+00', ''),
	('00000000-0000-0000-0000-000000000000', '7d3c527f-214e-42a1-9cb4-c60df93a81a3', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 07:23:28.527735+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fbed4352-4b9e-485c-ad43-fb73beec39a3', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 07:23:28.528938+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac2cb974-6d67-4d38-a350-70f6992bf28a', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 10:57:05.709141+00', ''),
	('00000000-0000-0000-0000-000000000000', '74e27f0f-c08c-459e-9af2-6b024c3462b6', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 10:57:05.71007+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd465b8b8-5ae1-4480-aade-3b8c767b81e4', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 11:55:33.097784+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a532ddc7-3323-40fd-8cdd-0aa4c121a6c4', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 11:55:33.098416+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b786c234-e965-4d7f-9312-424251e49ff0', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 12:59:07.619213+00', ''),
	('00000000-0000-0000-0000-000000000000', '25c3340a-1adf-4089-9537-0080e286b7c4', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 12:59:07.620066+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e53565fa-e1a9-4d6b-af83-5e921ba00da1', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 14:05:03.900396+00', ''),
	('00000000-0000-0000-0000-000000000000', '546e150d-fcae-4e75-8a9c-d1ae797c38d3', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 14:05:03.966457+00', ''),
	('00000000-0000-0000-0000-000000000000', '90095d37-09c2-4e9f-9eb7-843cf598e76e', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 16:13:40.395242+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d4bab20-039d-4254-835a-b249e6d7e455', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 16:13:40.395827+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a3078b04-24a6-4980-aa6f-6d33d591cd09', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 17:30:09.02166+00', ''),
	('00000000-0000-0000-0000-000000000000', '2395ed2a-f877-495d-8226-438a200ed4f8', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-23 17:30:09.022961+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f0056c3c-0f5c-4232-8cae-fbec579bf968', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-24 06:19:24.197732+00', ''),
	('00000000-0000-0000-0000-000000000000', '98a2394f-6523-43f1-8d26-4d9f290bf26b', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-24 06:19:24.198334+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fb515946-7486-4147-8e3b-7d55b531a530', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-24 07:17:54.616471+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ebc84e49-c340-41a7-8ff7-2c714f7d5ef7', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-24 07:17:54.617804+00', ''),
	('00000000-0000-0000-0000-000000000000', 'dae920d6-87e7-481b-aee4-1e7f1699e98d', '{"action":"token_refreshed","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-24 08:17:14.874418+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e913672-34a7-450c-bbf5-171d4390995f', '{"action":"token_revoked","actor_id":"4e8eb72f-3ce7-48ec-9567-b632c39bd237","actor_username":"nguyenthichlaptrinh@gmail.com","actor_via_sso":false,"log_type":"token"}', '2026-07-24 08:17:14.875285+00', '');


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
	('00000000-0000-0000-0000-000000000000', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', 'authenticated', 'authenticated', 'nguyenthichlaptrinh@gmail.com', '$2a$10$/lEJEHqj4l0eualxzEwHMO4qcVXqbkvLN2UQD2QwUJp3F271ZiZkW', '2026-06-28 14:33:44.812567+00', NULL, '', NULL, '', NULL, '', '', NULL, '2026-07-16 14:03:29.021175+00', '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2026-06-28 14:33:44.790796+00', '2026-07-24 08:17:14.877114+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


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
	('b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '2026-07-16 14:03:29.021211+00', '2026-07-24 08:17:14.878173+00', NULL, 'aal1', NULL, '2026-07-24 08:17:14.878115', 'node', '172.18.0.1', NULL, NULL, NULL, NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe', '2026-07-16 14:03:29.024068+00', '2026-07-16 14:03:29.024068+00', 'password', 'f432bf6b-e39e-4545-ab10-2bf8f47ff9b1');


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
	('00000000-0000-0000-0000-000000000000', 71, 'yic2oelah2yl', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-23 16:13:40.398201+00', '2026-07-23 17:30:09.023496+00', '4uwgypdertkz', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 72, 'm3artoju6wpm', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-23 17:30:09.024256+00', '2026-07-24 06:19:24.198614+00', 'yic2oelah2yl', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 73, 'hpekfyqmmat7', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-24 06:19:24.199215+00', '2026-07-24 07:17:54.61806+00', 'm3artoju6wpm', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 74, 'qqier25ar6v6', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-24 07:17:54.618606+00', '2026-07-24 08:17:14.875838+00', 'hpekfyqmmat7', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 75, 'qbielhphl54p', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', false, '2026-07-24 08:17:14.876454+00', '2026-07-24 08:17:14.876454+00', 'qqier25ar6v6', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 49, 'p26efti4orfb', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-16 14:03:29.022177+00', '2026-07-16 15:02:05.290794+00', NULL, 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 50, '7aj3fcfh6ip2', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-16 15:02:05.291209+00', '2026-07-17 00:06:09.342979+00', 'p26efti4orfb', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 51, 'tkgs4e2bqmnh', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-17 00:06:09.3435+00', '2026-07-20 06:12:53.898133+00', '7aj3fcfh6ip2', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 52, 'y2jcizwrd74u', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-20 06:12:53.898628+00', '2026-07-20 07:16:31.655422+00', 'tkgs4e2bqmnh', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 53, 'qttjvcjiojop', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-20 07:16:31.656021+00', '2026-07-20 13:39:39.263555+00', 'y2jcizwrd74u', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 54, 'dyo7zgiihdma', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-20 13:39:39.264547+00', '2026-07-20 16:23:14.79954+00', 'qttjvcjiojop', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 55, 'z4y7dhg26xtm', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-20 16:23:14.80007+00', '2026-07-20 21:50:46.094301+00', 'dyo7zgiihdma', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 56, 'mbq3pmlgqk7o', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-20 21:50:46.094847+00', '2026-07-21 05:10:12.06984+00', 'z4y7dhg26xtm', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 57, 'hpgfzhydwwlv', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-21 05:10:12.070241+00', '2026-07-21 06:51:34.984866+00', 'mbq3pmlgqk7o', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 58, 'aq3zxnyvy5cy', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-21 06:51:34.985941+00', '2026-07-21 15:00:58.310471+00', 'hpgfzhydwwlv', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 59, 'ejll6rq5rcdw', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-21 15:00:58.311126+00', '2026-07-21 15:59:02.549339+00', 'aq3zxnyvy5cy', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 60, 'lr7elpd3pqgd', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-21 15:59:02.549807+00', '2026-07-22 00:11:53.667689+00', 'ejll6rq5rcdw', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 61, '4ye3wmfbqeay', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-22 00:11:53.668205+00', '2026-07-22 07:15:12.761157+00', 'lr7elpd3pqgd', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 62, 'po4fgpypvq6s', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-22 07:15:12.762117+00', '2026-07-22 14:25:04.948051+00', '4ye3wmfbqeay', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 63, '7mhjrcnebkre', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-22 14:25:04.950746+00', '2026-07-23 04:48:57.601409+00', 'po4fgpypvq6s', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 64, 'wqoaooyjvmtc', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-23 04:48:57.60191+00', '2026-07-23 05:47:10.709559+00', '7mhjrcnebkre', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 65, '6fo2ktrokeug', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-23 05:47:10.710085+00', '2026-07-23 07:23:28.529235+00', 'wqoaooyjvmtc', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 66, 'npuhhvf24ny4', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-23 07:23:28.529862+00', '2026-07-23 10:57:05.711064+00', '6fo2ktrokeug', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 67, 'efdadl4rxayu', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-23 10:57:05.711865+00', '2026-07-23 11:55:33.0988+00', 'npuhhvf24ny4', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 68, 'opdpb7eywz5a', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-23 11:55:33.099272+00', '2026-07-23 12:59:07.620508+00', 'efdadl4rxayu', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 69, 'a7epllgrru34', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-23 12:59:07.621426+00', '2026-07-23 14:05:03.966673+00', 'opdpb7eywz5a', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe'),
	('00000000-0000-0000-0000-000000000000', 70, '4uwgypdertkz', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', true, '2026-07-23 14:05:03.971588+00', '2026-07-23 16:13:40.397661+00', 'a7epllgrru34', 'b1f7b8d8-62ba-4a31-9773-8ed9bd695dbe');


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
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."customer" ("id", "company_name", "address", "contact_person", "phone", "email", "created_at", "updated_at", "tax_code", "position", "bank_account", "swift_code", "bank_name", "bank_address", "bank_account_name") VALUES
	('fe4818ca-bcb4-458a-9d13-78cc56f58571', 'HONG PHU LOGISTICS CO.,LTD', 'AREA 5, MONG CAI 3 WARD, QUANG NINH PROVINCE, VIET NAM', '<>', '<>', 'example@gmail.com', '2026-07-23 05:45:54.427048+00', '2026-07-23 05:45:54.427048+00', '', 'Director', NULL, NULL, NULL, NULL, NULL),
	('e5f3a3bf-0e36-4f0a-b1c9-eb5bbdd447dd', 'LIFE NUTRITION IMPORT EXPORT JOINT STOCK COMPANY', 'No. 8, Alley 163/23 Pham Van Dong Street, Cluster 2, Mai Dich Ward, Cau Giay District, Hanoi City, VIET NAM', 'LE DUY', '0961202468', 'contact@example.com', '2026-07-23 17:32:09.27064+00', '2026-07-23 17:32:09.27064+00', '0109729369', 'Director', '8695507979', 'BIDVVNVX', 'Joint Stock Commercial Bank for Investment and Development of Vietnam (BIDV)', 'BIDV Tower, 194 Tran Quang Khai Street, Hoan Kiem District, Hanoi, Vietnam', 'LE DUY');


--
-- Data for Name: seller_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."seller_profile" ("id", "company_name_cn", "company_name_en", "company_name_vi", "address_cn", "address_en", "address_vi", "authorized_person", "position", "tax_code", "bank_account", "swift_code", "bank_name", "bank_address", "created_at", "updated_at", "bank_account_name") VALUES
	('b2c71f0e-8e7e-471c-8b8f-07991f7daef4', '辉鸿国际供应链（广州）有限公司', 'Huyhong international supply chain (Guangzhou )Co.,Ltd', 'Công ty TNHH Thương Mại Huy Hồng', '胡志明市第七郡阮文灵街123号', 'ROOM A 1708 ,SHIJING INTERNATIONAL ,NO 88 , SHISHA HIGHWAY BAIYUN LAKE STREET BAIYUN DISTRICT GUANGZHOU CHINA', '<Vietnamese Name>', 'Tang Tgu Hui', 'Director', '91440111MA7MCAMD9C', '6899 8083 5052', 'BKCHCN BJ400', 'BANK OF CHINA GUANGZHOU SHIJING SUB-BRANCH', '	NO.151 ZHAOFENG STREET BAIYUN DISTRICT GUANGZHOU, CHINA', '2026-06-29 10:26:33.758689+00', '2026-06-29 10:26:33.758689+00', 'Huyhong international supply chain (Guangzhou) Co.,Ltd');


--
-- Data for Name: shipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."shipment" ("id", "doc_number", "customer_id", "contract_date", "shipment_date", "port_of_loading", "port_of_destination", "transport_mode", "payment_terms", "packing_type", "shipping_marks", "status", "created_at", "updated_at") VALUES
	('6a9834f6-c835-4f7f-bb04-2f74a96ff303', 'LH2026071302', 'e5f3a3bf-0e36-4f0a-b1c9-eb5bbdd447dd', '2026-07-13', NULL, 'Bằng Tường', NULL, 'Highway Transportation', '100% payment before shipment', NULL, 'N/M', 'processing', '2026-07-23 17:32:32.22987+00', '2026-07-23 17:32:32.22987+00'),
	('705972a1-c541-457c-9d07-672dc69e8557', 'LH2026071302 (copy)', 'e5f3a3bf-0e36-4f0a-b1c9-eb5bbdd447dd', '2026-07-13', NULL, 'Bằng Tường', NULL, 'Highway Transportation', '100% payment before shipment', NULL, 'N/M', 'processing', '2026-07-24 08:18:23.559871+00', '2026-07-24 08:18:23.559871+00');


--
-- Data for Name: shipment_document; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."shipment_document" ("id", "shipment_id", "doc_type", "file_name", "storage_path", "is_auto_generated", "uploaded_at") VALUES
	('f330b9c8-ba17-47fa-8f7e-0eb22026f032', '6a9834f6-c835-4f7f-bb04-2f74a96ff303', 'contract', 'LH2026071302_CT.pdf', 'shipments/6a9834f6-c835-4f7f-bb04-2f74a96ff303/1784877474524_CT.pdf', true, '2026-07-24 07:17:55.383025+00'),
	('fd76ff30-71a0-4f95-ad98-f07357c005a7', '6a9834f6-c835-4f7f-bb04-2f74a96ff303', 'packing_list', 'LH2026071302_PL.pdf', 'shipments/6a9834f6-c835-4f7f-bb04-2f74a96ff303/1784877474524_PL.pdf', true, '2026-07-24 07:17:55.382818+00'),
	('a07e13b1-9b98-4eac-99dc-e207786bc40e', '6a9834f6-c835-4f7f-bb04-2f74a96ff303', 'invoice', 'LH2026071302_INV.pdf', 'shipments/6a9834f6-c835-4f7f-bb04-2f74a96ff303/1784877474524_INV.pdf', true, '2026-07-24 07:17:55.384371+00'),
	('83de9bbc-9dfd-4067-8171-7bcf2d3032f7', '6a9834f6-c835-4f7f-bb04-2f74a96ff303', 'other', 'test', 'shipments/6a9834f6-c835-4f7f-bb04-2f74a96ff303/1784879117118_13803295_48651672_15-Dec-2025_13_41_45.pdf', false, '2026-07-24 07:45:17.232404+00'),
	('509608c1-ac5e-4968-aa1c-94dcf5070252', '705972a1-c541-457c-9d07-672dc69e8557', 'contract', 'LH2026071302 (copy)_CT.pdf', 'shipments/705972a1-c541-457c-9d07-672dc69e8557/1784881121675_CT.pdf', true, '2026-07-24 08:18:41.964834+00'),
	('6c7569c2-01d3-4f47-b517-938e2cb113ce', '705972a1-c541-457c-9d07-672dc69e8557', 'invoice', 'LH2026071302 (copy)_INV.pdf', 'shipments/705972a1-c541-457c-9d07-672dc69e8557/1784881121675_INV.pdf', true, '2026-07-24 08:18:41.968424+00'),
	('c8df3d6f-68df-488d-b30f-6448be00a468', '705972a1-c541-457c-9d07-672dc69e8557', 'packing_list', 'LH2026071302 (copy)_PL.pdf', 'shipments/705972a1-c541-457c-9d07-672dc69e8557/1784881121675_PL.pdf', true, '2026-07-24 08:18:41.972454+00');


--
-- Data for Name: shipment_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."shipment_item" ("id", "shipment_id", "item_no", "name_cn", "name_en", "hs_code", "specification", "num_packages", "quantity", "nw_kg", "gw_kg", "cbm", "unit_price_usd", "created_at", "name_other") VALUES
	('5d9e363d-1add-42a9-a1cf-113c49dd3d37', '6a9834f6-c835-4f7f-bb04-2f74a96ff303', 1, '好吃点杏仁酥', 'Almond Crisp Biscuits', '1905900000', '146g×30 packs/ctn', NULL, 50, 219.00, 239.00, 4.7180, 13.24, '2026-07-23 17:34:48.720012+00', 'bánh quy tròn hạnh nhân'),
	('4fd7d798-c4b9-42a2-9959-b698f327a9d3', '6a9834f6-c835-4f7f-bb04-2f74a96ff303', 2, '达利园罐装桂圆莲子八宝粥', 'Mixed Congee with Longan & Lotus Seed (Canned)', '1904900000', '360g×12 cans/ctn', NULL, 1500, 6480.00, 7800.00, 10.7100, 3.44, '2026-07-23 17:35:32.251775+00', 'Cháo bát bảo Daliyuan Nhãn Nhục Hạt Sen'),
	('f571c3c0-5fc5-431e-a903-249c5cd89dd1', '6a9834f6-c835-4f7f-bb04-2f74a96ff303', 3, '青梅绿茶', 'Green Tea with Green Plum Flavor', '2202100090', '500ml×15 bottles/ctn', NULL, 750, 5625.00, 6300.00, 10.2100, 3.32, '2026-07-23 17:36:05.704518+00', 'Trà thảo mộc Hoà Kỳ Chính'),
	('387751da-4baa-4b79-b450-409037a79d97', '6a9834f6-c835-4f7f-bb04-2f74a96ff303', 4, '和其正罐装凉茶', 'Herbal Tea Drink (Canned)', '2202100090', '310ml×24 cans/ctn ', NULL, 2000, 15260.00, 16700.00, 27.0000, 5.34, '2026-07-24 06:35:50.620724+00', 'Trà thảo mộc Hoà Kỳ Chính '),
	('547efb5d-bbf0-4724-9cbf-a081c2327ad7', '705972a1-c541-457c-9d07-672dc69e8557', 1, '好吃点杏仁酥', 'Almond Crisp Biscuits', '1905900000', '146g×30 packs/ctn', NULL, 50, 219.00, 239.00, 4.7180, 13.24, '2026-07-24 08:18:23.559871+00', 'bánh quy tròn hạnh nhân'),
	('861a078c-27e0-486b-8c5e-54eb8abee16d', '705972a1-c541-457c-9d07-672dc69e8557', 2, '达利园罐装桂圆莲子八宝粥', 'Mixed Congee with Longan & Lotus Seed (Canned)', '1904900000', '360g×12 cans/ctn', NULL, 1500, 6480.00, 7800.00, 10.7100, 3.44, '2026-07-24 08:18:23.559871+00', 'Cháo bát bảo Daliyuan Nhãn Nhục Hạt Sen'),
	('924a6506-390f-4508-85f7-a6f72dd8161e', '705972a1-c541-457c-9d07-672dc69e8557', 3, '青梅绿茶', 'Green Tea with Green Plum Flavor', '2202100090', '500ml×15 bottles/ctn', NULL, 750, 5625.00, 6300.00, 10.2100, 3.32, '2026-07-24 08:18:23.559871+00', 'Trà thảo mộc Hoà Kỳ Chính'),
	('8fe1845d-6ddc-427f-8708-d34d9273a413', '705972a1-c541-457c-9d07-672dc69e8557', 4, '和其正罐装凉茶', 'Herbal Tea Drink (Canned)', '2202100090', '310ml×24 cans/ctn ', NULL, 2000, 15260.00, 16700.00, 27.0000, 5.34, '2026-07-24 08:18:23.559871+00', 'Trà thảo mộc Hoà Kỳ Chính ');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('shipment-documents', 'shipment-documents', NULL, '2026-07-21 15:38:04.497862+00', '2026-07-21 15:38:04.497862+00', false, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_namespaces; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: iceberg_tables; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('b2dd6af8-b889-4280-b1b2-63399c0710e2', 'shipment-documents', 'shipments/6a9834f6-c835-4f7f-bb04-2f74a96ff303/1784877474524_PL.pdf', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '2026-07-24 07:17:55.32372+00', '2026-07-24 07:17:55.32372+00', '2026-07-24 07:17:55.32372+00', '{"eTag": "\"8e12fdf29b1d540bf7a708eceaef28ff\"", "size": 183674, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-24T07:17:55.310Z", "contentLength": 183674, "httpStatusCode": 200}', 'a7698212-76a0-4972-b426-acb7c050cd9c', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '{}'),
	('7c0a44f9-072d-4665-b367-8de893dc8783', 'shipment-documents', 'shipments/6a9834f6-c835-4f7f-bb04-2f74a96ff303/1784877474524_INV.pdf', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '2026-07-24 07:17:55.324245+00', '2026-07-24 07:17:55.324245+00', '2026-07-24 07:17:55.324245+00', '{"eTag": "\"4e8e7b244f8de3db575fe8a37813e724\"", "size": 188823, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-24T07:17:55.316Z", "contentLength": 188823, "httpStatusCode": 200}', '7586356e-8027-43db-85e5-297896ebde11', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '{}'),
	('d62ffa17-bef0-448e-810b-cdc35b55c97f', 'shipment-documents', 'shipments/6a9834f6-c835-4f7f-bb04-2f74a96ff303/1784877474524_CT.pdf', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '2026-07-24 07:17:55.32381+00', '2026-07-24 07:17:55.32381+00', '2026-07-24 07:17:55.32381+00', '{"eTag": "\"a615f62a505e952edbec86716b464767\"", "size": 222734, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-24T07:17:55.309Z", "contentLength": 222734, "httpStatusCode": 200}', '070ea066-ef11-43de-b02b-fc28e5e886cd', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '{}'),
	('eb2194ff-f687-4f8b-b0d4-5383efa89126', 'shipment-documents', 'shipments/6a9834f6-c835-4f7f-bb04-2f74a96ff303/1784879117118_13803295_48651672_15-Dec-2025_13_41_45.pdf', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '2026-07-24 07:45:17.211164+00', '2026-07-24 07:45:17.211164+00', '2026-07-24 07:45:17.211164+00', '{"eTag": "\"03e2c925c664e67f6de4299d1c867006\"", "size": 64512, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-24T07:45:17.208Z", "contentLength": 64512, "httpStatusCode": 200}', 'f6919efb-c547-40af-a729-fd22fa92ff3f', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '{}'),
	('745e4e32-6b82-4dc4-b92c-a1f56f037359', 'shipment-documents', 'shipments/705972a1-c541-457c-9d07-672dc69e8557/1784881121675_PL.pdf', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '2026-07-24 08:18:41.882947+00', '2026-07-24 08:18:41.882947+00', '2026-07-24 08:18:41.882947+00', '{"eTag": "\"c553f3d78315d2f80dc3f20cc3c3bafe\"", "size": 183681, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-24T08:18:41.876Z", "contentLength": 183681, "httpStatusCode": 200}', 'd723edd6-fc27-454d-b4ca-7895d7378e45', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '{}'),
	('55603a96-5bbc-4263-9766-702a76097ac1', 'shipment-documents', 'shipments/705972a1-c541-457c-9d07-672dc69e8557/1784881121675_INV.pdf', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '2026-07-24 08:18:41.882803+00', '2026-07-24 08:18:41.882803+00', '2026-07-24 08:18:41.882803+00', '{"eTag": "\"deffb8b3cad4125807489d6b390f70d0\"", "size": 188838, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-24T08:18:41.876Z", "contentLength": 188838, "httpStatusCode": 200}', '41777cab-a244-42e1-bb57-fd5479dd8bcc', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '{}'),
	('905bf383-51d8-402e-b926-7031838e376d', 'shipment-documents', 'shipments/705972a1-c541-457c-9d07-672dc69e8557/1784881121675_CT.pdf', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '2026-07-24 08:18:41.890278+00', '2026-07-24 08:18:41.890278+00', '2026-07-24 08:18:41.890278+00', '{"eTag": "\"c85ce24ba436f852ff45e348cf9199b9\"", "size": 222788, "mimetype": "application/pdf", "cacheControl": "max-age=3600", "lastModified": "2026-07-24T08:18:41.886Z", "contentLength": 222788, "httpStatusCode": 200}', 'df6caf98-84d9-4d9e-916d-ff8b08e0a82a', '4e8eb72f-3ce7-48ec-9567-b632c39bd237', '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 75, true);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict jI6qyitunoRNSTWIHDvnZJVZ2xE5u3XFozdeKIejlnf7q512mQA1OGHjFn85LhS

RESET ALL;
