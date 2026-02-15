--
-- PostgreSQL database dump
--

\restrict jEZQSkRaIIsYQJlhIOUuaOJlJCqEoSpRvPknN9iIVZ6X2l6dewX4sEhmXetMEpQ

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

-- Started on 2026-02-15 07:23:04

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16402)
-- Name: breeders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.breeders (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    country character varying(50),
    website character varying(200),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.breeders OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16401)
-- Name: breeders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.breeders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.breeders_id_seq OWNER TO postgres;

--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 221
-- Name: breeders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.breeders_id_seq OWNED BY public.breeders.id;


--
-- TOC entry 228 (class 1259 OID 16465)
-- Name: plant_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plant_images (
    id integer NOT NULL,
    plant_id integer,
    image_filename character varying(255) NOT NULL,
    image_url character varying(500) NOT NULL,
    is_primary boolean DEFAULT false,
    caption text,
    uploaded_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.plant_images OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16464)
-- Name: plant_images_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plant_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plant_images_id_seq OWNER TO postgres;

--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 227
-- Name: plant_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plant_images_id_seq OWNED BY public.plant_images.id;


--
-- TOC entry 220 (class 1259 OID 16390)
-- Name: plant_names; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plant_names (
    id integer NOT NULL,
    botanical_name character varying(100) NOT NULL,
    common_name character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.plant_names OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16389)
-- Name: plant_names_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plant_names_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plant_names_id_seq OWNER TO postgres;

--
-- TOC entry 5081 (class 0 OID 0)
-- Dependencies: 219
-- Name: plant_names_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plant_names_id_seq OWNED BY public.plant_names.id;


--
-- TOC entry 224 (class 1259 OID 16414)
-- Name: plants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plants (
    id integer NOT NULL,
    plant_name_id integer,
    variety_name character varying(100) NOT NULL,
    identification_code character varying(50),
    breeder_id integer,
    year_introduced integer,
    flower_color character varying(100),
    flowering_time character varying(50),
    growing_habit character varying(50),
    growth_intensity character varying(50),
    flower_type character varying(50),
    flower_size character varying(50),
    starting_stage character varying(50),
    current_quantity integer DEFAULT 0,
    minimum_stock_level integer DEFAULT 0,
    notes text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.plants OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16413)
-- Name: plants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.plants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.plants_id_seq OWNER TO postgres;

--
-- TOC entry 5082 (class 0 OID 0)
-- Dependencies: 223
-- Name: plants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.plants_id_seq OWNED BY public.plants.id;


--
-- TOC entry 226 (class 1259 OID 16442)
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_movements (
    id integer NOT NULL,
    plant_id integer,
    movement_type character varying(20) NOT NULL,
    quantity integer NOT NULL,
    movement_date date DEFAULT CURRENT_DATE,
    reason character varying(200),
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.stock_movements OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16441)
-- Name: stock_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_movements_id_seq OWNER TO postgres;

--
-- TOC entry 5083 (class 0 OID 0)
-- Dependencies: 225
-- Name: stock_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_movements_id_seq OWNED BY public.stock_movements.id;


--
-- TOC entry 4878 (class 2604 OID 16405)
-- Name: breeders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.breeders ALTER COLUMN id SET DEFAULT nextval('public.breeders_id_seq'::regclass);


--
-- TOC entry 4889 (class 2604 OID 16468)
-- Name: plant_images id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_images ALTER COLUMN id SET DEFAULT nextval('public.plant_images_id_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 16393)
-- Name: plant_names id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_names ALTER COLUMN id SET DEFAULT nextval('public.plant_names_id_seq'::regclass);


--
-- TOC entry 4880 (class 2604 OID 16417)
-- Name: plants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plants ALTER COLUMN id SET DEFAULT nextval('public.plants_id_seq'::regclass);


--
-- TOC entry 4886 (class 2604 OID 16445)
-- Name: stock_movements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements ALTER COLUMN id SET DEFAULT nextval('public.stock_movements_id_seq'::regclass);


--
-- TOC entry 5067 (class 0 OID 16402)
-- Dependencies: 222
-- Data for Name: breeders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.breeders (id, name, country, website, created_at) FROM stdin;
1	Selecta	Germany	\N	2026-02-13 14:38:47.36078
2	Ball	USA	\N	2026-02-13 14:38:47.36078
3	Syngenta	Switzerland	\N	2026-02-13 14:38:47.36078
4	Dümmen Orange	Netherlands	\N	2026-02-13 14:38:47.36078
\.


--
-- TOC entry 5073 (class 0 OID 16465)
-- Dependencies: 228
-- Data for Name: plant_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plant_images (id, plant_id, image_filename, image_url, is_primary, caption, uploaded_at) FROM stdin;
2	1	1771001813285-1250908.jpg	/uploads/1771001813285-1250908.jpg	f	\N	2026-02-13 18:56:53.406235
3	1	1771002140583-OIG.GC.jpeg	/uploads/1771002140583-OIG.GC.jpeg	t	\N	2026-02-13 19:02:20.594834
\.


--
-- TOC entry 5065 (class 0 OID 16390)
-- Dependencies: 220
-- Data for Name: plant_names; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plant_names (id, botanical_name, common_name, created_at) FROM stdin;
1	Pelargonium peltatum	Ivy Geranium	2026-02-13 14:38:47.36078
2	Pelargonium zonale	Zonal Geranium	2026-02-13 14:38:47.36078
3	Pelargonium crispum	Lemon Geranium	2026-02-13 14:38:47.36078
4	Petunia hybrida	Petunia	2026-02-13 14:38:47.36078
5	Tagetes patula	French Marigold	2026-02-13 14:38:47.36078
6	Primula	Primrose	2026-02-13 14:38:47.36078
7	Fuchsia magellanica	Cercelus	2026-02-13 14:38:47.36078
\.


--
-- TOC entry 5069 (class 0 OID 16414)
-- Dependencies: 224
-- Data for Name: plants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.plants (id, plant_name_id, variety_name, identification_code, breeder_id, year_introduced, flower_color, flowering_time, growing_habit, growth_intensity, flower_type, flower_size, starting_stage, current_quantity, minimum_stock_level, notes, is_active, created_at, updated_at) FROM stdin;
1	1	Calliope Dark Red	PP-CAL-DR-001	1	2020	Dark Red	Early	Trailing	Vigorous	Double	Large	Rooted Cutting	150	0	Great performance, customer favorite	t	2026-02-13 14:38:47.36078	2026-02-13 14:38:47.36078
2	2	Tango Deep Red	PZ-TAN-DR-001	1	2024	Deep Red	Early	Erect	Compact	Single	Medium	Young Plant	120	30	Testing my first entry!	t	2026-02-13 17:26:21.508641	2026-02-13 17:26:21.508641
3	1	Cascade Red	PT-RED-001	1	\N	Red	Late	Trailing	Vigorous	Single	Medium	Rooted Cutting	126	6	Muscata tirolea rosie	t	2026-02-13 17:48:07.901861	2026-02-13 17:48:07.901861
\.


--
-- TOC entry 5071 (class 0 OID 16442)
-- Dependencies: 226
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_movements (id, plant_id, movement_type, quantity, movement_date, reason, notes, created_at) FROM stdin;
\.


--
-- TOC entry 5084 (class 0 OID 0)
-- Dependencies: 221
-- Name: breeders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.breeders_id_seq', 4, true);


--
-- TOC entry 5085 (class 0 OID 0)
-- Dependencies: 227
-- Name: plant_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plant_images_id_seq', 3, true);


--
-- TOC entry 5086 (class 0 OID 0)
-- Dependencies: 219
-- Name: plant_names_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plant_names_id_seq', 6, true);


--
-- TOC entry 5087 (class 0 OID 0)
-- Dependencies: 223
-- Name: plants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.plants_id_seq', 3, true);


--
-- TOC entry 5088 (class 0 OID 0)
-- Dependencies: 225
-- Name: stock_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_movements_id_seq', 1, false);


--
-- TOC entry 4897 (class 2606 OID 16412)
-- Name: breeders breeders_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.breeders
    ADD CONSTRAINT breeders_name_key UNIQUE (name);


--
-- TOC entry 4899 (class 2606 OID 16410)
-- Name: breeders breeders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.breeders
    ADD CONSTRAINT breeders_pkey PRIMARY KEY (id);


--
-- TOC entry 4912 (class 2606 OID 16477)
-- Name: plant_images plant_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_images
    ADD CONSTRAINT plant_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4893 (class 2606 OID 16400)
-- Name: plant_names plant_names_botanical_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_names
    ADD CONSTRAINT plant_names_botanical_name_key UNIQUE (botanical_name);


--
-- TOC entry 4895 (class 2606 OID 16398)
-- Name: plant_names plant_names_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_names
    ADD CONSTRAINT plant_names_pkey PRIMARY KEY (id);


--
-- TOC entry 4905 (class 2606 OID 16430)
-- Name: plants plants_identification_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plants
    ADD CONSTRAINT plants_identification_code_key UNIQUE (identification_code);


--
-- TOC entry 4907 (class 2606 OID 16428)
-- Name: plants plants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plants
    ADD CONSTRAINT plants_pkey PRIMARY KEY (id);


--
-- TOC entry 4909 (class 2606 OID 16454)
-- Name: stock_movements stock_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (id);


--
-- TOC entry 4910 (class 1259 OID 16483)
-- Name: idx_plant_images_plant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_plant_images_plant_id ON public.plant_images USING btree (plant_id);


--
-- TOC entry 4900 (class 1259 OID 16463)
-- Name: idx_plants_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_plants_active ON public.plants USING btree (is_active);


--
-- TOC entry 4901 (class 1259 OID 16461)
-- Name: idx_plants_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_plants_code ON public.plants USING btree (identification_code);


--
-- TOC entry 4902 (class 1259 OID 16462)
-- Name: idx_plants_name_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_plants_name_id ON public.plants USING btree (plant_name_id);


--
-- TOC entry 4903 (class 1259 OID 16460)
-- Name: idx_plants_variety; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_plants_variety ON public.plants USING btree (variety_name);


--
-- TOC entry 4916 (class 2606 OID 16478)
-- Name: plant_images plant_images_plant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plant_images
    ADD CONSTRAINT plant_images_plant_id_fkey FOREIGN KEY (plant_id) REFERENCES public.plants(id) ON DELETE CASCADE;


--
-- TOC entry 4913 (class 2606 OID 16436)
-- Name: plants plants_breeder_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plants
    ADD CONSTRAINT plants_breeder_id_fkey FOREIGN KEY (breeder_id) REFERENCES public.breeders(id) ON DELETE SET NULL;


--
-- TOC entry 4914 (class 2606 OID 16431)
-- Name: plants plants_plant_name_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plants
    ADD CONSTRAINT plants_plant_name_id_fkey FOREIGN KEY (plant_name_id) REFERENCES public.plant_names(id) ON DELETE RESTRICT;


--
-- TOC entry 4915 (class 2606 OID 16455)
-- Name: stock_movements stock_movements_plant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_plant_id_fkey FOREIGN KEY (plant_id) REFERENCES public.plants(id) ON DELETE CASCADE;


-- Completed on 2026-02-15 07:23:04

--
-- PostgreSQL database dump complete
--

\unrestrict jEZQSkRaIIsYQJlhIOUuaOJlJCqEoSpRvPknN9iIVZ6X2l6dewX4sEhmXetMEpQ

