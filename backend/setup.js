import readline from 'readline';
import fs from 'fs';
import path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Peak Mode Backend Setup');
console.log('==========================\n');

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const setup = async () => {
  try {
    console.log('📋 Setup Options:');
    console.log('1. Use MongoDB Atlas (Cloud - Recommended)');
    console.log('2. Use Local MongoDB');
    console.log('3. Skip database setup for now\n');

    const choice = await question('Choose an option (1-3): ');

    if (choice === '1') {
      console.log('\n🌐 MongoDB Atlas Setup:');
      console.log('1. Go to https://www.mongodb.com/atlas');
      console.log('2. Create a free account and cluster');
      console.log('3. Get your connection string');
      console.log('4. Update config.env with your connection string\n');
      
      const atlasUri = await question('Enter your MongoDB Atlas connection string: ');
      
      if (atlasUri) {
        const configPath = path.join(process.cwd(), 'config.env');
        let config = fs.readFileSync(configPath, 'utf8');
        
        // Update MongoDB URI
        config = config.replace(
          /MONGODB_URI=.*/,
          `MONGODB_URI=${atlasUri}`
        );
        
        fs.writeFileSync(configPath, config);
        console.log('✅ MongoDB Atlas URI updated in config.env');
      }
    } else if (choice === '2') {
      console.log('\n💻 Local MongoDB Setup:');
      console.log('1. Install MongoDB from https://www.mongodb.com/try/download/community');
      console.log('2. Start MongoDB service');
      console.log('3. Run: npm run seed');
      console.log('4. Run: npm run dev\n');
    } else {
      console.log('\n⏭️  Skipping database setup');
      console.log('You can set up the database later by running: npm run seed\n');
    }

    console.log('🎯 Next Steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Set up database (if not done above)');
    console.log('3. Run database seeder: npm run seed');
    console.log('4. Start development server: npm run dev');
    console.log('5. Access admin panel at: http://localhost:8080/admin/login');
    console.log('6. Login with: admin@peakmode.com / admin123\n');

    console.log('📚 Documentation:');
    console.log('- Backend README: backend/README.md');
    console.log('- API endpoints: Check routes/ directory');
    console.log('- Database models: Check models/ directory\n');

    console.log('🔧 Configuration:');
    console.log('- Edit config.env for environment variables');
    console.log('- Update CORS settings for your frontend URL');
    console.log('- Change JWT_SECRET for production\n');

    console.log('✅ Setup complete!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
};

setup(); 