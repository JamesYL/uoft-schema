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
    id INT PRIMARY KEY CHECK (id >= 0),
    department CHAR(3) NOT NULL,
    course_title VARCHAR(150) NOT NULL,
    course_number SMALLINT NOT NULL CHECK (course_number >= 100),
    campus SMALLINT NOT NULL CHECK (campus IN (0, 1, 2)),
    breadth_category SMALLINT,
    distribution_category VARCHAR(14) CHECK (distribution_category in ('Science', 'Social Science', 'Humanities')),
    course_description VARCHAR(1000) NOT NULL,
    num_credits SMALLINT NOT NULL CHECK (num_credits IN (1, 2)),
    CONSTRAINT department FOREIGN KEY(department) REFERENCES department(code),
    CONSTRAINT breadth FOREIGN KEY(breadth_category) REFERENCES breadth_category(id),
    CONSTRAINT unique_course UNIQUE (department, course_number, campus)
);
CREATE TABLE selection (
    id INT PRIMARY KEY,
    course_id INT NOT NULL,
    section CHAR(1) NOT NULL CHECK (section IN ('F', 'S', 'Y')),
    start_year SMALLINT NOT NULL,
    start_month SMALLINT CHECK (1 <= start_month AND start_month <= 12),
    num_weeks SMALLINT NOT NULL,
    delivery_instructions VARCHAR(1000),
    other_instructions VARCHAR(1000),
    CONSTRAINT unique_selection UNIQUE (course_id, section, start_year, start_month),
    CONSTRAINT course_id FOREIGN KEY(course_id) REFERENCES course(id)
);
CREATE TABLE instructor (
    id INT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL
);
CREATE TABLE meeting (
    id INT PRIMARY KEY,
    meeting_type CHAR(3) NOT NULL CHECK (meeting_type IN ('LEC', 'TUT', 'PRA')),
    section_number SMALLINT NOT NULL CHECK (section_number >= 0),
    delivery_mode VARCHAR(8) NOT NULL CHECK (delivery_mode IN ('ONLSYNC', 'CLASS', 'ONLASYNC')),
    selection_id INT NOT NULL,
    CONSTRAINT selection_id FOREIGN KEY(selection_id) REFERENCES selection(id),
    CONSTRAINT unique_meeting UNIQUE (selection_id, meeting_type, section_number)
);
CREATE TABLE meeting_taught_by (
    meeting_id INT,
    instructor_id INT,
    PRIMARY KEY (meeting_id, instructor_id),
    CONSTRAINT instructor_id FOREIGN KEY(instructor_id) REFERENCES instructor(id),
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
    course_id INT,
    edge_id INT,
    CONSTRAINT course_id FOREIGN KEY(course_id) REFERENCES course(id),
    CONSTRAINT edge_id FOREIGN KEY(edge_id) REFERENCES course_relation_tree_edge(id)
);
CREATE TABLE prerequisite (
    id INT PRIMARY KEY,
    prereq INT NOT NULL,
    CONSTRAINT prereq FOREIGN KEY(prereq) REFERENCES course_relation_tree(id),
    CONSTRAINT id FOREIGN KEY(id) REFERENCES course(id)
);
CREATE TABLE exclusion (
    id INT PRIMARY KEY,
    exclusion INT NOT NULL,
    CONSTRAINT exclusion FOREIGN KEY(exclusion) REFERENCES course_relation_tree(id),
    CONSTRAINT id FOREIGN KEY(id) REFERENCES course(id)
);
CREATE TABLE corequisite (
    id INT PRIMARY KEY,
    coreq INT NOT NULL,
    CONSTRAINT coreq FOREIGN KEY(coreq) REFERENCES course_relation_tree(id),
    CONSTRAINT id FOREIGN KEY(id) REFERENCES course(id)
);
CREATE TABLE recommended_prep (
    id INT PRIMARY KEY,
    prep INT NOT NULL,
    CONSTRAINT prep FOREIGN KEY(prep) REFERENCES course_relation_tree(id),
    CONSTRAINT id FOREIGN KEY(id) REFERENCES course(id)
);
