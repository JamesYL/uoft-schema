\c postgres;
DROP DATABASE IF EXISTS uoft WITH (FORCE);
CREATE DATABASE uoft;
\c uoft;

CREATE TABLE department (
    code CHAR(3) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    info VARCHAR(1000)
);
CREATE TABLE breadth_category (
    id SMALLINT PRIMARY KEY CHECK (id > 0),
    category VARCHAR(150) NOT NULL,
    explanation VARCHAR(1000) NOT NULL
);

CREATE TABLE course (
    code VARCHAR(10) PRIMARY KEY,
    department CHAR(3) NOT NULL,
    course_title VARCHAR(150) NOT NULL,
    course_number SMALLINT NOT NULL CHECK (course_number >= 100),
    campus SMALLINT NOT NULL CHECK (campus IN (1, 3, 5)),
    breadth_category SMALLINT,
    distribution_category VARCHAR(14) CHECK (distribution_category in ('Science', 'Social Science', 'Humanities')),
    course_description VARCHAR(2500) NOT NULL,
    num_credits REAL NOT NULL CHECK (num_credits IN (0.5, 1)),
    prerequisite VARCHAR(1000),
    exclusion VARCHAR(1000),
    recommended_prep VARCHAR(1000),
    CONSTRAINT department FOREIGN KEY(department) REFERENCES department(code),
    CONSTRAINT breadth FOREIGN KEY(breadth_category) REFERENCES breadth_category(id),
    CONSTRAINT unique_course UNIQUE (department, course_number, campus, num_credits)
);
CREATE TABLE selection (
    id INT PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    section CHAR(1) NOT NULL CHECK (section IN ('F', 'S', 'Y')),
    start_year SMALLINT NOT NULL,
    start_month SMALLINT NOT NULL CHECK (1 <= start_month AND start_month <= 12),
    num_weeks SMALLINT NOT NULL,
    delivery_instructions VARCHAR(1500),
    other_instructions VARCHAR(1500),
    CONSTRAINT unique_selection UNIQUE (code, start_year, start_month, section),
    CONSTRAINT code FOREIGN KEY(code) REFERENCES course(code)
);
CREATE TABLE meeting (
    id INT PRIMARY KEY,
    meeting_type CHAR(3) NOT NULL CHECK (meeting_type IN ('LEC', 'TUT', 'PRA')),
    section_number CHAR(4) NOT NULL,
    delivery_mode VARCHAR(8) NOT NULL CHECK (delivery_mode IN ('ONLSYNC', 'CLASS', 'ONLASYNC')),
    selection_id INT NOT NULL,
    CONSTRAINT selection_id FOREIGN KEY(selection_id) REFERENCES selection(id),
    CONSTRAINT unique_meeting UNIQUE (selection_id, meeting_type, section_number)
);
CREATE TABLE meeting_taught_by (
    meeting_id INT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    PRIMARY KEY (meeting_id, first_name, last_name),
    CONSTRAINT meeting_id FOREIGN KEY(meeting_id) REFERENCES meeting(id)
);
CREATE TABLE course_relation_tree_edge (
    id INT PRIMARY KEY,
    messsage VARCHAR(50) NOT NULL
);
CREATE TABLE course_relation_tree (
    id INT PRIMARY KEY,
    group_id INT NOT NULL,
    parent_id INT,
    is_optional BOOLEAN,
    code VARCHAR(10),
    edge_id INT,
    CONSTRAINT code FOREIGN KEY(code) REFERENCES course(code),
    CONSTRAINT edge_id FOREIGN KEY(edge_id) REFERENCES course_relation_tree_edge(id)
);
CREATE TABLE prerequisite (
    code VARCHAR(10) PRIMARY KEY,
    prereq INT NOT NULL,
    CONSTRAINT prereq FOREIGN KEY(prereq) REFERENCES course_relation_tree(id),
    CONSTRAINT code FOREIGN KEY(code) REFERENCES course(code)
);
CREATE TABLE exclusion (
    code VARCHAR(10) PRIMARY KEY,
    exclusion INT NOT NULL,
    CONSTRAINT exclusion FOREIGN KEY(exclusion) REFERENCES course_relation_tree(id),
    CONSTRAINT code FOREIGN KEY(code) REFERENCES course(code)
);
CREATE TABLE corequisite (
    code VARCHAR(10) PRIMARY KEY,
    coreq INT NOT NULL,
    CONSTRAINT coreq FOREIGN KEY(coreq) REFERENCES course_relation_tree(id),
    CONSTRAINT code FOREIGN KEY(code) REFERENCES course(code)
);
CREATE TABLE recommended_prep (
    code VARCHAR(10) PRIMARY KEY,
    prep INT NOT NULL,
    CONSTRAINT prep FOREIGN KEY(prep) REFERENCES course_relation_tree(id),
    CONSTRAINT code FOREIGN KEY(code) REFERENCES course(code)
);

\COPY department FROM '/home/uoft-data/csv/department.csv' DELIMITER ',' CSV HEADER;
\COPY breadth_category FROM '/home/uoft-data/csv/breadth_category.csv' DELIMITER ',' CSV HEADER;
\COPY course FROM '/home/uoft-data/csv/course.csv' DELIMITER ',' CSV HEADER;
\COPY selection FROM '/home/uoft-data/csv/selection.csv' DELIMITER ',' CSV HEADER;
\COPY meeting FROM '/home/uoft-data/csv/meeting.csv' DELIMITER ',' CSV HEADER;
\COPY meeting_taught_by FROM '/home/uoft-data/csv/meeting_taught_by.csv' DELIMITER ',' CSV HEADER;
