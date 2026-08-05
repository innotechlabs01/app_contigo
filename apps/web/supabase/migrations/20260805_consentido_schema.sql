-- ConSentido Database Schema

CREATE TABLE IF NOT EXISTS occasions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_color TEXT NOT NULL,
  icon_svg TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE occasions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for occasions" ON occasions FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occasion_id UUID NOT NULL REFERENCES occasions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for messages" ON messages FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  occasion TEXT NOT NULL,
  message_text TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  recipient_phone TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert access for orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own orders" ON orders FOR SELECT USING (true);

CREATE INDEX idx_orders_status_scheduled ON orders(status, scheduled_date);

-- Seed occasions
INSERT INTO occasions (name, slug, description, icon_color, icon_svg, sort_order) VALUES
  ('Cumpleaños',  'cumpleanos',  'Celebrar un año más.',            '#FF8104', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF8800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.5 4.5L18 3l-2 5 5-1-4.5 4.5L21 13h-5l2 5-5-2-2 5-2-5-5 2 2-5H1l4.5-4.5L1 8l5 1-2-5 4.5 3.5L12 2z"/></svg>', 1),
  ('Graduación',  'graduacion',  'Un logro académico.',            '#2269ED', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2269ED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>', 2),
  ('Aniversario', 'aniversario', 'Tiempo compartido.',             '#E91E63', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E91E63" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>', 3),
  ('Boda',        'boda',        'Un nuevo comienzo.',             '#9C27B0', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9C27B0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>', 4),
  ('Nacimiento',  'nacimiento',  'Bienvenida al mundo.',           '#4CAF50', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M3 12h18"/><path d="M8 8l8 8"/><path d="M16 8l-8 8"/></svg>', 5),
  ('Amistad',     'amistad',     'Cariño sincero.',                '#FF9800', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>', 6);

-- Seed messages for each occasion
DO $$
DECLARE
  occ_id UUID;
BEGIN
  SELECT id INTO occ_id FROM occasions WHERE slug = 'cumpleanos';
  INSERT INTO messages (occasion_id, text) VALUES
    (occ_id, 'Que este nuevo año de vida te traiga la fuerza para perseguir cada sueño, la sabiduría para valorar cada instante y la alegría de saberte querido. ¡Feliz cumpleaños!'),
    (occ_id, 'Hoy celebramos tu existencia, esa chispa que ilumina a quienes tienen la suerte de conocerte. Que nunca te falten razones para sonreír.'),
    (occ_id, 'Que la vida te siga sorprendiendo con cosas maravillosas y que cada día sea una nueva razón para celebrar. ¡Feliz vuelta al sol!'),
    (occ_id, 'Un abrazo sincero en tu día especial. Que este nuevo año te regale todo lo que mereces y más.'),
    (occ_id, 'Que la alegría de hoy sea solo el comienzo de un año lleno de momentos inolvidables. Brindo por ti y por todo lo que está por venir.'),
    (occ_id, 'Feliz cumpleaños a una persona que hace del mundo un lugar mejor con su presencia. Que este día esté lleno de amor y felicidad.'),
    (occ_id, 'Que cada vela que apagues sea un deseo cumplido y cada risa compartida un recuerdo imborrable. ¡Disfruta tu día!'),
    (occ_id, 'La vida es mejor contigo en ella. Gracias por ser quien eres. Feliz cumpleaños, te mereces lo mejor.'),
    (occ_id, 'Que la felicidad que sientes hoy te acompañe durante todo el año. Feliz cumpleaños, que todos tus sueños se hagan realidad.'),
    (occ_id, 'Hoy el mundo celebra tu llegada. Que este nuevo ciclo esté lleno de aventuras, aprendizajes y mucho amor.');

  SELECT id INTO occ_id FROM occasions WHERE slug = 'graduacion';
  INSERT INTO messages (occasion_id, text) VALUES
    (occ_id, 'Tu esfuerzo y dedicación han dado sus frutos. Hoy celebramos no solo un título, sino tu perseverancia y pasión. ¡Felicidades!'),
    (occ_id, 'Cada página leída, cada noche de estudio, cada desafío superado te ha traído hasta aquí. El mundo te espera. ¡Felicitaciones!'),
    (occ_id, 'Este logro es solo el comienzo de todo lo que eres capaz de alcanzar. Que sigan los éxitos. ¡Enhorabuena!'),
    (occ_id, 'Hoy cierras un capítulo y abres otro lleno de posibilidades. Que la vida te premie con todo lo que sueñas. ¡Felicitaciones!'),
    (occ_id, 'La educación es el pasaporte al futuro. Tú ya tienes el tuyo. Ahora, ¡a conquistar el mundo!'),
    (occ_id, 'Detrás de este diploma hay historias de madrugadas, sacrificios y sueños. Todo valió la pena. ¡Lo lograste!'),
    (occ_id, 'Tu determinación es inspiradora. Hoy celebras el resultado de nunca rendirte. Que este sea el primero de muchos triunfos.'),
    (occ_id, 'El conocimiento que has adquirido es tu mayor tesoro. Ahora sal a compartirlo con el mundo. ¡Felicitaciones!'),
    (occ_id, 'No hay límites para quien cree en sí mismo. Tú lo has demostrado. Felicidades por este gran logro.'),
    (occ_id, 'Que este triunfo sea el impulso para alcanzar metas aún más grandes. El cielo es el límite. ¡Felicitaciones!');

  SELECT id INTO occ_id FROM occasions WHERE slug = 'aniversario';
  INSERT INTO messages (occasion_id, text) VALUES
    (occ_id, 'Cada día a tu lado es un regalo. Feliz aniversario, mi amor. Que sigan los años sumando recuerdos hermosos.'),
    (occ_id, 'El tiempo compartido es el mejor tesoro. Gracias por cada momento, cada risa y cada abrazo. Feliz aniversario.'),
    (occ_id, 'Contigo aprendí que el amor no se mide en tiempo, sino en intensidad. Y lo nuestro es eterno. Feliz aniversario.'),
    (occ_id, 'Celebrar otro año juntos es recordar que la vida es mejor cuando se comparte. Te amo. Feliz aniversario.'),
    (occ_id, 'Gracias por ser mi compañero de vida, mi apoyo y mi alegría. Que vengan muchos años más. Feliz aniversario.'),
    (occ_id, 'Cada aniversario es una nueva oportunidad para agradecer por haberte encontrado. Eres mi mejor decisión.'),
    (occ_id, 'El amor verdadero crece con el tiempo. El nuestro es prueba de ello. Feliz aniversario, mi vida.'),
    (occ_id, 'Un año más de complicidad, de sueños compartidos y de amor incondicional. Feliz aniversario.'),
    (occ_id, 'No necesito un calendario para saber que cada día contigo es especial. Pero hoy lo celebramos doble.'),
    (occ_id, 'Que nuestra historia siga escribiéndose con letras de amor, respeto y felicidad. Feliz aniversario.');

  SELECT id INTO occ_id FROM occasions WHERE slug = 'boda';
  INSERT INTO messages (occasion_id, text) VALUES
    (occ_id, 'Que este nuevo comienzo esté lleno de amor, respeto y complicidad. Que su historia juntos sea maravillosa. ¡Felicidades!'),
    (occ_id, 'Hoy unen sus vidas y sus sueños. Que el amor sea siempre el guía de su camino. ¡Enhorabuena!'),
    (occ_id, 'Dos almas, un corazón, un mismo destino. Que la felicidad los acompañe siempre. Felicidades en su boda.'),
    (occ_id, 'El amor es la fuerza más poderosa y ustedes lo demuestran. Que su unión sea bendecida con alegría eterna.'),
    (occ_id, 'Hoy comienza la mejor aventura de sus vidas. Que cada día sea un nuevo motivo para enamorarse. ¡Felicidades!'),
    (occ_id, 'Que el sí de hoy sea el primero de muchos síes que construyan una vida llena de amor. Felicidades.'),
    (occ_id, 'El matrimonio es el arte de crecer juntos. Que esta nueva etapa esté llena de luz y felicidad.'),
    (occ_id, 'Que su amor sea tan infinito como el universo y tan profundo como el mar. Felicidades en este día especial.'),
    (occ_id, 'Hoy celebramos el triunfo del amor. Que su hogar esté siempre lleno de risas, abrazos y comprensión.'),
    (occ_id, 'Dos caminos que se unen para siempre. Que el viaje sea tan hermoso como este día. ¡Felicidades!');

  SELECT id INTO occ_id FROM occasions WHERE slug = 'nacimiento';
  INSERT INTO messages (occasion_id, text) VALUES
    (occ_id, 'Bienvenido al mundo, pequeño. Que tu vida esté llena de amor, salud y felicidad. Has llegado para iluminar todo.'),
    (occ_id, 'Un nuevo ángel ha llegado. Que cada día sea una bendición y cada sonrisa un tesoro. ¡Felicidades a la familia!'),
    (occ_id, 'Hoy nace una nueva historia llena de amor. Bienvenido, pequeño milagro. El mundo te espera con los brazos abiertos.'),
    (occ_id, 'La llegada de un bebé es la prueba de que el amor no tiene límites. Felicidades por esta hermosa bendición.'),
    (occ_id, 'Pequeños pies que dejan grandes huellas en el corazón. Bienvenido a la familia. Que la vida te sonría siempre.'),
    (occ_id, 'Hoy el mundo recibe a un nuevo ser lleno de luz. Que crezcas rodeado de amor, risas y muchas aventuras.'),
    (occ_id, 'Cada bebé trae consigo la promesa de un mundo mejor. Felicidades por esta hermosa llegada.'),
    (occ_id, 'Que tus primeros pasos sean el inicio de un camino lleno de bendiciones. Bienvenido, pequeño tesoro.'),
    (occ_id, 'La familia crece y el amor se multiplica. Felicidades por la llegada de este hermoso bebé.'),
    (occ_id, 'Un corazón nuevo late en el mundo. Que la vida te regale todo lo hermoso que mereces. Bienvenido.');

  SELECT id INTO occ_id FROM occasions WHERE slug = 'amistad';
  INSERT INTO messages (occasion_id, text) VALUES
    (occ_id, 'La amistad verdadera no necesita palabras, pero hoy quiero decirte lo importante que eres para mí. Gracias por estar siempre.'),
    (occ_id, 'Un amigo es un tesoro que la vida nos regala. Gracias por ser parte de mi historia y por cada momento compartido.'),
    (occ_id, 'En las buenas y en las malas, siempre has estado ahí. Eso es la amistad verdadera. Gracias por ser como eres.'),
    (occ_id, 'La vida es más divertida, más ligera y más bella con amigos como tú. Gracias por existir.'),
    (occ_id, 'No necesito contar con los dedos a mis amigos porque con uno como tú me basta. Eres invaluable.'),
    (occ_id, 'Los mejores momentos de la vida se viven en buena compañía. Gracias por ser de las mejores.'),
    (occ_id, 'Un amigo es quien te conoce tal como eres y aún así decide quedarse. Gracias por elegirme.'),
    (occ_id, 'Que la vida nos siga regalando momentos para compartir, risas para recordar y abrazos para sanar.'),
    (occ_id, 'La distancia no apaga una amistad verdadera. Gracias por estar presente, aunque sea en el corazón.'),
    (occ_id, 'Celebro tenerte en mi vida. Eres de esas personas que hacen del mundo un lugar más amable.');
END $$;
