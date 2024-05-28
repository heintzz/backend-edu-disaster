
alter table notes
add column student_id integer references users(id);