-- Database Schema for China-to-Iran Product Ordering and Tracking Web Application

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  is_team BOOLEAN DEFAULT FALSE
);

-- Projects (Orders) table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(50) DEFAULT 'Order Received'
);

-- Project Steps table
CREATE TABLE project_steps (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_name VARCHAR(100) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster queries
CREATE INDEX idx_project_steps_project_id ON project_steps(project_id);
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_users_email ON users(email);

-- Insert default steps for the tracking process
INSERT INTO project_steps (project_id, step_number, step_name, completed) VALUES
  (1, 1, 'Order Received', FALSE),
  (1, 2, 'Contract Signed', FALSE),
  (1, 3, 'Advance Payment Received', FALSE),
  (1, 4, 'Order Placed in China', FALSE),
  (1, 5, 'Items Stored in China Warehouse', FALSE),
  (1, 6, 'Items Sent to Cargo Ship', FALSE),
  (1, 7, 'Goods Clearance Permit (China)', FALSE),
  (1, 8, 'Shipped to Dubai Port', FALSE),
  (1, 9, 'Arrived at Dubai Port', FALSE),
  (1, 10, 'Loaded on Ship to Iran', FALSE),
  (1, 11, 'Goods Clearance Permit (Iran)', FALSE),
  (1, 12, 'Delivered to User Warehouse in Iran', FALSE),
  (1, 13, 'Final Confirmation from User', FALSE);

-- Create a function to automatically create steps for new projects
CREATE OR REPLACE FUNCTION create_project_steps()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO project_steps (project_id, step_number, step_name, completed)
  VALUES
    (NEW.id, 1, 'Order Received', TRUE),
    (NEW.id, 2, 'Contract Signed', FALSE),
    (NEW.id, 3, 'Advance Payment Received', FALSE),
    (NEW.id, 4, 'Order Placed in China', FALSE),
    (NEW.id, 5, 'Items Stored in China Warehouse', FALSE),
    (NEW.id, 6, 'Items Sent to Cargo Ship', FALSE),
    (NEW.id, 7, 'Goods Clearance Permit (China)', FALSE),
    (NEW.id, 8, 'Shipped to Dubai Port', FALSE),
    (NEW.id, 9, 'Arrived at Dubai Port', FALSE),
    (NEW.id, 10, 'Loaded on Ship to Iran', FALSE),
    (NEW.id, 11, 'Goods Clearance Permit (Iran)', FALSE),
    (NEW.id, 12, 'Delivered to User Warehouse in Iran', FALSE),
    (NEW.id, 13, 'Final Confirmation from User', FALSE);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically create steps for new projects
CREATE TRIGGER create_project_steps_trigger
AFTER INSERT ON projects
FOR EACH ROW
EXECUTE FUNCTION create_project_steps();

-- Create a function to update project status when steps are completed
CREATE OR REPLACE FUNCTION update_project_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed = TRUE THEN
    UPDATE projects
    SET status = NEW.step_name
    WHERE id = NEW.project_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update project status when steps are completed
CREATE TRIGGER update_project_status_trigger
AFTER UPDATE ON project_steps
FOR EACH ROW
WHEN (OLD.completed = FALSE AND NEW.completed = TRUE)
EXECUTE FUNCTION update_project_status();

-- Notifications table for tracking user notifications
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT FALSE
);

-- Create index for faster notification queries
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_project_id ON notifications(project_id);

-- Create a function to automatically create notifications when steps are completed
CREATE OR REPLACE FUNCTION create_step_notification()
RETURNS TRIGGER AS $$
DECLARE
  project_user_id INTEGER;
BEGIN
  IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
    -- Get the user_id for the project
    SELECT user_id INTO project_user_id FROM projects WHERE id = NEW.project_id;
    
    -- Create notification
    INSERT INTO notifications (user_id, project_id, message)
    VALUES (project_user_id, NEW.project_id, 'Step "' || NEW.step_name || '" has been completed for your order.');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically create notifications when steps are completed
CREATE TRIGGER create_step_notification_trigger
AFTER UPDATE ON project_steps
FOR EACH ROW
EXECUTE FUNCTION create_step_notification();
