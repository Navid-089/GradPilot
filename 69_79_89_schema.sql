--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-05-17 01:34:50 +06

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
-- TOC entry 254 (class 1259 OID 16672)
-- Name: application_timeline; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_timeline (
    event_id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(128),
    date date NOT NULL,
    type character varying(64),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    is_pending boolean DEFAULT true NOT NULL
);


ALTER TABLE public.application_timeline OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 16671)
-- Name: application_timeline_event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.application_timeline_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.application_timeline_event_id_seq OWNER TO postgres;

--
-- TOC entry 3970 (class 0 OID 0)
-- Dependencies: 253
-- Name: application_timeline_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.application_timeline_event_id_seq OWNED BY public.application_timeline.event_id;


--
-- TOC entry 252 (class 1259 OID 16651)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    comment_id integer NOT NULL,
    draft_id integer NOT NULL,
    user_id integer NOT NULL,
    comment_text text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 16650)
-- Name: comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_comment_id_seq OWNER TO postgres;

--
-- TOC entry 3971 (class 0 OID 0)
-- Dependencies: 251
-- Name: comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_comment_id_seq OWNED BY public.comments.comment_id;


--
-- TOC entry 234 (class 1259 OID 16514)
-- Name: countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.countries (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.countries OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 16513)
-- Name: countries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.countries_id_seq OWNER TO postgres;

--
-- TOC entry 3972 (class 0 OID 0)
-- Dependencies: 233
-- Name: countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.countries_id_seq OWNED BY public.countries.id;


--
-- TOC entry 250 (class 1259 OID 16633)
-- Name: drafts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drafts (
    draft_id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(128),
    content text,
    type character varying(10) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT drafts_type_check CHECK (((type)::text = ANY ((ARRAY['SOP'::character varying, 'LOR'::character varying])::text[])))
);


ALTER TABLE public.drafts OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16632)
-- Name: drafts_draft_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drafts_draft_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drafts_draft_id_seq OWNER TO postgres;

--
-- TOC entry 3973 (class 0 OID 0)
-- Dependencies: 249
-- Name: drafts_draft_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drafts_draft_id_seq OWNED BY public.drafts.draft_id;


--
-- TOC entry 226 (class 1259 OID 16456)
-- Name: fields_of_study; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fields_of_study (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.fields_of_study OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16455)
-- Name: fields_of_study_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fields_of_study_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fields_of_study_id_seq OWNER TO postgres;

--
-- TOC entry 3974 (class 0 OID 0)
-- Dependencies: 225
-- Name: fields_of_study_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fields_of_study_id_seq OWNED BY public.fields_of_study.id;


--
-- TOC entry 230 (class 1259 OID 16485)
-- Name: majors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.majors (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.majors OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16484)
-- Name: majors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.majors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.majors_id_seq OWNER TO postgres;

--
-- TOC entry 3975 (class 0 OID 0)
-- Dependencies: 229
-- Name: majors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.majors_id_seq OWNED BY public.majors.id;


--
-- TOC entry 256 (class 1259 OID 16688)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    notification_id integer NOT NULL,
    user_id integer NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    text text,
    is_read boolean DEFAULT false NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 16687)
-- Name: notifications_notification_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_notification_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_notification_id_seq OWNER TO postgres;

--
-- TOC entry 3976 (class 0 OID 0)
-- Dependencies: 255
-- Name: notifications_notification_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_notification_id_seq OWNED BY public.notifications.notification_id;


--
-- TOC entry 246 (class 1259 OID 16604)
-- Name: professor_papers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professor_papers (
    id integer NOT NULL,
    professor_id integer NOT NULL,
    title character varying(255) NOT NULL,
    url character varying(255)
);


ALTER TABLE public.professor_papers OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 16603)
-- Name: professor_papers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.professor_papers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.professor_papers_id_seq OWNER TO postgres;

--
-- TOC entry 3977 (class 0 OID 0)
-- Dependencies: 245
-- Name: professor_papers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.professor_papers_id_seq OWNED BY public.professor_papers.id;


--
-- TOC entry 244 (class 1259 OID 16584)
-- Name: professor_research_areas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professor_research_areas (
    id integer NOT NULL,
    professor_id integer NOT NULL,
    research_interest_id integer NOT NULL
);


ALTER TABLE public.professor_research_areas OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 16583)
-- Name: professor_research_areas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.professor_research_areas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.professor_research_areas_id_seq OWNER TO postgres;

--
-- TOC entry 3978 (class 0 OID 0)
-- Dependencies: 243
-- Name: professor_research_areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.professor_research_areas_id_seq OWNED BY public.professor_research_areas.id;


--
-- TOC entry 242 (class 1259 OID 16569)
-- Name: professors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professors (
    professor_id integer NOT NULL,
    university_id integer NOT NULL,
    name character varying(100) NOT NULL,
    bio text,
    department character varying(100),
    email character varying(120),
    linkedin_url character varying(255),
    google_scholar_url character varying(255),
    lab_link character varying(255)
);


ALTER TABLE public.professors OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 16568)
-- Name: professors_professor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.professors_professor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.professors_professor_id_seq OWNER TO postgres;

--
-- TOC entry 3979 (class 0 OID 0)
-- Dependencies: 241
-- Name: professors_professor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.professors_professor_id_seq OWNED BY public.professors.professor_id;


--
-- TOC entry 222 (class 1259 OID 16427)
-- Name: research_interests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.research_interests (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.research_interests OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16426)
-- Name: research_interests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.research_interests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.research_interests_id_seq OWNER TO postgres;

--
-- TOC entry 3980 (class 0 OID 0)
-- Dependencies: 221
-- Name: research_interests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.research_interests_id_seq OWNED BY public.research_interests.id;


--
-- TOC entry 248 (class 1259 OID 16619)
-- Name: scholarships; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.scholarships (
    scholarship_id integer NOT NULL,
    university_id integer,
    name character varying(200) NOT NULL,
    description text,
    apply_link character varying(255),
    eligibility text,
    coverage character varying(100)
);


ALTER TABLE public.scholarships OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16618)
-- Name: scholarships_scholarship_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.scholarships_scholarship_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.scholarships_scholarship_id_seq OWNER TO postgres;

--
-- TOC entry 3981 (class 0 OID 0)
-- Dependencies: 247
-- Name: scholarships_scholarship_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.scholarships_scholarship_id_seq OWNED BY public.scholarships.scholarship_id;


--
-- TOC entry 240 (class 1259 OID 16558)
-- Name: universities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.universities (
    university_id integer NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    email character varying(120),
    ranking integer,
    address text,
    website_url character varying(255)
);


ALTER TABLE public.universities OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 16557)
-- Name: universities_university_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.universities_university_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.universities_university_id_seq OWNER TO postgres;

--
-- TOC entry 3982 (class 0 OID 0)
-- Dependencies: 239
-- Name: universities_university_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.universities_university_id_seq OWNED BY public.universities.university_id;


--
-- TOC entry 228 (class 1259 OID 16465)
-- Name: user_fields_of_study; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_fields_of_study (
    id integer NOT NULL,
    user_id integer NOT NULL,
    field_of_study_id integer NOT NULL
);


ALTER TABLE public.user_fields_of_study OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16464)
-- Name: user_fields_of_study_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_fields_of_study_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_fields_of_study_id_seq OWNER TO postgres;

--
-- TOC entry 3983 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_fields_of_study_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_fields_of_study_id_seq OWNED BY public.user_fields_of_study.id;


--
-- TOC entry 238 (class 1259 OID 16543)
-- Name: user_publications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_publications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    url character varying(255)
);


ALTER TABLE public.user_publications OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 16542)
-- Name: user_publications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_publications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_publications_id_seq OWNER TO postgres;

--
-- TOC entry 3984 (class 0 OID 0)
-- Dependencies: 237
-- Name: user_publications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_publications_id_seq OWNED BY public.user_publications.id;


--
-- TOC entry 224 (class 1259 OID 16436)
-- Name: user_research_interests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_research_interests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    research_interest_id integer NOT NULL
);


ALTER TABLE public.user_research_interests OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16435)
-- Name: user_research_interests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_research_interests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_research_interests_id_seq OWNER TO postgres;

--
-- TOC entry 3985 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_research_interests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_research_interests_id_seq OWNED BY public.user_research_interests.id;


--
-- TOC entry 220 (class 1259 OID 16412)
-- Name: user_scores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_scores (
    id integer NOT NULL,
    user_id integer NOT NULL,
    test_name character varying(32) NOT NULL,
    score character varying(32) NOT NULL
);


ALTER TABLE public.user_scores OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16411)
-- Name: user_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_scores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_scores_id_seq OWNER TO postgres;

--
-- TOC entry 3986 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_scores_id_seq OWNED BY public.user_scores.id;


--
-- TOC entry 236 (class 1259 OID 16523)
-- Name: user_target_countries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_target_countries (
    id integer NOT NULL,
    user_id integer NOT NULL,
    country_id integer NOT NULL
);


ALTER TABLE public.user_target_countries OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 16522)
-- Name: user_target_countries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_target_countries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_target_countries_id_seq OWNER TO postgres;

--
-- TOC entry 3987 (class 0 OID 0)
-- Dependencies: 235
-- Name: user_target_countries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_target_countries_id_seq OWNED BY public.user_target_countries.id;


--
-- TOC entry 232 (class 1259 OID 16494)
-- Name: user_target_majors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_target_majors (
    id integer NOT NULL,
    user_id integer NOT NULL,
    major_id integer NOT NULL
);


ALTER TABLE public.user_target_majors OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16493)
-- Name: user_target_majors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_target_majors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_target_majors_id_seq OWNER TO postgres;

--
-- TOC entry 3988 (class 0 OID 0)
-- Dependencies: 231
-- Name: user_target_majors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_target_majors_id_seq OWNED BY public.user_target_majors.id;


--
-- TOC entry 218 (class 1259 OID 16399)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(100) NOT NULL,
    bio text,
    email character varying(120) NOT NULL,
    bicrypted_pass character varying(255) NOT NULL,
    cgpa numeric(3,2),
    cv character varying(255),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    apply_year integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16398)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 3989 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 3675 (class 2604 OID 16675)
-- Name: application_timeline event_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_timeline ALTER COLUMN event_id SET DEFAULT nextval('public.application_timeline_event_id_seq'::regclass);


--
-- TOC entry 3673 (class 2604 OID 16654)
-- Name: comments comment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN comment_id SET DEFAULT nextval('public.comments_comment_id_seq'::regclass);


--
-- TOC entry 3662 (class 2604 OID 16517)
-- Name: countries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries ALTER COLUMN id SET DEFAULT nextval('public.countries_id_seq'::regclass);


--
-- TOC entry 3670 (class 2604 OID 16636)
-- Name: drafts draft_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drafts ALTER COLUMN draft_id SET DEFAULT nextval('public.drafts_draft_id_seq'::regclass);


--
-- TOC entry 3658 (class 2604 OID 16459)
-- Name: fields_of_study id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fields_of_study ALTER COLUMN id SET DEFAULT nextval('public.fields_of_study_id_seq'::regclass);


--
-- TOC entry 3660 (class 2604 OID 16488)
-- Name: majors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.majors ALTER COLUMN id SET DEFAULT nextval('public.majors_id_seq'::regclass);


--
-- TOC entry 3679 (class 2604 OID 16691)
-- Name: notifications notification_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN notification_id SET DEFAULT nextval('public.notifications_notification_id_seq'::regclass);


--
-- TOC entry 3668 (class 2604 OID 16607)
-- Name: professor_papers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professor_papers ALTER COLUMN id SET DEFAULT nextval('public.professor_papers_id_seq'::regclass);


--
-- TOC entry 3667 (class 2604 OID 16587)
-- Name: professor_research_areas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professor_research_areas ALTER COLUMN id SET DEFAULT nextval('public.professor_research_areas_id_seq'::regclass);


--
-- TOC entry 3666 (class 2604 OID 16572)
-- Name: professors professor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professors ALTER COLUMN professor_id SET DEFAULT nextval('public.professors_professor_id_seq'::regclass);


--
-- TOC entry 3656 (class 2604 OID 16430)
-- Name: research_interests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.research_interests ALTER COLUMN id SET DEFAULT nextval('public.research_interests_id_seq'::regclass);


--
-- TOC entry 3669 (class 2604 OID 16622)
-- Name: scholarships scholarship_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scholarships ALTER COLUMN scholarship_id SET DEFAULT nextval('public.scholarships_scholarship_id_seq'::regclass);


--
-- TOC entry 3665 (class 2604 OID 16561)
-- Name: universities university_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities ALTER COLUMN university_id SET DEFAULT nextval('public.universities_university_id_seq'::regclass);


--
-- TOC entry 3659 (class 2604 OID 16468)
-- Name: user_fields_of_study id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_fields_of_study ALTER COLUMN id SET DEFAULT nextval('public.user_fields_of_study_id_seq'::regclass);


--
-- TOC entry 3664 (class 2604 OID 16546)
-- Name: user_publications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_publications ALTER COLUMN id SET DEFAULT nextval('public.user_publications_id_seq'::regclass);


--
-- TOC entry 3657 (class 2604 OID 16439)
-- Name: user_research_interests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_research_interests ALTER COLUMN id SET DEFAULT nextval('public.user_research_interests_id_seq'::regclass);


--
-- TOC entry 3655 (class 2604 OID 16415)
-- Name: user_scores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_scores ALTER COLUMN id SET DEFAULT nextval('public.user_scores_id_seq'::regclass);


--
-- TOC entry 3663 (class 2604 OID 16526)
-- Name: user_target_countries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_target_countries ALTER COLUMN id SET DEFAULT nextval('public.user_target_countries_id_seq'::regclass);


--
-- TOC entry 3661 (class 2604 OID 16497)
-- Name: user_target_majors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_target_majors ALTER COLUMN id SET DEFAULT nextval('public.user_target_majors_id_seq'::regclass);


--
-- TOC entry 3652 (class 2604 OID 16402)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 3962 (class 0 OID 16672)
-- Dependencies: 254
-- Data for Name: application_timeline; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_timeline (event_id, user_id, title, date, type, created_at, updated_at, is_pending) FROM stdin;
1	1	Submitted GRE	2024-11-01	Test	2025-05-17 00:54:30.800097+06	2025-05-17 00:54:30.800097+06	f
2	2	SOP Drafted	2024-10-15	Document	2025-05-17 00:54:30.800097+06	2025-05-17 00:54:30.800097+06	t
\.


--
-- TOC entry 3960 (class 0 OID 16651)
-- Dependencies: 252
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (comment_id, draft_id, user_id, comment_text, created_at) FROM stdin;
1	1	2	Great introduction!	2025-05-17 00:54:30.800097+06
2	2	1	Needs more details.	2025-05-17 00:54:30.800097+06
\.


--
-- TOC entry 3942 (class 0 OID 16514)
-- Dependencies: 234
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.countries (id, name) FROM stdin;
1	USA
2	Germany
\.


--
-- TOC entry 3958 (class 0 OID 16633)
-- Dependencies: 250
-- Data for Name: drafts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drafts (draft_id, user_id, title, content, type, created_at, updated_at) FROM stdin;
1	1	My SOP	This is my statement of purpose.	SOP	2025-05-17 00:54:30.800097+06	2025-05-17 00:54:30.800097+06
2	2	Recommendation Letter Draft	Draft for LOR.	LOR	2025-05-17 00:54:30.800097+06	2025-05-17 00:54:30.800097+06
\.


--
-- TOC entry 3934 (class 0 OID 16456)
-- Dependencies: 226
-- Data for Name: fields_of_study; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fields_of_study (id, name) FROM stdin;
1	Computer Science
2	Biotechnology
\.


--
-- TOC entry 3938 (class 0 OID 16485)
-- Dependencies: 230
-- Data for Name: majors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.majors (id, name) FROM stdin;
1	Data Science
2	Genetics
\.


--
-- TOC entry 3964 (class 0 OID 16688)
-- Dependencies: 256
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (notification_id, user_id, "timestamp", text, is_read) FROM stdin;
1	1	2025-05-17 00:54:30.800097+06	Your GRE score has been added.	f
2	2	2025-05-17 00:54:30.800097+06	New comment on your LOR draft.	t
\.


--
-- TOC entry 3954 (class 0 OID 16604)
-- Dependencies: 246
-- Data for Name: professor_papers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professor_papers (id, professor_id, title, url) FROM stdin;
1	1	Deep Learning Advances	http://example.com/deep_learning
\.


--
-- TOC entry 3952 (class 0 OID 16584)
-- Dependencies: 244
-- Data for Name: professor_research_areas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professor_research_areas (id, professor_id, research_interest_id) FROM stdin;
1	1	1
2	1	3
\.


--
-- TOC entry 3950 (class 0 OID 16569)
-- Dependencies: 242
-- Data for Name: professors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.professors (professor_id, university_id, name, bio, department, email, linkedin_url, google_scholar_url, lab_link) FROM stdin;
1	1	Dr. John Doe	AI researcher	Computer Science	jdoe@mit.edu	https://linkedin.com/in/jdoe	https://scholar.google.com/jdoe	http://mitlab.com/jdoe
25	1	Tommi Jaakkola	Machine Learning, AI researcher at MIT CSAIL	Computer Science	tommi@csail.mit.edu	\N	https://scholar.google.com/citations?user=xxxxx	\N
26	4	Fei-Fei Li	Expert in Computer Vision and AI, Stanford University	Computer Science	feifeili@stanford.edu	https://www.linkedin.com/in/feifeili/	https://profiles.stanford.edu/fei-fei-li	\N
27	5	David Parkes	Researcher in AI, Economics, and Multi-agent Systems at Harvard	Computer Science	parkes@seas.harvard.edu	\N	https://scholar.harvard.edu/parkes	\N
28	6	Yisong Yue	Machine Learning and Robotics researcher at Caltech	Computing & Mathematical Sciences	yyue@caltech.edu	\N	https://yisongyue.com	\N
29	7	Michael Osborne	Bayesian methods and Machine Learning expert, Oxford University	Engineering Science	michael.osborne@eng.ox.ac.uk	\N	https://www.cs.ox.ac.uk/people/michael.osborne	\N
30	8	Zoubin Ghahramani	Probabilistic models and Bayesian ML professor at Cambridge	Machine Learning	zoubin@ml.cam.ac.uk	\N	https://www.ml.cam.ac.uk/people/zoubin-ghahramani	\N
31	9	Joachim M. Buhmann	Expert in Machine Learning and Pattern Recognition, ETH Zurich	Computer Science	joachim.buhmann@inf.ethz.ch	\N	https://people.inf.ethz.ch/buhmann/	\N
32	10	Raquel Urtasun	Self-driving cars and Computer Vision professor, University of Toronto	Computer Science	urtasun@cs.toronto.edu	\N	https://www.cs.toronto.edu/~urtasun/	\N
33	11	Min-Ling Zhang	Data Mining and Machine Learning researcher at NUS	Computer Science	mlingzhang@nus.edu.sg	\N	https://www.comp.nus.edu.sg/~mzhang/	\N
34	12	Jun Zhu	Machine Learning and AI professor at Tsinghua University	Computer Science	jzhu@tsinghua.edu.cn	\N	http://www.stat.tsinghua.edu.cn/~jzhu/	\N
35	13	Michele Sebag	Machine Learning and Data Science expert at Imperial College London	Computer Science	michele.sebag@imperial.ac.uk	\N	https://www.imperial.ac.uk/people/michele.sebag	\N
\.


--
-- TOC entry 3930 (class 0 OID 16427)
-- Dependencies: 222
-- Data for Name: research_interests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.research_interests (id, name) FROM stdin;
1	Artificial Intelligence
2	Bioinformatics
3	Machine Learning
\.


--
-- TOC entry 3956 (class 0 OID 16619)
-- Dependencies: 248
-- Data for Name: scholarships; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.scholarships (scholarship_id, university_id, name, description, apply_link, eligibility, coverage) FROM stdin;
1	1	MIT Fellowship	Full tuition	http://mit.edu/fellowship	Open to international students	100%
2	\N	Harvard Research Grant	Partial tuition	http://harvard.edu/grant	For genetics students	50%
\.


--
-- TOC entry 3948 (class 0 OID 16558)
-- Dependencies: 240
-- Data for Name: universities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.universities (university_id, name, description, email, ranking, address, website_url) FROM stdin;
1	MIT	Top tech university	contact@mit.edu	1	77 Massachusetts Ave, Cambridge, MA	http://mit.edu
4	Stanford University	Leading tech university	contact@stanford.edu	2	450 Serra Mall, Stanford, CA	https://www.stanford.edu
5	Harvard University	Ivy League school	admissions@harvard.edu	3	Massachusetts Hall, Cambridge, MA	https://www.harvard.edu
6	Caltech	Science and engineering	info@caltech.edu	4	1200 E California Blvd, Pasadena, CA	https://www.caltech.edu
7	Oxford University	Oldest UK university	info@ox.ac.uk	5	Oxford, England	https://www.ox.ac.uk
8	Cambridge University	Prestigious UK university	info@cam.ac.uk	6	Cambridge, England	https://www.cam.ac.uk
9	ETH Zurich	Swiss Federal Institute of Tech	info@ethz.ch	7	Zurich, Switzerland	https://ethz.ch
10	University of Toronto	Top Canadian university	contact@utoronto.ca	8	Toronto, Canada	https://www.utoronto.ca
11	National University of Singapore	Leading Asian university	admissions@nus.edu.sg	9	Singapore	https://www.nus.edu.sg
12	Tsinghua University	Top Chinese university	info@tsinghua.edu.cn	10	Beijing, China	https://www.tsinghua.edu.cn
13	Imperial College London	Science and engineering	info@imperial.ac.uk	11	London, UK	https://www.imperial.ac.uk
14	University of Melbourne	Leading Australian university	info@unimelb.edu.au	12	Melbourne, Australia	https://www.unimelb.edu.au
15	Peking University	Comprehensive Chinese university	info@pku.edu.cn	13	Beijing, China	https://www.pku.edu.cn
16	Seoul National University	Top South Korean university	info@snu.ac.kr	14	Seoul, South Korea	https://www.snu.ac.kr
17	Technical University of Munich	Top German university	info@tum.de	15	Munich, Germany	https://www.tum.de
18	University of Edinburgh	Top UK university	info@ed.ac.uk	16	Edinburgh, UK	https://www.ed.ac.uk
19	University of British Columbia	Leading Canadian university	info@ubc.ca	17	Vancouver, Canada	https://www.ubc.ca
20	Australian National University	Top Australian university	info@anu.edu.au	18	Canberra, Australia	https://www.anu.edu.au
21	University of Tokyo	Leading Japanese university	info@u-tokyo.ac.jp	19	Tokyo, Japan	https://www.u-tokyo.ac.jp
22	KU Leuven	Top Belgian university	info@kuleuven.be	20	Leuven, Belgium	https://www.kuleuven.be
\.


--
-- TOC entry 3936 (class 0 OID 16465)
-- Dependencies: 228
-- Data for Name: user_fields_of_study; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_fields_of_study (id, user_id, field_of_study_id) FROM stdin;
1	1	1
2	2	2
\.


--
-- TOC entry 3946 (class 0 OID 16543)
-- Dependencies: 238
-- Data for Name: user_publications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_publications (id, user_id, title, url) FROM stdin;
1	1	AI in Healthcare	http://example.com/ai_healthcare
2	2	Genome Sequencing Advances	http://example.com/genome_seq
\.


--
-- TOC entry 3932 (class 0 OID 16436)
-- Dependencies: 224
-- Data for Name: user_research_interests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_research_interests (id, user_id, research_interest_id) FROM stdin;
1	1	1
2	1	3
3	2	2
\.


--
-- TOC entry 3928 (class 0 OID 16412)
-- Dependencies: 220
-- Data for Name: user_scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_scores (id, user_id, test_name, score) FROM stdin;
1	1	IELTS	7.5
2	1	GRE	320
3	2	TOEFL	100
\.


--
-- TOC entry 3944 (class 0 OID 16523)
-- Dependencies: 236
-- Data for Name: user_target_countries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_target_countries (id, user_id, country_id) FROM stdin;
1	1	1
2	2	2
\.


--
-- TOC entry 3940 (class 0 OID 16494)
-- Dependencies: 232
-- Data for Name: user_target_majors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_target_majors (id, user_id, major_id) FROM stdin;
1	1	1
2	2	2
\.


--
-- TOC entry 3926 (class 0 OID 16399)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, name, bio, email, bicrypted_pass, cgpa, cv, created_at, updated_at, apply_year) FROM stdin;
1	Alice Smith	Interested in AI and ML	alice@example.com	hashedpass1	3.80	alice_cv.pdf	2025-05-17 00:54:30.800097+06	2025-05-17 00:54:30.800097+06	2025
2	Bob Johnson	Bioinformatics researcher	bob@example.com	hashedpass2	3.60	bob_cv.pdf	2025-05-17 00:54:30.800097+06	2025-05-17 00:54:30.800097+06	2024
5	Cathy Lee	Data scientist	cathy@example.com	$2b$12$hash3...	3.92	cathy_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2025
6	David Kim	Software developer	david@example.com	$2b$12$hash4...	3.50	david_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2024
7	Emma Chen	Research assistant	emma@example.com	$2b$12$hash5...	3.78	emma_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2025
8	Frank Wright	Robotics expert	frank@example.com	$2b$12$hash6...	3.88	frank_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2026
9	Grace Park	Computer Vision	grace@example.com	$2b$12$hash7...	3.82	grace_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2025
10	Henry Zhao	Bioinformatics	henry@example.com	$2b$12$hash8...	3.90	henry_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2024
11	Isabel Garcia	NLP researcher	isabel@example.com	$2b$12$hash9...	3.70	isabel_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2026
12	Jack Brown	Security analyst	jack@example.com	$2b$12$hash10...	3.65	jack_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2025
13	Karen Wilson	Data engineer	karen@example.com	$2b$12$hash11...	3.77	karen_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2024
14	Leo Martinez	Cloud computing	leo@example.com	$2b$12$hash12...	3.83	leo_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2025
15	Maya Patel	AI ethics	maya@example.com	$2b$12$hash13...	3.69	maya_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2026
16	Nate Cooper	Full stack dev	nate@example.com	$2b$12$hash14...	3.55	nate_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2024
17	Olivia Green	UX researcher	olivia@example.com	$2b$12$hash15...	3.80	olivia_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2025
18	Paul Young	Big data specialist	paul@example.com	$2b$12$hash16...	3.74	paul_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2026
19	Quinn Lee	Quantum computing	quinn@example.com	$2b$12$hash17...	3.90	quinn_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2025
20	Rachel Kim	Mobile apps dev	rachel@example.com	$2b$12$hash18...	3.68	rachel_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2024
21	Samir Das	Data analyst	samir@example.com	$2b$12$hash19...	3.71	samir_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2025
22	Tina Huang	Cybersecurity	tina@example.com	$2b$12$hash20...	3.76	tina_cv.pdf	2025-05-17 00:58:39.552263+06	2025-05-17 00:58:39.552263+06	2026
\.


--
-- TOC entry 3990 (class 0 OID 0)
-- Dependencies: 253
-- Name: application_timeline_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.application_timeline_event_id_seq', 2, true);


--
-- TOC entry 3991 (class 0 OID 0)
-- Dependencies: 251
-- Name: comments_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_comment_id_seq', 2, true);


--
-- TOC entry 3992 (class 0 OID 0)
-- Dependencies: 233
-- Name: countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.countries_id_seq', 2, true);


--
-- TOC entry 3993 (class 0 OID 0)
-- Dependencies: 249
-- Name: drafts_draft_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.drafts_draft_id_seq', 2, true);


--
-- TOC entry 3994 (class 0 OID 0)
-- Dependencies: 225
-- Name: fields_of_study_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.fields_of_study_id_seq', 2, true);


--
-- TOC entry 3995 (class 0 OID 0)
-- Dependencies: 229
-- Name: majors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.majors_id_seq', 2, true);


--
-- TOC entry 3996 (class 0 OID 0)
-- Dependencies: 255
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 2, true);


--
-- TOC entry 3997 (class 0 OID 0)
-- Dependencies: 245
-- Name: professor_papers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.professor_papers_id_seq', 2, true);


--
-- TOC entry 3998 (class 0 OID 0)
-- Dependencies: 243
-- Name: professor_research_areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.professor_research_areas_id_seq', 3, true);


--
-- TOC entry 3999 (class 0 OID 0)
-- Dependencies: 241
-- Name: professors_professor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.professors_professor_id_seq', 35, true);


--
-- TOC entry 4000 (class 0 OID 0)
-- Dependencies: 221
-- Name: research_interests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.research_interests_id_seq', 3, true);


--
-- TOC entry 4001 (class 0 OID 0)
-- Dependencies: 247
-- Name: scholarships_scholarship_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.scholarships_scholarship_id_seq', 2, true);


--
-- TOC entry 4002 (class 0 OID 0)
-- Dependencies: 239
-- Name: universities_university_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.universities_university_id_seq', 22, true);


--
-- TOC entry 4003 (class 0 OID 0)
-- Dependencies: 227
-- Name: user_fields_of_study_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_fields_of_study_id_seq', 2, true);


--
-- TOC entry 4004 (class 0 OID 0)
-- Dependencies: 237
-- Name: user_publications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_publications_id_seq', 2, true);


--
-- TOC entry 4005 (class 0 OID 0)
-- Dependencies: 223
-- Name: user_research_interests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_research_interests_id_seq', 3, true);


--
-- TOC entry 4006 (class 0 OID 0)
-- Dependencies: 219
-- Name: user_scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_scores_id_seq', 3, true);


--
-- TOC entry 4007 (class 0 OID 0)
-- Dependencies: 235
-- Name: user_target_countries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_target_countries_id_seq', 2, true);


--
-- TOC entry 4008 (class 0 OID 0)
-- Dependencies: 231
-- Name: user_target_majors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_target_majors_id_seq', 2, true);


--
-- TOC entry 4009 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 22, true);


--
-- TOC entry 3755 (class 2606 OID 16680)
-- Name: application_timeline application_timeline_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_timeline
    ADD CONSTRAINT application_timeline_pkey PRIMARY KEY (event_id);


--
-- TOC entry 3752 (class 2606 OID 16659)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (comment_id);


--
-- TOC entry 3720 (class 2606 OID 16521)
-- Name: countries countries_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_name_key UNIQUE (name);


--
-- TOC entry 3722 (class 2606 OID 16519)
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (id);


--
-- TOC entry 3749 (class 2606 OID 16643)
-- Name: drafts drafts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drafts
    ADD CONSTRAINT drafts_pkey PRIMARY KEY (draft_id);


--
-- TOC entry 3702 (class 2606 OID 16463)
-- Name: fields_of_study fields_of_study_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fields_of_study
    ADD CONSTRAINT fields_of_study_name_key UNIQUE (name);


--
-- TOC entry 3704 (class 2606 OID 16461)
-- Name: fields_of_study fields_of_study_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fields_of_study
    ADD CONSTRAINT fields_of_study_pkey PRIMARY KEY (id);


--
-- TOC entry 3711 (class 2606 OID 16492)
-- Name: majors majors_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.majors
    ADD CONSTRAINT majors_name_key UNIQUE (name);


--
-- TOC entry 3713 (class 2606 OID 16490)
-- Name: majors majors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.majors
    ADD CONSTRAINT majors_pkey PRIMARY KEY (id);


--
-- TOC entry 3759 (class 2606 OID 16697)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (notification_id);


--
-- TOC entry 3740 (class 2606 OID 16591)
-- Name: professor_research_areas prof_research_area_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professor_research_areas
    ADD CONSTRAINT prof_research_area_unique UNIQUE (professor_id, research_interest_id);


--
-- TOC entry 3745 (class 2606 OID 16611)
-- Name: professor_papers professor_papers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professor_papers
    ADD CONSTRAINT professor_papers_pkey PRIMARY KEY (id);


--
-- TOC entry 3742 (class 2606 OID 16589)
-- Name: professor_research_areas professor_research_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professor_research_areas
    ADD CONSTRAINT professor_research_areas_pkey PRIMARY KEY (id);


--
-- TOC entry 3737 (class 2606 OID 16576)
-- Name: professors professors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professors
    ADD CONSTRAINT professors_pkey PRIMARY KEY (professor_id);


--
-- TOC entry 3693 (class 2606 OID 16434)
-- Name: research_interests research_interests_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.research_interests
    ADD CONSTRAINT research_interests_name_key UNIQUE (name);


--
-- TOC entry 3695 (class 2606 OID 16432)
-- Name: research_interests research_interests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.research_interests
    ADD CONSTRAINT research_interests_pkey PRIMARY KEY (id);


--
-- TOC entry 3747 (class 2606 OID 16626)
-- Name: scholarships scholarships_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scholarships
    ADD CONSTRAINT scholarships_pkey PRIMARY KEY (scholarship_id);


--
-- TOC entry 3732 (class 2606 OID 16567)
-- Name: universities universities_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_name_key UNIQUE (name);


--
-- TOC entry 3734 (class 2606 OID 16565)
-- Name: universities universities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_pkey PRIMARY KEY (university_id);


--
-- TOC entry 3725 (class 2606 OID 16530)
-- Name: user_target_countries user_country_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_target_countries
    ADD CONSTRAINT user_country_unique UNIQUE (user_id, country_id);


--
-- TOC entry 3707 (class 2606 OID 16472)
-- Name: user_fields_of_study user_field_of_study_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_fields_of_study
    ADD CONSTRAINT user_field_of_study_unique UNIQUE (user_id, field_of_study_id);


--
-- TOC entry 3709 (class 2606 OID 16470)
-- Name: user_fields_of_study user_fields_of_study_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_fields_of_study
    ADD CONSTRAINT user_fields_of_study_pkey PRIMARY KEY (id);


--
-- TOC entry 3716 (class 2606 OID 16501)
-- Name: user_target_majors user_major_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_target_majors
    ADD CONSTRAINT user_major_unique UNIQUE (user_id, major_id);


--
-- TOC entry 3730 (class 2606 OID 16550)
-- Name: user_publications user_publications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_publications
    ADD CONSTRAINT user_publications_pkey PRIMARY KEY (id);


--
-- TOC entry 3698 (class 2606 OID 16443)
-- Name: user_research_interests user_research_interest_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_research_interests
    ADD CONSTRAINT user_research_interest_unique UNIQUE (user_id, research_interest_id);


--
-- TOC entry 3700 (class 2606 OID 16441)
-- Name: user_research_interests user_research_interests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_research_interests
    ADD CONSTRAINT user_research_interests_pkey PRIMARY KEY (id);


--
-- TOC entry 3689 (class 2606 OID 16417)
-- Name: user_scores user_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_scores
    ADD CONSTRAINT user_scores_pkey PRIMARY KEY (id);


--
-- TOC entry 3727 (class 2606 OID 16528)
-- Name: user_target_countries user_target_countries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_target_countries
    ADD CONSTRAINT user_target_countries_pkey PRIMARY KEY (id);


--
-- TOC entry 3718 (class 2606 OID 16499)
-- Name: user_target_majors user_target_majors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_target_majors
    ADD CONSTRAINT user_target_majors_pkey PRIMARY KEY (id);


--
-- TOC entry 3691 (class 2606 OID 16419)
-- Name: user_scores user_test_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_scores
    ADD CONSTRAINT user_test_unique UNIQUE (user_id, test_name);


--
-- TOC entry 3684 (class 2606 OID 16410)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3686 (class 2606 OID 16408)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3756 (class 1259 OID 16686)
-- Name: idx_app_timeline_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_app_timeline_user_id ON public.application_timeline USING btree (user_id);


--
-- TOC entry 3753 (class 1259 OID 16670)
-- Name: idx_comments_draft_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_comments_draft_id ON public.comments USING btree (draft_id);


--
-- TOC entry 3750 (class 1259 OID 16649)
-- Name: idx_drafts_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_drafts_user_id ON public.drafts USING btree (user_id);


--
-- TOC entry 3757 (class 1259 OID 16703)
-- Name: idx_notifications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user_id ON public.notifications USING btree (user_id);


--
-- TOC entry 3738 (class 1259 OID 16602)
-- Name: idx_prof_research_prof_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prof_research_prof_id ON public.professor_research_areas USING btree (professor_id);


--
-- TOC entry 3743 (class 1259 OID 16617)
-- Name: idx_professor_papers_professor_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_professor_papers_professor_id ON public.professor_papers USING btree (professor_id);


--
-- TOC entry 3735 (class 1259 OID 16582)
-- Name: idx_professors_university_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_professors_university_id ON public.professors USING btree (university_id);


--
-- TOC entry 3705 (class 1259 OID 16483)
-- Name: idx_user_fields_of_study_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_fields_of_study_user_id ON public.user_fields_of_study USING btree (user_id);


--
-- TOC entry 3728 (class 1259 OID 16556)
-- Name: idx_user_publications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_publications_user_id ON public.user_publications USING btree (user_id);


--
-- TOC entry 3696 (class 1259 OID 16454)
-- Name: idx_user_research_interests_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_research_interests_user_id ON public.user_research_interests USING btree (user_id);


--
-- TOC entry 3687 (class 1259 OID 16425)
-- Name: idx_user_scores_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_scores_user_id ON public.user_scores USING btree (user_id);


--
-- TOC entry 3723 (class 1259 OID 16541)
-- Name: idx_user_target_countries_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_target_countries_user_id ON public.user_target_countries USING btree (user_id);


--
-- TOC entry 3714 (class 1259 OID 16512)
-- Name: idx_user_target_majors_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_target_majors_user_id ON public.user_target_majors USING btree (user_id);


--
-- TOC entry 3778 (class 2606 OID 16681)
-- Name: application_timeline application_timeline_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_timeline
    ADD CONSTRAINT application_timeline_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3776 (class 2606 OID 16660)
-- Name: comments comments_draft_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_draft_id_fkey FOREIGN KEY (draft_id) REFERENCES public.drafts(draft_id) ON DELETE CASCADE;


--
-- TOC entry 3777 (class 2606 OID 16665)
-- Name: comments comments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3775 (class 2606 OID 16644)
-- Name: drafts drafts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drafts
    ADD CONSTRAINT drafts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3779 (class 2606 OID 16698)
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3773 (class 2606 OID 16612)
-- Name: professor_papers professor_papers_professor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professor_papers
    ADD CONSTRAINT professor_papers_professor_id_fkey FOREIGN KEY (professor_id) REFERENCES public.professors(professor_id) ON DELETE CASCADE;


--
-- TOC entry 3771 (class 2606 OID 16592)
-- Name: professor_research_areas professor_research_areas_professor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professor_research_areas
    ADD CONSTRAINT professor_research_areas_professor_id_fkey FOREIGN KEY (professor_id) REFERENCES public.professors(professor_id) ON DELETE CASCADE;


--
-- TOC entry 3772 (class 2606 OID 16597)
-- Name: professor_research_areas professor_research_areas_research_interest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professor_research_areas
    ADD CONSTRAINT professor_research_areas_research_interest_id_fkey FOREIGN KEY (research_interest_id) REFERENCES public.research_interests(id);


--
-- TOC entry 3770 (class 2606 OID 16577)
-- Name: professors professors_university_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professors
    ADD CONSTRAINT professors_university_id_fkey FOREIGN KEY (university_id) REFERENCES public.universities(university_id) ON DELETE CASCADE;


--
-- TOC entry 3774 (class 2606 OID 16627)
-- Name: scholarships scholarships_university_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.scholarships
    ADD CONSTRAINT scholarships_university_id_fkey FOREIGN KEY (university_id) REFERENCES public.universities(university_id) ON DELETE SET NULL;


--
-- TOC entry 3763 (class 2606 OID 16478)
-- Name: user_fields_of_study user_fields_of_study_field_of_study_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_fields_of_study
    ADD CONSTRAINT user_fields_of_study_field_of_study_id_fkey FOREIGN KEY (field_of_study_id) REFERENCES public.fields_of_study(id) ON DELETE CASCADE;


--
-- TOC entry 3764 (class 2606 OID 16473)
-- Name: user_fields_of_study user_fields_of_study_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_fields_of_study
    ADD CONSTRAINT user_fields_of_study_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3769 (class 2606 OID 16551)
-- Name: user_publications user_publications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_publications
    ADD CONSTRAINT user_publications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3761 (class 2606 OID 16449)
-- Name: user_research_interests user_research_interests_research_interest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_research_interests
    ADD CONSTRAINT user_research_interests_research_interest_id_fkey FOREIGN KEY (research_interest_id) REFERENCES public.research_interests(id) ON DELETE CASCADE;


--
-- TOC entry 3762 (class 2606 OID 16444)
-- Name: user_research_interests user_research_interests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_research_interests
    ADD CONSTRAINT user_research_interests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3760 (class 2606 OID 16420)
-- Name: user_scores user_scores_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_scores
    ADD CONSTRAINT user_scores_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3767 (class 2606 OID 16536)
-- Name: user_target_countries user_target_countries_country_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_target_countries
    ADD CONSTRAINT user_target_countries_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id) ON DELETE CASCADE;


--
-- TOC entry 3768 (class 2606 OID 16531)
-- Name: user_target_countries user_target_countries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_target_countries
    ADD CONSTRAINT user_target_countries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


--
-- TOC entry 3765 (class 2606 OID 16507)
-- Name: user_target_majors user_target_majors_major_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_target_majors
    ADD CONSTRAINT user_target_majors_major_id_fkey FOREIGN KEY (major_id) REFERENCES public.majors(id) ON DELETE CASCADE;


--
-- TOC entry 3766 (class 2606 OID 16502)
-- Name: user_target_majors user_target_majors_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_target_majors
    ADD CONSTRAINT user_target_majors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2025-05-17 01:34:51 +06

--
-- PostgreSQL database dump complete
--

