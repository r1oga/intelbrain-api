BEGIN TRANSACTION;
INSERT into users (name, email, entries, joined) values ('r1oga', 'r1oga@t.com', 5, '2020-01-01');
INSERT into login (hash, email) values ('$2a$10$zgOaT8Pgu1s30aSkPrD4JOtu7jykf7KJXBsa6WOfm0mNTlbXTPKIe', 'r1oga@t.com');
COMMIT;