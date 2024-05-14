create table progress (
    id serial primary key,
    student_id integer not null,
    class_id integer not null,
    lesson_id integer not null,
    completed boolean not null default false,
    completion_date date,
    foreign key (student_id) references users(id),
    foreign key (class_id) references classes(id)
);