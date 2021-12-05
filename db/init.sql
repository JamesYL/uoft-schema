CREATE DATABASE uoft;
\c uoft;

CREATE TABLE department (
    code CHAR(3) PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    info VARCHAR(1000) NOT NULL
);
CREATE TABLE breadth_category (
    breadth_id SMALLINT PRIMARY KEY CHECK (breadth_id > 0),
    category VARCHAR(150) NOT NULL,
    explanation VARCHAR(1000) NOT NULL
);
CREATE TABLE distribution_category (
    distribution_id SMALLINT PRIMARY KEY CHECK (distribution_id > 0),
    title VARCHAR(100) NOT NULL,
    explanation VARCHAR(1000) NOT NULL
);
CREATE TABLE course (
    id INT PRIMARY KEY CHECK (id >= 0),
    department CHAR(3) NOT NULL,
    course_title VARCHAR(150) NOT NULL,
    course_number SMALLINT NOT NULL CHECK (course_number >= 100),
    campus SMALLINT NOT NULL CHECK (campus IN (0, 1, 2)),
    breadth_category SMALLINT NOT NULL,
    distribution_category SMALLINT NOT NULL,
    course_description VARCHAR(1000) NOT NULL,
    num_credits SMALLINT NOT NULL CHECK (num_credits IN (1, 2)),
    CONSTRAINT department FOREIGN KEY(department) REFERENCES department(code),
    CONSTRAINT distribution_category FOREIGN KEY(distribution_category) REFERENCES distribution_category(distribution_id),
    CONSTRAINT breadth FOREIGN KEY(breadth_category) REFERENCES breadth_category(breadth_id),
    CONSTRAINT unique_course UNIQUE (department, course_number, campus)
);
