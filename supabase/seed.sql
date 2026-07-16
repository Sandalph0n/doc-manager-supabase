SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict Rqj60jA0wgdlubYlL88w7r0v1VO9hZtFOBnUmUzu2zusZN0GFgN8gJYrUqlwCmR

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
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."customer" ("id", "company_name", "address", "contact_person", "phone", "email", "created_at", "updated_at", "tax_code", "position") VALUES
	('9a7af2a8-d6d6-4742-b16e-3248c114164e', 'Sino Commerce Group', 'Room 501, Huafa Building, Futian District, Shenzhen', 'Li Mei', '+86 139 0000 5678', 'limei@sinocommerce.cn', '2026-06-30 10:18:00.326798+00', '2026-06-30 10:18:00.326798+00', NULL, NULL),
	('90d83c28-8a74-4924-bb9b-c54df0e186ba', 'Shenzhen Viet Import Export Co.', 'Floor 3, Building B, Longhua District, Shenzhen', 'Chen Jianhua', '+86 135 0000 9012', 'chen@vietimport.cn', '2026-06-30 10:18:00.326798+00', '2026-06-30 10:18:00.326798+00', NULL, NULL),
	('b30f48cd-5f05-427b-8c2f-b871b3039258', 'Foshan Golden Bridge Trading', 'No. 22, Fenjiang South Road, Foshan, Guangdong', 'Wang Fang', '+86 137 0000 3456', 'wangfang@goldenbridgetrade.com', '2026-06-30 10:18:00.326798+00', '2026-06-30 10:18:00.326798+00', NULL, NULL),
	('7d9dc200-1e17-4c5d-98ea-88b87cc94420', 'Dongguan Pacific Logistics Ltd', 'No. 15, Houjie Industrial Zone, Dongguan, Guangdong', 'Liu Yang', '+86 136 0000 7890', 'liuyang@pacificlogistics.cn', '2026-06-30 10:18:00.326798+00', '2026-06-30 10:18:00.326798+00', NULL, NULL),
	('065e21d3-5329-4e2b-9d54-b046ecc2d443', 'Guangzhou Huy Hong Trading Co. Ltd', 'No. 88, Zhongshan Road, Guangzhou, Guangdong', 'Zhang Wei', '+86 138 0000 1234', 'zhangwei@huyhong.cn', '2026-06-30 10:18:00.326798+00', '2026-06-30 10:18:00.326798+00', '', 'Manager');


--
-- Data for Name: seller_profile; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."seller_profile" ("id", "company_name_cn", "company_name_en", "company_name_vi", "address_cn", "address_en", "address_vi", "authorized_person", "position", "tax_code", "bank_account", "swift_code", "bank_name", "bank_address", "created_at", "updated_at", "bank_account_name") VALUES
	('b2c71f0e-8e7e-471c-8b8f-07991f7daef4', '辉红贸易有限公司', 'Huy Hong Trading Co., Ltd.', 'Công ty TNHH Thương Mại Huy Hồng', '胡志明市第七郡阮文灵街123号', 'No. 123, Nguyen Van Linh Street, District 7, Ho Chi Minh City', 'Số 123, Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh', 'Nguyễn Văn A', 'Giám Đốc', '0312345678', '0123456789012', 'BFTVVNVX', 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)', 'Chi nhánh TP. Hồ Chí Minh, 29 Bến Chương Dương, Quận 1', '2026-06-29 10:26:33.758689+00', '2026-06-29 10:26:33.758689+00', 'Nguyen Van A');


--
-- Data for Name: shipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."shipment" ("id", "doc_number", "customer_id", "contract_date", "shipment_date", "port_of_loading", "port_of_destination", "transport_mode", "payment_terms", "packing_type", "shipping_marks", "status", "created_at", "updated_at") VALUES
	('8fce00cc-749b-48bc-a39d-27b63ef936c6', '20260712-001', '7d9dc200-1e17-4c5d-98ea-88b87cc94420', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-07-12 06:32:12.380352+00', '2026-07-12 06:32:12.380352+00'),
	('2b0c13ac-d53f-4fa9-a124-3b5e5254a621', '20260712-002', 'b30f48cd-5f05-427b-8c2f-b871b3039258', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-07-12 06:32:25.054134+00', '2026-07-12 06:32:25.054134+00'),
	('2bf52420-dfc1-4c6e-aced-d4022f91ef96', '20260712-003', '90d83c28-8a74-4924-bb9b-c54df0e186ba', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-07-12 06:32:41.514395+00', '2026-07-12 06:32:41.514395+00');


--
-- Data for Name: shipment_document; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: shipment_item; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- PostgreSQL database dump complete
--

-- \unrestrict Rqj60jA0wgdlubYlL88w7r0v1VO9hZtFOBnUmUzu2zusZN0GFgN8gJYrUqlwCmR

RESET ALL;
