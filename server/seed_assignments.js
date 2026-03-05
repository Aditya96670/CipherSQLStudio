import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function seed() {
  try {
    console.log("Starting Seeding Process...");

    // 1. Create Practice Tables
    await pool.query(`
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS customers;
      DROP TABLE IF EXISTS products;
      DROP TABLE IF EXISTS employees;
      DROP TABLE IF EXISTS departments;
      DROP TABLE IF EXISTS students;

      CREATE TABLE students (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER,
        grade TEXT,
        city TEXT
      );

      CREATE TABLE departments (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        location TEXT
      );

      CREATE TABLE employees (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        dept_id INTEGER,
        salary INTEGER,
        hire_date DATE
      );

      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT,
        price DECIMAL(10,2),
        stock INTEGER
      );

      CREATE TABLE customers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        country TEXT
      );

      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER,
        product_id INTEGER,
        order_date DATE,
        amount DECIMAL(10,2)
      );
    `);

    // 2. Insert Sample Data
    await pool.query(`
      INSERT INTO students (name, age, grade, city) VALUES
      ('Aditya', 20, 'A', 'Delhi'),
      ('Neeraj', 21, 'B', 'Mumbai'),
      ('Yukti', 19, 'A', 'Pune'),
      ('Rahul', 22, 'C', 'Delhi'),
      ('Sneha', 20, 'B', 'Bangalore'),
      ('Ankit', 23, 'A', 'Mumbai'),
      ('Priya', 21, 'B', 'Delhi'),
      ('Saurabh', 22, 'C', 'Pune');

      INSERT INTO departments (name, location) VALUES
      ('Engineering', 'San Francisco'),
      ('Marketing', 'New York'),
      ('Sales', 'Chicago'),
      ('HR', 'San Francisco');

      INSERT INTO employees (name, dept_id, salary, hire_date) VALUES
      ('Alice', 1, 90000, '2021-01-15'),
      ('Bob', 1, 85000, '2021-03-20'),
      ('Charlie', 2, 70000, '2022-05-10'),
      ('David', 3, 60000, '2023-01-01'),
      ('Eve', 2, 75000, '2022-11-12'),
      ('Frank', 4, 55000, '2023-06-15');

      INSERT INTO products (name, category, price, stock) VALUES
      ('Laptop', 'Electronics', 1200.00, 50),
      ('Phone', 'Electronics', 800.00, 100),
      ('Desk Lamp', 'Home', 45.00, 200),
      ('Coffee Maker', 'Home', 89.99, 30),
      ('Headphones', 'Electronics', 150.00, 75),
      ('Monitor', 'Electronics', 300.00, 40);

      INSERT INTO customers (name, email, country) VALUES
      ('John Doe', 'john@example.com', 'USA'),
      ('Jane Smith', 'jane@test.org', 'UK'),
      ('Akash Verma', 'akash@india.in', 'India'),
      ('Maria Garcia', 'maria@spain.es', 'Spain');

      INSERT INTO orders (customer_id, product_id, order_date, amount) VALUES
      (1, 1, '2024-01-10', 1200.00),
      (1, 5, '2024-02-05', 150.00),
      (2, 2, '2024-01-15', 800.00),
      (3, 2, '2024-03-01', 800.00),
      (4, 4, '2024-03-10', 89.99);
    `);

    // 3. Clear existing assignments
    await pool.query('DELETE FROM assignments');

    // 4. Insert 50 Assignments
    const assignments = [
      // EASY (20)
      { title: 'Fetch All Students', description: 'Retrieve all columns for all students.', difficulty: 'Easy', target_table: 'students', hint: 'Use SELECT * FROM students;', sample_query: 'SELECT * FROM students;' },
      { title: 'Student Names', description: 'Get only the names of all students.', difficulty: 'Easy', target_table: 'students', hint: 'Use SELECT name FROM students;', sample_query: 'SELECT name FROM students;' },
      { title: 'High Grade Students', description: 'Find students with grade A.', difficulty: 'Easy', target_table: 'students', hint: 'Filter using WHERE grade = \'A\';', sample_query: 'SELECT * FROM students WHERE grade = \'A\';' },
      { title: 'Delhi Residents', description: 'List students living in Delhi.', difficulty: 'Easy', target_table: 'students', hint: 'Filter using WHERE city = \'Delhi\';', sample_query: 'SELECT * FROM students WHERE city = \'Delhi\';' },
      { title: 'Adult Students', description: 'Get students older than 20.', difficulty: 'Easy', target_table: 'students', hint: 'Use WHERE age > 20;', sample_query: 'SELECT * FROM students WHERE age > 20;' },
      { title: 'All Products', description: 'List all available products.', difficulty: 'Easy', target_table: 'products', hint: 'SELECT * FROM products;', sample_query: 'SELECT * FROM products;' },
      { title: 'Electronic Items', description: 'Find all products in Electronic category.', difficulty: 'Easy', target_table: 'products', hint: 'WHERE category = \'Electronics\';', sample_query: 'SELECT * FROM products WHERE category = \'Electronics\';' },
      { title: 'Product Prices', description: 'Show names and prices of all products.', difficulty: 'Easy', target_table: 'products', hint: 'SELECT name, price FROM products;', sample_query: 'SELECT name, price FROM products;' },
      { title: 'Low Stock', description: 'Find products with stock less than 50.', difficulty: 'Easy', target_table: 'products', hint: 'WHERE stock < 50;', sample_query: 'SELECT * FROM products WHERE stock < 50;' },
      { title: 'All Employees', description: 'Retrieve details of all employees.', difficulty: 'Easy', target_table: 'employees', hint: 'SELECT * FROM employees;', sample_query: 'SELECT * FROM employees;' },
      { title: 'Employee Salaries', description: 'Get name and salary of all employees.', difficulty: 'Easy', target_table: 'employees', hint: 'SELECT name, salary FROM employees;', sample_query: 'SELECT name, salary FROM employees;' },
      { title: 'Well Paid', description: 'Find employees earning more than 70,000.', difficulty: 'Easy', target_table: 'employees', hint: 'WHERE salary > 70000;', sample_query: 'SELECT * FROM employees WHERE salary > 70000;' },
      { title: 'Hired in 2021', description: 'Find employees hired in the year 2021.', difficulty: 'Easy', target_table: 'employees', hint: 'Use WHERE hire_date >= \'2021-01-01\' AND hire_date <= \'2021-12-31\';', sample_query: 'SELECT * FROM employees WHERE hire_date BETWEEN \'2021-01-01\' AND \'2021-12-31\';' },
      { title: 'Customer List', description: 'Get names of all customers.', difficulty: 'Easy', target_table: 'customers', hint: 'SELECT name FROM customers;', sample_query: 'SELECT name FROM customers;' },
      { title: 'Indian Customers', description: 'Find customers from India.', difficulty: 'Easy', target_table: 'customers', hint: 'WHERE country = \'India\';', sample_query: 'SELECT * FROM customers WHERE country = \'India\';' },
      { title: 'Order Amounts', description: 'List all orders with their amounts.', difficulty: 'Easy', target_table: 'orders', hint: 'SELECT amount FROM orders;', sample_query: 'SELECT amount FROM orders;' },
      { title: 'Large Orders', description: 'Find orders with amount greater than 500.', difficulty: 'Easy', target_table: 'orders', hint: 'WHERE amount > 500;', sample_query: 'SELECT * FROM orders WHERE amount > 500;' },
      { title: 'Sort Students', description: 'Get all students sorted by age (youngest first).', difficulty: 'Easy', target_table: 'students', hint: 'Use ORDER BY age ASC;', sample_query: 'SELECT * FROM students ORDER BY age ASC;' },
      { title: 'Product Count', description: 'How many products are in the table?', difficulty: 'Easy', target_table: 'products', hint: 'Use SELECT COUNT(*) FROM products;', sample_query: 'SELECT COUNT(*) FROM products;' },
      { title: 'Unique Categories', description: 'List all unique product categories.', difficulty: 'Easy', target_table: 'products', hint: 'Use SELECT DISTINCT category FROM products;', sample_query: 'SELECT DISTINCT category FROM products;' },

      // MEDIUM (20)
      { title: 'Average Salary', description: 'Calculate the average salary of all employees.', difficulty: 'Medium', target_table: 'employees', hint: 'Use SELECT AVG(salary) FROM employees;', sample_query: 'SELECT AVG(salary) as average_salary FROM employees;' },
      { title: 'Max Product Price', description: 'Find the price of the most expensive product.', difficulty: 'Medium', target_table: 'products', hint: 'Use SELECT MAX(price) FROM products;', sample_query: 'SELECT MAX(price) FROM products;' },
      { title: 'Salary by Dept', description: 'Get total salary spent per department id.', difficulty: 'Medium', target_table: 'employees', hint: 'Use GROUP BY dept_id with SUM(salary);', sample_query: 'SELECT dept_id, SUM(salary) FROM employees GROUP BY dept_id;' },
      { title: 'Mumbai Grade A', description: 'Find students from Mumbai with Grade A.', difficulty: 'Medium', target_table: 'students', hint: 'Combine conditions using AND.', sample_query: 'SELECT * FROM students WHERE city = \'Mumbai\' AND grade = \'A\';' },
      { title: 'Total Stock Value', description: 'Calculate price * stock for each product.', difficulty: 'Medium', target_table: 'products', hint: 'SELECT name, price * stock AS total_value FROM products;', sample_query: 'SELECT name, price * stock AS total_value FROM products;' },
      { title: 'Recent Orders', description: 'Find orders placed after February 1st, 2024.', difficulty: 'Medium', target_table: 'orders', hint: 'WHERE order_date > \'2024-02-01\';', sample_query: 'SELECT * FROM orders WHERE order_date > \'2024-02-01\';' },
      { title: 'Employees per Dept', description: 'Count how many employees are in each department.', difficulty: 'Medium', target_table: 'employees', hint: 'GROUP BY dept_id and COUNT(*);', sample_query: 'SELECT dept_id, COUNT(*) FROM employees GROUP BY dept_id;' },
      { title: 'High Salary Depts', description: 'List departments (id) where average salary is > 70000.', difficulty: 'Medium', target_table: 'employees', hint: 'Use GROUP BY with HAVING AVG(salary) > 70000;', sample_query: 'SELECT dept_id FROM employees GROUP BY dept_id HAVING AVG(salary) > 70000;' },
      { title: 'Employee Names (A/C)', description: 'Find employees whose names start with \'A\' or \'C\'.', difficulty: 'Medium', target_table: 'employees', hint: 'Use WHERE name LIKE \'A%\' OR name LIKE \'C%\';', sample_query: 'SELECT * FROM employees WHERE name LIKE \'A%\' OR name LIKE \'C%\';' },
      { title: 'Stock Range', description: 'Find products with stock between 40 and 100.', difficulty: 'Medium', target_table: 'products', hint: 'Use WHERE stock BETWEEN 40 AND 100;', sample_query: 'SELECT * FROM products WHERE stock BETWEEN 40 AND 100;' },
      { title: 'Order Summary', description: 'Get total amount of all orders.', difficulty: 'Medium', target_table: 'orders', hint: 'SELECT SUM(amount) FROM orders;', sample_query: 'SELECT SUM(amount) FROM orders;' },
      { title: 'Average Student Age', description: 'Calculate average age of students per grade.', difficulty: 'Medium', target_table: 'students', hint: 'GROUP BY grade with AVG(age);', sample_query: 'SELECT grade, AVG(age) FROM students GROUP BY grade;' },
      { title: 'Non-USA Customers', description: 'List customers who are NOT from USA.', difficulty: 'Medium', target_table: 'customers', hint: 'Use WHERE country <> \'USA\';', sample_query: 'SELECT * FROM customers WHERE country <> \'USA\';' },
      { title: 'Emp Dept Join', description: 'List employee names and their department names.', difficulty: 'Medium', target_table: 'employees', hint: 'Join employees (e) and departments (d) on e.dept_id = d.id.', sample_query: 'SELECT e.name as employee, d.name as department FROM employees e JOIN departments d ON e.dept_id = d.id;' },
      { title: 'Categories with 2+', description: 'List categories that have more than 2 products.', difficulty: 'Medium', target_table: 'products', hint: 'GROUP BY category HAVING COUNT(*) > 2;', sample_query: 'SELECT category FROM products GROUP BY category HAVING COUNT(*) >= 2;' },
      { title: 'Customer Order Amounts', description: 'List customer names and the amounts they spent.', difficulty: 'Medium', target_table: 'customers', hint: 'Join customers and orders.', sample_query: 'SELECT c.name, o.amount FROM customers c JOIN orders o ON c.id = o.customer_id;' },
      { title: 'Total Spent per Customer', description: 'Calculate total amount spent by each customer.', difficulty: 'Medium', target_table: 'orders', hint: 'GROUP BY customer_id and SUM(amount);', sample_query: 'SELECT customer_id, SUM(amount) FROM orders GROUP BY customer_id;' },
      { title: 'Oldest Student', description: 'Find the details of the oldest student.', difficulty: 'Medium', target_table: 'students', hint: 'Use ORDER BY age DESC LIMIT 1;', sample_query: 'SELECT * FROM students ORDER BY age DESC LIMIT 1;' },
      { title: 'Salary Rank', description: 'Select employees and rank them by salary (highest first).', difficulty: 'Medium', target_table: 'employees', hint: 'Use ORDER BY salary DESC;', sample_query: 'SELECT * FROM employees ORDER BY salary DESC;' },
      { title: 'Category Price Avg', description: 'Find average price of products in each category.', difficulty: 'Medium', target_table: 'products', hint: 'GROUP BY category with AVG(price);', sample_query: 'SELECT category, AVG(price) FROM products GROUP BY category;' },

      // HARD (10)
      { title: 'Top Spending Customer', description: 'Find the name of the customer who spent the most.', difficulty: 'Hard', target_table: 'customers', hint: 'Join customers and orders, group by name, sum amount, order by sum desc, limit 1.', sample_query: 'SELECT c.name FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.name ORDER BY SUM(o.amount) DESC LIMIT 1;' },
      { title: 'Unordered Products', description: 'Find products that have never been ordered.', difficulty: 'Hard', target_table: 'products', hint: 'Use LEFT JOIN with orders and WHERE orders.id IS NULL.', sample_query: 'SELECT p.* FROM products p LEFT JOIN orders o ON p.id = o.product_id WHERE o.id IS NULL;' },
      { title: 'Multiple Orders', description: 'Find names of customers who placed more than 1 order.', difficulty: 'Hard', target_table: 'customers', hint: 'Join with orders and use GROUP BY having COUNT(*) > 1.', sample_query: 'SELECT c.name FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.name HAVING COUNT(o.id) > 1;' },
      { title: 'Above Avg Salary', description: 'Find employees who earn more than the company average.', difficulty: 'Hard', target_table: 'employees', hint: 'Use a subquery: WHERE salary > (SELECT AVG(salary) FROM employees).', sample_query: 'SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);' },
      { title: 'San Francisco Employees', description: 'List all employees working in San Francisco.', difficulty: 'Hard', target_table: 'employees', hint: 'Join employees with departments and filter by location.', sample_query: 'SELECT e.name FROM employees e JOIN departments d ON e.dept_id = d.id WHERE d.location = \'San Francisco\';' },
      { title: 'Monthly Sales', description: 'Find total sales amount for each month.', difficulty: 'Hard', target_table: 'orders', hint: 'Use DATE_TRUNC(\'month\', order_date).', sample_query: 'SELECT DATE_TRUNC(\'month\', order_date) as month, SUM(amount) FROM orders GROUP BY month;' },
      { title: 'Category Leader', description: 'Find the most expensive product in each category.', difficulty: 'Hard', target_table: 'products', hint: 'This often requires a subquery or Window Function.', sample_query: 'SELECT * FROM products p1 WHERE price = (SELECT MAX(price) FROM products p2 WHERE p2.category = p1.category);' },
      { title: 'Rich Departments', description: 'Find departments where the total salary is > 150000.', difficulty: 'Hard', target_table: 'departments', hint: 'Join departments and employees, group by dept name, having sum > 150000.', sample_query: 'SELECT d.name FROM departments d JOIN employees e ON d.id = e.dept_id GROUP BY d.name HAVING SUM(e.salary) > 150000;' },
      { title: 'Grade A Students %', description: 'Percentage of students with Grade A.', difficulty: 'Hard', target_table: 'students', hint: 'Complex fraction: (COUNT(A) * 100.0) / COUNT(*).', sample_query: 'SELECT (COUNT(*) FILTER (WHERE grade = \'A\') * 100.0 / COUNT(*)) as percentage FROM students;' },
      { title: 'Customer Lifetime Value', description: 'List customers and their total order count and total spend.', difficulty: 'Hard', target_table: 'customers', hint: 'Join with orders, group by customer id/name, count and sum.', sample_query: 'SELECT c.name, COUNT(o.id) as order_count, SUM(o.amount) as total_spent FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.name;' },
    ];

    for (const a of assignments) {
      await pool.query(
        'INSERT INTO assignments (title, description, difficulty, target_table, hint, sample_query) VALUES ($1, $2, $3, $4, $5, $6)',
        [a.title, a.description, a.difficulty, a.target_table, a.hint, a.sample_query]
      );
    }

    console.log("Seeding Completed! 50 Assignments added.");
  } catch (err) {
    console.error("Seeding Failed:", err);
  } finally {
    await pool.end();
  }
}

seed();
