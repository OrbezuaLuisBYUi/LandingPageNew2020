CREATE TABLE "public"."users" (
  use_key_inside SERIAL NOT NULL PRIMARY KEY,
  use_username varchar(20) NOT NULL,
  use_password varchar(20) NOT NULL,
  use_name varchar(100) NOT NULL,
  use_lastname varchar(100) NOT NULL,
  use_phone varchar(25) NOT NULL,
  use_email varchar(150) NOT NULL,
  use_profile int4 NOT NULL DEFAULT 2
) WITH (OIDS=FALSE);

CREATE TABLE "public"."landing_page" (
    lan_key_inside SERIAL NOT NULL PRIMARY KEY,
    lan_tittle varchar(100) NOT NULL,
    lan_subtittle varchar(300) NOT NULL,
    lan_image varchar(100),
    lan_video text,
    lan_text text,
    lan_sw_name SMALLINT NOT NULL DEFAULT 1,
    lan_sw_email SMALLINT NOT NULL DEFAULT 1,
    lan_sw_text SMALLINT NOT NULL DEFAULT 1,
    lan_sw_phone SMALLINT NOT NULL DEFAULT 1,
    use_key_inside int NOT NULL REFERENCES public.users(use_key_inside)
) WITH (OIDS=FALSE);
ALTER TABLE public.landing_page ADD COLUMN lan_video_owner text NOT NULL;
ALTER TABLE public.landing_page ADD COLUMN lan_attachment_owner text NOT NULL;

CREATE TABLE "public"."validate_email" (
    ema_key_inside SERIAL NOT NULL PRIMARY KEY,
    ema_type SMALLINT NOT NULL,
    use_key_inside int NOT NULL REFERENCES public.users(use_key_inside)
) WITH (OIDS=FALSE);

CREATE TABLE "public"."customer" (
    cus_key_inside SERIAL NOT NULL PRIMARY KEY,
    cus_name varchar(100) NOT NULL,
    cus_email text NOT NULL,
    cus_text text,
    cus_phone varchar(50),
    use_key_inside int NOT NULL REFERENCES public.users(use_key_inside)
) WITH (OIDS=FALSE);
ALTER TABLE public.customer ADD COLUMN lan_key_inside int4 NOT NULL REFERENCES public.landing_page(lan_key_inside);

(1: Cuando se registra, 2. Cuando crea la landingpage junto con su link)