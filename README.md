# Peak Mode - Local Development Setup

This is a local development version of the Peak Mode e-commerce frontend with integrated admin panel. All external API connections have been removed and replaced with local mock data for development purposes.

## Features

- **Main Frontend**: Complete e-commerce site with product catalog, cart, checkout
- **Admin Panel**: Full admin dashboard accessible at `/admin`
- **Local Data**: Mock data for products, orders, customers, and more
- **No External Dependencies**: Runs completely locally without backend connections

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Admin Access
Navigate to `/admin` and use these credentials:
- **Username**: `admin`
- **Password**: `admin123`

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── Admin.tsx      # Admin dashboard
│   ├── Home.tsx       # Homepage
│   ├── Shop.tsx       # Product catalog
│   └── ...            # Other pages
├── lib/
│   └── localService.ts # Local data service (mock data)
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
└── models/             # TypeScript interfaces
```

## Admin Dashboard Features

- **Products Management**: View, edit, delete products
- **Order Management**: Track orders and update statuses
- **Customer Management**: View customer information
- **Newsletter Subscribers**: Manage email subscriptions
- **Contact Messages**: Handle customer inquiries

## Local Data

The application uses in-memory mock data stored in `src/lib/localService.ts`. This includes:

- Sample products with images, prices, and descriptions
- Mock orders with customer details
- Customer profiles and newsletter subscriptions
- Contact message inquiries

## Building for Production

```bash
npm run build
```

## Future Backend Integration

This project is designed to be easily connected to a backend API in the future. The local service structure mirrors what would be expected from a real API, making the transition straightforward.

## Development Notes

- All data is stored in memory and resets on page refresh
- No persistent storage - this is for development/demo purposes only
- The admin panel is fully functional with local data
- UI components use shadcn/ui and Tailwind CSS

## License

This project is for development purposes only.
