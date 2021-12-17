-- Used as a helper file to setup local database not in docker
-- psql -U postgres -f ./db/data.sql
\i ./db/init.sql
\COPY department FROM './data/csv/department.csv' DELIMITER ',' CSV HEADER;
\COPY breadth_category FROM './data/csv/breadth_category.csv' DELIMITER ',' CSV HEADER;
\COPY course FROM './data/csv/course.csv' DELIMITER ',' CSV HEADER;
\COPY selection FROM './data/csv/selection.csv' DELIMITER ',' CSV HEADER;
\COPY meeting FROM './data/csv/meeting.csv' DELIMITER ',' CSV HEADER;
\COPY meeting_taught_by FROM './data/csv/meeting_taught_by.csv' DELIMITER ',' CSV HEADER;
