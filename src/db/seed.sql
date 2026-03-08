-- Seed data for Juolingo
-- Run: wrangler d1 execute juolingo-db --local --file=src/db/seed.sql

-- Clean existing data
DELETE FROM challenge_tokens;
DELETE FROM challenge_options;
DELETE FROM challenges;
DELETE FROM lessons;
DELETE FROM units;
DELETE FROM subjects;

-- =====================
-- Subject 1: Famous Biographies
-- =====================
INSERT INTO subjects (id, title, description, image_url, "order") VALUES
  (1, 'Famous Biographies', 'Learn English through the stories of great people', 'biography', 0);

-- Unit 1: Beethoven
INSERT INTO units (id, subject_id, title, description, "order") VALUES
  (1, 1, 'Beethoven', 'The legendary composer who changed music forever', 0);

-- Lesson 1: Basic vocabulary
INSERT INTO lessons (id, unit_id, title, "order") VALUES
  (1, 1, 'Early Life', 0);

-- Challenge 1: Translate "Hello, I am Anna."
INSERT INTO challenges (id, lesson_id, type, question, audio_url, "order") VALUES
  (1, 1, 'TRANSLATE', 'Hello, I am Beethoven.', 'ElevenLabs_2026-03-07T08_32_39_Rachel_pre_sp100_s50_sb75_se0_b_m2.mp3', 0);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (1, '你好', 1, 0),
  (1, '我', 1, 1),
  (1, '是', 1, 2),
  (1, '贝多芬', 1, 3),
  (1, '吗', 0, 4),
  (1, '很', 0, 5);

INSERT INTO challenge_tokens (challenge_id, text, translation, "order") VALUES
  (1, 'Hello,', '你好', 0),
  (1, 'I', '我', 1),
  (1, 'am', '是', 2),
  (1, 'Beethoven.', '贝多芬', 3);

-- Challenge 2: Fill in the blank
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (2, 1, 'FILL_BLANK', 'Beethoven ___ born in Bonn, Germany.', 1);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (2, 'was', 1, 0),
  (2, 'is', 0, 1),
  (2, 'were', 0, 2);

-- Challenge 3: Select translation
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (3, 1, 'SELECT_TRANSLATION', 'He began learning music at a very young age.', 2);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (3, '他很小的时候就开始学习音乐了', 1, 0),
  (3, '他在很老的时候才开始学习音乐', 0, 1),
  (3, '他从来没有学过音乐', 0, 2);

INSERT INTO challenge_tokens (challenge_id, text, translation, "order") VALUES
  (3, 'He', '他', 0),
  (3, 'began', '开始', 1),
  (3, 'learning', '学习', 2),
  (3, 'music', '音乐', 3),
  (3, 'at a very young age.', '在很小的时候', 4);

-- Challenge 4: Match pairs
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (4, 1, 'MATCH_PAIRS', 'Match the English words with their Chinese translations.', 3);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (4, 'composer', 1, 0),
  (4, '作曲家', 1, 1),
  (4, 'piano', 1, 2),
  (4, '钢琴', 1, 3),
  (4, 'symphony', 1, 4),
  (4, '交响曲', 1, 5);

-- Challenge 5: Translate
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (5, 1, 'TRANSLATE', 'They speak a little Chinese.', 4);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (5, '他们', 1, 0),
  (5, '说', 1, 1),
  (5, '一点点', 1, 2),
  (5, '中文', 1, 3),
  (5, '黑色', 0, 4),
  (5, '很', 0, 5),
  (5, '电脑', 0, 6),
  (5, '的', 0, 7);

INSERT INTO challenge_tokens (challenge_id, text, translation, "order") VALUES
  (5, 'They', '他们', 0),
  (5, 'speak', '说', 1),
  (5, 'a little', '一点点', 2),
  (5, 'Chinese.', '中文', 3);

-- Lesson 2: Musical Journey
INSERT INTO lessons (id, unit_id, title, "order") VALUES
  (2, 1, 'Musical Journey', 1);

-- Challenge 6
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (6, 2, 'FILL_BLANK', 'His father ___ his first music teacher.', 0);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (6, 'was', 1, 0),
  (6, 'is', 0, 1),
  (6, 'are', 0, 2);

-- Challenge 7
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (7, 2, 'SELECT_TRANSLATION', 'Beethoven composed nine symphonies.', 1);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (7, '贝多芬创作了九首交响曲', 1, 0),
  (7, '贝多芬只弹钢琴', 0, 1),
  (7, '贝多芬住在法国', 0, 2);

-- Challenge 8
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (8, 2, 'TRANSLATE', 'He lost his hearing.', 2);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (8, '他', 1, 0),
  (8, '失去了', 1, 1),
  (8, '听力', 1, 2),
  (8, '看到', 0, 3),
  (8, '音乐', 0, 4);

INSERT INTO challenge_tokens (challenge_id, text, translation, "order") VALUES
  (8, 'He', '他', 0),
  (8, 'lost', '失去了', 1),
  (8, 'his hearing.', '听力', 2);

-- Unit 2: Nobel
INSERT INTO units (id, subject_id, title, description, "order") VALUES
  (2, 1, 'Alfred Nobel', 'The inventor of dynamite and founder of the Nobel Prize', 1);

INSERT INTO lessons (id, unit_id, title, "order") VALUES
  (3, 2, 'Who Was Nobel?', 0);

INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (9, 3, 'TRANSLATE', 'Nobel was a Swedish inventor.', 0);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (9, '诺贝尔', 1, 0),
  (9, '是', 1, 1),
  (9, '一位', 1, 2),
  (9, '瑞典', 1, 3),
  (9, '发明家', 1, 4),
  (9, '法国', 0, 5),
  (9, '画家', 0, 6);

INSERT INTO challenge_tokens (challenge_id, text, translation, "order") VALUES
  (9, 'Nobel', '诺贝尔', 0),
  (9, 'was', '是', 1),
  (9, 'a Swedish', '一位瑞典', 2),
  (9, 'inventor.', '发明家', 3);

INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (10, 3, 'FILL_BLANK', 'He ___ born in Stockholm in 1833.', 1);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (10, 'was', 1, 0),
  (10, 'is', 0, 1),
  (10, 'has', 0, 2);

INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (11, 3, 'MATCH_PAIRS', 'Match the words.', 2);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (11, 'inventor', 1, 0),
  (11, '发明家', 1, 1),
  (11, 'prize', 1, 2),
  (11, '奖项', 1, 3),
  (11, 'peace', 1, 4),
  (11, '和平', 1, 5);

-- =====================
-- Subject 2: Fairy Tales
-- =====================
INSERT INTO subjects (id, title, description, image_url, "order") VALUES
  (2, 'Fairy Tales', 'Classic stories retold in English', 'story', 1);

INSERT INTO units (id, subject_id, title, description, "order") VALUES
  (3, 2, 'Little Red Riding Hood', 'The classic tale of a girl and a wolf', 0);

INSERT INTO lessons (id, unit_id, title, "order") VALUES
  (4, 3, 'Into the Woods', 0);

INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (12, 4, 'TRANSLATE', 'Once upon a time, there was a little girl.', 0);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (12, '从前', 1, 0),
  (12, '有', 1, 1),
  (12, '一个', 1, 2),
  (12, '小女孩', 1, 3),
  (12, '大灰狼', 0, 4),
  (12, '森林', 0, 5);

INSERT INTO challenge_tokens (challenge_id, text, translation, "order") VALUES
  (12, 'Once upon a time,', '从前', 0),
  (12, 'there was', '有', 1),
  (12, 'a little', '一个', 2),
  (12, 'girl.', '小女孩', 3);

INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (13, 4, 'FILL_BLANK', 'She ___ a red riding hood.', 1);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (13, 'wore', 1, 0),
  (13, 'eat', 0, 1),
  (13, 'ran', 0, 2);

INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (14, 4, 'SELECT_TRANSLATION', 'The wolf hid in the forest.', 2);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (14, '大灰狼藏在森林里', 1, 0),
  (14, '小女孩在森林里玩', 0, 1),
  (14, '奶奶住在城市里', 0, 2);

INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (15, 4, 'MATCH_PAIRS', 'Match the fairy tale words.', 3);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (15, 'wolf', 1, 0),
  (15, '狼', 1, 1),
  (15, 'forest', 1, 2),
  (15, '森林', 1, 3),
  (15, 'grandmother', 1, 4),
  (15, '奶奶', 1, 5);

INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (16, 4, 'TRANSLATE', 'She went to visit her grandmother.', 4);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (16, '她', 1, 0),
  (16, '去', 1, 1),
  (16, '看望', 1, 2),
  (16, '她的', 1, 3),
  (16, '奶奶', 1, 4),
  (16, '大灰狼', 0, 5),
  (16, '吃', 0, 6);

INSERT INTO challenge_tokens (challenge_id, text, translation, "order") VALUES
  (16, 'She', '她', 0),
  (16, 'went to', '去', 1),
  (16, 'visit', '看望', 2),
  (16, 'her grandmother.', '她的奶奶', 3);

INSERT INTO lessons (id, unit_id, title, "order") VALUES
  (5, 3, 'Meeting the Wolf', 1);

INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (17, 5, 'TRANSLATE', 'What big eyes you have!', 0);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (17, '你的', 1, 0),
  (17, '眼睛', 1, 1),
  (17, '好大', 1, 2),
  (17, '啊', 1, 3),
  (17, '耳朵', 0, 4),
  (17, '嘴巴', 0, 5);

INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (18, 5, 'FILL_BLANK', 'The wolf ___ the grandmother.', 1);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (18, 'ate', 1, 0),
  (18, 'helped', 0, 1),
  (18, 'saw', 0, 2);

INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (19, 5, 'SELECT_TRANSLATION', 'The hunter saved them both.', 2);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (19, '猎人救了她们两个', 1, 0),
  (19, '猎人跑去了森林', 0, 1),
  (19, '大灰狼逃跑了', 0, 2);
