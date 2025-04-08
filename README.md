# China-to-Iran Product Ordering and Tracking Web Application

This documentation provides instructions for setting up, deploying, and using the China-to-Iran Product Ordering and Tracking Web Application.

## Overview

This application manages the entire process of ordering goods from China and delivering them to customers in Iran. It includes two interconnected web applications:

1. **User WebApp**: Allows customers to request, manage, and track orders through a visual roadmap UI
2. **Team WebApp**: Enables internal staff to manage orders and update order statuses via checkboxes

## Features

### User WebApp
- User authentication (login/register)
- Dashboard for viewing and creating orders
- Responsive roadmap UI for tracking order progress through 13 steps
- Real-time notifications when order status changes

### Team WebApp
- Team authentication
- Project management dashboard
- Step completion UI with checkboxes for updating order statuses
- Access to all customer orders

## Technology Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL
- **Real-time Communication**: WebSockets

## Installation and Setup

### Prerequisites
- Node.js (v14+)
- Python 3.10+
- PostgreSQL

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/your-repo/china-iran-tracker.git
cd china-iran-tracker
```

2. Set up Python virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install fastapi uvicorn sqlalchemy psycopg2-binary pydantic python-jose[cryptography] passlib[bcrypt] python-multipart websockets
```

4. Configure the database:
   - Create a PostgreSQL database
   - Update the database connection string in `app/database/database.py`
   - Run the SQL schema file:
   ```bash
   psql -U your_user -d your_database -f app/database/schema.sql
   ```

5. Start the backend server:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd ../frontend
npm install
```

2. Configure the API endpoint:
   - Update the API URL in `src/utils/api.ts` to match your backend server

3. Start the development server:
```bash
npm start
```

## Deployment

### Backend Deployment

1. Set up a production server with Python and PostgreSQL
2. Clone the repository and install dependencies as described above
3. Configure the database with production credentials
4. Use a production ASGI server like Gunicorn with Uvicorn workers:
```bash
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```
5. Set up Nginx as a reverse proxy to the Gunicorn server

### Frontend Deployment

1. Build the production version:
```bash
cd frontend
npm run build
```
2. Deploy the contents of the `build` directory to a static file server or CDN
3. Configure the server to route all requests to `index.html` for client-side routing

## Usage Instructions

### For Customers

1. Register a new account or log in with existing credentials
2. From the dashboard, create a new order by providing product details
3. View your orders and their current status on the dashboard
4. Click on an order to see detailed progress through the 13-step tracking roadmap
5. Receive real-time notifications when your order status changes

### For Team Members

1. Log in to the team portal using team credentials
2. View all customer orders on the team dashboard
3. Click on an order to manage its details
4. Use the checkboxes to mark steps as completed as the order progresses
5. Each completed step automatically updates the order status and notifies the customer

## Process Flow

Each order follows these 13 steps:

1. Order Received
2. Contract Signed
3. Advance Payment Received
4. Order Placed in China
5. Items Stored in China Warehouse
6. Items Sent to Cargo Ship
7. Goods Clearance Permit (China)
8. Shipped to Dubai Port
9. Arrived at Dubai Port
10. Loaded on Ship to Iran
11. Goods Clearance Permit (Iran)
12. Delivered to User Warehouse in Iran
13. Final Confirmation from User

## Testing

The application includes several testing components accessible at:
- `/test/responsive` - Test responsive design
- `/test/websocket` - Test WebSocket functionality
- `/test/summary` - View test results summary

## Support

For any issues or questions, please contact the development team at support@example.com.
