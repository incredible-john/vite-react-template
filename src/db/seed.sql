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

-- =====================
-- Unit 4: The Lion and the Mouse (Fairy Tales)
-- =====================
INSERT INTO units (id, subject_id, title, description, "order") VALUES
  (4, 2, 'The Lion and the Mouse', 'A classic fable about kindness and friendship', 1);

-- Lesson 6: Select Translation Challenge A (Part 1 vocab)
INSERT INTO lessons (id, unit_id, title, "order") VALUES
  (6, 4, 'Part 1 Vocabulary', 0);

-- Lesson 7: Matching Pairs Challenge A1–A4
INSERT INTO lessons (id, unit_id, title, "order") VALUES
  (7, 4, 'Part 1 Matching', 1);

-- Lesson 8: Select Translation Challenge B (Part 2 vocab)
INSERT INTO lessons (id, unit_id, title, "order") VALUES
  (8, 4, 'Part 2 Vocabulary', 2);

-- Lesson 9: Matching Pairs Challenge B1–B3
INSERT INTO lessons (id, unit_id, title, "order") VALUES
  (9, 4, 'Part 2 Matching', 3);

-- ============================================================
-- Lesson 6 — SELECT_TRANSLATION Challenge A (Part 1, 19 items)
-- ============================================================

INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (20, 6, 'SELECT_TRANSLATION', 'lion',             1),
  (21, 6, 'SELECT_TRANSLATION', 'sleep',              2),
  (22, 6, 'SELECT_TRANSLATION', 'under',            3),
  (23, 6, 'SELECT_TRANSLATION', 'tree',             4),
  (24, 6, 'SELECT_TRANSLATION', 'little',           5),
  (25, 6, 'SELECT_TRANSLATION', 'mouse',            6),
  (26, 6, 'SELECT_TRANSLATION', 'play',             7),
  (27, 6, 'SELECT_TRANSLATION', 'around',           8),
  (28, 6, 'SELECT_TRANSLATION', 'suddenly',         9),
  (29, 6, 'SELECT_TRANSLATION', 'wake / woke',      10),
  (30, 6, 'SELECT_TRANSLATION', 'eat',              11),
  (31, 6, 'SELECT_TRANSLATION', 'pick up',          12),
  (32, 6, 'SELECT_TRANSLATION', 'open',             13),
  (33, 6, 'SELECT_TRANSLATION', 'mouth',            14),
  (34, 6, 'SELECT_TRANSLATION', 'his',              15),
  (35, 6, 'SELECT_TRANSLATION', 'please',           16),
  (36, 6, 'SELECT_TRANSLATION', 'let me go',        17),
  (37, 6, 'SELECT_TRANSLATION', 'help',             18),
  (38, 6, 'SELECT_TRANSLATION', 'one day',          19);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  -- 20: lion
  (20, '狮子',     1, 0), (20, '老虎',     0, 1), (20, '大象',     0, 2),
  -- 21: sleep / sleeping
  (21, '睡觉',     1, 0), (21, '玩耍',     0, 1), (21, '奔跑',     0, 2),
  -- 22: under
  (22, '在……下面', 1, 0), (22, '在……上面', 0, 1), (22, '在……旁边', 0, 2),
  -- 23: tree
  (23, '树',       1, 0), (23, '花',       0, 1), (23, '草',       0, 2),
  -- 24: little
  (24, '小小的',   1, 0), (24, '大大的',   0, 1), (24, '高高的',   0, 2),
  -- 25: mouse
  (25, '老鼠',     1, 0), (25, '兔子',     0, 1), (25, '猫咪',     0, 2),
  -- 26: play / playing
  (26, '玩耍',     1, 0), (26, '睡觉',     0, 1), (26, '哭泣',     0, 2),
  -- 27: around
  (27, '在周围',   1, 0), (27, '在里面',   0, 1), (27, '在外面',   0, 2),
  -- 28: suddenly
  (28, '突然',     1, 0), (28, '慢慢地',   0, 1), (28, '开心地',   0, 2),
  -- 29: wake / woke
  (29, '醒来',     1, 0), (29, '睡着',     0, 1), (29, '站起来',   0, 2),
  -- 30: eat
  (30, '吃',       1, 0), (30, '喝',       0, 1), (30, '跑',       0, 2),
  -- 31: pick up
  (31, '抓起',     1, 0), (31, '放下',     0, 1), (31, '推开',     0, 2),
  -- 32: open
  (32, '打开',     1, 0), (32, '关上',     0, 1), (32, '拿起',     0, 2),
  -- 33: mouth
  (33, '嘴巴',     1, 0), (33, '眼睛',     0, 1), (33, '耳朵',     0, 2),
  -- 34: his
  (34, '他的',     1, 0), (34, '她的',     0, 1), (34, '它的',     0, 2),
  -- 35: please
  (35, '请；拜托', 1, 0), (35, '谢谢',     0, 1), (35, '对不起',   0, 2),
  -- 36: let me go
  (36, '放了我',   1, 0), (36, '抓住我',   0, 1), (36, '帮助我',   0, 2),
  -- 37: help
  (37, '帮助',     1, 0), (37, '伤害',     0, 1), (37, '忘记',     0, 2),
  -- 38: one day
  (38, '有一天',   1, 0), (38, '每一天',   0, 1), (38, '今天',     0, 2);

-- ============================================================
-- Lesson 7 — MATCH_PAIRS Challenge A1–A4 (full Part 1 coverage)
-- ============================================================

-- A1: lion → little (items 1–5)
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (39, 7, 'MATCH_PAIRS', 'Match the English words with their Chinese translations.', 1);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (39, 'lion',             1, 0), (39, '狮子',     1, 1),
  (39, 'sleep / sleeping', 1, 2), (39, '睡觉',     1, 3),
  (39, 'under',            1, 4), (39, '在……下面', 1, 5),
  (39, 'tree',             1, 6), (39, '树',       1, 7),
  (39, 'little',           1, 8), (39, '小小的',   1, 9);

-- A2: mouse → wake/woke (items 6–10)
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (40, 7, 'MATCH_PAIRS', 'Match the English words with their Chinese translations.', 2);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (40, 'mouse',          1, 0), (40, '老鼠',   1, 1),
  (40, 'play / playing', 1, 2), (40, '玩耍',   1, 3),
  (40, 'around',         1, 4), (40, '在周围', 1, 5),
  (40, 'suddenly',       1, 6), (40, '突然',   1, 7),
  (40, 'wake / woke',    1, 8), (40, '醒来',   1, 9);

-- A3: eat → his (items 11–15)
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (41, 7, 'MATCH_PAIRS', 'Match the English words with their Chinese translations.', 3);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (41, 'eat',     1, 0), (41, '吃',   1, 1),
  (41, 'pick up', 1, 2), (41, '抓起', 1, 3),
  (41, 'open',    1, 4), (41, '打开', 1, 5),
  (41, 'mouth',   1, 6), (41, '嘴巴', 1, 7),
  (41, 'his',     1, 8), (41, '他的', 1, 9);

-- A4: please → one day (items 16–19, please repeated to fill 5 pairs)
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (42, 7, 'MATCH_PAIRS', 'Match the English words with their Chinese translations.', 4);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (42, 'please',    1, 0), (42, '请；拜托', 1, 1),
  (42, 'let me go', 1, 2), (42, '放了我',   1, 3),
  (42, 'help',      1, 4), (42, '帮助',     1, 5),
  (42, 'one day',   1, 6), (42, '有一天',   1, 7),
  (42, 'please',    1, 8), (42, '请；拜托', 1, 9);

-- ============================================================
-- Lesson 8 — SELECT_TRANSLATION Challenge B (Part 2, 13 items)
-- ============================================================

INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (43, 8, 'SELECT_TRANSLATION', 'do',                   1),
  (44, 8, 'SELECT_TRANSLATION', 'laugh',                2),
  (45, 8, 'SELECT_TRANSLATION', 'run away',             3),
  (46, 8, 'SELECT_TRANSLATION', 'next',                 4),
  (47, 8, 'SELECT_TRANSLATION', 'next day',             5),
  (48, 8, 'SELECT_TRANSLATION', 'catch / caught',       6),
  (49, 8, 'SELECT_TRANSLATION', 'trap',                 7),
  (50, 8, 'SELECT_TRANSLATION', 'see / saw',            8),
  (51, 8, 'SELECT_TRANSLATION', 'run / ran',            9),
  (52, 8, 'SELECT_TRANSLATION', 'begin / began',        10),
  (53, 8, 'SELECT_TRANSLATION', 'save / saved my life', 11),
  (54, 8, 'SELECT_TRANSLATION', 'from that day',        12),
  (55, 8, 'SELECT_TRANSLATION', 'become / became',      13);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  -- 43: do
  (43, '做',           1, 0), (43, '说',           0, 1), (43, '看',           0, 2),
  -- 44: laugh
  (44, '大笑',         1, 0), (44, '哭泣',         0, 1), (44, '生气',         0, 2),
  -- 45: run away
  (45, '跑走',         1, 0), (45, '躲起来',       0, 1), (45, '飞走',         0, 2),
  -- 46: next
  (46, '下一个',       1, 0), (46, '上一个',       0, 1), (46, '这一个',       0, 2),
  -- 47: next day
  (47, '第二天',       1, 0), (47, '昨天',         0, 1), (47, '今天',         0, 2),
  -- 48: catch / caught
  (48, '抓住；被困',   1, 0), (48, '逃跑',         0, 1), (48, '找到',         0, 2),
  -- 49: trap
  (49, '陷阱',         1, 0), (49, '绳子',         0, 1), (49, '树木',         0, 2),
  -- 50: see / saw
  (50, '看见',         1, 0), (50, '听见',         0, 1), (50, '摸到',         0, 2),
  -- 51: run / ran
  (51, '跑',           1, 0), (51, '走',           0, 1), (51, '跳',           0, 2),
  -- 52: begin / began
  (52, '开始',         1, 0), (52, '结束',         0, 1), (52, '继续',         0, 2),
  -- 53: save / saved my life
  (53, '救了我的命',   1, 0), (53, '伤害了我',     0, 1), (53, '忘记了我',     0, 2),
  -- 54: from that day
  (54, '从那天起',     1, 0), (54, '到那天为止',   0, 1), (54, '在那天之前',   0, 2),
  -- 55: become / became
  (55, '成为',         1, 0), (55, '离开',         0, 1), (55, '忘记',         0, 2);

-- ============================================================
-- Lesson 9 — MATCH_PAIRS Challenge B1–B3 (full Part 2 coverage)
-- ============================================================

-- B1: do → next day (items 1–5)
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (56, 9, 'MATCH_PAIRS', 'Match the English words with their Chinese translations.', 1);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (56, 'do',       1, 0), (56, '做',     1, 1),
  (56, 'laugh',    1, 2), (56, '大笑',   1, 3),
  (56, 'run away', 1, 4), (56, '跑走',   1, 5),
  (56, 'next',     1, 6), (56, '下一个', 1, 7),
  (56, 'next day', 1, 8), (56, '第二天', 1, 9);

-- B2: catch/caught → begin/began (items 6–10)
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (57, 9, 'MATCH_PAIRS', 'Match the English words with their Chinese translations.', 2);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (57, 'catch / caught', 1, 0), (57, '抓住；被困', 1, 1),
  (57, 'trap',           1, 2), (57, '陷阱',       1, 3),
  (57, 'see / saw',      1, 4), (57, '看见',       1, 5),
  (57, 'run / ran',      1, 6), (57, '跑',         1, 7),
  (57, 'begin / began',  1, 8), (57, '开始',       1, 9);

-- B3: save/saved my life → become/became (items 11–13, save + from that day repeated)
INSERT INTO challenges (id, lesson_id, type, question, "order") VALUES
  (58, 9, 'MATCH_PAIRS', 'Match the English words with their Chinese translations.', 3);

INSERT INTO challenge_options (challenge_id, text, is_correct, "order") VALUES
  (58, 'save / saved my life', 1, 0), (58, '救了我的命', 1, 1),
  (58, 'from that day',        1, 2), (58, '从那天起',   1, 3),
  (58, 'become / became',      1, 4), (58, '成为',       1, 5),
  (58, 'save / saved my life', 1, 6), (58, '救了我的命', 1, 7),
  (58, 'from that day',        1, 8), (58, '从那天起',   1, 9);
