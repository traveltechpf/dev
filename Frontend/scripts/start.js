#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { createServer } from 'vite';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const paths = {
  frontend: resolve(__dirname, '..'),
  backend: resolve(__dirname, '../../Backend/travel-platform'),
  targetClasses: resolve(__dirname, '../../Backend/travel-platform/target/classes/static'),
  viteConfig: resolve(__dirname, '../vite.config.js')
};

class TravelPlatformDev {
  constructor() {
    this.isInteractive = process.stdout.isTTY;
    this.DEFAULT_PORT = 3000;
    this.HOST = '0.0.0.0';
  }

  log(message, color = 'white') {
    console.log(chalk[color](message));
  }

  async checkDirectories() {
    if (!await fs.pathExists(paths.backend)) {
      this.log(`❌ Spring Boot project not found at: ${paths.backend}`, 'red');
      this.log('Please ensure the backend project exists.', 'yellow');
      process.exit(1);
    }
  }

  async checkRequiredFiles() {
    const requiredFiles = [
      resolve(paths.frontend, 'src/main.jsx'),
      resolve(paths.frontend, 'public/index.html')
    ];

    for (const file of requiredFiles) {
      if (!await fs.pathExists(file)) {
        this.log(`❌ Required file missing: ${file}`, 'red');
        process.exit(1);
      }
    }
  }

  async checkSpringBootServer() {
    return new Promise((resolve) => {
      const child = exec('curl -s http://localhost:8080/api/health', (error) => {
        resolve(!error);
      });
      
      setTimeout(() => {
        child.kill();
        resolve(false);
      }, 2000);
    });
  }

  async buildAndDeploy() {
    this.log('🔄 Building and deploying to target/classes...', 'blue');
    
    try {
      // Ensure target directory exists
      await fs.ensureDir(paths.targetClasses);
      
      // Set development environment
      process.env.NODE_ENV = 'development';
      process.env.BABEL_ENV = 'development';
      
      // Import and run the build process
      const { build } = await import('vite');
      
      await build({
        configFile: paths.viteConfig,
        mode: 'development'
      });
      
      this.log('✅ Development build deployed to target/classes', 'green');
    } catch (error) {
      this.log(`❌ Failed to build and deploy: ${error.message}`, 'red');
      throw error;
    }
  }

  async startViteDevServer() {
    this.log('🚀 Starting Vite development server...', 'blue');
    
    try {
      // Create Vite server
      const server = await createServer({
        configFile: paths.viteConfig,
        mode: 'development'
      });

      // Start the server
      await server.listen();

      this.log('\n✅ Development environment ready!', 'green');
      this.log(`\n🛠️  Development Options:`, 'cyan');
      this.log(`   Frontend Dev: ${chalk.cyan('http://localhost:3000')} ${chalk.gray('(hot reload)')}`, 'white');
      this.log(`   Spring Boot:  ${chalk.cyan('http://localhost:8080')} ${chalk.gray('(serves target/classes)')}`, 'white');
      
      // Check if Spring Boot is running
      const springBootRunning = await this.checkSpringBootServer();
      if (springBootRunning) {
        this.log(`\n🌐 Full Stack: ${chalk.cyan('http://localhost:8080')} ${chalk.green('✓ Running')}`, 'white');
      } else {
        this.log(`\n⚠️  Spring Boot not running. Start it with:`, 'yellow');
        this.log(`   cd Backend/travel-platform && mvn spring-boot:run`, 'gray');
      }
      
      this.log(`\n📝 Workflow:`, 'cyan');
      this.log(`   1. Edit React files → Auto hot reload on :3000`, 'gray');
      this.log(`   2. Run "npm run build" → Deploy to target/classes`, 'gray');
      this.log(`   3. Access :8080 → Spring Boot serves deployed chunks`, 'gray');
      this.log(`\nPress ${chalk.cyan('Ctrl+C')} to stop.\n`, 'gray');

      // Handle shutdown gracefully
      process.on('SIGINT', () => {
        this.log('\n🛑 Shutting down development server...', 'yellow');
        server.close();
        process.exit(0);
      });

      process.on('SIGTERM', () => {
        server.close();
        process.exit(0);
      });

    } catch (error) {
      this.log(`❌ Failed to start development server: ${error.message}`, 'red');
      process.exit(1);
    }
  }

  async run() {
    try {
      if (this.isInteractive) {
        console.clear();
      }
      
      this.log('🎯 Starting Travel Platform development...', 'blue');
      this.log(`📂 Backend: ${paths.backend}`, 'gray');
      this.log(`📂 Target: ${paths.targetClasses}`, 'gray');
      
      await this.checkDirectories();
      await this.checkRequiredFiles();
      
      // Option to build initially
      const args = process.argv.slice(2);
      if (args.includes('--build')) {
        await this.buildAndDeploy();
      }
      
      await this.startViteDevServer();
      
    } catch (error) {
      this.log(`💥 Failed to start: ${error.message}`, 'red');
      process.exit(1);
    }
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', err => {
  throw err;
});

// Run the development server
const devServer = new TravelPlatformDev();
devServer.run();